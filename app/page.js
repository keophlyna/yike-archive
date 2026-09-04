"use client";

import { useEffect, useRef, useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import entries from "../data/data_entries.js";
import ThemeToggle from "./ThemeToggle.js";
import { notoSerifKhmer } from "../app/fonts.js";

const COLOR_TRANSITION =
  "background-color 450ms cubic-bezier(.4,0,.2,1), color 450ms cubic-bezier(.4,0,.2,1), border-color 450ms cubic-bezier(.4,0,.2,1)";

const FONT_STACK = '"var(--font-roboto)", "Arial", "sans-serif"';

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    width: "100%",
    backgroundColor: "var(--page-bg)",
    borderBottom: "1px solid transparent",
    transition: `${COLOR_TRANSITION}, box-shadow 250ms ease, border-color 250ms ease`,
  },
  headerScrolled: {
    borderBottomColor: "var(--card-border)",
    boxShadow: "0 8px 24px rgba(15, 24, 32, 0.10)",
  },
  headerInner: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "16px 24px",
    boxSizing: "border-box",
  },
  headerTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  kicker: {
    fontFamily: FONT_STACK,
    color: "#9e1212",
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: 0,
  },
  searchField: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    width: 18,
    height: 18,
    color: "var(--text-secondary)",
    pointerEvents: "none",
    transition: COLOR_TRANSITION,
  },
  searchInput: {
    width: "100%",
    padding: "12px 44px 12px 42px",
    borderRadius: 8,
    border: "1px solid var(--card-border)",
    backgroundColor: "var(--card-bg)",
    color: "var(--text-primary)",
    fontFamily: FONT_STACK,
    fontSize: 16,
    outline: "none",
    transition: COLOR_TRANSITION,
    boxSizing: "border-box",
  },
  clearBtn: {
    position: "absolute",
    right: 8,
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1,
    transition: COLOR_TRANSITION,
  },
  kbdHint: {
    position: "absolute",
    right: 12,
    fontFamily: "monospace",
    fontSize: 12,
    color: "var(--text-secondary)",
    border: "1px solid var(--card-border)",
    borderRadius: 4,
    padding: "1px 6px",
    pointerEvents: "none",
    transition: COLOR_TRANSITION,
  },
  filterCount: {
    fontFamily: FONT_STACK,
    fontSize: 12.5,
    color: "var(--text-secondary)",
    margin: "10px 2px 0",
    transition: COLOR_TRANSITION,
  },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  wrap: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "48px 24px 80px",
    backgroundColor: "var(--page-bg)",
    transition: COLOR_TRANSITION,
    boxSizing: "border-box",
  },
  title: {
    fontFamily: FONT_STACK,
    fontSize: "clamp(32px, 5.5vw, 52px)",
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: "0 0 12px",
    lineHeight: 1.1,
    maxWidth: 720,
    transition: COLOR_TRANSITION,
  },
  description: {
    fontFamily: FONT_STACK,
    fontSize: 18,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: 680,
    transition: COLOR_TRANSITION,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginTop: 48,
  },
  metaCard: {
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
    lineHeight: 1.5,
    transition: COLOR_TRANSITION,
  },
  section: {
    marginTop: 64,
  },
  sectionHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  countPill: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    color: "var(--text-on-accent)",
    backgroundColor: "var(--accent-mint)",
    padding: "2px 9px",
    borderRadius: 999,
    transition: COLOR_TRANSITION,
  },
  empty: {
    marginTop: 16,
    padding: "48px 24px",
    border: "1px dashed var(--card-border)",
    borderRadius: 6,
    textAlign: "center",
    transition: COLOR_TRANSITION,
  },
  emptyTitle: {
    fontFamily: FONT_STACK,
    fontSize: 16,
    color: "var(--text-primary)",
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  emptyKh: {
    fontSize: 16,
    color: "var(--text-secondary)",
    margin: "8px 0 0",
    transition: COLOR_TRANSITION,
  },
  emptyClearBtn: {
    marginTop: 20,
    fontFamily: FONT_STACK,
    fontSize: 13,
    color: "var(--text-on-accent)",
    backgroundColor: "var(--accent-peach)",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
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

const globalCss = `
  :focus-visible {
    outline: 2px solid var(--accent-peach);
    outline-offset: 2px;
    border-radius: 4px;
  }
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-decoration {
    display: none;
  }
  .yk-search-field:focus-within .yk-kbd-hint {
    display: none;
  }
  .yk-search-input:hover,
  .yk-search-input:focus {
    border-color: var(--text-secondary) !important;
  }
  .yk-clear-btn:hover {
    background-color: var(--card-border) !important;
    color: var(--text-primary) !important;
  }
  .yk-entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }
  @media (max-width: 520px) {
    .yk-entry-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const target = e.target;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered =
    q === ""
      ? entries
      : entries.filter(
          (e) =>
            (e.title || "").toLowerCase().includes(q) ||
            (e.description || "").toLowerCase().includes(q) ||
            (e.titleKh || "").toLowerCase().includes(q)
        );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCss }} />

      <header
        style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}
      >
        <div style={styles.headerInner}>
          <div style={styles.headerTopRow}>
            <p style={styles.kicker}>Khmer Living Archive</p>
            <ThemeToggle />
          </div>

          <div role="search">
            <label htmlFor="archive-search" style={styles.visuallyHidden}>
              Search entries by title, Khmer title, or description
            </label>
            <div className="yk-search-field" style={styles.searchField}>
              <SearchIcon style={styles.searchIcon} width={18} height={18} />
              <input
                id="archive-search"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search entries…"
                className="yk-search-input"
                style={styles.searchInput}
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="yk-clear-btn"
                  style={styles.clearBtn}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              ) : (
                <span className="yk-kbd-hint" style={styles.kbdHint} aria-hidden="true">
                  /
                </span>
              )}
            </div>
          </div>

          <p style={styles.filterCount} aria-live="polite">
            {q
              ? `${filtered.length} of ${entries.length} ${
                  entries.length === 1 ? "entry" : "entries"
                } match "${query}"`
              : `${entries.length} ${
                  entries.length === 1 ? "entry" : "entries"
                } in the archive`}
          </p>
        </div>
      </header>

      <main style={styles.wrap}>
        <h1 style={styles.title}>{collection.name}</h1>
        <p style={styles.description}>{collection.description}</p>

        <div style={styles.metaGrid}>
          <div style={styles.metaCard}>
            <p style={styles.cardLabel}>Curated by</p>
            <p style={styles.cardValue}>{collection.curator}</p>
          </div>
          <div style={styles.metaCard}>
            <p style={styles.cardLabel}>Source</p>
            <p style={styles.cardValue}>{collection.source}</p>
          </div>
          <div style={styles.metaCard}>
            <p style={styles.cardLabel}>Province</p>
            <p style={styles.cardValue}>{collection.province}</p>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeaderRow}>
            <p style={styles.cardLabel}>Latest entries</p>
            <span style={styles.countPill}>{entries.length}</span>
          </div>

          {filtered.length > 0 ? (
            <div className="yk-entry-grid">
              {filtered.map((entry, index) => (
                <EntryCard
                  key={entry.title}
                  entryNumber={`Entry 0${index + 1}`}
                  title={entry.title}
                  titleKh={entry.titleKh}
                  description={entry.description}
                  contributor={entry.contributor}
                  place={entry.place}
                  category={entry.category}
                  photo={entry.photo}
                />
              ))}
            </div>
          ) : (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>
                No entries match "{query}."
              </p>
              <p className={notoSerifKhmer.className} style={styles.emptyKh}>
                {"រកមិនឃើញធាតុដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                style={styles.emptyClearBtn}
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <p style={styles.count}>entries in the archive: {entries.length}</p>

        <footer style={styles.footer}>
          A growing record of Yike, built with care in ICT 340 at the American
          University of Phnom Penh, Fall 2026.
        </footer>
      </main>
    </>
  );
}