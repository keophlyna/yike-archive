// ============================================================
//  EntryCard
//
//  Renders a single Yike archive entry as a horizontal split
//  section: photo (or placeholder) on one side, content on the
//  other. Alternates left/right based on entry position. Stacks
//  to a single column on narrow screens.
// ============================================================

import Image from "next/image";
import {
  roboto,
  notoSerifKhmer,
} from "../app/fonts.js";

const COLOR_TRANSITION =
  "background-color 450ms cubic-bezier(.4,0,.2,1), color 450ms cubic-bezier(.4,0,.2,1), border-color 450ms cubic-bezier(.4,0,.2,1)";

const FONT_STACK = '"var(--font-roboto)", "Arial", "sans-serif"';

const styles = {
  card: {
    backgroundColor: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: 6,
    boxShadow: "0 1px 2px rgba(31, 42, 51, 0.04), 0 4px 12px rgba(31, 42, 51, 0.05)",
    maxWidth: 960,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    transition: COLOR_TRANSITION,
  },
  photoWrap: {
    position: "relative",
    width: "50%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    flexShrink: 0,
  },
  photoPlaceholder: {
    position: "relative",
    width: "50%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: "var(--card-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: COLOR_TRANSITION,
  },
  photoOrderLeft: { order: 1 },
  photoOrderRight: { order: 2 },
  bodyOrderLeft: { order: 2 },
  bodyOrderRight: { order: 1 },
  placeholderCategory: {
    fontFamily: FONT_STACK,
    fontSize: 48,
    fontWeight: 700,
    color: "var(--accent-mint)",
    opacity: 0.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    userSelect: "none",
    transition: COLOR_TRANSITION,
  },
  photoOverlay: {
    position: "absolute",
    zIndex: 2,
    fontFamily: FONT_STACK,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: "5px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    transition: COLOR_TRANSITION,
  },
  entryBadge: {
    top: 12,
    left: 12,
    color: "var(--badge-dark-text)",
    backgroundColor: "var(--badge-dark-bg)",
    transition: COLOR_TRANSITION,
  },
  visualBadge: {
    bottom: 12,
    left: 12,
    color: "var(--text-on-accent)",
    backgroundColor: "var(--accent-mint)",
    transition: COLOR_TRANSITION,
  },
  body: {
    width: "50%",
    flex: 1,
    minWidth: 0,
    flexShrink: 0,
    padding: 30,
    display: "flex",
    flexDirection: "column",
  },
  categoryPill: {
    alignSelf: "flex-start",
    fontFamily: FONT_STACK,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "var(--text-on-accent)",
    backgroundColor: "var(--accent-mint)",
    padding: "4px 10px",
    borderRadius: 999,
    margin: "0 0 14px",
    transition: COLOR_TRANSITION,
  },
  title: {
    fontFamily: FONT_STACK,
    fontSize: 23,
    fontWeight: 700,
    color: "var(--text-primary)",
    margin: 0,
    lineHeight: 1.25,
    transition: COLOR_TRANSITION,
  },
  titleKh: {
    fontFamily: notoSerifKhmer.className,
    fontSize: 17.5,
    color: "var(--text-primary)",
    margin: "4px 0 0",
    lineHeight: 1.4,
    transition: COLOR_TRANSITION,
  },
  rule: {
    width: 32,
    height: 2,
    backgroundColor: "var(--accent-peach)",
    border: "none",
    margin: "16px 0",
    transition: COLOR_TRANSITION,
  },
  description: {
    fontFamily: FONT_STACK,
    fontSize: 15.5,
    lineHeight: 1.6,
    color: "var(--text-secondary)",
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid var(--card-border)",
    display: "flex",
    gap: 24,
    transition: COLOR_TRANSITION,
  },
  footerCol: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  footerLabel: {
    fontFamily: FONT_STACK,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "var(--text-secondary)",
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  footerValue: {
    fontFamily: FONT_STACK,
    fontSize: 14,
    color: "var(--text-primary)",
    margin: "4px 0 0",
    transition: COLOR_TRANSITION,
  },
};

const responsiveCss = `
  .ec-card         { box-sizing: border-box; }
  .ec-titleKh      { color: var(--text-primary); }
  [data-theme="dark"] .ec-titleKh { color: var(--accent-peach); }
  [data-theme="dark"] .ec-footerLabel { color: var(--accent-mint); }
  [data-theme="dark"] .ec-categoryPill { color: var(--text-on-accent); }
  @media (max-width: 700px) {
    .ec-card         { flex-direction: column !important; align-items: stretch !important; }
    .ec-photo        { width: 100% !important; aspect-ratio: 3 / 2 !important; order: unset !important; }
    .ec-body         { width: 100% !important; order: unset !important; }
  }
  @media (max-width: 600px) {
    .ec-card         { margin: 0 16px; }
    .ec-body         { padding: 18px !important; }
    .ec-title        { font-size: 18px !important; }
    .ec-titleKh      { font-size: 15px !important; }
    .ec-photoOverlay { font-size: 10px !important; }
  }
  @media (max-width: 360px) {
    .ec-footer       { flex-direction: column !important; gap: 16px !important; }
  }
`;

export default function EntryCard({
  title,
  titleKh = "",
  description,
  contributor,
  place,
  category = "",
  photo,
  entryNumber = "",
}) {
  const isRight =
    (() => {
      const m = /0*(\d+)/.exec(entryNumber || "");
      if (!m) return false;
      const n = parseInt(m[1], 10);
      return n > 0 && n % 2 === 0;
    })();

  return (
    <article className="ec-card" style={styles.card}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      <div
        className="ec-photo"
        style={{
          ...(photo ? styles.photoWrap : styles.photoPlaceholder),
          ...(isRight ? styles.photoOrderRight : styles.photoOrderLeft),
        }}
      >
        {entryNumber && (
          <span
            className="ec-photoOverlay"
            style={{ ...styles.photoOverlay, ...styles.entryBadge }}
          >
            {entryNumber}
          </span>
        )}
        <span
          className="ec-photoOverlay"
          style={{ ...styles.photoOverlay, ...styles.visualBadge }}
        >
          Visual
        </span>
        {photo ? (
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(max-width: 700px) 100vw, 480px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span style={styles.placeholderCategory}>
            {category || "Entry"}
          </span>
        )}
      </div>

      <div
        className="ec-body"
        style={{
          ...styles.body,
          ...(isRight ? styles.bodyOrderLeft : styles.bodyOrderRight),
        }}
      >
        {category && (
          <span className="ec-categoryPill" style={styles.categoryPill}>
            {category}
          </span>
        )}
        <h3 className="ec-title" style={styles.title}>{title}</h3>
        {titleKh && (
          <p className="ec-titleKh" style={styles.titleKh}>{titleKh}</p>
        )}
        <hr style={styles.rule} />
        <p style={styles.description}>{description}</p>

        <div className="ec-footer" style={styles.footer}>
          <div style={styles.footerCol}>
            <p className="ec-footerLabel" style={styles.footerLabel}>Source</p>
            <p style={styles.footerValue}>{contributor}</p>
          </div>
          <div style={styles.footerCol}>
            <p className="ec-footerLabel" style={styles.footerLabel}>Place</p>
            <p style={styles.footerValue}>{place}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
