/* global process, console */
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const output = process.env.HERO_REVIEW_DIR || "docs/cinematic-hero-v2";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
await page.goto(base + "/experience-3d");
await page.locator(".guardian-hud").first().waitFor();
const ready = Date.now();
const frames = [];
for (const target of [200, 600, 1000, 1500, 2200]) {
  await page.waitForTimeout(Math.max(0, target - (Date.now() - ready)));
  const path = `activation-${target}.png`;
  await page.bringToFront();
  if (target === 200)
    await page.screenshot({ path: `${output}/desktop-activation.png` });
  await page.locator(".scene-stage").screenshot({ path: `${output}/${path}` });
  frames.push({ path, elapsedMs: Date.now() - ready });
}
await context.close();
// A fresh page per full-page still avoids stale native screenshot layers.
for (const parallax of [false, true]) {
  const still = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await still.goto(base + "/experience-3d");
  await still.locator(".guardian-hud").first().waitFor();
  await still.waitForTimeout(2800);
  if (parallax) {
    await still.mouse.move(1360, 220);
    await still.waitForTimeout(800);
  }
  await still.screenshot({
    path: `${output}/desktop-${parallax ? "parallax" : "final"}.png`,
  });
  await still.close();
}
for (const width of [390, 375, 320]) {
  const mobile = await browser.newPage({
    viewport: { width, height: width === 375 ? 812 : 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(base + "/experience-3d");
  await mobile.locator(".guardian-hud").first().waitFor();
  await mobile.waitForTimeout(3000);
  await mobile.screenshot({ path: `${output}/mobile-${width}.png` });
  await mobile.close();
}
fs.writeFileSync(
  `${output}/activation-timing.json`,
  JSON.stringify(frames, null, 2),
);
await browser.close();
console.log("Hero screenshots and activation frames captured:", output);
