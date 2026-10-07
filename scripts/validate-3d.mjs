/* global process, console, document, HTMLCanvasElement, innerWidth, URL */
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
import assert from "node:assert/strict";
import fs from "node:fs";
const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
fs.mkdirSync("/tmp/portfolio-3d-validation", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const width of [1440, 1024, 768, 390, 375, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  console.log("Testing width", width);
  const errors = [];
  const requests = [];
  let documentRequests = 0;
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    requests.push(r.url());
    if (r.resourceType() === "document") documentRequests += 1;
  });
  await page.goto(`${baseUrl}/`);
  await page.waitForTimeout(400);
  assert.equal(
    requests.some((r) => r.includes("Experience3D")),
    false,
  );
  assert.equal(await page.locator("canvas").count(), 0);
  assert((await page.locator('a[href="/resume.pdf"]').count()) > 0);
  assert((await page.locator('a[href*="linkedin.com"]').count()) > 0);
  assert(
    (await page.locator('a[href="mailto:ramsrisaikotari@gmail.com"]').count()) >
      0,
  );
  assert(
    (await page
      .locator('a[href="https://github.com/ramsrisaikotari"]')
      .count()) > 0,
  );
  await page.locator("#projects").scrollIntoViewIfNeeded();
  const filters = page.locator(".project-filters button");
  if (await filters.count()) {
    await filters.last().click();
    await filters.first().click();
  }
  const detail = page.locator("details summary").first();
  if (await detail.count()) await detail.click();
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `default overflow ${width}`,
  );
  if (width <= 900)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "3D Experience", exact: true }).click();
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(1600);
  assert.equal(new URL(page.url()).pathname, "/experience-3d");
  assert.equal(await page.locator("canvas").count(), 1);
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `3d overflow ${width}`,
  );
  await page.screenshot({
    path: `/tmp/portfolio-3d-validation/intro-${width}.png`,
  });
  for (const id of [
    "infrastructure",
    "modules",
    "case-studies",
    "observability",
    "delivery",
    "diagnostic",
    "components",
    "standby",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${id} overflow ${width}`,
    );
  }
  await page.locator("#case-studies").scrollIntoViewIfNeeded();
  await page.locator("#case-studies .system-flow button").first().click();
  await page
    .locator("#case-studies .system-flow")
    .nth(1)
    .locator("button")
    .first()
    .focus();
  await page.keyboard.press("Space");
  await page.locator("#delivery").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `/tmp/portfolio-3d-validation/delivery-${width}.png`,
  });
  await page.locator("#system-exit").click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator("canvas").count(), 0);
  assert.equal(new URL(page.url()).pathname, "/");
  await page.goBack();
  await page.locator("canvas").waitFor();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  assert.equal(new URL(page.url()).pathname, "/");
  assert.equal(
    documentRequests,
    1,
    "Client-side navigation must not reload the document",
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log("Passed width", width);
  results.push({
    width,
    default: "pass",
    immersive: "pass",
    canvas: 1,
    errors,
  });
  await page.close();
}
const reduced = await browser.newPage({ reducedMotion: "reduce" });
await reduced.goto(`${baseUrl}/experience-3d`);
await reduced.locator("canvas").waitFor();
assert.equal(
  await reduced.getByText("SYSTEM INITIALIZING", { exact: false }).count(),
  0,
);
results.push({ reducedMotion: "pass" });
await reduced.close();
const fallback = await browser.newPage();
await fallback.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    if (type === "webgl" || type === "webgl2") return null;
    return original.call(this, type, ...args);
  };
});
await fallback.goto(`${baseUrl}/experience-3d`);
await fallback.getByText("3D experience unavailable on this device.").waitFor();
await fallback.getByRole("link", { name: "Return to Portfolio" }).click();
assert.equal(new URL(fallback.url()).pathname, "/");
results.push({ webglFallback: "pass" });
await fallback.close();
console.log(JSON.stringify(results, null, 2));
fs.writeFileSync(
  "/tmp/portfolio-3d-validation/results.json",
  JSON.stringify(results, null, 2),
);
await browser.close();
