# Pact frontend

- Stack: React 19, TypeScript, Vite, Framer Motion. Use the existing dependencies and plain CSS; no component framework is installed.
- Entry points: `src/main.tsx` and `src/App.tsx`. The app is a single landing page with hash navigation, not a routed dashboard. No backend, API integration, authentication, or persistent data store exists in this repository.
- Preserve existing navigation destinations unless the task explicitly requests changing them. The create-agent and legal links are existing placeholders, not working onboarding or legal routes.
- Shared design tokens and primitives: `src/styles/base.css`, `src/lib/ui.tsx`. Section styling is split between `nav-hero.css`, `how.css`, and `sections.css`.
- The desktop product journey lives in `src/components/how/HowItWorks.tsx`; its eight stage interfaces are in `stages.tsx`. Small/short viewports and reduced-motion preferences use a vertical version.
- Product guardrails: agents prepare proposals; humans approve. All fees, metrics, reputation tiers, and activity events in the page are illustrative. Approval controls only update local demo state and never sign contracts or move funds.
- Development: `npm run dev`. Production verification: `npm run build` (TypeScript strict checking followed by Vite build).
- Check responsive layouts at 1920, 1440, 1200, 1024, 768, 480, 390, and 375 pixels. Also check short landscape viewports, keyboard navigation, and `prefers-reduced-motion`.
- Browser verification: `node ui-check.mjs`, using locally installed Playwright and Microsoft Edge (`chromium.launch({ channel: 'msedge', headless: true })`). Playwright is not a runtime dependency. `UI_URL` overrides the default `http://localhost:5174/`; `UI_QUICK=1` limits width checks to 375px. Screenshots go to the OS temp directory.
- Visual reference: `DESIGN.md`. The page uses cobalt, warm paper, and charcoal section palettes with Geist Pixel Square display type, Geist Sans body type, Geist Mono metadata, and Arial buttons.
- Fonts are self-hosted in `public/fonts/`, from the official `geist@1.7.0` distribution. Keep the included SIL Open Font License with the font assets. No Next.js font loader or external font service is needed.
