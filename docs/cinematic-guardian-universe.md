# Cinematic Guardian: complete operational experience

PR #6 extends the approved hero into one persistent machine and industrial facility. The hero model, its materials, entrance, and desktop/mobile identity composition are preserved. This is a presentation-only extension; portfolio facts, shared data, resume, default site, and deployment configuration are unchanged.

## Visual architecture

`EngineeringScene` now keeps `CinematicHero` mounted across all ten sections. `useGuardianModel` owns one abortable GLB load and disposes its geometry/materials on exit. The Guardian's articulated pivots move toward operational docking positions; the large entrance happens once per experience entry. The same `HeroEnvironment` remains mounted, with existing graphite structural ribs, floor panels, recessed rails, conduits, cyan service strips, and sparse amber practicals.

- `cinematic/operationalPose.ts`: damped housings, sleds, braces, crown, and core; restrained operational lighting and standby folding.
- `cinematic/modeComposition.ts`: section-specific station layouts, primary/supporting separation, shared project titles, and deliberate mobile selections.
- `cinematic/OperationalSystems.tsx`: shared instanced service cradles, actuator supports, projector frames, command deck, deployment rail, docking, and one-shot packet motion.
- `cinematic/ProjectionPaths.tsx`: one vertex-colored connection batch; selected request paths are brighter, supporting validation links dimmer.

All labels and interactions remain accessible DOM buttons through `NodeLabel`; detailed portfolio content remains in the original story components. Scene selection synchronizes existing project and skill controls. No paragraphs or metric values are duplicated inside WebGL.

## Operational modes

| Section            | Presentation                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engineering Impact | Guardian housings open into telemetry configuration; four short service/account/region/operations indicators support the authoritative DOM metrics.                                                                 |
| Experience         | Side infrastructure assemblies rotate outward; mechanically supported CLOUD, DELIVERY, SERVICES, OBSERVABILITY, and RELIABILITY stations deploy.                                                                    |
| Featured Projects  | Four stations dock around the recessed Guardian. Inactive stations fold back; the selected station moves forward, illuminates its frame, and connects to the core. Shared titles and details are unchanged.         |
| Case Studies       | Wider operations view, raised command deck, rails, two dim background telemetry screens, and selected holographic architecture above the Guardian.                                                                  |
| AWS Migration      | Five sequential primary stations with directional chevrons and one request pulse. Lambda and Step Functions are smaller, offset, and dimly connected as supporting systems.                                         |
| Observability      | Two depth layers of binary atmosphere, open data-processing housings, four-step log flow, one packet, and five secondary validation stations.                                                                       |
| CI/CD              | Nine physical stations along one sequential deployment rail. Struts and rail segments extend with staggered docking; one deployment pulse runs, then the scene rests.                                               |
| Incident Response  | Lower key lighting, one diagnostic path, selected connection illumination, and muted degradation lighting only on Database. No flashing or alarm effects.                                                           |
| Skills             | Eight major mechanical/data modules; selecting a category deploys up to six related technologies on desktop and five on mobile, with the full list retained in DOM. The selected category remains in the small HUD. |
| Contact            | Previous stations retract, Guardian arms partially fold, core light dims, camera settles wider, and SYSTEM STANDBY remains. Binary motion slows to 12% speed and settled rendering is paced at 10 Hz.               |

The mechanical configurations use translation and hinge rotation with damping; normal docking completes in approximately 0.75–1.25 seconds. Request/deployment pulses finish once after docking. Scrolling remains standard and never waits for an animation.

## Mobile composition

The existing 160–184px visual band is retained, with no header gap. Operational cameras center the selected system and keep the Guardian recognizable. Project stations use two carefully separated rows. AWS overview retains its five primary stages; observability shows only its four-step primary flow. Longer case studies and CI/CD show four stages around the selected stage. Skills show a compact category subset initially and only selected related children afterward. The full underlying content and controls remain in DOM.

Label depth and spacing are tailored to 320, 375, 390, and 768px. The operational status HUD is a normal DOM overlay inside the scene safe area, independent of camera projection and frame timing. Long desktop flows stagger short labels along a single rail, rather than becoming a grid.

## Rendering safeguards

One Canvas, demand rendering, hidden-document pause, adaptive DPR (desktop ≤1.5, mobile ≤1.25), reduced motion, boundary/context-loss fallback, client-side navigation, and resource cleanup remain intact. Reduced-motion users see assembled static configurations without boot, packets, parallax, continuous rotation, or assembly. Phong/basic materials avoid introducing PBR environment resources. No dependencies, models, external textures, audio, physics, or post-processing were added.

The optional scene/model is requested only after entering `/experience-3d`. The default bundle contains no Three.js scene code. Its CSS is unchanged; its JavaScript changes only the generated dynamic-import target.

## Validation and visual review

Run the existing `validate-3d.mjs`, `validate-3d-quality.mjs`, `validate-3d-lifecycle.mjs`, and `validate-cinematic-hero.mjs`, plus `validate-cinematic-universe.mjs`. Provide `PLAYWRIGHT_MODULE` when Playwright is installed outside the repository and `PORTFOLIO_TEST_URL` for a running production preview.

The universe suite covers Chromium and Playwright WebKit at 1440×900, 390×844, and 375×812. It verifies one Guardian request across all nine modes, one Canvas, rendered triangles, draw-call budget, overflow, safe labels, HUD overlap, mobile header alignment, every Skills category and selected deployment stages, Back/Escape/history, resume, reduced motion, and WebGL fallback. WebKit automation is compatibility evidence, not a substitute for a physical iPhone/Safari device check.

It captures the nine required desktop sections and six mobile sections, writes `manifest.json` and `results.json`, adds a selected-Skills mobile capture, and generates a self-contained desktop contact sheet (HTML and PNG). Default artifact location: `/tmp/guardian-universe/acceptance`; override with `VISUAL_OUTPUT_DIR`.

The lifecycle suite retains its 24-cycle context/RAF/listener/memory checks. Its complete-experience ceiling is now 50 draw calls, matching the reviewed persistent Guardian budget; the approved hero retains its independent 45-call ceiling. This change accommodates shared physical stations without weakening any cleanup assertions.

## Measured budget

Measurements below use the production Vite build. KB/MB are decimal units; transport total combines gzipped JS/CSS with the raw quantized GLB.

| Resource                       | Current measurement                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Default JavaScript             | 262.59 KB raw / 82.01 KB gzip; no Three.js or model request before opting in                            |
| Optional 3D JavaScript         | 972.59 KB raw / 267.50 KB gzip (approved hero build: 269.30 KB gzip)                                    |
| Optional CSS                   | 8.13 KB raw / 2.40 KB gzip                                                                              |
| Guardian GLB                   | 876,912 bytes; unchanged Git blob and 19,920 model triangles                                            |
| Combined optional transport    | Approximately 1.147 MB, before server compression of the GLB                                            |
| Render calls                   | Hero 44 desktop / 42 mobile; operational states 43–48 settled; complete-experience peak 49              |
| Scene triangles                | Approximately 20,610–24,416 including bay, station geometry, and request pulse                          |
| DPR cap                        | 1.5 desktop / 1.25 mobile; adaptive fallback to 1                                                       |
| Binary instances               | Desktop: 97 intro, 94 observability, 72 other modes. Mobile: 18 intro/observability, 12 other modes     |
| Flow particles                 | At most one short-lived request/deployment packet                                                       |
| Textures                       | Generated binary glyph maps and contact-shadow gradient; no external texture assets or environment maps |
| Initial local model-ready time | Approximately 0.8–2.0 seconds in headless browser runs; this is not a production-network benchmark      |

Vite retains its existing large optional-chunk advisory. The full scene remains outside the recruiter-critical path, and its gzip JavaScript size is lower than the approved hero-only build.

The transition timeout counts elapsed activation time independently of bounded damping steps, so low frame rates do not keep settled mechanical scenes invalidating indefinitely. Resize invalidation restarts the short camera settling window. Non-flow docking stops requesting frames after 1.4 seconds; flow scenes allow their single pulse to finish by 2.5 seconds.

## Changed files and assets

The implementation touches only `src/three`: the scene dispatcher, host overlay, operational class, shared labels, hero controller/binary/CSS, and four new `cinematic` helpers. Validation adds `scripts/validate-cinematic-universe.mjs` and strengthens `scripts/validate-3d-lifecycle.mjs`. This report is the only documentation addition.

No model, texture, dependency, portfolio-data, resume, default-portfolio, deployment, or infrastructure files changed. The approved Guardian asset remains the same Git blob (`ef1cda7122d9059ee308250f281d260920db5b80`) and retains its existing original-model license in `public/models/LICENSE.txt`.

## Final validation evidence

- `npm ci`, `npm run lint`, `npm run build`, and `git diff --check`: pass. The build emits only the existing optional-chunk size advisory.
- Existing 3D regression: all six widths pass (1440, 1024, 768, 390, 375, 320), including the normal portfolio, case-study variations, selected Skills, resume/social links, client-side history, Escape, reduced motion, and fallback.
- Quality suite: DPR limits, zero reduced-motion idle draws, hidden-document pause, project/Skills synchronization, settled mechanical pause, and context-loss fallback pass.
- Approved cinematic hero: Chromium at 1440/1024/390/375/320 and WebKit at 1440/1024/390/375 pass; 44 desktop / 42 mobile draw calls and no console errors.
- Lifecycle: all 24 loaded-model entry/exit cycles pass. Every exit leaves zero WebGL contexts, RAFs, and standby intervals; document pointer-move listeners return to zero and other listeners remain stable. Post-GC heap growth across the run is 1,301,480 bytes, within the existing 5 MB guard. Complete-experience peak is 49 draw calls.
- Complete-universe suite: Chromium and Playwright WebKit pass at 1440×900, 390×844, and 375×812, with every Skills category checked for clipping/overlap. No console errors, no horizontal overflow, one Canvas, one Guardian request across modes, and working Back/Escape/history/resume are confirmed. Both engines pass reduced-motion and forced-WebGL-unavailable fallback checks.
- Review captures: nine desktop + six mobile required frames, one additional selected-Skills mobile frame, and desktop contact sheet are generated. Review-gallery HTML embeds the unmodified captures for full-size inspection.
