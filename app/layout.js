import collection from "../collection.config.js";
import { montserrat } from "./fonts.js";
import ThemeProvider from "./ThemeContext.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

const themeCss = `
  :root {
    --page-bg: #EAF3FF;
    --card-bg: #ffffff;
    --card-border: #D8EAFF;
    --text-primary: #1F2A33;
    --text-secondary: #496580;
    --accent-mint: #BAFFF5;
    --accent-peach: #FFDBBB;
    --text-on-accent: #1F2A33;
    --badge-dark-bg: rgba(31, 42, 51, 0.75);
    --badge-dark-text: #ffffff;
  }
  [data-theme="dark"] {
    --page-bg: #10181F;
    --card-bg: #1B2733;
    --card-border: rgba(186, 221, 255, 0.14);
    --text-primary: #F2F6FA;
    --text-secondary: #9FB6C7;
    --accent-mint: #BAFFF5;
    --accent-peach: #FFDBBB;
    --text-on-accent: #1F2A33;
    --badge-dark-bg: rgba(15, 24, 32, 0.85);
    --badge-dark-text: #ffffff;
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
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body
        className={montserrat.className}
        suppressHydrationWarning
        style={{
          margin: 0,
          backgroundColor: "var(--page-bg)",
          color: "var(--text-primary)",
          minHeight: "100vh",
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
