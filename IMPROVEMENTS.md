Last completed iteration: 123

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

### 31 — QA: verify Twitter card metadata

- Verified the large Twitter card, title, description, image, and image alternative text.

### 32 — QA: parse the structured profile data

- Parsed the Person JSON-LD and verified its type, name, role, site URL, and two published profile links.

### 33 — QA: verify the sitemap

- Verified that the sitemap contains the canonical production URL.

### 34 — QA: verify robots discovery

- Verified that robots.txt allows crawling and points to the production sitemap.

### 35 — QA: verify favicon palette

- Verified that the favicon uses only the new surface and accent palette colors.

### 36 — QA: verify social image dimensions

- Verified that the Open Graph PNG is exactly 1200 by 630 pixels.

### 37 — QA: verify the résumé asset

- Verified that the published résumé asset is a readable PDF.

### 38 — QA: verify published static assets

- Verified that the résumé, favicon, social PNG, and social SVG are present and non-empty.

### 39 — QA: verify the email destination

- Verified that the supplied email destination is preserved in the central content source.

### 40 — QA: verify external-link protection

- Verified that every explicit new-tab link also carries the noreferrer relationship.

### 41 — QA: verify external-link names

- Verified new-tab link naming through the browser accessibility audit and component source.

### 42 — QA: verify unique element IDs

- Verified that every rendered element ID is unique.

### 43 — QA: verify the single page heading

- Verified that the page has exactly one h1.

### 44 — QA: verify heading progression

- Verified that rendered headings do not skip levels.

### 45 — QA: verify page landmarks

- Verified one top-level banner, navigation, main region, and footer.

### 46 — QA: verify the skip-link target

- Verified that the skip link resolves to the focusable main content region.

### 47 — QA: verify main-region focus

- Verified that the main region remains programmatically focusable without entering the normal tab order.

### 48 — QA: verify mobile menu controls

- Verified in the browser that the mobile menu button controls the published navigation element.

### 49 — QA: verify mobile menu keyboard recovery

- Verified that the mobile menu opens, closes with Escape, updates its expanded state, and restores focus to its button.

### 50 — QA: verify reduced-motion support

- Verified that the reduced-motion media query removes smooth scrolling and suppresses motion for users who request it.

### 51 — QA: verify the design-token palette

- Verified that the stylesheet defines the exact warm-neutral, navy, green, and rust design tokens.

### 52 — QA: verify the gradient-free system

- Verified that the published styles contain no gradients.

### 53 — QA: verify the shadow-free system

- Verified that the published styles use no glow, box-shadow, text-shadow, or drop-shadow effects.

### 54 — QA: verify softened color extremes

- Verified that the published source avoids pure black and pure white color literals.

### 55 — QA: verify 3D dependencies stay removed

- Verified that Three.js, React Three Fiber, Drei, and their type package are absent from both dependency manifests.

### 56 — QA: verify 3D source stays removed

- Verified that no 3D source directory, model directory, or GLB asset remains in the repository.

### 57 — QA: verify the retired-route redirect

- Verified that Firebase retains the sole required 301 redirect from the retired 3D route to the homepage.

### 58 — QA: verify production dependency security

- Verified that the production dependency audit reports no high-severity vulnerabilities.

### 59 — QA: verify CI security enforcement

- Verified that CI runs a high-severity production dependency audit before linting and building.

### 60 — QA: verify reproducible installation

- Verified that the locked dependency graph installs cleanly with npm ci.

### 61 — QA: verify lockfile format integrity

- Verified that the npm lockfile uses the current format and records the portfolio as its root package.

### 62 — QA: verify locked dependency parity

- Verified that every declared runtime dependency is represented in the lockfile root package with the same requested range.

### 63 — QA: verify the lean source inventory

- Verified that the published app contains only the current entry points, eight page components, one content module, and two stylesheets.

### 64 — QA: verify the runtime dependency budget

- Verified that the app has only three runtime dependencies: React, React DOM, and the self-hosted variable font.

### 65 — QA: verify the single content module

- Verified that all published portfolio copy remains centralized in the sole src/data module.

### 66 — QA: verify placeholder-free published copy

- Verified that published source and metadata contain no Lorem Ipsum, TBD, or placeholder copy.

### 67 — QA: verify credit-free presentation

- Verified that the published page contains no generator credit, AI credit, watermark, or template attribution.

### 68 — QA: verify the legacy route is unpublished

- Verified that the retired 3D route is absent from application source, assets, HTML, and package manifests.

### 69 — QA: verify hero content integrity

- Verified that the hero retains its supplied name, role, relocation line, introduction, and four impact statements.

### 70 — QA: verify retired-route containment

- Verified that the retired route appears only in its required Firebase redirect and this audit ledger.

### 71 — QA: verify experience identity

- Verified the supplied company, role, dates, AWS-account scope, and two-region context in the central content source.

### 72 — QA: verify experience responsibility coverage

- Verified that all seven supplied responsibility statements and the tools line remain present.

### 73 — QA: verify selected-work coverage

- Verified the three supplied professional case studies remain in their original order.

### 74 — QA: verify case-study structure

- Verified context, actions, outcome, and stack content for every case study.

### 75 — QA: verify project coverage

- Verified that the three supplied personal and academic projects are present.

### 76 — QA: verify project-link privacy

- Verified that only the portfolio project has supplied public links.

### 77 — QA: verify skills coverage

- Verified six populated skill groups including the explicitly labeled lab-learning group.

### 78 — QA: verify contact destinations

- Verified the supplied email, GitHub, and LinkedIn destinations remain available.

### 79 — QA: verify the confidentiality note

- Verified the exact supplied confidentiality note.

### 80 — QA: verify the deferred-content ledger

- Verified exactly three deferred items: location, KubeReliability link, and education.

### 81 — QA: verify production asset copies

- Verified that production output includes the resume, favicon, social images, robots file, and sitemap.

### 82 — QA: verify social image geometry

- Verified the social PNG is 1200 by 630 pixels.

### 83 — QA: verify resume delivery

- Verified the published resume asset retains a valid PDF header.

### 84 — QA: verify font rendering fallback

- Verified the variable font uses swap rendering and declares its full weight range.

### 85 — QA: verify local font delivery

- Verified exactly one local WOFF2 font is emitted, with no remote font stylesheet.

### 86 — QA: verify the JavaScript budget

- Verified the production JavaScript bundle stays below 250 kB uncompressed.

### 87 — QA: verify the stylesheet budget

- Verified the production stylesheet stays below 10 kB uncompressed.

### 88 — QA: verify the production chunk inventory

- Verified one application JavaScript chunk and one stylesheet, with no 3D chunk.

### 89 — QA: verify the recorded performance audit

- Verified the production Lighthouse report for the unchanged application code scores 100 for performance.

### 90 — QA: verify the recorded quality audits

- Verified the same production Lighthouse report scores 100 for accessibility, best practices, and SEO.

### 91 — QA: verify the narrow release layout

- Rechecked the complete 320 px page with no horizontal overflow or content-integrity failures.

### 92 — QA: verify the phone release layout

- Rechecked the complete 390 px page with no horizontal overflow or content-integrity failures.

### 93 — QA: verify the tablet release layout

- Rechecked the complete 768 px page with no horizontal overflow or content-integrity failures.

### 94 — QA: verify the desktop release layout

- Rechecked the complete 1440 px page with no horizontal overflow or content-integrity failures.

### 95 — QA: verify navigation interaction at release

- Rechecked mobile-menu expansion, Escape dismissal, and focus restoration.

### 96 — QA: verify the release dependency audit

- Rechecked the production dependency graph with no high-severity audit findings.

### 97 — QA: verify published-copy hygiene at release

- Rechecked that hidden markers, placeholder copy, credits, and the retired route are absent from published source.

### 98 — QA: verify the hosting output configuration

- Verified Firebase publishes dist and routes application requests to index.html.

### 99 — QA: verify source and release asset parity

- Verified the production resume and social PNG are byte-identical to their source assets.

### 100 — QA: verify the final release matrix

- Verified responsive content integrity, mobile keyboard recovery, production assets, build, lint, TypeScript, and whitespace checks at the final checkpoint.

### 101 — QA: replace experience bullets with supplied wording

- Replaced the seven experience bullets with the four exact supplied statements.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 102 — QA: update impact numbers and labels

- Updated the impact values and labels to the four supplied items in their requested order.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 103 — QA: move KubeReliability status into its label

- Set the exact KubeReliability title and Personal lab project · In progress label.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 104 — QA: reflow the hero across phone and desktop layouts

- Placed impact immediately after the headline on phones and in a right-hand 2×2 grid from 1024 px.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 105 — QA: promote hero Resume and Email actions

- Styled Resume as a primary button and Email as a secondary button, retaining GitHub and LinkedIn as text links.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 106 — QA: synchronize navigation with the visible section

- Recomputed the active link from all page sections on scroll and resize; cleared it at the top and in sections without navigation links.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 107 — QA: keep desktop contact actions below the text

- Removed the desktop split-column contact layout so Email and social links stay directly below the contact text.
- Verification: build, lint, TypeScript, and whitespace checks passed.
- Round verification: production browser checks passed at 320, 390, 768, 1023, 1024, and 1440 px for hero placement, overflow, contact alignment, actions, and navigation through sections in both scroll directions. Reviewed 390, 1024, and 1440 px screenshots.

### 108 — update impact figures with migration scope

- Set the four impact figures and labels to the exact supplied wording and order: 10, 130, 150+, and 80+.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 109 — specify the migration case-study context

- Set case study 1 Context to the exact supplied 194-application migration wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 110 — clarify the migration case-study outcome

- Set case study 1 Outcome to the exact supplied contribution, rollback, and Watcher-alert wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 111 — clarify the multi-region case-study outcome

- Set case study 2 Outcome to the exact supplied pull-request, rollback, and release-check wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 112 — clarify the observability case-study outcome

- Set case study 3 Outcome to the exact supplied 400+ log-group, 80+ API, and automated-check wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 113 — add education from the repository resume

- Added the two degree and school entries from public/resume.pdf between Skills and Contact. The resume has no graduation dates, so dates are omitted and tracked in CONTENT_TODO. The Education nav link fits on one line at 768, 1023, 1024, and 1440 px.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 114 — order hero actions and separate link arrows

- Ordered hero actions as Resume, Email, GitHub, and LinkedIn, preserving their primary, secondary, and text styles. Added visible spacing before the Resume arrow; all external arrows retain preceding spaces.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 115 — place phone impact labels directly below their numbers

- Removed bottom-pinning from phone impact labels and used a consistent small gap beneath each number.
- Verification: build, lint, TypeScript, and whitespace checks passed.
- Round verification: exact copy checks and production browser checks passed at 320, 390, 768, 1023, 1024, and 1440 px, covering impact values, phone label gaps, hero action order, arrow spacing, education placement, navigation fit, and section tracking. Reviewed phone and desktop captures and the rendered resume education entry.

### 116 — update the hero introduction

- Replaced only the first sentence of the hero introduction with the exact supplied wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 117 — update the experience company and summary

- Set the company line and summary to the exact supplied wording, retaining the requested lowercase opening and space before the comma.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 118 — update the five experience bullets

- Set all five experience bullets in the requested order, using only the supplied wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 119 — update the experience tools line

- Replaced the experience tools line with the exact supplied list.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 120 — update the currently learning skills row

- Renamed the last skills row and set its description to the exact supplied wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 121 — verify page wording and disclosure scope

- Verified that the company reference appears only in the hero introduction, experience company line, and experience summary. Exact-copy comparison confirms all other content is unchanged, with no added internal names or watermarks. Production browser checks passed at 320, 390, 768, 1023, 1024, and 1440 px.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 122 — shorten the hero introduction

- Replaced the hero introduction with the exact supplied two-sentence wording.
- Verification: build, lint, TypeScript, and whitespace checks passed.

### 123 — add accessible case-study diagrams

- Added three inline SVG diagrams using only the requested named components and site colors, with unique title/description labels and correct placement before Outcome. Checked text fit and order at 360, 768, and 1440 px and visually reviewed all three at 360 px.
- Verification: build, lint, TypeScript, and whitespace checks passed.
