"use client";

import { useState } from "react";
import PendingPhoto from "../entry/PendingPhoto.js";
import { fontKhmer } from "../entry/entryCardStyles.js";
import formText from "../../utils/form/formText.js";

const styles = {
  item: { display: "flex", flexWrap: "wrap", gap: 24, padding: "28px 0", borderBottom: "1px solid var(--rule)" },
  photo: { flex: "1 1 220px", maxWidth: 320 },
  body: { flex: "3 1 300px", minWidth: 0 },
  title: { margin: 0, font: "600 22px/1.3 var(--font-google-sans), sans-serif" },
  khmer: { fontFamily: fontKhmer },
  text: { margin: "10px 0 0", color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.7, whiteSpace: "pre-wrap" },
  facts: { display: "grid", gridTemplateColumns: "max-content 1fr", gap: "6px 16px", margin: "18px 0 0", fontSize: 14 },
  term: { color: "var(--ink-soft)", fontWeight: 600 },
  value: { margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere" },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
  button: { minHeight: 44, padding: "10px 17px", border: "1px solid var(--surface-border)", borderRadius: 999, background: "var(--ink)", color: "var(--page-bg)", font: "600 13px var(--font-google-sans), sans-serif", cursor: "pointer" },
  secondary: { background: "var(--surface)", color: "var(--red)" },
  error: { margin: "12px 0 0", color: "var(--red)", font: "600 13px/1.5 var(--font-google-sans), sans-serif" },
  note: { display: "flex", flexDirection: "column", gap: 6, flex: "1 1 240px", fontSize: 13, color: "var(--ink-soft)" },
  // Google Sans has no Khmer glyphs, so Khmer typed here falls through to Noto Serif Khmer.
  noteBox: { minHeight: 44, padding: "8px 12px", border: "1px solid var(--surface-border)", borderRadius: 12, background: "var(--surface)", color: "var(--ink)", font: `14px/1.6 var(--font-google-sans), ${fontKhmer}`, resize: "vertical" },
};

// The time zone is fixed so the server render and the browser render print the
// same date and React does not report a hydration mismatch.
function formatDate(value, language) {
  if (!value) return "";
  return new Intl.DateTimeFormat(language === "kh" ? "km-KH" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Phnom_Penh" }).format(new Date(value));
}

// Shows both the English and the Khmer value, one per line, skipping blanks.
function both(english, khmer) {
  return <>{english}{english && khmer ? <br /> : null}{khmer ? <span style={styles.khmer}>{khmer}</span> : null}{!english && !khmer ? "—" : null}</>;
}

export default function ReviewItem({ entry, t, language, busy, failed, onDecide }) {
  const [note, setNote] = useState("");
  const noteLabel = (formText[language] || formText.en).reviewNoteLabel;
  const facts = [
    [t.category, entry.category],
    [t.place, both(entry.place, entry.place_kh)],
    [t.contributor, both(entry.contributor, entry.contributor_kh)],
    [t.sources, both(entry.sources, entry.sources_kh)],
    [t.submitted, formatDate(entry.created_at, language)],
  ];

  return (
    <li style={styles.item}>
      <div style={styles.photo}><PendingPhoto photo={entry.photo_url} alt={entry.title || entry.title_kh || ""} language={language} /></div>
      <article style={styles.body}>
        <h2 style={styles.title}>{entry.title}</h2>
        {entry.title_kh ? <h2 style={{ ...styles.title, ...styles.khmer }}>{entry.title_kh}</h2> : null}
        {entry.description ? <p style={styles.text}>{entry.description}</p> : null}
        {entry.description_kh ? <p style={{ ...styles.text, ...styles.khmer }}>{entry.description_kh}</p> : null}
        <dl style={styles.facts}>
          {facts.map(([label, value]) => <div key={label} style={{ display: "contents" }}><dt style={styles.term}>{label}</dt><dd style={styles.value}>{value || "—"}</dd></div>)}
        </dl>
        <div style={styles.actions}>
          <button type="button" disabled={busy} onClick={() => onDecide(entry.id, "published")} style={styles.button}>{busy ? t.saving : t.publish}</button>
          <button type="button" disabled={busy} onClick={() => onDecide(entry.id, "returned", note)} style={{ ...styles.button, ...styles.secondary }}>{busy ? t.saving : t.return}</button>
          <label style={{ ...styles.note, ...(language === "kh" ? styles.khmer : null) }}>
            {noteLabel}
            <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={2} disabled={busy} style={styles.noteBox} />
          </label>
        </div>
        {failed ? <p role="alert" style={styles.error}>{t.notSaved}</p> : null}
      </article>
    </li>
  );
}
