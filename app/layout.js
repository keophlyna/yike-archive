import collection from "../collection.config.js";
import { montserrat } from "./fonts.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={montserrat.className}
        suppressHydrationWarning
        style={{
          margin: 0,
          backgroundColor: "#14181F",
          color: "#E8EDF2",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
