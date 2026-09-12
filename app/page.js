"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import entries from "../data/data_entries.js";
import { useTheme } from "./ThemeContext.js";
import ThemeToggle from "./ThemeToggle.js";

const contentWidth = "min(90vw, 1760px)";
const fontSans = "var(--font-google-sans), sans-serif";
const fontSerif = "var(--font-google-sans), sans-serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";

const translations = {
  en: {
    wordmark: "Khmer Living Archive",
    searchPlaceholder: "Search the archive",
    searchLabel: "Search",
    matchingEntries: "Matching entries",
    latestEntries: "Latest entries",
    noResults: (query) => `No entries match “${query}”`,
    clearSearch: "Clear search",
    kicker: "A living record of Khmer performance",
    curatedBy: "Curated by",
    province: "Province",
    source: "Source",
    heroTitle: collection.name,
    heroDescription: collection.description,
    emptySubtitle: "Search results are empty",
  },
  kh: {
    wordmark: "បណ្ណសាររស់ខ្មែរ",
    searchPlaceholder: "ស្វែងរកក្នុងបណ្ណសារ",
    searchLabel: "ស្វែងរក",
    matchingEntries: "ឯកសារដែលត្រូវគ្នា",
    latestEntries: "ឯកសារថ្មីៗ",
    noResults: () => "គ្មានឯកសារណាត្រូវនឹង",
    clearSearch: "សម្អាតការស្វែងរក",
    kicker: "កំណត់ត្រាដ៏រស់រវើកនៃសិល្បៈទស្សនីយភាពខ្មែរ",
    curatedBy: "រៀបចំចងក្រងដោយ",
    province: "ខេត្ត",
    source: "ប្រភព",
    heroTitle: "បណ្ណសាររស់ខ្មែរ",
    heroDescription: "ល្ខោនយីកេ គឺជាទម្រង់សិល្បៈល្ខោនប្រពៃណីខ្មែរមួយ ដែលរួមបញ្ចូលគ្នានូវតន្ត្រី របាំ និងការនិទានរឿង។ ល្ខោនយីកេមានតម្លៃលើសពីការកម្សាន្តទៅទៀត ដោយវាបានពាំនាំនូវសាច់រឿង ភាសា តន្ត្រី ប្រពៃណី និងចំណេះដឹងផ្នែកវប្បធម៌ខ្មែរ ពីជំនាន់មួយទៅជំនាន់មួយ។ ការអភិរក្សសិល្បៈមួយនេះ គឺជួយទប់ស្កាត់មិនឱ្យចំណេះដឹងទាំងនេះត្រូវបាត់បង់ ជាពិសេសបន្ទាប់ពីសិល្បៈ និងប្រពៃណីវប្បធម៌កម្ពុជា ត្រូវបានរងការបំផ្លិចបំផ្លាញយ៉ាងធ្ងន់ធ្ងរ ក្នុងអំឡុងរបបខ្មែរក្រហម។",
    emptySubtitle: "រកមិនឃើញលទ្ធផល",
    curatorValue: "កែវ ផ្លីនា",
    provinceValue: "ភ្នំពេញ, កម្ពុជា",
    sourceValue: "អ្នកចាស់ទុំ អ្នកសម្តែងយីកេ និងឯកសារបោះពុម្ពអំពីសិល្បៈសម្តែងខ្មែរ",
  },
};

const styles = {
  header: { position: "sticky", top: 0, zIndex: 40, width: "100%", background: "var(--page-bg)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "transparent", transition: "box-shadow 250ms ease, border-color 250ms ease" },
  headerScrolled: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)", boxShadow: "0 8px 24px var(--shadow)" },
  headerInner: { width: contentWidth, margin: "0 auto", padding: "16px 0 13px" },
  headerTop: { display: "grid", gridTemplateColumns: "1fr minmax(280px, 520px) auto", alignItems: "start", gap: "clamp(20px, 5vw, 90px)" },
  wordmark: { fontFamily: fontSans, fontWeight: 600, fontSize: 24, color: "var(--ink)", margin: 0, lineHeight: 1.1 },
  searchWrap: { minWidth: 0 },
  searchField: { position: "relative", display: "flex", alignItems: "center", borderBottom: "1px solid var(--ink-soft)" },
  searchInput: { width: "100%", padding: "5px 0 8px 36px", border: 0, background: "transparent", color: "var(--ink)", fontFamily: fontSans, fontWeight: 400, fontSize: 15, outline: "none" },
  searchButton: { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, padding: 0, border: 0, background: "transparent", cursor: "pointer", opacity: 1, transition: "opacity 220ms ease, transform 220ms ease" },
  searchSpinner: { width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--ink-soft)", borderTopColor: "var(--gold)", borderRightColor: "var(--gold)" },
  clearBtn: { position: "absolute", right: 0, width: 24, height: 24, border: 0, background: "transparent", color: "var(--ink-soft)", cursor: "pointer", fontSize: 14 },
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
  .yk-search-spinner { display: inline-block; }
  .yk-back-top { opacity: 0; pointer-events: none; transform: translateY(8px); transition: opacity 220ms ease, transform 220ms ease; }
  .yk-back-top.is-visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
  @media (prefers-reduced-motion: no-preference) {
    .yk-search-spinner { animation: yk-search-spin 0.9s linear infinite; }
    @keyframes yk-search-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .yk-reveal { opacity: 0; transform: translateY(28px); transition: opacity 700ms ease, transform 700ms ease; }
    .yk-reveal.is-visible { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .yk-search-spinner { animation: none; }
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
    ...(entry.phases || []).flatMap((phase) => [phase.num, phase.phase, phase.title, phase.kh, phase.text, phase.textKh]),
    ...(entry.characters || []).flatMap((character) => [character.role, character.kh, character.tag, character.text, character.textKh]),
    ...(entry.garments || []).flatMap((garment) => [garment.name, garment.kh, garment.text, garment.textKh]),
  ];

  return [
    entry.title,
    entry.titleKh,
    entry.description,
    entry.descriptionKh,
    entry.category,
    entry.contributor,
    entry.place,
    ...nestedText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function getLanguageLabel(language) {
  return language === "kh" ? "KH" : "EN";
}

export default function Home() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [language, setLanguage] = useState("en");
  const inputRef = useRef(null);
  const searchTimerRef = useRef(null);
  const searchIconSrc = theme === "dark" ? "/entries/search-icon-sand.png" : "/entries/search-icon.png";

  useEffect(() => {
    const stored = window.localStorage.getItem("yike-language");
    if (stored === "en" || stored === "kh") {
      setLanguage(stored);
      document.documentElement.lang = stored;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("yike-language", language);
    } catch (_) {}
    document.documentElement.lang = language;
  }, [language]);

  const filterEntries = (rawText) => {
    const normalized = rawText.trim().toLocaleLowerCase();
    const searchTerms = normalized.split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return entries;
    return entries.filter((entry) => {
      const searchableText = getEntrySearchText(entry);
      return searchTerms.every((term) => searchableText.includes(term));
    });
  };

  const commitSearch = (nextQuery = query) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setShowSuggestions(false);
    setIsSearching(true);
    searchTimerRef.current = setTimeout(() => {
      setCommittedQuery(nextQuery);
      setIsSearching(false);
      searchTimerRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

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
      if (event.key === "Escape" && document.activeElement === inputRef.current) { setQuery(""); setCommittedQuery(""); setShowSuggestions(false); inputRef.current?.blur(); }
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
  }, [committedQuery]);

  const t = translations[language] || translations.en;
  const heroMeta = language === "kh"
    ? {
        curator: t.curatorValue || "កែវ ផល្នា",
        province: t.provinceValue || "ភ្នំពេញ កម្ពុជា",
        source: t.sourceValue || "អ្នកចាស់ទុំ និងអ្នកសម្តែងយីកេ",
      }
    : {
        curator: collection.curator,
        province: collection.province,
        source: collection.source,
      };
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const suggestionResults = normalizedQuery ? entries.filter((entry) => {
    const searchableText = getEntrySearchText(entry);
    return searchableText.includes(normalizedQuery);
  }) : [];
  const isSearchActive = committedQuery.trim().length > 0;
  const filtered = filterEntries(committedQuery);

  const clearSearch = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setIsSearching(false);
    setQuery("");
    setCommittedQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getDisplayTitle = (entry) => {
    if (language === "kh" && entry.titleKh) return entry.titleKh;
    return entry.title;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      <a className="yk-skip-link" href="#main">Skip to entries</a>
      <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}>
        <div className="yk-header-inner" style={styles.headerInner}>
          <div className="yk-header-top" style={styles.headerTop}>
            <p className="yk-wordmark" style={styles.wordmark}>{t.wordmark}</p>
            <form className="yk-search-wrap" style={styles.searchWrap} role="search" onSubmit={(event) => { event.preventDefault(); commitSearch(); }}>
              <label htmlFor="archive-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{t.searchLabel}</label>
              <div style={styles.searchField}>
                <input id="archive-search" ref={inputRef} type="search" value={query} onChange={(event) => { const nextValue = event.target.value; setQuery(nextValue); setShowSuggestions(nextValue.trim().length > 0); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); commitSearch(event.currentTarget.value); } }} placeholder={t.searchPlaceholder} className="yk-search-input" style={styles.searchInput} autoComplete="off" />
                <button type="button" aria-label={t.searchLabel} onClick={() => commitSearch()} style={styles.searchButton}>
                  {isSearching ? <span className="yk-search-spinner" style={styles.searchSpinner} aria-hidden="true" /> : <Image src={searchIconSrc} alt="" width={18} height={18} priority={false} style={{ display: "block", opacity: 1 }} />}
                </button>
                {query ? <button type="button" className="yk-clear-btn" style={styles.clearBtn} onClick={clearSearch} aria-label={t.clearSearch}>x</button> : null}
              </div>
              {showSuggestions && normalizedQuery && suggestionResults.length > 0 && <>
                <p style={styles.resultLabel}>{t.matchingEntries}</p>
                <ul style={styles.resultLinks} aria-label={t.matchingEntries}>
                  {suggestionResults.map((entry, index) => {
                    const suggestionLabel = getDisplayTitle(entry);
                    return (
                      <li style={styles.resultItem} key={`${entry.title}-${index}`}>
                        <a className="yk-result-link" style={styles.resultLink} href="#" onClick={(event) => { event.preventDefault(); setQuery(suggestionLabel); commitSearch(suggestionLabel); }}>
                          <span style={styles.resultNumber}>{String(index + 1).padStart(2, "0")}</span>
                          <span style={styles.resultInfo}><span>{suggestionLabel}</span>{language === "kh" && entry.titleKh ? <span className="yk-result-khmer" style={styles.resultKhmer}>{entry.titleKh}</span> : null}</span>
                          {entry.category && <span style={styles.resultCategory}>{entry.category}</span>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>}
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="button" onClick={() => setLanguage((current) => (current === "en" ? "kh" : "en"))} aria-label="Language toggle" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 54, height: 32, border: "1px solid var(--surface-border)", borderRadius: 999, background: "var(--surface)", color: "var(--ink)", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", fontFamily: fontSans, boxShadow: "0 0 0 1px var(--surface-border)" }}>
                {getLanguageLabel(language)}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {!isSearchActive && <section style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.kicker}>{t.kicker}</p>
          <h1 className="yk-hero-title" style={styles.heroTitle}>{t.heroTitle}</h1>
          <p style={styles.heroDescription}>{t.heroDescription}</p>
          <div style={styles.metaRow}>
            <div className="yk-meta" style={{ ...styles.meta, ...styles.metaFirst }}><p style={styles.metaLabel}>{t.curatedBy}</p><p style={styles.metaValue}>{heroMeta.curator}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>{t.province}</p><p style={styles.metaValue}>{heroMeta.province}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>{t.source}</p><p style={styles.metaValue}>{heroMeta.source}</p></div>
          </div>
        </div>
      </section>}

      <main id="main" style={styles.main}>
        <section aria-labelledby="latest-heading">
          <div style={styles.sectionHeader}><h2 id="latest-heading" style={styles.sectionTitle}>{t.latestEntries}</h2><span style={styles.countPill} aria-label={`${filtered.length} entries`}>{filtered.length}</span></div>
          {filtered.length > 0 ? <div style={styles.entryList}>{filtered.map((entry, index) => <EntryCard key={entry.id || entry.title || index} entryId={`entry-${index + 1}`} entryNumber={String(index + 1)} {...entry} language={language} />)}</div> : <div style={styles.empty}><h2 style={styles.emptyTitle}>{language === "kh" ? `គ្មានឯកសារណាមួយត្រូវនឹង “${committedQuery || query}”` : `No entries match “${committedQuery || query}”`}</h2><p style={styles.emptyKh}>{t.emptySubtitle}</p><button type="button" className="yk-empty-clear" style={styles.emptyClear} onClick={clearSearch}>{t.clearSearch}</button></div>}
        </section>
        <footer style={styles.footer}>{language === "kh" ? "កំណត់ត្រាដែលកំពុងរីកចម្រើនអំពីយីកេ ដែលត្រូវបានសាងសង់ដោយក្តីស្រមៃ និងការយកចិត្តទុកដាក់ក្នុង ICT 340 នៅมหาวิทยาลัยអាមេរិកខេត្តភ្នំពេញ ប្រចាំឆ្នាំ 2026." : "A growing record of Yike, built with care in ICT 340 at the American University of Phnom Penh, Fall 2026."} <span>· {entries.length} entries</span></footer>
      </main>
      <button type="button" className={`yk-back-top${showTop ? " is-visible" : ""}`} style={styles.topButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </>
  );
}
