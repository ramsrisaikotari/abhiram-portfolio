/* global process, console */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const { webkit } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const output =
  process.env.HERO_REVIEW_DIR || "docs/cinematic-hero-v2/refinement";
fs.mkdirSync(output, { recursive: true });

// Each full-page image gets a fresh page to avoid native repeated-snapshot layers.
for (const [name, ticks] of [
  ["offline", 0],
  ["mid-transformation", 900],
]) {
  const browser = await webkit.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.clock.install();
  await page.goto(base + "/experience-3d");
  await page.locator(".guardian-hud").first().waitFor();
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 300);
  await page.clock.runFor(ticks + 16);
  await page.screenshot({ path: `${output}/${name}.png` });
  await page.close();
  await browser.close();
}
for (const [name, width, height, parallax] of [
  ["final", 1440, 900, false],
  ["alternate-pointer", 1440, 900, true],
  ["mobile-390", 390, 844, false],
]) {
  const browser = await webkit.launch();
  const page = await browser.newPage({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  await page.goto(base + "/experience-3d");
  await page.locator(".guardian-hud").first().waitFor();
  await page.waitForTimeout(2900);
  if (parallax) {
    await page.mouse.move(1360, 220);
    await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${output}/${name}.png` });
  await page.close();
  await browser.close();
}
const before = fs.readFileSync(`${output}/current-v2.png`).toString("base64"),
  after = fs.readFileSync(`${output}/final.png`).toString("base64");
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Guardian hero visual comparison</title><style>body{margin:0;background:#061016;color:#dbe5e4;font:20px system-ui}main{display:grid;grid-template-columns:1fr 1fr}section{min-width:0}h1{font:600 25px system-ui;margin:18px 25px}p{font:15px system-ui;color:#9cb0b4;margin:0 25px 18px}img{width:100%;display:block}section+section{border-left:1px solid #263c43}@media(max-width:900px){main{grid-template-columns:1fr}section+section{border-left:0;border-top:1px solid #263c43}}</style><main><section><h1>CURRENT V2</h1><p>PR #6 baseline · original compact cabinet silhouette</p><img alt="Current V2 desktop hero" src="data:image/png;base64,${before}"></section><section><h1>REFINED V2</h1><p>Articulated guardian · open trusses · deeper service bay</p><img alt="Refined V2 desktop hero" src="data:image/png;base64,${after}"></section></main></html>`;
fs.writeFileSync(`${output}/comparison.html`, html);
const browser = await webkit.launch();
const comparison = await browser.newPage({
  viewport: { width: 2880, height: 1000 },
});
await comparison.goto(
  pathToFileURL(path.resolve(`${output}/comparison.html`)).href,
);
await comparison.screenshot({
  path: `${output}/comparison.png`,
  fullPage: true,
});
await comparison.close();
await browser.close();
console.log("Refined hero captures and comparison saved:", output);
