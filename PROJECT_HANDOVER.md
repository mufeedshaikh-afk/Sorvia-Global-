# SorviaGlobal project handover

Updated: 17 November 2026. Current milestone: Step 5 complete; Shop warm-luxury theme trial awaiting user review; modern and classic comparisons retained. Do not begin Step 6 until authorized.

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

Wait for Step 5 review. Apply requested adjustments if any. After approval, Step 6 is cart/region, checkout, accounts/orders, tracking/support/policies, admin. Real product photos, approved business copy, supported countries/prices, policies and API contracts are outstanding.

## Prompt for a new agent

Continue SorviaGlobal in the existing workspace. Read PROJECT_HANDOVER.md and README.md first, inspect files and Git status/log, and preserve completed work. Build one page at a time, explain in simple language, upload completed milestones to the existing GitHub repository, and wait for my review before starting the next page. Step 5 Search and Wishlist are complete and awaiting review. Step 6 cart/region is next after approval. Report current state and the next pending action before continuing. Update this handover at every milestone.

## Hosted preview setup (17 November)

User requested a hosted preview that works with the computer off. Sites project: `appgprj_6afbfa2edf6081919d3199d7ab2d1af1`; target origin: https://sorvia-global-preview.cozycondor32.chatgpt.site . Access was verified owner-only (custom policy with owner and no other users/groups). Keep it private unless the user requests sharing. Hosting manifest `.openai/hosting.json` uses static dist. Added `public/_redirects` for direct route navigation. Reuse this project identity; never create another site for updates. Publish using Sites source helper and fresh short-lived credentials passed only through stdin. Preserve GitHub origin and push completed source there as well. Verify deployment status/current_live_url before claiming it is live. Local Vite server may stop between sessions; hosted preview does not depend on it. Hosted content updates only after another build/deployment. User approved Steps 1-3 and planned Step 4 for next work session; this task only enables hosting.

Hosting route note: the host did not apply the SPA rewrite alone. The production build now runs `scripts/prepare-static-routes.mjs` to generate HTML entries and directory indexes for Shop and every collection/category route. Add any future routes to this build preparation. Keep asset URLs absolute.

## Step 4 (17 November)

User explicitly authorized Step 4. Added `src/ProductDetail.tsx` and shared `src/ProductCard.tsx`; all 30 product IDs have pages at `/product/ID` (e.g. `/product/05`). Image/title/details links open them from Shop and collections. Features: large single reference photo, native dialog enlargement with Escape/focus restoration, concept description, material/category links, disabled ordering pending real catalog, native expandable About/Dimensions/Care/Delivery sections, three same-material related samples and validated return link preserving Shop/collection queries. No stock, pricing, dimensions, extra photos or product claims were fabricated. Unknown IDs have a recovery component; explicit `/product/not-found` generated for hosted recovery. Static build helper now generates 41 page routes (10 existing, 30 product, one missing-product page) as HTML aliases and indexes. Do not remove these; hosted SPA rewrite alone was insufficient.

Validation: TypeScript/build passed; local browser checked filtered Shop -> photo link -> detail -> Back preserving Brass + A-Z, enlargement dialog opening/Escape/focus return, expandable specs, related sample navigation, external return address rejection, missing sample, desktop and mobile layout. Private hosting audience remains owner-only. Publish updated build using the existing Sites project and preserve GitHub backup. Step 4 awaits review before Step 5.

## Step 5 (17 November)

User explicitly authorized Search and Wishlist. Added `src/DiscoveryPages.tsx` (SearchPage/WishlistPage) and `src/WishlistContext.tsx` (provider, storage handling, shared SaveButton). Search at `/search` has explicit form submission, all-word case-insensitive matching across name/material/category, six material suggestions, material filter, URL state and no-result recovery. Favourites appear on all shared product cards and product details; header includes Search and Wishlist/count, mobile menu and footer updated. `/wishlist` supports view/remove and empty recovery. localStorage key `sorvia-wishlist-v1`, validated known product IDs, deduplication, guarded reads/writes and storage-event synchronization. Browser storage only, per origin; no account sync or stock reservation. Storage write failures show a notice on Wishlist/detail. Product Back to browsing accepts internal Search/Wishlist routes and preserves queries. Static build now includes 43 routes.

Validation: local UI verified brass bowl search = 2, add two favourites, navigate/refresh preserves 2, remove from product details returns to wishlist with 1, remove last gives empty state, no-result search = 0, reset = 30, Glass suggestion/filter = 5 and survives refresh. Checked narrow layout at 320px with no horizontal overflow. TypeScript and production build passed. Step 5 awaits review; Step 6 (cart/region) is next after approval. Previous milestone commit: `0b5389b`.

Step 5 follow-up: hosted verification caught a navigation race with effect-based localStorage writes. Wishlist toggles now persist synchronously inside the click handler, with a ref holding current IDs. Local regression passed: save then immediately navigate -> item present; remove then immediately navigate -> item remains removed. Keep persistence inside the handler to avoid reintroducing this issue.

## Shop modern luxury trial (17 November)

User asked to try modern luxury for the SHOP page and compare it with the previous design. Scope is Shop only. `src/Shop.tsx` defaults to `.shop-luxury` unless `?design=classic`; collection/category routes continue using the existing layout. Added comparison links preserving query/filter state, editorial photo hero, larger type/spacing, understated material links, two-column desktop product grid and one-column mobile grid. A Refine selection button opens/closes the filters, with aria-expanded/controls and hidden state. Existing search, sort, wishlist and product-detail links remain. Classic style flag is retained in the URL and product return path. Styles are scoped to `.shop-luxury`. User has not yet chosen which design to retain. Before redesigning other pages or continuing Step 6, wait for their review. Also preserve the user’s explicit preference: finish frontend first; backend comes afterward.

Checks: TypeScript; browser comparison retains Brass filter and A-Z (5 results), classic product navigation/back retains classic mode, favourites save/remove, mobile filter disclosure, empty search/reset, desktop two columns and mobile one column with no horizontal overflow. Previous design screenshot saved at visualization root as shop-before-luxury.jpg. Git baseline before trial: `25f95dd`.

## Warm luxury Shop theme — 17 November 2026
User selected warm luxury after clarifying they wanted a theme change. Default /shop now uses cream, chocolate brown and muted gold, including its shared header/footer. Modern palette remains /shop?design=modern and original layout remains /shop?design=classic. Comparison links retain filters/sort; product return links preserve the selected design. Other routes retain the existing theme pending review. Theme styles live in src/warm-theme.css and are scoped by the App wrapper. No backend work or Step 6 started.
Validation: TypeScript, Vite build and all 43 static routes passed. Browser verified warm theme presence, Brass filter = 5, switching modern/warm preserves selection, clearing restores 30, and 390px mobile viewport has no horizontal overflow. Browser screenshot capture was unavailable during local QA. No dependencies changed; direct build tools used because pnpm's automatic store registration hit a sandbox symlink restriction.
