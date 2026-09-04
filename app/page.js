"use client";

import { useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import entries from "../data/data_entries.js";
import ThemeToggle from "./ThemeToggle.js";
import { roboto } from "../app/fonts.js";

const COLOR_TRANSITION =
  "background-color 450ms cubic-bezier(.4,0,.2,1), color 450ms cubic-bezier(.4,0,.2,1), border-color 450ms cubic-bezier(.4,0,.2,1)";

const FONT_STACK = '"var(--font-roboto)", "Arial", "sans-serif"';

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
    backgroundColor: "var(--page-bg)",
    transition: COLOR_TRANSITION,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 0,
  },
  kicker: {
    fontFamily: FONT_STACK,
    color: "#9e1212",
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontFamily: FONT_STACK,
    fontSize: 52,
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: "16px 0 12px",
    lineHeight: 1.1,
    transition: COLOR_TRANSITION,
  },
  description: {
    fontFamily: FONT_STACK,
    fontSize: 18,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: 6,
    transition: COLOR_TRANSITION,
  },
  cardLabel: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  cardValue: {
    fontFamily: FONT_STACK,
    fontSize: 16,
    color: "var(--text-primary)",
    margin: "6px 0 0",
    transition: COLOR_TRANSITION,
  },
  section: {
    marginTop: 64,
  },
  searchSticky: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "var(--page-bg)",
    padding: "16px 0",
    marginBottom: 16,
    transition: COLOR_TRANSITION,
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 6,
    border: "1px solid var(--card-border)",
    backgroundColor: "var(--card-bg)",
    color: "var(--text-primary)",
    fontFamily: FONT_STACK,
    fontSize: 16,
    outline: "none",
    transition: COLOR_TRANSITION,
    boxSizing: "border-box",
  },
  filterCount: {
    fontFamily: FONT_STACK,
    fontSize: 12,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: "12px 0 0",
    transition: COLOR_TRANSITION,
  },
  empty: {
    padding: "40px 24px",
    border: "1px dashed var(--card-border)",
    borderRadius: 6,
    textAlign: "center",
    color: "var(--text-secondary)",
    fontFamily: FONT_STACK,
    transition: COLOR_TRANSITION,
  },
  count: {
    fontFamily: FONT_STACK,
    fontSize: 14,
    color: "var(--accent-peach)",
    marginTop: 48,
    transition: COLOR_TRANSITION,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid var(--card-border)",
    fontSize: 13,
    color: "var(--text-secondary)",
    fontFamily: FONT_STACK,
    transition: COLOR_TRANSITION,
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q === ""
    ? entries
    : entries.filter(
        (e) =>
          (e.title || "").toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q) ||
          (e.titleKh || "").toLowerCase().includes(q)
      );

  return (
    <main style={styles.wrap}>
      <div style={styles.searchSticky}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entries…"
          style={styles.searchInput}
        />
        {q !== "" && (
          <p style={styles.filterCount}>
            {filtered.length} of {entries.length} entries shown
          </p>
        )}
      </div>

      <div style={styles.topBar}>
        <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
        <ThemeToggle />
      </div>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>Curated by</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>Source</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>Province</p>
        <p style={styles.cardValue}>{collection.province}</p>
      </div>

      <section style={styles.section}>
        <p style={styles.cardLabel}>Latest entries</p>

        {filtered.length > 0 ? (
          filtered.map((entry, index) => (
            <div key={entry.title} style={{ marginTop: 16 }}>
              <EntryCard
                entryNumber={`Entry 0${index + 1}`}
                title={entry.title}
                titleKh={entry.titleKh}
                description={entry.description}
                contributor={entry.contributor}
                place={entry.place}
                category={entry.category}
                photo={entry.photo}
              />
            </div>
          ))
        ) : (
          <div style={styles.empty}></div>
        )}
      </section>

      <p style={styles.count}>entries in the archive: 2 (for now)</p>

      <footer style={styles.footer}>
        A growing record of Yike, built with care in ICT 340 at the American
        University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}
