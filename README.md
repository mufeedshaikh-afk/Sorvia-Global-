# SorviaGlobal frontend

Steps 1–6: homepage, Shop, collections, product details, Search, Wishlist, preview cart and region controls, built with React, TypeScript and Vite. Step 6 is awaiting review.

## Run locally

Install Node.js, then run `npm install` and `npm run dev`. Open the local address printed in the terminal. Run `npm run build` for the production build and type checks.

## Review this step

- Review the ivory/green palette, typography, desktop and mobile layout.
- Try the mobile menu and in-page navigation.
- Product and collection visuals use locally stored reference photographs; these are not confirmed inventory photos. Copy remains draft. Photo credits are linked on every image and in the footer; see IMAGE_CREDITS.md. CSS concept art is retained as an image-error fallback.
- Homepage collection links open the dedicated collection/category pages.
- Open `/shop`: search thirty sample items, filter by category/material, sort by name, and reset. Filter state is preserved in the URL on refresh.
- Check a search with no matches and use the recovery button.
- No live products, pricing, authentication, checkout or backend are connected yet.
- No analytics, payment credentials or customer data are included.

## Page-by-page plan

1. Homepage and shared header/footer — complete; user authorized Step 2.
2. Shop listing, filters and sorting — complete; user authorized Step 3.
3. Category and collection templates — complete; user approved.
4. Product detail — complete; user approved.
5. Search and wishlist — complete.
6. Cart and region selection — complete; awaiting review.
7. Checkout and payment states.
8. Accounts and orders.
9. Tracking and support/policies.
10. Admin product management.

Review each page before proceeding. Confirm backend API contracts before production integration. Real product assets, supported markets, prices, contact details and policies must be provided by the business.

Read `PROJECT_HANDOVER.md` first when continuing with another agent. Static hosting must serve `index.html` for `/shop`, `/collections/*`, and `/category/*` (Vite already does this locally).

## Step 3 review

Open `/collections/brass` or use the homepage collection links. Check the introduction, matching sample items, filters, sorting, reset and related collection links. All product information remains draft; photos are references, not inventory or material confirmation. Reset clears additional filters while preserving the current collection.

## Reference photographs

Thirty reusable photos from Wikimedia Commons are stored in `public/images/reference`. Their source records and individual licenses are in `IMAGE_CREDITS.md` and `public/images/reference/credits.json`; the website exposes a photo-credit page. Preserve these credits when sharing or deploying. Run `scripts/fetch-reference-images.py --credits-only` with Python to regenerate the credit pages without downloading files. Replace reference images with approved catalog photography before launch.

## Expanded material preview

Six materials: Brass, Wood, Copper, Ceramic, Glass and Stone. New routes: `/collections/ceramic`, `/collections/glass`, `/collections/stone`. Every material now has five sample products, bringing the catalog to thirty samples across nine collection/category pages. The homepage and Shop links/filters derive their material choices from the collection definitions. Reference photography remains clearly labelled.

## Five samples per material

Brass, Wood, Copper, Ceramic, Glass and Stone each contain five samples (30 total). Sample records and their image mapping live together in `src/catalog.ts`. Search, filters and name sorting work across the expanded catalog. Photos remain reference images, often of historic objects, with no confirmed stock or prices.

## Hosted preview

Hosting target: https://sorvia-global-preview.cozycondor32.chatgpt.site . The preview is private to the owner and may require ChatGPT sign-in. Hosting identity is preserved in `.openai/hosting.json`; reuse it for future deployments. Vite output is served from `dist`; `public/_redirects` supports direct Shop and collection links. Local edits must be rebuilt and published before they appear at the hosted link. GitHub remains the project backup.

Hosting route note: the host did not apply the SPA rewrite alone. The production build now runs `scripts/prepare-static-routes.mjs` to generate HTML entries and directory indexes for Shop and every collection/category route. Add any future routes to this build preparation. Keep asset URLs absolute.

## Step 4 review

Open any product image/title from Shop or a collection, or visit `/product/05`. All 30 sample IDs have detail pages with a larger reference photo, accessible enlargement dialog, material/category links, expandable details and three related samples. Back to browsing preserves supported filter/search/sort query state. Exact dimensions, materials, pricing, stock, delivery and ordering remain pending actual catalog/backend data. There is one photo per sample; no alternative product views are invented. Ordering is disabled. Direct product routes are generated during the production build. Unknown IDs show a recovery screen locally; `/product/not-found` is also an explicit hosted route.

## Step 5 review

Open `/search` from the header. Search matches all typed words against sample names, material and category; submit the form or use material suggestions. Search/filter state is stored in the URL. Save/remove a sample using the heart on any card or product-detail page; header count updates immediately. `/wishlist` shows saved items with removal and an empty-state recovery link. Favourites persist in localStorage for this browser and origin only, with cross-tab updates; they do not sync to accounts/devices, confirm availability or reserve stock. If browser storage is unavailable, the wishlist/detail views explain that favourites will not persist. Local and hosted previews have separate browser storage. Native route entries now include Search and Wishlist (43 static routes total).

## Shop design comparison

Modern luxury is the default Shop preview at `/shop`. Compare with `/shop?design=classic` or use the style links at the top. The trial adds an editorial photo introduction, a two-column large-photo grid on desktop, one column on mobile, and a collapsible filter area. Category/collection pages keep their existing design. Filters, search, sort and product return links preserve the selected style. This is a review trial awaiting the user’s choice, not approval to redesign other pages.

Warm luxury theme trial: `/shop` now uses cream, chocolate brown and muted gold. Compare the earlier modern palette at `/shop?design=modern` and original layout at `/shop?design=classic`. The theme includes the Shop header/footer and is isolated in `src/warm-theme.css`; other pages await review.


## Step 6 review
Open `/product/05`, choose a quantity and use **Add to preview cart**. Open the header mini-cart or `/cart` to adjust quantities, remove samples and review the empty state. Cart counts represent total quantities. Repeated additions merge by sample ID; the 99-item limit is a preview control, not stock information. Photos and concept records are not sellable inventory. Prices, subtotal and totals remain unavailable; shipping/taxes are not calculated and checkout is disabled.

Choose country/currency below the header, in the cart summary or in the footer. Example countries and INR/USD/GBP/EUR are review options only, not confirmed delivery/payment support. Browser language can suggest a country; no IP lookup runs. Country changes suggest a currency, which can be overridden. No exchange rates or prices are fabricated. Cart and preferences persist locally for this browser/origin, synchronize across tabs, and show write-failure notices. Backend configuration will replace preview options later.

Theme changes are postponed until the remaining frontend steps are complete. Next: Step 7 checkout/payment-state interface, after review and authorization.
