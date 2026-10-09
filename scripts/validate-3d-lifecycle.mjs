/* global process, console, window, document, HTMLCanvasElement */
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
import assert from "node:assert/strict";
import fs from "node:fs";
const baseUrl = process.env.PORTFOLIO_TEST_URL || "http://127.0.0.1:4173";
fs.mkdirSync("/tmp/portfolio-3d-validation", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  const nativeRAF = window.requestAnimationFrame.bind(window),
    nativeCancel = window.cancelAnimationFrame.bind(window);
  const pending = new Set();
  const contexts = new Set();
  const intervals = new Set();
  const interval = window.setInterval.bind(window),
    clearInterval = window.clearInterval.bind(window);
  window.setInterval = (...args) => {
    const id = interval(...args);
    intervals.add(id);
    return id;
  };
  window.clearInterval = (id) => {
    intervals.delete(id);
    clearInterval(id);
  };
  const listeners = new Map();
  let drawCalls = 0;
  let frameCalls = 0;
  let peakFrameCalls = 0;
  window.requestAnimationFrame = (cb) => {
    let id;
    id = nativeRAF((time) => {
      pending.delete(id);
      cb(time);
    });
    pending.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    pending.delete(id);
    nativeCancel(id);
  };
  const get = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    const context = get.call(this, type, ...args);
    if (
      context &&
      (type === "webgl" || type === "webgl2") &&
      !contexts.has(context)
    ) {
      contexts.add(context);
      this.addEventListener("webglcontextlost", () => contexts.delete(context));
      const clear = context.clear.bind(context);
      context.clear = (...args) => {
        peakFrameCalls = Math.max(peakFrameCalls, frameCalls);
        frameCalls = 0;
        return clear(...args);
      };
      for (const name of [
        "drawElements",
        "drawArrays",
        "drawElementsInstanced",
        "drawArraysInstanced",
      ]) {
        const original = context[name].bind(context);
        context[name] = (...args) => {
          drawCalls++;
          frameCalls++;
          return original(...args);
        };
      }
    }
    return context;
  };
  for (const target of [document, window]) {
    const add = target.addEventListener.bind(target),
      remove = target.removeEventListener.bind(target);
    target.addEventListener = (type, listener, options) => {
      if (
        [
          "visibilitychange",
          "keydown",
          "pointerdown",
          "pointermove",
          "change",
          "popstate",
          "click",
        ].includes(type)
      ) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(listener);
      }
      return add(type, listener, options);
    };
    target.removeEventListener = (type, listener, options) => {
      listeners.get(type)?.delete(listener);
      return remove(type, listener, options);
    };
  }
  window.__audit = () => ({
    raf: pending.size,
    contexts: contexts.size,
    intervals: intervals.size,
    listeners: Object.fromEntries(
      [...listeners].map(([name, set]) => [name, set.size]),
    ),
    drawCalls,
    peakFrameCalls,
  });
});
const client = await page.context().newCDPSession(page);
await page.goto(`${baseUrl}/`);
const snapshots = [];
for (let i = 0; i < 24; i++) {
  await page.getByRole("link", { name: "3D Experience", exact: true }).click();
  await page.locator("canvas").waitFor();
  // Exercise disposal of the loaded GLB, not just an aborted initial request.
  await page.locator(".guardian-hud").first().waitFor();
  await page.waitForTimeout(600);
  if (i === 0) {
    for (const id of [
      "intro",
      "impact",
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
      await page.waitForTimeout(1000);
      const before = await page.evaluate(() => window.__audit().drawCalls);
      await page.waitForTimeout(500);
      const after = await page.evaluate(() => window.__audit().drawCalls);
      snapshots.push({ scene: id, drawCallsPerSecond: 2 * (after - before) });
    }
  }
  await page.locator("#system-exit").click();
  await page.waitForTimeout(1200);
  await client.send("HeapProfiler.collectGarbage");
  const state = await page.evaluate(() => window.__audit());
  const heap = await client.send("Runtime.getHeapUsage");
  console.log("Exit cycle", i + 1, "heap", heap.usedSize);
  snapshots.push({ cycle: i + 1, ...state, heap: heap.usedSize });
  assert.equal(await page.locator("canvas").count(), 0);
  assert.equal(state.contexts, 0);
  assert.equal(state.raf, 0);
  assert.equal(state.intervals, 0, "Standby interval must be released on exit");
  // The complete persistent Guardian modes have a reviewed 50-call budget.
  // The approved hero retains its separate <=45 guard.
  assert(
    state.peakFrameCalls <= 50,
    `Investigate scene draw calls above 50: ${state.peakFrameCalls}`,
  );
}
const exits = snapshots.filter((s) => s.cycle);
assert.deepEqual(exits[0].listeners, exits.at(-1).listeners);
assert(exits.at(-1).heap - exits[0].heap < 5_000_000, "unexpected heap growth");
console.log(JSON.stringify(snapshots, null, 2));
fs.writeFileSync(
  "/tmp/portfolio-3d-validation/lifecycle.json",
  JSON.stringify(snapshots, null, 2),
);
await browser.close();
