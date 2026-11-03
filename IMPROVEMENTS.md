Last completed iteration: 4

## Pre-iteration work

- Phase 1 removed the optional 3D route, implementation, model, review artifacts, validation scripts, and 3D-only dependencies.
- Baseline bundle: 262.59 kB main JavaScript, 980.33 kB 3D JavaScript, 20.23 kB main CSS, and 8.72 kB 3D CSS.
- Phase 1 bundle: 260.05 kB JavaScript and 20.12 kB CSS. The 3D JavaScript chunk was eliminated.
- Verification: the build, lint, and TypeScript checks pass; no 3D packages or GLB assets remain.
- The required Firebase 301 redirect is the only remaining `experience-3d` search match.

- Phase 2 rebuilt the homepage from the supplied content, added the editorial design system, created the social preview image, and moved hidden items to `CONTENT_TODO.md`.
- The rebuilt page passes build, lint, and TypeScript checks. True 360 px and 390 px browser emulation show no horizontal overflow.

## Iterations

### 1 — Accessibility: clarify new-tab links

- Added spoken descriptions to every link that opens a new tab while keeping the visible labels concise.

### 2 — Typography: make Inter consistent

- Added the Latin variable Inter font as a local application asset so the intended typography does not depend on a visitor's installed fonts.

### 3 — Navigation: show the current section

- Added an active-section state to the main navigation with matching visual and `aria-current` cues.

### 4 — SEO: add structured profile data

- Added a minimal Person schema using only the published name, role, site, GitHub, and LinkedIn details.
