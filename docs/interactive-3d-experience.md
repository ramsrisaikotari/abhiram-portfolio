# Optional interactive engineering experience

The professional portfolio remains the default at `/`. A secondary navbar link opens `/experience-3d` through the History API. There is no experience selector, redirect, or forced intro. The implementation began at main commit `88610fd` on `feature/interactive-3d-experience`.

## Architecture and changed files

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Lazy route boundary, client-side entry/exit, popstate cleanup |
| `src/components/Navbar.tsx` | Secondary desktop/mobile entry link |
| `src/styles/global.css` | Small entry-link treatment |
| `src/data/impact.ts` | Existing unchanged metrics extracted into shared data |
| `src/components/EngineeringImpact.tsx` | Reads those shared metrics |
| `src/three/Experience3D.tsx` | Immersive shell, boot status, exit/Escape, shared-data scene mapping |
| `src/three/EngineeringStory.tsx` | Accessible DOM story and existing content components |
| `src/three/SceneHost.tsx` | One Canvas, WebGL probe, error boundary, DPR and renderer disposal |
| `src/three/useSceneController.ts` | IntersectionObserver, visibility and live media-query handling |
| `src/three/EngineeringScene.tsx` | Shared core, nodes, paths, short transformations, camera and packets |
| `src/three/BinaryField.tsx` | Instanced, layered procedural binary atmosphere |
| `src/three/ProjectModules.tsx` | Four featured project modules using shared project data |
| `src/three/SystemFlow.tsx` | DOM focus/activation controls for architecture nodes |
| `src/three/skillLabels.ts` | Presentation labels mapped onto shared skill categories |
| `src/three/WebGLFallback.tsx` | Readable device/renderer failure state |
| `src/three/experience.css` | Scoped immersive layouts and responsive reductions |
| `package.json`, `package-lock.json` | Pinned new WebGL dependencies |
| `scripts/validate-3d.mjs` | Six-width default/immersive regression matrix |
| `scripts/validate-3d-quality.mjs` | DPR, reduced motion, visibility, interaction and context-loss checks |
| `scripts/validate-3d-lifecycle.mjs` | Repeated entry/exit cleanup and heap checks |
| `docs/interactive-3d-experience.md` | Implementation and validation report |

The profile, jobs, projects and skills are read from the existing `src/data` modules. Existing project cards, details, experience, contact and impact components are reused. No parallel content collection was introduced. Metric values and all employment/project claims remain unchanged.

Dependencies added: `three@0.183.2`, `@react-three/fiber@9.4.0`, `@react-three/drei@10.7.7`, and development declarations `@types/three@0.183.1`. Installed React and React DOM remain 19.3.0, Vite 7.3.6 and TypeScript 5.9.3. Existing dependency versions were compared against main and did not change. No GSAP, physics or router dependency was added.

## Behavior

| System | Behavior |
| --- | --- |
| Entry and exit | `/experience-3d` is lazy-loaded after selection. A persistent Back to Portfolio link, Escape, and browser Back operate without document reloads. Direct URL entry works through the existing hosting rewrite. Modified clicks retain normal browser behavior. |
| Boot | The system status switches from initializing to online in 1.4 seconds; navigation and content are usable immediately. Reduced motion skips initialization. |
| Digital | Nearly black/green atmosphere, layered 0/1 glyphs, instanced planes, a network nucleus, connected engineering nodes and restrained pointer parallax. AWS exposes related technology labels in DOM. |
| Impact | Original metrics remain readable DOM telemetry; selecting a metric highlights the matching scene node. |
| Mechanical | The nucleus contracts, rings reposition, and infrastructure nodes assemble through damped scale changes over roughly 0.6–1.5 seconds. Segmented steel modules and a command platform appear. Changes occur on section activation, rather than every scroll pixel. |
| Command center | Graphite/navy surfaces, cyan edge lighting, circular command platform and labeled architecture nodes. All geometry is procedural and original. |
| Featured projects | Four floating modules derive their names from the existing four featured projects. Focus/hover/activation changes the current project visualization. Existing DOM cards preserve descriptions, technologies, details and links. |
| AWS architecture | Shared Client → API Gateway → VPC Link / Load Balancer → ECS → Downstream flow, plus Lambda and Step Functions as supporting nodes. A short request pulse runs on entry or case-study selection. Selecting a node lights the node and adjacent path segments. Supporting workloads are not falsely connected into the main flow. |
| Case studies | The five prioritized shared case studies can activate their own architecture. No archive-wide heavy visualization was added. |
| Observability | Shared AWS Applications → CloudWatch Logs → Amazon Data Firehose → Dynatrace flow, one small moving packet, and separate validation targets. DOM and scene-node controls synchronize selection and adjacent path highlighting. |
| CI/CD | Shared nine-stage pipeline assembles on entry. One two-second request pulse traverses the pipeline, then stops. Hover/focus highlights stages; stage selection does not restart the pulse. |
| Incident response | Generalized Application/API/ECS/Network/Database diagnostic, healthy/degraded/elevated DOM statuses, Logs/Metrics/HTTP signals and a restrained red database accent. Explicitly labeled as illustrative, not an employer incident. |
| Skills | AWS, Terraform, CI/CD, Containers, Observability, Python, Linux and MLOps labels map to shared categories. Selection reveals shared connected technologies in DOM and the scene. |
| Standby | A settled command scene accompanies existing contact content and links. |

Normal scrolling drives an IntersectionObserver. Only the currently relevant architecture is rendered. There is no audio, game movement, physics, imported character, movie asset, environment map or post-processing pipeline.

## Mobile, accessibility and failure handling

At widths up to 768px, the scene occupies a compact fixed band above the reading area. It uses fewer glyph instances, two core rings, four mechanical panels, simplified node labels, no pointer camera travel and disabled antialiasing. Content occupies the full available width with wrapping controls. The 320px layout prioritizes readable content.

Buttons support focus, Enter/Space, visible focus outlines, meaningful labels and pressed states. Scene labels are actual DOM buttons projected into the scene; duplicate DOM flow controls provide a familiar alternative. Essential content never depends on Canvas. The story has a skip link and initial heading focus. Scene navigation is not modal and does not trap focus.

Live `prefers-reduced-motion` changes are respected: initialization, falling binary, camera movement, assembly and packets stop. Static colors, geometry, controls and content remain available. Reduced-motion demand rendering was verified to stop after updates.

WebGL2 is probed before mounting Canvas; that temporary probe context is immediately released. There is only one persistent scene context. Unsupported WebGL, renderer errors and context loss show “3D experience unavailable on this device.” with Return to Portfolio. The DOM story remains available. No error stack appears in the interface.

Canvas unmounts on exit. Binary texture, renderer caches/listeners and Fiber-owned geometries/materials are disposed. Observers, media listeners, visibility listeners, pointer listeners, Escape listeners and boot timeout have cleanup handlers. Hidden documents use a stopped render loop. Mechanical/command scenes use demand rendering and settle after two seconds; only intro atmosphere and observability continue scheduling frames.

## Performance

| Measurement | Result |
| --- | --- |
| Baseline default JS | 260.05 kB raw / 80.89 kB gzip |
| Final default JS | 262.57 kB raw / 82.01 kB gzip |
| Default JS increase | 2.52 kB raw / 1.12 kB gzip |
| Baseline → final default CSS | 20.12 → 20.23 kB raw; 4.73 → 4.76 kB gzip |
| Optional 3D JS | 906.78 kB raw / 246.80 kB gzip |
| Optional CSS | 5.21 kB raw / 1.63 kB gzip |
| 3D requested on default page | No; checked from browser network requests at all six widths |
| Primary draw calls | Estimated 17–32 per desktop frame; measured peak 32 across primary scenes |
| Binary instances | Desktop 84, mobile 24; three glyphs per instance with three depth layers |
| Flow particles | One packet; continuous only in observability, one short pulse for CI/CD |
| Node cap | Desktop 14, mobile 9; featured projects add four lightweight modules |
| DPR | Desktop maximum 1.5, mobile maximum 1.25; sustained slow frames reduce to 1 |
| High-DPR browser measurement | 1.499 desktop / 1.249 mobile on simulated device DPR 3 |
| Textures | One locally generated 64×128 binary canvas texture; no downloaded textures |
| Models / large media | None; all geometry procedural |

Vite reports its normal >500 kB chunk warning for the optional WebGL chunk. It does not affect the initial portfolio path, and the warning is not suppressed. Shading uses lightweight Phong materials; repeated-entry testing exposed shared physical-material lookup-texture retention, which this material choice avoids without relying on private renderer internals.

## Validation

`npm ci` passed. `npm run lint` passed without warnings. `npm run build` passed with the optional-chunk size warning above. `git diff --check` passed.

Chromium viewport checks passed at 1440, 1024, 768, 390, 375 and 320 pixels. Checks covered default rendering first, lazy chunk loading, no initial Canvas, one immersive Canvas, no horizontal overflow, project filters/details, resume/GitHub/LinkedIn/email link presence, Back to Portfolio, browser Back, Escape, no reload and no ordinary-operation console/page errors. Resume was separately fetched successfully as a PDF. External links use the unchanged shared URLs; remote third-party availability was not independently tested.

Additional tests passed for reduced-motion boot skipping, static reduced-motion draw calls, high-DPR limits, paused hidden-document rendering, settled mechanical rendering, skill/module activation, unavailable WebGL and runtime context loss.

An instrumented 24-cycle run reported zero pending animation frames and zero live contexts after every exit, with stable document/window listener counts. Collected JS heap grew from approximately 7.66 MB to 8.87 MB, primarily during warm-up; the last ten cycles grew by approximately 0.26 MB. A separate 30-cycle run held DOM nodes at 3400 and event listeners at 1127 throughout; heap grew from 6.12 MB to 8.15 MB, with the last ten cycles growing by approximately 0.23 MB. These measurements support resource cleanup and eliminate the earlier detached-DOM accumulation; they are not a claim of zero runtime cache allocation or real-device GPU benchmarking.

Screenshots of desktop/mobile intro and delivery scenes were visually inspected. Browser runs are viewport simulations, not physical-phone or Safari testing.

The Firebase deployment architecture, GitHub Actions, IAM/WIF, DNS/Cloudflare, canonical domain, `resume.pdf`, existing shared facts and verified metric values are unchanged. No merge or manual deployment is performed.

## Reproduce browser checks

The regression scripts use optional Playwright tooling outside the project dependency tree:

```sh
npm ci
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

In another terminal:

```sh
npm install --prefix /tmp/portfolio-3d-validation playwright
/tmp/portfolio-3d-validation/node_modules/.bin/playwright install chromium
PLAYWRIGHT_MODULE=/tmp/portfolio-3d-validation/node_modules/playwright/index.mjs node scripts/validate-3d.mjs
PLAYWRIGHT_MODULE=/tmp/portfolio-3d-validation/node_modules/playwright/index.mjs node scripts/validate-3d-quality.mjs
PLAYWRIGHT_MODULE=/tmp/portfolio-3d-validation/node_modules/playwright/index.mjs node scripts/validate-3d-lifecycle.mjs
```

`PORTFOLIO_TEST_URL` optionally changes the preview URL. Screenshots and JSON reports are written under `/tmp/portfolio-3d-validation`. The lifecycle test is an instrumented heap-growth bound plus frame/context/listener assertions; inspect the reported heap trend when changing scene assets or dependencies.
