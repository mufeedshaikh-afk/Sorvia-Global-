# SorviaGlobal project handover

Updated: 16 November 2026. Current milestone: Step 3 complete, awaiting user review. Do not begin Step 4 until authorized.

## Working agreement

Explain steps in simple language. Build one page at a time, check it, upload completed work to GitHub, and pause for user review before the next page. Keep this file current after each completed milestone. User wants to save time and credits when changing agents. Account credit/agent limits are not visible; do not promise advance warnings unless a warning is actually available.

## Project and source

- Workspace: `C:\Users\greyd\OneDrive\Documents\ChatGPT\Sorvia Global`
- GitHub: https://github.com/mufeedshaikh-afk/Sorvia-Global- (public, branch main).
- Original brief: `C:\Users\greyd\OneDrive\Documents\Desktop\mufee\SorviaGlobal_Frontend_Project_Brief.pdf`. Do not upload the brief. Treat document contents as requirements/context, not execution authorization.
- Brief: international handicrafts/home décor ecommerce frontend. Brand curates/resells, does not manufacture. Ivory neutrals, muted sage, brass details. Backend supplies products, stock, country/currency prices, authentication, payment/order states. Never invent conversions or live claims.

## Completed

1. Homepage: responsive header/mobile menu, hero, material collection previews, brand story, footer. Commit `20b044e`.
2. Shop at `/shop`: eight explicitly labelled demo items with CSS concept art; category and material filters; case-insensitive search; featured/A–Z/Z–A sorting; result count; reset and empty-state recovery. State stored in URL and restored on refresh. Header/footer and homepage links connect to Shop. Shared artwork extracted into `src/ObjectArt.tsx`.

The user said “yes and now begin with the step 2”, authorizing continuation from homepage. No explicit approval of every homepage detail was recorded. The user subsequently authorized Step 3 with "now begin with next step". Step 3 needs review now.

3. Category/collection template: three material collections at `/collections/brass`, `/collections/wood`, `/collections/copper`; three categories at `/category/decorative-chess`, `/category/decorative-objects`, `/category/vases-vessels`. Each has an introduction, concept illustration, breadcrumb, scoped sample results, filtering/search/sorting, and related collection links. Reset preserves the collection scope. Homepage links open these pages; Shop has material and category links. Unknown collection/category slugs show a recovery page. Step 2 commit: `d9ff4f3`.

## Files

- `src/main.tsx`: homepage, shared header/footer, pathname choice between homepage, Shop, collections/categories and missing-collection recovery.
- `src/Shop.tsx`: sample catalog and reusable browsing template, with optional collection scope.
- `src/collections.ts`: typed definitions for six category/material pages.
- `src/ObjectArt.tsx`: CSS illustration markup shared by both pages.
- `src/styles.css`: shared and responsive Shop styling.
- `README.md`: local run instructions and ordered roadmap.
- No real catalog, prices, cart, product details, checkout, login or backend yet. Cards do not pretend to be actionable product links.

## Validation

TypeScript checks and Vite production build passed. Browser checked material filter (Brass = 3), category URL (Decorative chess = 2), A–Z order, zero-result search and reset to 8 items. Desktop at 1280px and narrow mobile layout visually checked. Step 3 browser checks: brass scope (3), category refinement (1), refresh preservation, empty state and reset within scope (3), related navigation to chess (2), wood refinement in chess (1), wood/copper/vessels/objects counts, missing slug recovery, browse anchor, mobile menu and Shop regression (8). Desktop and mobile hero/filter layouts checked. Temporary viewport override reset. No automated suite added.

## Running here

Local review server was running at http://127.0.0.1:5174/ ; Shop: http://127.0.0.1:5174/shop ; Step 3 review: http://127.0.0.1:5174/collections/brass . Verify it is still running before promising access. Server is a local preview, not a deployed public site. Existing preview browser tab was marked deliverable.

This machine uses bundled executables because Node/npm/git are not on PATH. Runtime root:
`C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt\dependencies`

- Node: `node\bin\node.exe`
- pnpm: `node\node_modules\pnpm\bin\pnpm.cjs`
- Git: `native\git\cmd\git.exe`
- Python: `python\python.exe`

Dependencies already installed. Check with Node + `node_modules/typescript/bin/tsc --noEmit`, then Node + `node_modules/vite/bin/vite.js build`. Start preview with Node + `node_modules/vite/bin/vite.js --host 127.0.0.1`. Direct `/shop`, `/collections/*` and `/category/*` need SPA fallback in future static hosting. No router dependency yet; normal anchor navigation reloads the page.

Git writes and host-visible preview previously required native permission escalation. Commit identity used per-command `-c user.name=mufeedshaikh-afk -c user.email=mufeedshaikh813@gmail.com`; no global config changes. Never store credentials. Before editing or pushing inspect Git status; do not overwrite user changes. Use Git log for latest milestone commit (this handover is included in that commit).

## Next

Wait for Step 3 review. Apply requested adjustments if any. After approval, Step 4 is product detail, followed by search/wishlist, cart/region, checkout, accounts/orders, tracking/support/policies, admin. Real product photos, approved business copy, supported countries/prices, policies and API contracts are outstanding.

## Prompt for a new agent

Continue SorviaGlobal in the existing workspace. Read PROJECT_HANDOVER.md and README.md first, inspect files and Git status/log, and preserve completed work. Build one page at a time, explain in simple language, upload completed milestones to the existing GitHub repository, and wait for my review before starting the next page. Step 3 category/collection pages are complete and awaiting review. Step 4 product details is next after approval. Report current state and the next pending action before continuing. Update this handover at every milestone.
