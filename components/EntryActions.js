"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../utils/supabase/client.js";
import { deleteEntry } from "../utils/deleteEntry.js";

const styles = {
  bar: { display: "flex", gridColumn: "1 / -1", order: 0, alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", marginBottom: -22 },
  action: { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "10px 17px", border: "1px solid var(--surface-border)", borderRadius: 999, background: "var(--ink)", color: "var(--page-bg)", font: "600 12px var(--font-google-sans), sans-serif", textDecoration: "none", cursor: "pointer", transition: "opacity 180ms ease, transform 180ms ease" },
  danger: { borderColor: "var(--surface-border)", background: "var(--surface)", color: "var(--red)" },
  message: { margin: 0, color: "var(--red)", font: "600 13px/1.5 var(--font-google-sans), sans-serif" },
};

// Rendered only when the signed-in user owns the entry, so this hides the
// controls from everyone else. That is a usability gate, not the security
// boundary: utils/deleteEntry.js filters on owner as well, and the entries table
// should carry a matching row level security policy.
export default function EntryActions({ entryId, userId, title = "", language = "en", onDeleted }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    setFailed(false);

    const result = await deleteEntry({ supabase: createClient(), entryId, userId });
    if (!result.ok) {
      console.error("Could not delete the entry:", result.error);
      setFailed(true);
      setIsDeleting(false);
      return;
    }
    if (onDeleted) onDeleted(entryId);
    else router.replace("/");
  };

  return (
    <div style={styles.bar}>
      <Link href={`/entries/${entryId}/edit`} style={styles.action} aria-label={`${language === "kh" ? "កែប្រែ" : "Edit"} ${title}…`}>{language === "kh" ? "កែប្រែ" : "Edit"}</Link>
      <button type="button" onClick={handleDelete} disabled={isDeleting} style={{ ...styles.action, ...styles.danger }} aria-label={`${language === "kh" ? "\u179b\u17bb\u1794" : "Delete"} ${title}\u2026`}>{isDeleting ? (language === "kh" ? "\u1780\u17c6\u1796\u17bb\u1784\u179b\u17bb\u1794\u2026" : "Deleting\u2026") : language === "kh" ? "\u179b\u17bb\u1794" : "Delete"}</button>
      {failed ? <p role="alert" style={styles.message}>That change wasn't saved</p> : null}
    </div>
  );
}
