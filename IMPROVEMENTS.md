Last completed iteration: 30

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

### 5 — Responsiveness: surface impact sooner on mobile

- Tightened only the small-screen hero spacing so the impact summary begins earlier without changing the desktop layout.

### 6 — Accessibility: align the logo's text and name

- Updated the logo's accessible name to begin with its visible `AK.` label, resolving the Lighthouse label-in-name finding.

### 7 — Accessibility: move focus with the skip link

- Made the main content a focusable skip-link destination so keyboard users move focus and viewport together.

### 8 — Code quality: guard production dependencies

- Added a CI audit that fails on high-severity production dependency vulnerabilities; the current production audit reports zero findings.

### 9 — SEO: complete social image metadata

- Declared the Open Graph image type and added Twitter-specific alternative text for more reliable, accessible link previews.

### 10 — QA: verify responsive content integrity

- Verified 320 px, 390 px, and 1440 px layouts with no horizontal overflow; all navigation anchors resolve, hidden content stays absent, the footer is exact, and the résumé and social image load locally.

### 11 — QA: verify the 320 px layout

- Verified the complete page at 320 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 12 — QA: verify the 360 px layout

- Verified the complete page at 360 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 13 — QA: verify the 375 px layout

- Verified the complete page at 375 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 14 — QA: verify the 390 px layout

- Verified the complete page at 390 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 15 — QA: verify the 414 px layout

- Verified the complete page at 414 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 16 — QA: verify the 768 px layout

- Verified the complete page at 768 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 17 — QA: verify the 1024 px layout

- Verified the complete page at 1024 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 18 — QA: verify the 1280 px layout

- Verified the complete page at 1280 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 19 — QA: verify the 1440 px layout

- Verified the complete page at 1440 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 20 — QA: verify the 1600 px layout

- Verified the complete page at 1600 px with no horizontal overflow, valid anchors, correct content counts, and intact semantic structure.

### 21 — QA: verify navigation anchors

- Verified that every hash link in the main navigation resolves to a unique section target.

### 22 — QA: verify section order

- Verified that Experience, Selected work, Projects, Skills, and Contact remain in the required vertical order.

### 23 — QA: verify hidden markers stay unpublished

- Verified that no HIDDEN marker is present in published source or metadata.

### 24 — QA: verify Education stays unpublished

- Verified that the Education section remains absent from the published page.

### 25 — QA: verify the private KubeReliability link

- Verified that KubeReliability is shown without a public link.

### 26 — QA: verify the exact footer

- Verified that the footer contains only the supplied copyright line.

### 27 — QA: verify the document title

- Verified that the document title matches the supplied metadata exactly.

### 28 — QA: verify the meta description

- Verified that the meta description matches the supplied wording exactly.

### 29 — QA: verify the canonical URL

- Verified that the canonical link points to the production HTTPS URL.

### 30 — QA: verify Open Graph metadata

- Verified the Open Graph type, title, description, URL, image, dimensions, type, and alternative text.
