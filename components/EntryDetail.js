"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";
import EntryActions from "./EntryActions.js";
import { useRevealOnScroll } from "./useRevealOnScroll.js";
import { createClient } from "../utils/supabase/client.js";
import { fetchEntry } from "../utils/fetchEntry.js";
import useLanguage from "./useLanguage.js";
import formText from "../utils/formText.js";

const styles = {
  page: { minHeight: "100vh", padding: "clamp(24px, 5vh, 56px) clamp(16px, 4vw, 40px)", background: "var(--page-bg)" },
  inner: { width: "min(100%, 1760px)", margin: "0 auto" },
  bar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 22 },
  back: { color: "var(--red)", font: "600 13px var(--font-google-sans), sans-serif", textDecoration: "none" },
  heading: { margin: "0 0 14px", color: "var(--ink)", font: "600 clamp(24px, 4vw, 34px)/1.15 var(--font-google-sans), sans-serif" },
  status: { margin: 0, color: "var(--ink-soft)", font: "400 16px/1.7 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

export default function EntryDetail({ id }) {
  const [entry, setEntry] = useState(undefined);
  const [owner, setOwner] = useState("");
  const [viewerId, setViewerId] = useState("");
  const [failed, setFailed] = useState("");
  const language = useLanguage();
  const t = formText[language];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const [result, session] = await Promise.all([fetchEntry(supabase, id), supabase.auth.getUser()]);
        if (!active) return;
        if (result.error) {
          console.error("Could not load the entry", result.error.code || "unknown");
          setFailed(result.error.code === "PGRST116" ? "missing" : "error");
          return;
        }
        setEntry(result.entry);
        setOwner(result.owner || "");
        setViewerId(session.data.user ? session.data.user.id : "");
      } catch (err) {
        console.error("Could not load the entry");
        if (active) setFailed("error");
      }
    })();
    return () => { active = false; };
  }, [id]);

  useRevealOnScroll(Boolean(entry));

  const shell = (children) => (
    <main style={styles.page}>
      <div style={styles.inner}>
        <nav style={styles.bar}>
          <Link href="/" style={styles.back}>{t.backToArchive}</Link>
          <Link href="/contribute" style={styles.back}>{t.addEntryLink}</Link>
        </nav>
        {children}
      </div>
    </main>
  );

  if (failed) {
    return shell(
      <>
        <h1 style={styles.heading}>{failed === "missing" ? t.missingEntry : t.loadFailedTitle}</h1>
        <p style={styles.status} role="alert">{failed === "missing" ? t.notFoundDetail : t.retry} <Link href="/" style={styles.link}>{t.backArchive}</Link></p>
      </>
    );
  }

  if (!entry) return shell(<p style={styles.status} role="status">{t.loadingEntry}</p>);

  // Edit and Delete belong to the entry's owner only, so compare the signed-in
  // user id against the owner column before offering either control.
  const isOwner = Boolean(owner) && owner === viewerId;

  return shell(
    <>
      {isOwner ? <EntryActions entryId={id} userId={viewerId} language={language} /> : null}
      <EntryCard {...entry} detail language={language} />
    </>
  );
}
