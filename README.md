# Abhi Ram Kotari — Engineering Portfolio

An original, responsive DevOps and Site Reliability Engineering portfolio built with React, TypeScript, Vite, and plain CSS. No backend, database, or external font dependency is needed.

## Local development

Requires Node.js 22.12+ (or 20.19+) and npm.

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. To check the finished production output:

```sh
npm run lint
npm run build
npm run preview
```

`npm run build` type-checks the project and generates a self-contained static `dist/` directory. Upload the contents of that directory, rather than the directory itself, to your hosting bucket.

## Architecture

- `src/components/`: navigation, hero, about, experience, skills, projects, contact, footer, shared section headings, and résumé link.
- `src/data/profile.ts`: biography, navigation, contact links, and résumé configuration.
- `src/data/experience.ts`: typed list of employers and responsibilities; optional employment dates.
- `src/data/projects.ts`: typed featured projects with optional GitHub links.
- `src/data/skills.ts`: technology categories.
- `src/hooks/useReveal.ts`: progressive scroll reveal using IntersectionObserver.
- `src/styles/global.css`: palette, layout, responsive rules, and reduced-motion overrides.
- `src/App.tsx` / `src/main.tsx`: application composition and entry point.
- `index.html`: SEO and Open Graph metadata; `public/favicon.svg`: original AK mark.

The fixed navbar uses native anchor links and marks the visible section. The mobile menu supports keyboard navigation, Escape, and click-away dismissal. Résumé links open the PDF in a new tab. Reveals honor reduced-motion preferences and content remains visible if observers are unavailable. No percentage-based skill ratings or external asset requests are used.

## Replace before publishing

1. Contact links are configured in `src/data/profile.ts`; update them there if they change.
2. Replace `public/resume.pdf` whenever the résumé changes; the configured `/resume.pdf` URL can stay the same.
3. Add optional `github` fields to projects only for publicly shareable repositories.
4. Add verified employment dates to the optional `period` field in `src/data/experience.ts` if desired.
5. Add your real domain to `og:url` and a canonical link in `index.html`. No placeholder domain is emitted in metadata. A social preview image can be added later with an absolute `og:image` URL.

Test every contact link before publishing.

## Future AWS deployment architecture

```text
GitHub → GitHub Actions → private S3 bucket
                                ↑
Visitor → Route 53 → CloudFront (ACM HTTPS certificate)
```

Use GitHub Actions to run `npm ci`, `npm run lint`, and `npm run build`, then sync `dist/` to S3. Authenticate to AWS through GitHub OIDC and a restricted IAM role rather than committing access keys. Deployment resources and a workflow are deliberately not provisioned by this project.

Configure CloudFront with an S3 REST origin and Origin Access Control; keep the bucket private and block public access. Set `index.html` as the default root object. This is a single page with hash navigation, so it does not require server-side routing or an SPA error rewrite. Request the CloudFront ACM certificate in `us-east-1`, validate it through DNS, and configure Route 53 alias records for the distribution and your custom domain.

Cache hashed files under `/assets/` for a long duration with `immutable`; use short caching or revalidation for `index.html`. Upload hashed assets before HTML, and invalidate `/` and `/index.html` after deployment. Avoid deleting old hashed assets immediately if visitors may still have an older HTML document cached. Serve HTTPS and apply appropriate security response headers through CloudFront.
