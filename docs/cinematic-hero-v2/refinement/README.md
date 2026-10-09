# Guardian hero refinement — PR #6

This is a right-scene-only refinement on `feature/cinematic-3d-v2`. The identity,
role, intro copy, CTA, left typography and mobile visual-band sizing remain
unchanged. The other nine sections, shared data, routing, default portfolio and
deployment/infrastructure configuration are untouched.

## Visual changes

- **Silhouette:** replace the closed cabinet hull with a slim exposed spine,
  separated central housings, outboard infrastructure service sleds, articulated
  upper/lower trusses, an open crown gantry and a split support cradle. Actual
  negative space separates the core, arms, and service assemblies.
- **Presence/camera:** a larger seven-and-a-half-unit deployed silhouette fills
  the right region; the three-quarter view reveals front core depth, one assembly's
  side, and the opposite frame. Parallax remains capped to 0.16/0.08 world units.
- **Core:** stepped, recessed chamber walls, bolted retainers, compute/turbine
  cartridges, a center shaft, a turning internal rotor and a narrow cyan service
  channel replace the three-bar icon. Protective cheeks open before power-on.
- **Place:** segmented floor plates, recessed longitudinal trenches/rails,
  repeated structural wall ribs, overhead framing, exposed conduits and rear
  machinery create a receding service bay. Geometry is merged into five material
  batches, plus the existing small procedural contact-shadow layer.
- **Light:** lower ambient fill, an offset cool key and stronger rear/side cyan
  rim separate metal edges from the dark bay. Near-black insets retain contrast;
  sparse amber floor indicators and cyan service strips establish scale. No bloom,
  HDRI, external texture, white surface, warning flash or audio was added.
- **Data:** 72 faint background, 22 readable midground, and 3 soft foreground
  streams occupy distinct depth planes with different speeds, sizes and opacity.
  Midground data passes behind the separated mechanical assemblies. Canvas
  containment keeps every stream out of the left text column.
- **HUD:** two existing small system labels and two thin targeting corners;
  no additional label field or description panels.

## Physical deployment

The approximately 2.45-second sequence has a visibly different initial/final form:

1. Compact sleds, folded braces, lowered crown, retracted supports and closed
   core cheeks form the offline state.
2. Left and right sleds unlock on staggered timings and travel 1.6 units outward.
3. Support trusses rotate about docking pivots; the lower cradle slides outward
   and settles into the floor rails.
4. The crown lifts; the central protective housings part and hinge away.
5. The internal rotor turns into alignment; core illumination activates last.
6. Braces, crown and core settle. Only slow data motion and minimal parallax remain.

No scale tween is used. Quintic easing gives each motion a gradual start/stop.
Measured precise world-space bounds grow from **4.3266 to 7.5163 units**, about
**74% wider**. Height grows from 4.4867 to 5.0472 units. See
[assembly-measurements.json](assembly-measurements.json).

Reduced motion immediately applies the fully deployed pose, lights and camera,
skips the boot/HUD animation, and leaves data static. Hidden-tab pausing and all
owned-resource disposal remain. There is still one Canvas.

## Mobile

The existing 160–184px visual band and header adjacency are unchanged. Mobile
frames the core and both outboard structures, with simplified floor/ribs/conduits,
18 streams across two layers, one small status label, and no pointer parallax.
The left-side DOM and standard touch scrolling remain unchanged.

## Review captures

- [Desktop offline / early activation — 1440×900](offline.png)
- [Desktop mid transformation — 1440×900](mid-transformation.png)
- [Desktop final — 1440×900](final.png)
- [Desktop alternate pointer — 1440×900](alternate-pointer.png)
- [Mobile final — 390×844](mobile-390.png)
- [CURRENT V2 vs REFINED V2 — side-by-side PNG](comparison.png)
- [Standalone responsive comparison](comparison.html)

The comparison baseline is the pre-refinement hero from commit `c6428e6`.
Offline/mid screenshots use Playwright's controlled clock to keep moving parts
in reviewable poses; final screenshots run normal wall-clock animation. Each
full-page still uses a fresh WebKit process to avoid stale native capture layers.
These are screenshots of the application, not generated artwork.

## Performance and asset integrity

| Measure | Refined hero |
| --- | --- |
| Original GLB | 876,912 bytes / 0.877 MB raw |
| Hero triangles | 19,920 (previously 15,600) |
| Model material batches | 34 (previously 22) |
| Optional JS | 977.97 KB raw / 269.30 KB gzip |
| Optional JS increase | ~0.76 KB gzip from initial V2 |
| Optional CSS | 7.56 KB raw / 2.29 KB gzip |
| Optional JS/CSS gzip + unencoded model | ~1.148 MB |
| Hero draw calls / complete-experience peak | 44 desktop / 42 mobile / 44 peak |
| Total rendered hero-scene triangles | 21,592 desktop / 20,610 mobile |
| Binary streams | 97 desktop / 18 mobile |
| DPR caps | 1–1.5 desktop / 1–1.25 mobile; slow-frame reduction to 1 |
| Model textures / external assets / dependencies added | None |
| Generated texture GPU estimate, including mipmaps | ~0.46 MiB desktop / ~0.33 MiB mobile |
| `/` requests for 3D JS or GLB before entry | None |

The GLB remains original, indexed and normal-quantized with correct four-byte
alignment. No compression decoder or image texture is required. Portfolio-owner
rights/source notice is unchanged. The [Khronos model validation](model-validation.json)
has zero errors, warnings, infos or hints. Review images/HTML remain in `docs/`
and are not included in the deployed Vite runtime assets.

Local unthrottled entry-to-model-ready timings ranged approximately 0.81–2.45s
under concurrent validation; these are not physical-device or production-network
benchmarks. See [hero-results.json](hero-results.json).

## Validation

Passed `npm ci`, `npm run lint`, `npm run build`, and `git diff --check`.
Vite retains the existing large optional-chunk warning; the recruiter route
still does not load that chunk.

All existing suites passed without weakening their limits:

- `scripts/validate-3d.mjs`: 1440/1024/768/390/375/320px, normal portfolio,
  entry/Back/browser Back/Escape, filters/details/resume/social links, no overflow,
  header gap or clipped scene labels, reduced motion and unavailable-WebGL fallback.
- `scripts/validate-3d-quality.mjs`: DPR, static reduced motion, hidden-document
  pause, existing Skills/project interactions, settled mechanical rendering,
  context-loss fallback and resume response.
- `scripts/validate-3d-lifecycle.mjs`: 24 fully loaded enter/exit cycles; every exit
  leaves zero RAFs and zero WebGL contexts, stable listeners and approximately
  1.26MB GC heap growth. Maximum 44 draw calls, below the existing 45-call guard.
- `scripts/validate-cinematic-hero.mjs`: Chromium 1440/1024/390/375/320 and WebKit
  1440/1024/390/375; no console/page errors, one Canvas, no overflow or label clipping,
  lazy JS/model loading, navigation and actual geometry rendering.

Protected DOM/story/route/controller/shared-data files were compared directly
against the pre-refinement commit and remain byte-identical. The only stylesheet
change adjusts the **right HUD** activation duration from 2.2 to 2.45 seconds.

This pass is submitted for visual review. No other section is redesigned, and
no merge or manual Firebase deployment has been performed.
