"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../utils/supabase/client.js";
import { deleteEntry } from "../utils/deleteEntry.js";

const styles = {
  bar: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 },
  action: { padding: "11px 16px", border: "1px solid var(--surface-border)", background: "var(--surface)", color: "var(--ink)", font: "600 12px var(--font-google-sans), sans-serif", textDecoration: "none", cursor: "pointer" },
  danger: { color: "var(--red)" },
  message: { margin: 0, color: "var(--red)", font: "600 13px/1.5 var(--font-google-sans), sans-serif" },
};

// Rendered only when the signed-in user owns the entry, so this hides the
// controls from everyone else. That is a usability gate, not the security
// boundary: utils/deleteEntry.js filters on owner as well, and the entries table
// should carry a matching row level security policy.
export default function EntryActions({ entryId, userId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    setIsDeleting(true);
    setFailed(false);

    const result = await deleteEntry({ supabase: createClient(), entryId, userId });
    if (!result.ok) {
      console.error("Could not delete the entry:", result.error);
      setFailed(true);
      setIsDeleting(false);
      return;
    }
    // The entry the page was showing no longer exists, so leave it.
    router.push("/");
  };

  return (
    <div style={styles.bar}>
      <Link href={`/entries/${entryId}/edit`} style={styles.action}>Edit entry</Link>
      <button type="button" onClick={handleDelete} disabled={isDeleting} style={{ ...styles.action, ...styles.danger }}>{isDeleting ? "Deleting…" : "Delete entry"}</button>
      {failed ? <p role="alert" style={styles.message}>That change wasn't saved</p> : null}
    </div>
  );
}