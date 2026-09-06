import collection from "../collection.config.js";
import { fraunces, notoSerifKhmer, workSans } from "./fonts.js";
import ThemeProvider from "./ThemeContext.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

const themeCss = `
  :root {
    --page-bg: #F3EEDE;
    --surface: #FBF8EE;
    --surface-border: #E4D8BC;
    --ink: #251B12;
    --ink-soft: #6B5D48;
    --rule: #DDD0B4;
    --red: #A3301F;
    --gold: #B07A20;
    --jade: #1F5445;
    --hero-bg: #2A160E;
    --hero-fg: #F5EAD6;
    --hero-rule: rgba(245,234,214,.25);
    --focus: #A3301F;
    --shadow: rgba(37,27,18,.12);
  }
  [data-theme="dark"] {
    --page-bg: #17120D;
    --surface: #201911;
    --surface-border: #392E20;
    --ink: #F1E6D2;
    --ink-soft: #B7A683;
    --rule: #392E20;
    --red: #E2795A;
    --gold: #E3BC6C;
    --jade: #63BCA1;
    --hero-bg: #48210F;
    --hero-fg: #F7EBD8;
    --hero-rule: rgba(247,235,216,.22);
    --focus: #E3BC6C;
    --shadow: rgba(0,0,0,.45);
  }
  html { scroll-behavior: smooth; }
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; background: var(--page-bg); color: var(--ink); }
  ::selection { background: var(--red); color: var(--hero-fg); }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  .yk-skip-link { position: fixed; left: 16px; top: 12px; z-index: 100; transform: translateY(-160%); background: var(--ink); color: var(--page-bg); padding: 10px 14px; font: 600 13px var(--font-work-sans), sans-serif; }
  .yk-skip-link:focus { transform: translateY(0); }
  input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration { display: none; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

const themeBootstrap = `
  (function() {
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
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable} ${notoSerifKhmer.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={workSans.className} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
