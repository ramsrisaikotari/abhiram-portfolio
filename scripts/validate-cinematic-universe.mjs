/* global process, console, document, window, HTMLCanvasElement, innerWidth, getComputedStyle, URL */
import fs from "node:fs";
import assert from "node:assert/strict";
const { chromium, webkit } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const output =
  process.env.VISUAL_OUTPUT_DIR || "/tmp/guardian-universe/acceptance";
fs.mkdirSync(output, { recursive: true });
const modes = [
  "impact",
  "infrastructure",
  "modules",
  "case-studies",
  "observability",
  "delivery",
  "diagnostic",
  "components",
  "standby",
];
const mobileCaptures = [
  "infrastructure",
  "case-studies",
  "observability",
  "delivery",
  "components",
  "standby",
];
const results = [],
  captures = [];
async function activate(page, mode, width) {
  await page.evaluate(
    ({ mode, width }) => {
      const offset =
        width <= 768
          ? document.querySelector(".scene-stage").getBoundingClientRect()
              .bottom + 20
          : 56;
      window.scrollTo({
        top:
          document.getElementById(mode).getBoundingClientRect().top +
          window.scrollY -
          offset,
        behavior: "instant",
      });
    },
    { mode, width },
  );
  await page.locator(`.system-nav a[aria-current][href="#${mode}"]`).waitFor();
  await page.waitForTimeout(2800);
}
async function measureBounds(page) {
  return page.evaluate(() => {
    const stage = document
      .querySelector(".scene-stage")
      .getBoundingClientRect();
    const labels = [
      ...document.querySelectorAll(".scene-node,.scene-readout"),
    ].map((el) => ({
      label: el.textContent,
      rect: el.getBoundingClientRect(),
    }));
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      clipped: labels
        .filter(
          ({ rect: r }) =>
            r.width &&
            (r.left < stage.left + 3 ||
              r.right > stage.right - 3 ||
              r.top < stage.top + 3 ||
              r.bottom > stage.bottom - 3),
        )
        .map((x) => x.label),
      overlaps: labels
        .filter((x) => x.label)
        .flatMap((a, i) =>
          labels
            .slice(i + 1)
            .filter(
              (b) =>
                Math.min(a.rect.right, b.rect.right) -
                  Math.max(a.rect.left, b.rect.left) >
                  1 &&
                Math.min(a.rect.bottom, b.rect.bottom) -
                  Math.max(a.rect.top, b.rect.top) >
                  1,
            )
            .map((b) => `${a.label}/${b.label}`),
        ),
      gap: Math.abs(
        stage.top -
          document.querySelector(".system-header").getBoundingClientRect()
            .bottom,
      ),
      touchAction: getComputedStyle(
        document.querySelector(".experience-content") ||
          document.querySelector("main"),
      ).touchAction,
    };
  });
}
for (const [engine, driver] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await driver.launch({ headless: true });
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [375, 812],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const errors = [],
      requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("request", (request) => requests.push(request.url()));
    await page.addInitScript(() => {
      const get = HTMLCanvasElement.prototype.getContext;
      const seen = new WeakSet();
      let calls = 0,
        triangles = 0,
        frame = { calls: 0, triangles: 0 },
        peak = 0,
        draws = 0;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        const context = get.call(this, type, ...args);
        if (context && type === "webgl2" && !seen.has(context)) {
          seen.add(context);
          const clear = context.clear.bind(context);
          context.clear = (...args) => {
            if (calls) frame = { calls, triangles };
            peak = Math.max(peak, calls);
            calls = 0;
            triangles = 0;
            return clear(...args);
          };
          for (const name of [
            "drawElements",
            "drawArrays",
            "drawElementsInstanced",
            "drawArraysInstanced",
          ]) {
            const draw = context[name].bind(context);
            context[name] = (...args) => {
              calls++;
              draws++;
              if (args[0] === 4)
                triangles +=
                  ((name.includes("Elements") ? args[1] : args[2]) / 3) *
                  (name.endsWith("Instanced")
                    ? args[name.includes("Elements") ? 4 : 3]
                    : 1);
              return draw(...args);
            };
          }
        }
        return context;
      };
      window.__universe = () => ({
        frame: calls ? { calls, triangles } : frame,
        peak: Math.max(peak, calls),
        draws,
      });
    });
    await page.goto(`${base}/`);
    await page.waitForTimeout(500);
    assert(
      !requests.some(
        (url) => url.includes("Experience3D") || url.endsWith(".glb"),
      ),
      "Default must not fetch optional scene/model",
    );
    assert.equal(await page.locator("canvas").count(), 0);
    if (width < 900)
      await page.getByRole("button", { name: "Open navigation" }).click();
    const started = Date.now();
    await page
      .getByRole("link", { name: "3D Experience", exact: true })
      .click();
    await page.locator(".guardian-hud").first().waitFor();
    const modelReadyMs = Date.now() - started;
    await page.waitForTimeout(2800);
    const scenes = [];
    for (const mode of modes) {
      await activate(page, mode, width);
      assert.equal(await page.locator("canvas").count(), 1);
      const bounds = await measureBounds(page);
      assert(!bounds.overflow, `${engine}/${width}/${mode} overflow`);
      assert.deepEqual(
        bounds.clipped,
        [],
        `${engine}/${width}/${mode} clipped`,
      );
      assert.deepEqual(
        bounds.overlaps,
        [],
        `${engine}/${width}/${mode} overlap`,
      );
      if (width < 768)
        assert(bounds.gap < 1, "Mobile visual band must meet header");
      const stats = await page.evaluate(() => window.__universe());
      assert(stats.frame.calls > 0, "Scene must issue WebGL draws");
      assert(
        stats.peak <= 50,
        `Scene draw call budget: ${JSON.stringify(stats)}`,
      );
      assert(
        stats.frame.triangles >= 19000,
        "Persistent Guardian must remain rendered",
      );
      scenes.push({ mode, ...stats.frame });
      if (
        engine === "chromium" &&
        (width === 1440 || (width === 390 && mobileCaptures.includes(mode)))
      ) {
        const name = `${width}-${mode}.png`;
        await page.screenshot({ path: `${output}/${name}` });
        captures.push({ engine, width, height, mode, file: name });
      }
    }
    assert.equal(
      requests.filter((url) =>
        url.endsWith("cloud-infrastructure-guardian.glb"),
      ).length,
      1,
      "One loaded Guardian across every mode",
    );
    await activate(page, "components", width);
    const categories = page
      .locator("#components .system-flow")
      .first()
      .locator("button");
    for (let index = 0; index < (await categories.count()); index++) {
      await categories.nth(index).click();
      await page.waitForTimeout(1600);
      const bounds = await measureBounds(page);
      assert(!bounds.overflow, `${engine}/${width}/skill-${index} overflow`);
      assert.deepEqual(
        bounds.clipped,
        [],
        `${engine}/${width}/skill-${index} clipped`,
      );
      assert.deepEqual(
        bounds.overlaps,
        [],
        `${engine}/${width}/skill-${index} overlap`,
      );
    }
    await page
      .locator("#components .system-flow button")
      .filter({ hasText: "Observability" })
      .click();
    await page.waitForTimeout(1600);
    assert(
      await page.locator('.scene-node[aria-label="Trace Dynatrace"]').count(),
      "Selected skill technologies must deploy",
    );
    assert.equal(
      await page.locator('.scene-node[aria-label="Trace Python"]').count(),
      0,
      "Unrelated skill modules must retract",
    );
    if (engine === "chromium" && width === 390) {
      const name = "390-components-selected.png";
      await page.screenshot({ path: `${output}/${name}` });
      captures.push({
        engine,
        width,
        height,
        mode: "components-selected",
        file: name,
      });
    }
    await activate(page, "delivery", width);
    await page
      .locator("#delivery .system-flow button")
      .filter({ hasText: "CodeDeploy" })
      .click();
    await page.waitForTimeout(2800);
    assert.equal(
      await page
        .locator('.scene-node[aria-label="Trace CodeDeploy"]')
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.locator("#system-exit").click();
    assert.equal(await page.locator("canvas").count(), 0);
    await page.goBack();
    await page.locator(".guardian-hud").first().waitFor();
    await page.keyboard.press("Escape");
    assert.equal(new URL(page.url()).pathname, "/");
    await page.goBack();
    await page.locator("canvas").waitFor();
    await page.goBack();
    assert.equal(new URL(page.url()).pathname, "/");
    const resume = await page.request.get(`${base}/resume.pdf`);
    assert.equal(resume.status(), 200);
    assert.match(resume.headers()["content-type"], /pdf/);
    assert.deepEqual(errors, []);
    results.push({
      engine,
      width,
      height,
      modelReadyMs,
      scenes,
      errors,
      lazyLoading: "pass",
      oneModel: "pass",
      navigation: "pass",
      resume: "pass",
    });
    await page.close();
    console.log("Passed", engine, width);
  }
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  await reduced.goto(`${base}/experience-3d`);
  await reduced.locator(".guardian-hud").first().waitFor();
  assert.equal(await reduced.getByText("SYSTEM INITIALIZING").count(), 0);
  for (const mode of modes) await activate(reduced, mode, 1440);
  await reduced.close();
  const fallback = await browser.newPage();
  await fallback.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl") ? null : get.call(this, type, ...args);
    };
  });
  await fallback.goto(`${base}/experience-3d`);
  await fallback
    .getByText("3D experience unavailable on this device.")
    .waitFor();
  await fallback.getByRole("link", { name: "Return to Portfolio" }).click();
  assert.equal(new URL(fallback.url()).pathname, "/");
  await fallback.close();
  results.push({ engine, reducedMotion: "pass", fallback: "pass" });
  await browser.close();
}
fs.writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
fs.writeFileSync(`${output}/manifest.json`, JSON.stringify(captures, null, 2));
const images = captures
  .filter((c) => c.width === 1440)
  .map(
    (c) =>
      `<figure><figcaption>${c.mode.toUpperCase()}</figcaption><img src="data:image/png;base64,${fs.readFileSync(`${output}/${c.file}`).toString("base64")}" /></figure>`,
  )
  .join("");
fs.writeFileSync(
  `${output}/desktop-contact-sheet.html`,
  `<!doctype html><html><head><meta charset="utf-8"><title>Cinematic Guardian — operational modes</title><style>body{margin:0;background:#03090c;color:#abc3cc;font:14px system-ui}h1{font-size:22px;margin:24px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:0 24px 24px}figure{margin:0;border:1px solid #243940}figcaption{padding:10px;font:12px monospace;letter-spacing:2px}img{display:block;width:100%}</style></head><body><h1>Cinematic Guardian / one facility, nine operational modes</h1><main>${images}</main></body></html>`,
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1800, height: 1300 } });
await page.goto(`file://${output}/desktop-contact-sheet.html`);
await page.screenshot({
  path: `${output}/desktop-contact-sheet.png`,
  fullPage: true,
});
await browser.close();
console.log(JSON.stringify(results, null, 2));
