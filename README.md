# SorviaGlobal frontend

Steps 1–3: homepage, Shop and category/collection previews, built with React, TypeScript and Vite. Step 3 is awaiting review.

## Run locally

Install Node.js, then run `npm install` and `npm run dev`. Open the local address printed in the terminal. Run `npm run build` for the production build and type checks.

## Review this step

- Review the ivory/green palette, typography, desktop and mobile layout.
- Try the mobile menu and in-page navigation.
- All illustrations are CSS concept art, not product photography. All copy is draft.
- Homepage collection links open the dedicated collection/category pages.
- Open `/shop`: search eight sample items, filter by category/material, sort by name, and reset. Filter state is preserved in the URL on refresh.
- Check a search with no matches and use the recovery button.
- No live products, pricing, authentication, checkout or backend are connected yet.
- No analytics, payment credentials or customer data are included.

## Page-by-page plan

1. Homepage and shared header/footer — complete; user authorized Step 2.
2. Shop listing, filters and sorting — complete; user authorized Step 3.
3. Category and collection templates — complete; awaiting review.
4. Product detail.
5. Search and wishlist.
6. Cart and region selection.
7. Checkout and payment states.
8. Accounts and orders.
9. Tracking and support/policies.
10. Admin product management.

Review each page before proceeding. Confirm backend API contracts before production integration. Real product assets, supported markets, prices, contact details and policies must be provided by the business.

Read `PROJECT_HANDOVER.md` first when continuing with another agent. Static hosting must serve `index.html` for `/shop`, `/collections/*`, and `/category/*` (Vite already does this locally).

## Step 3 review

Open `/collections/brass` or use the homepage collection links. Check the introduction, matching sample items, filters, sorting, reset and related collection links. All product information and illustrations remain draft samples. Reset clears additional filters while preserving the current collection.
