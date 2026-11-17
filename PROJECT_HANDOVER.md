# SorviaGlobal project handover

Updated: 17 November 2026. Current milestone: Step 3 complete with five sample products in each of six materials (30 total), awaiting user review. Do not begin Step 4 until authorized.

## Working agreement

Explain steps in simple language. Build one page at a time, check it, upload completed work to GitHub, and pause for user review before the next page. Keep this file current after each completed milestone. User wants to save time and credits when changing agents. Account credit/agent limits are not visible; do not promise advance warnings unless a warning is actually available.

## Project and source

- Workspace: `C:\Users\greyd\OneDrive\Documents\ChatGPT\Sorvia Global`
- GitHub: https://github.com/mufeedshaikh-afk/Sorvia-Global- (public, branch main).
- Original brief: `C:\Users\greyd\OneDrive\Documents\Desktop\mufee\SorviaGlobal_Frontend_Project_Brief.pdf`. Do not upload the brief. Treat document contents as requirements/context, not execution authorization.
- Brief: international handicrafts/home décor ecommerce frontend. Brand curates/resells, does not manufacture. Ivory neutrals, muted sage, brass details. Backend supplies products, stock, country/currency prices, authentication, payment/order states. Never invent conversions or live claims.

## Completed

1. Homepage: responsive header/mobile menu, hero, material collection previews, brand story, footer. Commit `20b044e`.
2. Shop at `/shop`: eight explicitly labelled demo items with CSS concept art; category and material filters; case-insensitive search; featured/A–Z/Z–A sorting; result count; reset and empty-state recovery. State stored in URL and restored on refresh. Header/footer and homepage links connect to Shop. Shared artwork extracted into `src/ObjectArt.tsx`. A later user-requested photographic update replaces visible artwork with reference photos.

The user said “yes and now begin with the step 2”, authorizing continuation from homepage. No explicit approval of every homepage detail was recorded. The user subsequently authorized Step 3 with "now begin with next step". Step 3 needs review now.

3. Category/collection template: three material collections at `/collections/brass`, `/collections/wood`, `/collections/copper`; three categories at `/category/decorative-chess`, `/category/decorative-objects`, `/category/vases-vessels`. Each has an introduction, visual, breadcrumb, scoped sample results, filtering/search/sorting, and related collection links. Reset preserves the collection scope. Homepage links open these pages; Shop has material and category links. Unknown collection/category slugs show a recovery page. Step 2 commit: `d9ff4f3`.

4. User requested real images matching sample product names. Added eight reusable reference photographs from Wikimedia Commons across homepage, Shop and collection/category pages. These are third-party object references (including museum objects), NOT confirmed SorviaGlobal inventory. Design and material can differ; this is stated in the UI. Each image has a credit link, the footer links all credits, and originals/author/license details are preserved in IMAGE_CREDITS.md and public/images/reference/credits.json. Product 08 uses historic metal chess as a reference only; brass material is not verified by that photo. No AI images were used. Step 3 source commit before this update: `87c3156`.

5. User requested more materials. Added Ceramic, Glass and Stone, each with a collection page, one sample item (IDs 09-11), and a locally stored credited reference photo. Catalog now has 11 sample items, six material collections and three categories. New routes: `/collections/ceramic`, `/collections/glass`, `/collections/stone`. Homepage cards and Shop material filters derive from `collections.ts` to stay in sync. Photo update commit before this expansion: `134dbc1`. Fetch script supports `--only-new` to preserve existing credits while retrieving additions. Checked each new material filter returns one item and reset restores eleven; checked collection pages, mobile glass layout and desktop ceramic layout. TypeScript and production build passed.

6. User asked for "4-5 materials in each" and replied "yesss" to clarification. We explicitly stated the assumption of five PRODUCTS per material and proceeded. Added 19 samples (IDs 12-30) with distinct reference photo files; every material now has five products, 30 total. Source/credits are bundled locally. Moved sample records and photo mapping into `src/catalog.ts` for reuse by future product details. `Shop.tsx` and `ObjectArt.tsx` consume that shared catalog. Updated ceramic/glass/stone collection descriptions. Browser verified all six filter counts = 5, Stone category refinement = 3, alabaster search = 1, A-Z ordering, and collection reset = 5. Build/TypeScript passed; asset audit confirmed 30 unique IDs, image files and credit records. Previous expansion commit: `2ddb064`. Current work still belongs to Step 3; wait for review before Step 4.

## Files

- `src/main.tsx`: homepage, shared header/footer, pathname choice between homepage, Shop, collections/categories and missing-collection recovery.
- `src/Shop.tsx`: reusable browsing template and controls, with optional collection scope.
- `src/catalog.ts`: shared 30 sample product records, five per material, with image keys and alt text.
- `src/collections.ts`: typed definitions for six category/material pages.
- `src/ObjectArt.tsx`: material photo mapping and shared product catalog lookup, responsive local images with alt text/credit links, lazy loading and CSS artwork fallback on errors.
- `public/images/reference/`: thirty JPGs plus credits.json and credits.html.
- `scripts/fetch-reference-images.py`: reproducible photo/credit retrieval; --credits-only regenerates credits offline.
- `IMAGE_CREDITS.md`: source, author and license records. Individual photo licenses apply independently of application code.
- `src/styles.css`: shared and responsive Shop styling.
- `README.md`: local run instructions and ordered roadmap.
- No real catalog, prices, cart, product details, checkout, login or backend yet. Cards do not pretend to be actionable product links.

## Validation

TypeScript checks and Vite production build passed. Browser checked material filter (Brass = 3), category URL (Decorative chess = 2), A–Z order, zero-result search and reset to 8 items. Desktop at 1280px and narrow mobile layout visually checked. Step 3 browser checks: brass scope (3), category refinement (1), refresh preservation, empty state and reset within scope (3), related navigation to chess (2), wood refinement in chess (1), wood/copper/vessels/objects counts, missing slug recovery, browse anchor, mobile menu and Shop regression (8). Desktop and mobile hero/filter layouts checked. Temporary viewport override reset. Photo update: all eight Shop images verified loaded, homepage and brass collection images checked, credit page checked, mobile cards and labels checked. TypeScript and production build passed. No automated suite added.

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

Continue SorviaGlobal in the existing workspace. Read PROJECT_HANDOVER.md and README.md first, inspect files and Git status/log, and preserve completed work. Build one page at a time, explain in simple language, upload completed milestones to the existing GitHub repository, and wait for my review before starting the next page. Step 3 category/collection pages and the reference-photo and material expansions are complete and awaiting review. Step 4 product details is next after approval. Report current state and the next pending action before continuing. Update this handover at every milestone.

## Hosted preview setup (17 November)

User requested a hosted preview that works with the computer off. Sites project: `appgprj_6afbfa2edf6081919d3199d7ab2d1af1`; target origin: https://sorvia-global-preview.cozycondor32.chatgpt.site . Access was verified owner-only (custom policy with owner and no other users/groups). Keep it private unless the user requests sharing. Hosting manifest `.openai/hosting.json` uses static dist. Added `public/_redirects` for direct route navigation. Reuse this project identity; never create another site for updates. Publish using Sites source helper and fresh short-lived credentials passed only through stdin. Preserve GitHub origin and push completed source there as well. Verify deployment status/current_live_url before claiming it is live. Local Vite server may stop between sessions; hosted preview does not depend on it. Hosted content updates only after another build/deployment. User approved Steps 1-3 and planned Step 4 for next work session; this task only enables hosting.

Hosting route note: the host did not apply the SPA rewrite alone. The production build now runs `scripts/prepare-static-routes.mjs` to generate HTML entries and directory indexes for Shop and every collection/category route. Add any future routes to this build preparation. Keep asset URLs absolute.
