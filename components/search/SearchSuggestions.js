"use client";

import { useEffect } from "react";

const MAX_SHOWN = 8;
const fontSans = "var(--font-google-sans), sans-serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";
const KHMER = /[ក-៿]/;

const styles = {
  panel: { position: "absolute", top: "calc(100% + 10px)", left: 0, right: 0, zIndex: 50, padding: 6, background: "var(--surface)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-2)", maxHeight: "min(60vh, 440px)", overflowY: "auto", overscrollBehavior: "contain" },
  head: { display: "flex", justifyContent: "space-between", padding: "8px 12px 6px", color: "var(--gold)", font: `600 10px ${fontSans}`, letterSpacing: ".08em", textTransform: "uppercase" },
  count: { color: "var(--ink-soft)" },
  list: { margin: 0, padding: 0, listStyle: "none" },
  item: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer" },
  title: { display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, color: "var(--ink)", font: `500 14px/1.4 ${fontSans}` },
  secondary: { display: "block", marginTop: 2, overflow: "hidden", color: "var(--ink-soft)", font: `400 13px/1.6 ${fontSans}`, textOverflow: "ellipsis", whiteSpace: "nowrap" },
  category: { padding: "3px 9px", border: "1px solid var(--rule)", borderRadius: "var(--radius-pill)", color: "var(--ink-soft)", font: `600 10px ${fontSans}`, letterSpacing: ".04em", whiteSpace: "nowrap" },
  mark: { background: "transparent", color: "inherit", fontWeight: 700, textDecoration: "underline", textDecorationColor: "var(--gold)", textDecorationThickness: 2, textUnderlineOffset: 3 },
  foot: { margin: "4px 0 0", padding: "9px 12px 5px", borderTop: "1px solid var(--rule)", color: "var(--ink-soft)", font: `400 12px ${fontSans}` },
};

const withKhmerFont = (text, style) => (KHMER.test(text) ? { ...style, fontFamily: fontKhmer } : style);

// Underlines the typed text inside a title. Khmer titles are left untouched:
// cutting a Khmer word into separate elements can split a consonant from its
// subscript or vowel sign and break how the word is drawn.
function highlight(text, query) {
  const q = query.trim().toLocaleLowerCase();
  const lower = text.toLocaleLowerCase();
  const at = q && !KHMER.test(text) && lower.length === text.length ? lower.indexOf(q) : -1;
  if (at < 0) return text;
  return <>{text.slice(0, at)}<mark style={styles.mark}>{text.slice(at, at + q.length)}</mark>{text.slice(at + q.length)}</>;
}

// The floating list under the search box. It only shows suggestions; app/page.js
// owns the query, the highlighted row (activeIndex) and what a pick does.
export default function SearchSuggestions({ id, results, query, language, activeIndex, onPick, onHover, labels }) {
  const shown = results.slice(0, MAX_SHOWN);

  useEffect(() => {
    if (activeIndex >= 0) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [id, activeIndex]);

  return (
    <div className="yk-suggest" style={styles.panel}>
      <div style={styles.head} aria-hidden="true"><span>{labels.matchingEntries}</span><span style={styles.count}>{results.length}</span></div>
      <ul id={id} role="listbox" aria-label={labels.matchingEntries} style={styles.list}>
        {shown.map((entry, index) => {
          const primary = language === "kh" && entry.titleKh ? entry.titleKh : entry.title;
          const secondary = language === "kh" ? (entry.titleKh ? entry.title : "") : entry.titleKh;
          return (
            <li key={entry.id || `${entry.title}-${index}`} id={`${id}-${index}`} role="option" aria-selected={index === activeIndex} className="yk-suggest-item" style={styles.item}
              onMouseDown={(event) => event.preventDefault()} onClick={() => onPick(entry)} onMouseEnter={() => onHover(index)}>
              <span style={{ minWidth: 0 }}>
                <span className="yk-suggest-title" style={withKhmerFont(primary, styles.title)}>{highlight(primary, query)}</span>
                {secondary ? <span style={withKhmerFont(secondary, styles.secondary)}>{secondary}</span> : null}
              </span>
              {entry.category ? <span style={styles.category}>{entry.category}</span> : null}
            </li>
          );
        })}
      </ul>
      {results.length > MAX_SHOWN ? <p style={styles.foot}>{labels.seeAll(results.length)}</p> : null}
    </div>
  );
}

export { MAX_SHOWN };
