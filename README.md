# OrderBanao — Order & Delivery Manager

A static GitHub Pages application for shopkeepers and small businesses, using vanilla HTML/CSS/JavaScript modules. Order records are stored **only in the local browser/WebView storage** (`localStorage`), not in GitHub.

## Features
- Customer directory: name, phone, address and optional notes
- Orders with up to 25 items, quantity and unit price, optional discount and delivery fee
- Manual delivery statuses: Pending, Packed, Shipped, Delivered, Cancelled
- Full and partial payment records; automatic outstanding balance
- Dashboard with totals, searchable and filtered orders
- Reports by delivery status; highest-value customers
- CSV exports for orders, customers and payments
- JSON backup and restore, with validation and replacement confirmation
- Printable order slips (browser print; native WebView may need a print bridge)
- English/Urdu user interface, dark mode and currency settings (PKR, INR, BDT, AED, USD)
- PWA install metadata, service-worker cache of site assets, no trackers in the provided source

## Publish to GitHub Pages
1. Extract the ZIP, then open the `orderbanao` directory.
2. Create an empty GitHub repository, e.g. `OrderBanao`.
3. Upload **the contents of `orderbanao/`** to the repository root, including `index.html`, `assets/` and `sw.js`.
4. In GitHub **Settings → Pages**, choose `Deploy from a branch`, branch `main`, folder `/(root)`.
5. Open `https://YOUR_USERNAME.github.io/OrderBanao/` after Pages has deployed.
6. Before publishing, replace `YOUR DEVELOPER NAME` and `YOUR_SUPPORT_EMAIL@example.com` in `privacy.html`, `contact.html`, `terms.html`, `delete-data.html`, and `assets/config.js`.

## Important
**Not an APK or AAB.** Android Studio WebView wrappers should use the published HTTPS URL, not `file://`, because JavaScript modules and PWA resources rely on a web origin. Enable JavaScript and DOM storage. A WebView file-picker bridge is needed for JSON restore; file downloads from Blob URLs and printing require separate native integration. Do not advertise these features as working in the APK until tested. Use the same application ID as your Play Console app.

No courier integration, live shipment tracking, payment gateway, cloud sync, or multi-device sync is included. All delivery statuses are user-entered. An order cannot be cancelled while payments are recorded; resolve those payments first. Printed slips are **not tax invoices**.

Local storage is not encrypted; it can be cleared by the browser/OS or lost during uninstall. Export backup copies regularly and keep them secure.

## Development
Run a static server (e.g. `python -m http.server 8000`) from this directory and open `http://localhost:8000/`. For consistency with browser module loading, don't open the HTML directly with `file://`.

No npm dependencies. `npm test` runs calculation and backup validation tests; `npm run check` checks required files and embedded links.

Suggested Android app/package: **OrderBanao – Order & Delivery Manager** / `com.orderbanao.app` (or a Play Console-registered package of your choice).
