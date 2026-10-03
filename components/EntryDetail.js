"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EntryCard from "./EntryCard.js";
import { createClient } from "../utils/supabase/client.js";
import { fetchEntry } from "../utils/fetchEntry.js";

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
  const [failed, setFailed] = useState("");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("yike-language");
    if (stored === "en" || stored === "kh") setLanguage(stored);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await fetchEntry(createClient(), id);
        if (!active) return;
        if (result.error) {
          console.error("Could not load the entry", result.error);
          setFailed(result.error.code === "PGRST116" ? "missing" : "error");
          return;
        }
        setEntry(result.entry);
      } catch (err) {
        console.error("Could not load the entry", err);
        if (active) setFailed("error");
      }
    })();
    return () => { active = false; };
  }, [id]);

  // EntryCard reveals its garment cards and its timeline line by adding
  // .is-visible, so this page needs the same observer the homepage runs.
  useEffect(() => {
    if (!entry) return undefined;
    const observer = new IntersectionObserver((observed) => {
      observed.forEach((item) => {
        if (item.isIntersecting) { item.target.classList.add("is-visible"); observer.unobserve(item.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".yk-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [entry]);

  const shell = (children) => (
    <main style={styles.page}>
      <div style={styles.inner}>
        <nav style={styles.bar}>
          <Link href="/" style={styles.back}>← Back to archive</Link>
          <Link href="/contribute" style={styles.back}>Add an entry</Link>
        </nav>
        {children}
      </div>
    </main>
  );

  if (failed) {
    return shell(
      <>
        <h1 style={styles.heading}>{failed === "missing" ? "That entry could not be found." : "We could not load this entry."}</h1>
        <p style={styles.status} role="alert">{failed === "missing" ? "It may have been removed, or the link is wrong." : "Please try again in a moment."} <Link href="/" style={styles.link}>Back to the archive</Link></p>
      </>
    );
  }

  if (!entry) return shell(<p style={styles.status} role="status">Loading entry…</p>);

  return shell(<EntryCard {...entry} language={language} />);
}