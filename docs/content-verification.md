# Portfolio content sources

Reviewed 2026-10-05. Project descriptions supplied by the owner are the source for the expanded academic and generalized professional content. Existing employer identity is retained from `src/data/experience.ts`; no dates or clients were added.

## Public source checks

- `ramsrisaikotari/llm-job-agent`: `app.py`, `requirements.txt`, and `render.yaml` support Python, FastAPI, Pydantic, Uvicorn, REST API, OpenRouter integration and Render configuration. The source accepts job description, resume summary, role, tone, language and model. Its README makes additional claims not supported by those files; these are omitted.
- `ramsrisaikotari/abhiram-portfolio`: existing Vite source and GitHub workflows support React/TypeScript, lint/build validation, Firebase previews, OIDC/WIF authentication and main-branch delivery. Custom domain, Cloudflare DNS, branch protection and monitoring are owner-supplied facts; no infrastructure changes are included.
- `ramsrisaikotari/covid-rate-tracker`: `data_pipeline.py` supports Python ingestion; the README documents React, D3, Airflow, Lambda, ARIMA and Prophet. The repository is linked as the project reference; those broader components are documented rather than fully established by the small source tree.
- `ramsrisaikotari/portfolio`: historical public project descriptions support phishing work with SVM, Random Forest, CNN, LSTM, Jenkins and AWS. Accuracy claims are deliberately excluded.

## Deliberate omissions / verification limits

- Car rental and inventory technology stacks are omitted because descriptions conflict and no implementation source establishes a stack.
- No employment dates, client identities, project dates, private system identifiers or proprietary code/configuration.
- No ML accuracy percentages, false-positive improvements or invented performance results.
- No Poetry, LangChain, GPT-4-specific claims, scraping, automatic job submission or resume-parsing claims for the LLM agent.
- The LLM deployment URL is documented in its README but a healthy live service could not be established during review; no Live button is published.
- No unverified academic GitHub links or demo links. COVID's repository is verified, but no public deployment is asserted.
- COVID OAuth2, encryption, rate limiting, Docker and Jenkins claims are omitted; phishing Flask, React, Docker and Gradient Boosting are omitted without stronger source support.
- Test reporting Docker/Node.js and extra PDF/spreadsheet artifact claims are omitted without implementation evidence.
- Kanban, diabetes, segmentation, chatbot and loan calculator technologies are owner-supplied, without independently verified implementation repositories. Review these against original coursework if stronger source verification is desired.
- Professional case studies use owner-supplied responsibilities and metrics, with generalized flows. Kubernetes is explicitly marked Learning / Hands-on.

## Maintenance

Project content lives in `src/data/projects.ts`. Native `<details>` panels require no routing dependency. Archive “All” shows the seven additional projects; category filters search all eleven personal/academic projects so featured work remains discoverable by category. Professional case studies are never included in public-project filters and never show repository or live links.

## Validation

- `npm ci`, `npm run lint`, `npm run build`, and `git diff --check` passed. No test script exists in package.json.
- Temporary Playwright checks (outside the repository) passed at 320, 375, 390, 768, 1024 and 1440 px: project counts, every category filter, native details opened with Enter, mobile navigation opened with Enter and dismissed with Escape with focus restored, and no horizontal overflow with all ten architecture panels expanded.
- Verified all four profile/resume link targets, new-tab resume attributes, HTTP 200 and PDF header for `/resume.pdf`, and no browser runtime errors. Reviewed desktop/mobile screenshots.
- GitHub profile and production site returned HTTP 200. LinkedIn returned its automated-access block (999), so its owner-supplied URL is preserved but not independently confirmed. Email is validated as the expected mailto link, not by sending a message.
- Dependencies, lockfile, resume, Firebase files, GitHub workflows, robots.txt, sitemap.xml and canonical/Open Graph production URLs are unchanged.
