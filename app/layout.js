import collection from "../collection.config.js";
import { googleSansFlex, notoSerifKhmer } from "./fonts.js";
import ThemeProvider from "./ThemeContext.js";
import "./theme.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSerifKhmer.variable} suppressHydrationWarning>
      <body className={googleSansFlex.className} suppressHydrationWarning>
        {/* Parser-blocking: sets data-theme before anything paints, so the
            stored preference never flashes. */}
        <script src="/theme-bootstrap.js" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
