# Using OrderBanao with Android Studio Java WebView

- Start a Java Android project (Empty Views Activity, package e.g. `com.orderbanao.app`).
- Publish OrderBanao as GitHub Pages and use that HTTPS URL in `WebView.loadUrl()`.
- In manifest include `android.permission.INTERNET` and use a native `android:style/Theme.Material.Light.NoActionBar` if MainActivity extends `android.app.Activity`. If using AppCompatActivity, use an AppCompat-compatible theme instead.
- Add a `WebView` in your XML layout and enable JavaScript and DOM storage in Java. Do not enable mixed HTTP content.
- Handle page errors and Android Back navigation.
- Set up `WebChromeClient.onShowFileChooser` for JSON restore.
- Blob URLs (`blob:https://...`) produced by CSV/JSON downloads are **not automatically handled by Android WebView**. Handle via a safe JS bridge or adapted app download logic; `DownloadManager` alone does not handle Blob URLs.
- `window.print()` in an embedded Android WebView is not guaranteed; implement printing with Android `PrintManager`/`createPrintDocumentAdapter`.
- Local data saved inside the WebView is distinct from Chrome browser storage, even with the same URL. Clear data/uninstall may erase records. Test backup/restore on a real device.
- Use a signed AAB with the exact registered application ID. Verify Play Console app content, Data Safety, privacy details and actual behavior before publishing.
