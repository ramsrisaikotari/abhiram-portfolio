/* global process, console, window, document, HTMLCanvasElement, innerWidth, URL */
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium, webkit } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const output = process.env.HERO_REVIEW_DIR || "/tmp/cinematic-hero-v2";
fs.mkdirSync(output, { recursive: true });
const results = [];
for (const [engine, widths] of [
  [chromium, [1440, 1024, 390, 375, 320]],
  [webkit, [1440, 1024, 390, 375]],
]) {
  const browser = await engine.launch({ headless: true });
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: {
        width,
        height: width >= 768 ? 900 : width === 375 ? 812 : 844,
      },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const errors = [],
      requests = [];
    let entry;
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("request", (r) => requests.push(r.url()));
    await page.addInitScript(() => {
      window.__heroAudit = {
        calls: 0,
        triangles: 0,
        peak: 0,
        peakTriangles: 0,
      };
      const get = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const gl = get.call(this, type, ...args);
        if (gl && type === "webgl2" && !gl.__heroWrapped) {
          gl.__heroWrapped = true;
          const clear = gl.clear.bind(gl);
          gl.clear = (...a) => {
            const s = window.__heroAudit;
            s.peak = Math.max(s.peak, s.calls);
            s.peakTriangles = Math.max(s.peakTriangles, s.triangles);
            s.calls = 0;
            s.triangles = 0;
            return clear(...a);
          };
          for (const name of [
            "drawArrays",
            "drawElements",
            "drawArraysInstanced",
            "drawElementsInstanced",
          ]) {
            const fn = gl[name].bind(gl);
            gl[name] = (...a) => {
              window.__heroAudit.calls++;
              if (a[0] === gl.TRIANGLES) {
                const count = name.includes("Elements") ? a[1] : a[2];
                const instances = name.endsWith("Instanced")
                  ? a[name.includes("Elements") ? 4 : 3]
                  : 1;
                window.__heroAudit.triangles += (count * instances) / 3;
              }
              return fn(...a);
            };
          }
        }
        return gl;
      };
    });
    await page.goto(base + "/");
    await page.waitForTimeout(350);
    assert.equal(
      requests.some((url) => /Experience3D|guardian\.glb/.test(url)),
      false,
      "Default route must defer hero JS/model",
    );
    assert.equal(await page.locator("canvas").count(), 0);
    if (width < 768)
      await page.getByRole("button", { name: "Open navigation" }).tap();
    entry = Date.now();
    const entryLink = page.getByRole("link", {
      name: "3D Experience",
      exact: true,
    });
    if (width < 768) await entryLink.tap();
    else await entryLink.click();
    await page.locator(".guardian-hud").first().waitFor();
    const modelReadyMs = Date.now() - entry;
    await page.waitForTimeout(2500);
    assert.equal(await page.locator("canvas").count(), 1);
    assert(requests.some((url) => url.includes("guardian.glb")));
    const layout = await page.evaluate(() => {
      const stage = document
        .querySelector(".scene-stage")
        .getBoundingClientRect();
      const header = document
        .querySelector(".system-header")
        .getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        gap: stage.top - header.bottom,
        labels: [...document.querySelectorAll(".guardian-hud")]
          .filter((n) => {
            const b = n.getBoundingClientRect();
            return (
              b.left < stage.left + 3 ||
              b.right > stage.right - 3 ||
              b.top < stage.top + 3 ||
              b.bottom > stage.bottom - 3
            );
          })
          .map((n) => n.textContent),
        ...window.__heroAudit,
      };
    });
    assert.equal(layout.overflow, false);
    assert.equal(layout.gap, 0);
    assert.deepEqual(layout.labels, []);
    assert(layout.peak <= 45);
    assert(layout.peakTriangles >= 15000);
    await page.screenshot({
      path: `${output}/${engine.name()}-hero-${width}.png`,
    });
    await page.keyboard.press("Escape");
    assert.equal(new URL(page.url()).pathname, "/");
    assert.equal(await page.locator("canvas").count(), 0);
    await page.goBack();
    await page.locator(".guardian-hud").first().waitFor();
    await page.locator("#system-exit").click();
    assert.equal(new URL(page.url()).pathname, "/");
    assert.deepEqual(errors, []);
    const result = {
      engine: engine.name(),
      width,
      modelReadyMs,
      ...layout,
      errors,
    };
    results.push(result);
    console.log(JSON.stringify(result));
    await page.close();
  }
  await browser.close();
}
fs.writeFileSync(
  `${output}/hero-results.json`,
  JSON.stringify(results, null, 2),
);
