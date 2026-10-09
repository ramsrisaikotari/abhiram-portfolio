# Cinematic hero V2 — visual approval prototype

This PR changes only the optional 3D intro. It is a visual-approval checkpoint,
not approval to propagate this art direction to the other nine sections.

## Visual architecture

The identity/CTA column uses about 43% of desktop width. The right-side bay
uses about 57%, with an original Cloud Infrastructure Guardian framed at a
three-quarter angle. This is a stylized hard-surface machine, not a photoreal
AAA asset. Review its silhouette, material treatment and activation before
expanding the direction.

The offline model contains authored beveled polygon armor, stepped mechanical
cross-sections, open service bays, vents, fasteners, coolant conduits, joints,
and split infrastructure housings. It is loaded as a GLB, not assembled from
runtime boxes, spheres and toruses. Supporting bay walls, ribs and rails use
merged simple geometry. The floor and receding industrial structure establish
scale; fog and three data planes establish atmospheric depth.

Material hierarchy: dark gunmetal, graphite, brushed steel, near-black recesses,
small cyan service components, green indicators and sparse amber practicals.
There is no bloom, environment map, reflection effect, audio, physics engine,
external texture or additional dependency.

Lighting: low ambient fill, a ramped cool directional key, cyan rim, restrained
green spill and small warm practical. A small original 128² procedural contact-shadow texture grounds the
machine without a realtime shadow map. This avoids per-frame shadow work and a
large shadow target while retaining a grounded floor composition.

## Activation

Activation lasts approximately 2.2 seconds after model readiness and never
blocks reading or scrolling:

- 0–350 ms: dark silhouette and early internal status indicators.
- 350–1400 ms: staggered side sled docking, with translation and hinge motion.
- 800–1700 ms: crown and lower armor settle into their docked positions.
- 1200–1950 ms: recessed cyan data chamber powers on.
- By 2200 ms: sparse HUD settles; only slow binary motion and tiny pointer
  camera damping remain.

Reduced motion renders docked parts and fully activated lights immediately
when the asset arrives, skips the boot/HUD animation, disables stream motion
and pointer travel, and draws only on changes. Hidden documents pause rendering.

Desktop uses a 40° perspective camera at an intentional elevated three-quarter
angle. Pointer displacement is capped to 0.16/0.08 world units; there are no
orbit/FPS/game controls. Mobile uses a tighter upper-chassis crop in the existing
160–184px band, two binary layers, simpler ribs, one HUD label, and no parallax.

## Preserved V1 architecture

`EngineeringScene` selects `CinematicHero` only for `intro`. The original
renderer is retained as `LegacyEngineeringScene` for Engineering Impact,
Experience, Projects, Case Studies, Observability, CI/CD, Incident Response,
Skills and Contact. Their visuals, data and interactions are unchanged.

The existing route, lazy boundary, one Canvas, shared data, Back to Portfolio,
browser history, Escape, keyboard controls, fallback, adaptive DPR, hidden-tab
pause and renderer disposal remain. The default professional portfolio, resume,
CI/CD, Firebase Preview and infrastructure configuration are unchanged.

The model uses an abortable, experience-owned loader rather than a global GLTF
cache. Late asynchronous results are disposed; all geometry/materials are
released on unmount. Loaded PBR descriptions are converted to shared lightweight
Phong/basic materials before any render, avoiding a retained global lighting LUT.

Hero DOM dimensions remain stable while sections change, preventing observer
layout oscillation. The hero uses a small contact-shadow layer rather than an expensive shadow
target; text stays the primary surface.

## Original asset and license

Source: [build-guardian.py](../../scripts/assets/build-guardian.py).
Asset: [cloud-infrastructure-guardian.glb](../../public/models/cloud-infrastructure-guardian.glb).
License: [Original portfolio asset notice](../../public/models/LICENSE.txt).
No external model was imported or modified.

Rebuild with `python3 scripts/assets/build-guardian.py`.
The Khronos validator reports zero errors, warnings, or hints; see
[model-validation.json](model-validation.json).
The model uses shared material batches, indexed vertices and normalized 16-bit
normals via `KHR_mesh_quantization`. No Draco/Meshopt decoder is needed at this
size; no external textures are embedded. Geometry details remain intact.

## Performance

| Measure | Result |
| --- | --- |
| GLB transfer before HTTP encoding | 668,944 bytes (0.669 MB) |
| Machine triangles | 15,600 |
| Model material batches | 22 |
| Optional JS | 976.30 KB raw / 268.54 KB gzip (Vite) |
| Optional CSS | 7.56 KB raw / 2.29 KB gzip |
| Total optional JS + CSS + model, unencoded | ~1.653 MB |
| JS/CSS gzip plus unencoded GLB | ~0.940 MB |
| Main portfolio JS | 262.59 KB raw / 82.02 KB gzip; effectively unchanged |
| Initial `/` requests for 3D JS or model | None |
| Hero main pass draw calls | 32 desktop / 30 mobile |
| Realtime shadow pass | None |
| Rendered main-pass triangles | 15,910 desktop / 15,752 mobile |
| Peak across all scene passes in lifecycle audit | 39 draw calls |
| Binary streams | 64 desktop / 16 mobile, instanced |
| DPR caps | 1–1.5 desktop / 1–1.25 mobile, slow-frame fallback 1 |
| Model image texture memory | 0 |
| Binary texture | 64×256 RGBA, ~0.083 MiB with mipmaps |
| Contact-shadow texture | 128×128 RGBA, ~0.083 MiB with mipmaps |
| Environment maps / external models / textures | None |

The full optional payload includes the preserved V1 systems. Review artifacts
live under `docs/`, outside the Vite public assets; they are not runtime payload.
HTTP encoding of GLB depends on the host; the payload budget above does not
assume the GLB is gzipped. The optional JS retains Vite's >500KB raw chunk warning;
it is deliberately absent from the recruiter-critical route.

Local unthrottled-preview entry-to-model-ready measurements: approximately 0.84–1.67s
in Chromium and 0.83–1.55s in WebKit for the measured run. These are local browser
measurements, not production network or physical-phone benchmarks. See
[hero-results.json](hero-results.json) for viewports and individual measurements.

## Visual review

- [Desktop final, 1440×900](desktop-final.png)
- [Desktop activation, 1440×900](desktop-activation.png)
- [Desktop pointer variation](desktop-parallax.png)
- [Mobile final, 390×844](mobile-390.png)
- [Mobile 375px](mobile-375.png) and [320px](mobile-320.png)
- Frame sequence: [200ms](activation-200.png), [600ms](activation-600.png),
  [1000ms](activation-1000.png), [1500ms](activation-1500.png),
  [2200ms](activation-2200.png).

Activation frames isolate the Canvas band so model motion is easy to compare.
The full desktop activation still also includes the DOM identity/CTA.
Frame filenames are requested capture targets. Actual screenshot completion
times are in [activation-timing.json](activation-timing.json); capture overhead
means they are not exact simulation timestamps.

## Validation

`npm ci`, `npm run lint`, `npm run build`, and `git diff --check` pass.
Existing `validate-3d.mjs`, `validate-3d-quality.mjs`, and
`validate-3d-lifecycle.mjs` pass; hero-specific Chromium/WebKit checks pass.
The layout suite covers 1440/1024/768/390/375/320px. Hero checks cover
1440×900, 390×844, 375×812 and 320×844 in Chromium; WebKit covers the first three.

Verified default lazy loading, filters/details/resume/social links, one Canvas,
Back/browser Back/Escape, overflow and label bounds, mobile header adjacency,
static reduced motion, hidden-tab pause, WebGL-unavailable and context-loss
fallbacks, and existing Skills/project selection.

The final 24-cycle audit leaves zero RAFs and zero WebGL contexts after every
exit, stable listeners, and heap growth of approximately 1.25MB after GC
(8.48→9.73MB), below the existing 5MB guard. GPU byte accounting is estimated
from known resources, not a complete browser GPU-memory measurement.

To reproduce with an external Playwright installation:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs PORTFOLIO_TEST_URL=http://127.0.0.1:4173 node scripts/validate-cinematic-hero.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs PORTFOLIO_TEST_URL=http://127.0.0.1:4173 node scripts/capture-cinematic-hero.mjs
```

This is submitted for hero visual approval. No merge or manual Firebase deploy
has been performed.

## Files changed

- `src/three/EngineeringScene.tsx`: hero/legacy scene selection.
- `src/three/LegacyEngineeringScene.tsx`: unchanged V1 renderer, with only its export renamed.
- `src/three/EngineeringStory.tsx`: intro identity reads the existing profile name.
- `src/three/Experience3D.tsx`: intro-only class and scoped hero stylesheet.
- `src/three/hero/`: camera/timeline/light controller, owned GLB loader, batched
  industrial bay, instanced depth streams and hero-only styles.
- `public/models/`: original GLB and ownership notice.
- `scripts/assets/build-guardian.py`: reproducible model authoring/export.
- `scripts/validate-cinematic-hero.mjs` and `scripts/capture-cinematic-hero.mjs`:
  cross-engine hero checks and review capture.
- Existing quality/lifecycle scripts now wait for asynchronous model readiness
  before static-frame measurement and full-model disposal checks.
- `docs/cinematic-hero-v2/`: review report, stills, sequence, asset
  validation and browser measurements. These are not served runtime assets.

No dependency/lockfile, default-portfolio source, shared data, resume, canonical
URL, deployment workflow or infrastructure configuration changes.
