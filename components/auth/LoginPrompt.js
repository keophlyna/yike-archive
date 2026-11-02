"use client";

import Link from "next/link";

const styles = {
  popover: { position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 20, width: "min(360px, 90vw)", padding: 18, background: "var(--surface)", border: "1px solid var(--surface-border)", boxShadow: "0 8px 24px var(--shadow)", color: "var(--ink)" },
  title: { margin: "0 0 8px", font: "600 16px var(--font-google-sans), sans-serif" },
  body: { margin: "0 0 14px", color: "var(--ink-soft)", font: "400 13px/1.5 var(--font-google-sans), sans-serif" },
  links: { display: "flex", alignItems: "center", gap: 16 },
  link: { color: "var(--red)", font: "600 12px var(--font-google-sans), sans-serif", textDecoration: "none" },
  close: { marginLeft: "auto", padding: "7px 10px", border: "1px solid var(--surface-border)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", font: "600 12px var(--font-google-sans), sans-serif" },
};

export default function LoginPrompt({ title, body, loginLabel, signupLabel, closeLabel, onClose, dialogRef, firstLinkRef }) {
  return <div ref={dialogRef} role="dialog" aria-labelledby="login-prompt-title" tabIndex={-1} style={styles.popover}>
    <h2 id="login-prompt-title" style={styles.title}>{title}</h2>
    <p style={styles.body}>{body}</p>
    <div style={styles.links}>
      <Link ref={firstLinkRef} href="/login" style={styles.link}>{loginLabel}</Link>
      <Link href="/signup" style={styles.link}>{signupLabel}</Link>
      <button type="button" onClick={onClose} style={styles.close}>{closeLabel}</button>
    </div>
  </div>;
}
