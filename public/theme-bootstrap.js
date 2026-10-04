// Applies the stored light/dark preference before React hydrates, so the page
// never flashes the wrong theme. Loaded with a plain <script src> at the top of
// <body>, which is parser-blocking, so it runs before any markup paints.
// It used to be an inline <script> built from a string in app/layout.js; it now
// lives in public/ so no source file injects markup from a string.
(function () {
  try {
    var stored = window.localStorage.getItem("yike-theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();