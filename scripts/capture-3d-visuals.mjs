/* global process, console, document, window */
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
const output =
  process.env.VISUAL_OUTPUT_DIR || "/tmp/portfolio-3d-refinement/acceptance";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const captures = [];
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${baseUrl}/`);
  if (width === 390)
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "3D Experience", exact: true }).click();
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(2200);
  const capture = async (name) => {
    const path = `${output}/${width}-${name}.png`;
    await page.screenshot({ path });
    captures.push({ width, name, path });
    console.log(width, name);
  };
  const activate = async (id, delay = 2200) => {
    await page.evaluate(
      ({ id, width }) => {
        const section = document.getElementById(id);
        const offset =
          width <= 768
            ? document.querySelector(".scene-stage").getBoundingClientRect()
                .bottom + 20
            : 56;
        window.scrollTo({
          top: section.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "instant",
        });
      },
      { id, width },
    );
    await page.locator(`.system-nav a[aria-current][href="#${id}"]`).waitFor();
    await page.waitForTimeout(delay);
  };
  await capture("digital-intro");
  await activate("impact");
  if (width === 1440) await capture("engineering-impact");
  await activate("infrastructure", width === 1440 ? 420 : 2200);
  if (width === 1440) {
    await capture("mechanical-partial");
    await page.waitForTimeout(1800);
  }
  await capture("mechanical-assembled");
  if (width === 1440) {
    await activate("modules");
    await capture("featured-projects");
  }
  await activate("case-studies");
  await capture("command-center");
  if (width === 1440) {
    for (const [id, name] of [
      ["observability", "observability"],
      ["delivery", "cicd"],
      ["diagnostic", "incident-response"],
    ]) {
      await activate(id);
      await capture(name);
    }
  }
  await activate("components");
  await capture("skills");
  await page
    .locator("#components .system-flow button")
    .filter({ hasText: "Observability" })
    .click();
  await page.waitForTimeout(1500);
  await capture("skills-observability");
  if (width === 1440) {
    await activate("standby");
    await capture("standby");
  }
  await page.close();
}
fs.writeFileSync(`${output}/manifest.json`, JSON.stringify(captures, null, 2));
await browser.close();
