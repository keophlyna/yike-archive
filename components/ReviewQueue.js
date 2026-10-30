"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../utils/supabase/client.js";
import useLanguage from "./useLanguage.js";
import ReviewItem from "./ReviewItem.js";
import reviewText from "./reviewText.js";

const styles = {
  page: { width: "min(90vw, 1000px)", margin: "0 auto", padding: "48px 0", color: "var(--ink)" },
  back: { color: "var(--red)", fontSize: 14 },
  title: { margin: "32px 0 20px", font: "600 clamp(30px, 5vw, 48px)/1.1 var(--font-google-sans), sans-serif" },
  list: { margin: 0, padding: 0, listStyle: "none", borderTop: "1px solid var(--rule)" },
  message: { color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6 },
};

// app/review/page.js has already asked the database whether this user is a
// reviewer and loaded the pending entries. This component only shows them and
// sends each decision through the review_entry function. The function and the
// row level security policies are the real gate; hiding the page is courtesy.
export default function ReviewQueue({ allowed, initialEntries = [], loadFailed = false }) {
  const language = useLanguage();
  const t = reviewText[language] || reviewText.en;
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);
  const [failedId, setFailedId] = useState(null);

  if (!allowed) return <main style={styles.page}><p style={styles.message}>{t.reviewersOnly}</p></main>;

  const decide = async (entryId, decision) => {
    if (busyId) return;
    setBusyId(entryId);
    setFailedId(null);
    let saved = false;
    try {
      const { data, error } = await createClient().rpc("review_entry", { entry_id: entryId, decision });
      saved = !error && data === true;
    } catch (_) {}
    if (saved) setEntries((current) => current.filter((entry) => entry.id !== entryId));
    else setFailedId(entryId);
    setBusyId(null);
  };

  return (
    <main style={styles.page}>
      <Link href="/" style={styles.back}>{t.back}</Link>
      <h1 style={styles.title}>{t.title}</h1>
      {loadFailed ? <p role="alert" style={styles.message}>{t.loadFailed}</p>
        : entries.length === 0 ? <p role="status" style={styles.message}>{t.empty}</p>
          : <ul style={styles.list}>{entries.map((entry) => <ReviewItem key={entry.id} entry={entry} t={t} language={language} busy={busyId !== null} failed={failedId === entry.id} onDecide={decide} />)}</ul>}
    </main>
  );
}
