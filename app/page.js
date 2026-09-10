"use client";

import { useEffect, useRef, useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import entries from "../data/data_entries.js";
import ThemeToggle from "./ThemeToggle.js";

const contentWidth = "min(90vw, 1760px)";
const fontSans = "var(--font-google-sans), sans-serif";
const fontSerif = "var(--font-google-sans), sans-serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";

const styles = {
  header: { position: "sticky", top: 0, zIndex: 40, width: "100%", background: "var(--page-bg)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "transparent", transition: "box-shadow 250ms ease, border-color 250ms ease" },
  headerScrolled: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)", boxShadow: "0 8px 24px var(--shadow)" },
  headerInner: { width: contentWidth, margin: "0 auto", padding: "16px 0 13px" },
  headerTop: { display: "grid", gridTemplateColumns: "1fr minmax(280px, 520px) auto", alignItems: "start", gap: "clamp(20px, 5vw, 90px)" },
  wordmark: { fontFamily: fontSans, fontWeight: 600, fontSize: 24, color: "var(--ink)", margin: 0, lineHeight: 1.1 },
  searchWrap: { minWidth: 0 },
  searchField: { position: "relative", display: "flex", alignItems: "center", borderBottom: "1px solid var(--ink-soft)" },
  searchInput: { width: "100%", padding: "5px 34px 8px 0", border: 0, background: "transparent", color: "var(--ink)", fontFamily: fontSans, fontWeight: 400, fontSize: 15, outline: "none" },
  searchHint: { position: "absolute", right: 3, color: "var(--ink-soft)", font: `500 12px monospace` },
  clearBtn: { position: "absolute", right: 0, width: 24, height: 24, border: 0, background: "transparent", color: "var(--ink-soft)", cursor: "pointer", fontSize: 14 },
  resultCount: { margin: "7px 0 0", color: "var(--ink-soft)", font: `400 12px ${fontSans}` },
  resultLabel: { margin: "14px 0 0", color: "var(--gold)", font: `600 10px ${fontSans}`, letterSpacing: ".08em", textTransform: "uppercase" },
  resultLinks: { display: "grid", gap: 0, margin: "4px 0 0", padding: 0, listStyle: "none", borderTop: "1px solid var(--rule)" },
  resultItem: { borderBottom: "1px solid var(--rule)" },
  resultLink: { display: "grid", gridTemplateColumns: "24px 1fr auto", alignItems: "baseline", gap: 8, width: "100%", padding: "9px 6px", color: "var(--red)", font: `500 12px ${fontSans}`, textDecoration: "none", transition: "background-color 220ms ease, color 220ms ease" },
  resultNumber: { color: "var(--ink-soft)", font: `500 11px ${fontSans}` },
  resultInfo: { display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "3px 8px", minWidth: 0 },
  resultKhmer: { color: "var(--ink-soft)", font: `400 14px ${fontKhmer}`, textDecoration: "none" },
  resultCategory: { color: "var(--ink-soft)", font: `600 10px ${fontSans}`, letterSpacing: ".04em" },
  hero: { background: "var(--hero-bg)", color: "var(--hero-fg)" },
  heroInner: { width: contentWidth, margin: "0 auto", padding: "clamp(58px, 10vw, 138px) 0 clamp(50px, 8vw, 112px)" },
  kicker: { margin: "0 0 18px", color: "var(--gold)", font: `600 12px ${fontSans}`, letterSpacing: ".08em" },
  heroTitle: { maxWidth: 900, margin: 0, font: `700 clamp(44px, 6.4vw, 78px)/.96 ${fontSerif}` },
  heroDescription: { maxWidth: 760, margin: "30px 0 0", color: "var(--hero-fg)", font: `400 clamp(17px, 1.5vw, 21px)/1.65 ${fontSans}` },
  metaRow: { display: "flex", flexWrap: "wrap", marginTop: "clamp(42px, 6vw, 76px)" },
  meta: { minWidth: 210, flex: "1 1 210px", padding: "0 28px", borderLeft: "1px solid var(--hero-rule)" },
  metaFirst: { paddingLeft: 0, borderLeft: 0 },
  metaLabel: { margin: 0, color: "var(--gold)", font: `600 11px ${fontSans}`, letterSpacing: ".05em" },
  metaValue: { margin: "8px 0 0", color: "var(--hero-fg)", font: `400 15px/1.45 ${fontSans}` },
  main: { width: contentWidth, margin: "0 auto", padding: "clamp(56px, 8vw, 116px) 0 60px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--rule)", paddingBottom: 18 },
  sectionTitle: { margin: 0, font: `600 clamp(28px, 3vw, 42px)/1 ${fontSerif}`, color: "var(--ink)" },
  countPill: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 24, padding: "0 8px", background: "var(--ink)", color: "var(--page-bg)", font: `600 12px ${fontSans}` },
  entryList: { marginTop: 0 },
  empty: { padding: "clamp(60px, 10vw, 130px) 0", textAlign: "center" },
  emptyTitle: { margin: 0, font: `600 clamp(28px, 4vw, 46px) ${fontSerif}`, color: "var(--ink)" },
  emptyKh: { margin: "14px 0 0", color: "var(--ink-soft)", font: `400 18px ${fontKhmer}` },
  emptyClear: { marginTop: 28, padding: "10px 16px", border: 0, background: "var(--ink)", color: "var(--page-bg)", font: `600 13px ${fontSans}`, cursor: "pointer" },
  footer: { paddingTop: 22, borderTop: "1px solid var(--rule)", color: "var(--ink-soft)", font: `400 13px/1.6 ${fontSans}` },
  topButton: { position: "fixed", right: "clamp(18px, 3vw, 48px)", bottom: 24, zIndex: 30, width: 46, height: 46, border: "1px solid var(--surface-border)", borderRadius: "50%", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", fontSize: 20 },
};

const globalCss = `
  .yk-search-input::placeholder { color: var(--ink-soft); opacity: 1; }
  .yk-result-link:hover, .yk-result-link:focus-visible { background: var(--surface); color: var(--jade) !important; }
  .yk-clear-btn:hover, .yk-empty-clear:hover { background: var(--red) !important; color: var(--hero-fg) !important; }
  .yk-back-top { opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity 220ms ease, transform 220ms ease; }
  .yk-back-top.is-visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
  @media (prefers-reduced-motion: no-preference) {
    .yk-reveal { opacity: 0; transform: translateY(28px); transition: opacity 700ms ease, transform 700ms ease; }
    .yk-reveal.is-visible { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 720px) {
    .yk-header-top { grid-template-columns: 1fr auto !important; }
    .yk-search-wrap { grid-column: 1 / -1; }
    .yk-meta { min-width: 50%; padding: 20px 18px 0 0 !important; border-left: 0 !important; }
  }
  @media (max-width: 520px) {
    .yk-wordmark { font-size: 20px !important; }
    .yk-hero-title { font-size: 42px !important; }
    .yk-meta { min-width: 100%; }
  }
`;

function getEntrySearchText(entry) {
  const nestedText = [
    ...(entry.phases || []).flatMap((phase) => [phase.num, phase.phase, phase.title, phase.kh, phase.text]),
    ...(entry.characters || []).flatMap((character) => [character.role, character.kh, character.tag, character.text]),
    ...(entry.garments || []).flatMap((garment) => [garment.name, garment.kh, garment.text]),
  ];

  return [
    entry.title,
    entry.titleKh,
    entry.description,
    entry.category,
    entry.contributor,
    entry.place,
    ...nestedText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 2); setShowTop(window.scrollY > 640); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === "Escape" && document.activeElement === inputRef.current) { setQuery(""); inputRef.current?.blur(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((observed) => {
      observed.forEach((item) => { if (item.isIntersecting) { item.target.classList.add("is-visible"); revealObserver.unobserve(item.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".yk-reveal").forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, [query]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  const filtered = searchTerms.length > 0
    ? entries.filter((entry) => {
        const searchableText = getEntrySearchText(entry);
        return searchTerms.every((term) => searchableText.includes(term));
      })
    : entries;
  const clearSearch = () => { setQuery(""); inputRef.current?.focus(); };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      <a className="yk-skip-link" href="#main">Skip to entries</a>
      <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}>
        <div className="yk-header-inner" style={styles.headerInner}>
          <div className="yk-header-top" style={styles.headerTop}>
            <p className="yk-wordmark" style={styles.wordmark}>Khmer Living Archive</p>
            <form className="yk-search-wrap" style={styles.searchWrap} role="search" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="archive-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Search entries</label>
              <div style={styles.searchField}>
                <input id="archive-search" ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" className="yk-search-input" style={styles.searchInput} autoComplete="off" />
                {query ? <button type="button" className="yk-clear-btn" style={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">x</button> : <span style={styles.searchHint} aria-hidden="true">/</span>}
              </div>
              <p style={styles.resultCount} aria-live="polite">{normalizedQuery ? `${filtered.length} of ${entries.length} entries match` : `${entries.length} entries in the archive`}</p>
              {normalizedQuery && filtered.length > 0 && <>
                <p style={styles.resultLabel}>Matching entries</p>
                <ul style={styles.resultLinks} aria-label="Matching entries">
                  {filtered.map((entry, index) => <li style={styles.resultItem} key={entry.title}><a className="yk-result-link" style={styles.resultLink} href={`#entry-${index + 1}`}><span style={styles.resultNumber}>{String(index + 1).padStart(2, "0")}</span><span style={styles.resultInfo}><span>{entry.title}</span>{entry.titleKh && <span className="yk-result-khmer" style={styles.resultKhmer}>{entry.titleKh}</span>}</span>{entry.category && <span style={styles.resultCategory}>{entry.category}</span>}</a></li>)}
                </ul>
              </>}
            </form>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.kicker}>A living record of Khmer performance</p>
          <h1 className="yk-hero-title" style={styles.heroTitle}>{collection.name}</h1>
          <p style={styles.heroDescription}>{collection.description}</p>
          <div style={styles.metaRow}>
            <div className="yk-meta" style={{ ...styles.meta, ...styles.metaFirst }}><p style={styles.metaLabel}>Curated by</p><p style={styles.metaValue}>{collection.curator}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>Province</p><p style={styles.metaValue}>{collection.province}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>Source</p><p style={styles.metaValue}>{collection.source}</p></div>
          </div>
        </div>
      </section>

      <main id="main" style={styles.main}>
        <section aria-labelledby="latest-heading">
          <div style={styles.sectionHeader}><h2 id="latest-heading" style={styles.sectionTitle}>Latest entries</h2><span style={styles.countPill} aria-label={`${filtered.length} entries`}>{filtered.length}</span></div>
          {filtered.length > 0 ? <div style={styles.entryList}>{filtered.map((entry, index) => <EntryCard key={entry.id || entry.title || index} entryId={`entry-${index + 1}`} entryNumber={String(index + 1)} {...entry} />)}</div> : <div style={styles.empty}><h2 style={styles.emptyTitle}>No entries match “{query}”</h2><p style={styles.emptyKh}>រកមិនឃើញលទ្ធផល</p><button type="button" className="yk-empty-clear" style={styles.emptyClear} onClick={clearSearch}>Clear search</button></div>}
        </section>
        <footer style={styles.footer}>A growing record of Yike, built with care in ICT 340 at the American University of Phnom Penh, Fall 2026. <span>· {entries.length} entries</span></footer>
      </main>
      <button type="button" className={`yk-back-top${showTop ? " is-visible" : ""}`} style={styles.topButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </>
  );
}
