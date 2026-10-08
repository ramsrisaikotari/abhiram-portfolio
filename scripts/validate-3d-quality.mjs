/* global process, console, window, document, Event */
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
import assert from "node:assert/strict";
import fs from "node:fs";
const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
fs.mkdirSync("/tmp/portfolio-3d-validation", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    deviceScaleFactor: 3,
  });
  await page.goto(`${baseUrl}/experience-3d`);
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(300);
  const dpr = await page
    .locator("canvas")
    .evaluate((c) => c.width / c.getBoundingClientRect().width);
  assert(dpr <= (width < 769 ? 1.25 : 1.5) + 0.01);
  results.push({ width, dpr });
  await page.close();
}
const page = await browser.newPage({ reducedMotion: "reduce" });
await page.goto(`${baseUrl}/experience-3d`);
await page.locator("canvas").waitFor();
await page.waitForTimeout(300);
await page.evaluate(() => {
  window.__calls = 0;
  const gl = document.querySelector("canvas").getContext("webgl2");
  for (const key of [
    "drawArrays",
    "drawElements",
    "drawArraysInstanced",
    "drawElementsInstanced",
  ]) {
    const native = gl[key].bind(gl);
    gl[key] = (...args) => {
      window.__calls++;
      return native(...args);
    };
  }
});
await page.waitForTimeout(600);
assert.equal(await page.evaluate(() => window.__calls), 0);
await page.locator("#intro .system-flow button").nth(1).click();
await page.waitForTimeout(300);
assert((await page.evaluate(() => window.__calls)) > 0);
const count = await page.evaluate(() => window.__calls);
await page.waitForTimeout(600);
assert.equal(await page.evaluate(() => window.__calls), count);
results.push({ reducedMotionStatic: "pass" });
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.waitForTimeout(300);
await page.evaluate(() => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => true,
  });
  document.dispatchEvent(new Event("visibilitychange"));
});
await page.waitForTimeout(100);
const hiddenCount = await page.evaluate(() => window.__calls);
await page.waitForTimeout(600);
assert.equal(await page.evaluate(() => window.__calls), hiddenCount);
results.push({ hiddenDocumentPaused: "pass" });
await page.evaluate(() => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => false,
  });
  document.dispatchEvent(new Event("visibilitychange"));
});
await page.locator("#components").scrollIntoViewIfNeeded();
await page
  .locator("#components .system-flow button")
  .filter({ hasText: "Observability" })
  .click();
assert(
  (await page
    .locator("#components details[open]")
    .filter({ hasText: "Dynatrace" })
    .count()) > 0,
);
await page.locator("#modules").scrollIntoViewIfNeeded();
await page.locator("#modules .system-activate").nth(1).click();
await page.waitForTimeout(200);
assert(
  (await page
    .locator('.scene-node[aria-label="Activate Portfolio CI/CD Platform"]')
    .getAttribute("aria-pressed")) === "true",
);
results.push({ skillsAndModules: "pass" });
await page.locator("#delivery").scrollIntoViewIfNeeded();
await page.waitForTimeout(2800);
const settled = await page.evaluate(() => window.__calls);
await page.waitForTimeout(500);
assert.equal(await page.evaluate(() => window.__calls), settled);
results.push({ settledMechanicalPaused: "pass" });
await page
  .locator("canvas")
  .evaluate((c) =>
    c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
  );
await page.getByText("3D experience unavailable on this device.").waitFor();
results.push({ contextLoss: "pass" });
const resume = await page.request.get(`${baseUrl}/resume.pdf`);
assert.equal(resume.status(), 200);
assert(resume.headers()["content-type"].includes("application/pdf"));
results.push({ resume: "pass" });
console.log(JSON.stringify(results, null, 2));
fs.writeFileSync(
  "/tmp/portfolio-3d-validation/quality.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
