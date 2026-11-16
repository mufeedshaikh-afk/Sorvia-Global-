# SorviaGlobal frontend

Steps 1–2: homepage and Shop preview, built with React, TypeScript and Vite. Step 2 is awaiting review.

## Run locally

Install Node.js, then run `npm install` and `npm run dev`. Open the local address printed in the terminal. Run `npm run build` for the production build and type checks.

## Review this step

- Review the ivory/green palette, typography, desktop and mobile layout.
- Try the mobile menu and in-page navigation.
- All illustrations are CSS concept art, not product photography. All copy is draft.
- Homepage collection links open the Shop with the relevant filter.
- Open `/shop`: search eight sample items, filter by category/material, sort by name, and reset. Filter state is preserved in the URL on refresh.
- Check a search with no matches and use the recovery button.
- No live products, pricing, authentication, checkout or backend are connected yet.
- No analytics, payment credentials or customer data are included.

## Page-by-page plan

1. Homepage and shared header/footer — complete; user authorized Step 2.
2. Shop listing, filters and sorting — complete; awaiting review.
3. Category and collection templates.
4. Product detail.
5. Search and wishlist.
6. Cart and region selection.
7. Checkout and payment states.
8. Accounts and orders.
9. Tracking and support/policies.
10. Admin product management.

Review each page before proceeding. Confirm backend API contracts before production integration. Real product assets, supported markets, prices, contact details and policies must be provided by the business.

Read `PROJECT_HANDOVER.md` first when continuing with another agent. Static hosting must serve `index.html` for `/shop` (Vite already does this locally).
