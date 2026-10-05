# Abhi Ram Kotari — Engineering Portfolio

An original, responsive DevOps and Site Reliability Engineering portfolio built with React, TypeScript, Vite, and plain CSS. No backend, database, or external font dependency is needed.

## Development and deployment

Requires Node.js 22.12+ (or 20.19+) and npm.

Local development:

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

Manual Firebase Hosting deployment:

```sh
firebase deploy --only hosting
```

`npm run build` type-checks the project and generates the static `dist/` directory configured in `firebase.json`. A push to `main` triggers `.github/workflows/firebase-deploy.yml`, which installs the locked dependencies, builds the site, and deploys it to Firebase Hosting. The workflow can also be started manually from the GitHub Actions page.

GitHub Actions authenticates to Google Cloud with short-lived credentials issued through GitHub OIDC and Google Cloud Workload Identity Federation. No service-account key or long-lived Firebase token is stored in GitHub.

## Required GCP / GitHub configuration

Create these resources manually in the `abhiram-portfolio` Google Cloud project:

1. A dedicated deployment service account used only by this workflow.
2. A Workload Identity Pool.
3. An OIDC Workload Identity Provider in that pool with issuer `https://token.actions.githubusercontent.com`.
4. Provider attribute mappings for at least `google.subject=assertion.sub` and `attribute.repository_id=assertion.repository_id`. Map `attribute.ref=assertion.ref` if the branch is included in the IAM principal or provider condition.
5. A provider attribute condition restricted to this repository and branch. Prefer the immutable numeric GitHub repository ID: `assertion.repository_id == '<GITHUB_REPOSITORY_ID>' && assertion.ref == 'refs/heads/main'`. Obtain the ID with `gh api repos/ramsrisaikotari/abhiram-portfolio --jq .id`; do not substitute an unrelated repository ID. This prevents tokens from arbitrary repositories or branches from entering the pool.
6. On the deployment service account, grant `roles/iam.workloadIdentityUser` to the principal set for that repository ID in the pool: `principalSet://iam.googleapis.com/projects/<GCP_PROJECT_NUMBER>/locations/global/workloadIdentityPools/<POOL_ID>/attribute.repository_id/<GITHUB_REPOSITORY_ID>`.
7. On the `abhiram-portfolio` project, grant the deployment service account:
   - `roles/firebasehosting.admin` to create Hosting versions, upload files, and release the version to the live site.
   - `roles/serviceusage.apiKeysViewer` because the Firebase CLI requires API Keys Viewer in addition to a Firebase product role.

Do not grant Owner or Editor. This Hosting-only workflow does not need Cloud Functions, Cloud Run, Artifact Registry, storage administration, `roles/iam.serviceAccountUser`, or `roles/iam.serviceAccountTokenCreator`. If the deployment later includes another Firebase product, review and add only that product's required role.

In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and create:

| Variable | Value |
| --- | --- |
| `GCP_PROJECT_ID` | `abhiram-portfolio` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full provider resource name: `projects/<GCP_PROJECT_NUMBER>/locations/global/workloadIdentityPools/<POOL_ID>/providers/<PROVIDER_ID>` |
| `GCP_SERVICE_ACCOUNT` | Full email address of the dedicated deployment service account |

These identifiers are configuration values, so the workflow reads them from GitHub repository variables. No GitHub secret is required. Ensure the IAM Service Account Credentials API and Security Token Service API are enabled for Workload Identity Federation, then allow several minutes for new federation and IAM settings to propagate before the first run.

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
