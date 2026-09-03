// ============================================================
//  EntryCard
//
//  Renders a single Yike archive entry: its title, Khmer title,
//  category, photo with overlay badges, description, and a
//  two-column Source / Place footer.
// ============================================================

import Image from "next/image";
import {
  fraunces,
  notoSerifKhmer,
  sourceSerif4,
  ibmPlexMono,
} from "../app/fonts.js";

const styles = {
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #D8EAFF",
    borderRadius: 6,
    boxShadow: "0 1px 2px rgba(31, 42, 51, 0.04), 0 4px 12px rgba(31, 42, 51, 0.05)",
    maxWidth: 540,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  photoWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "3 / 2",
    overflow: "hidden",
  },
  photoOverlay: {
    position: "absolute",
    zIndex: 2,
    fontFamily: ibmPlexMono.className,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: "5px 10px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  },
  entryBadge: {
    top: 12,
    left: 12,
    color: "#ffffff",
    backgroundColor: "rgba(31, 42, 51, 0.75)",
  },
  visualBadge: {
    bottom: 12,
    left: 12,
    color: "#1F2A33",
    backgroundColor: "rgba(186, 255, 245, 0.85)",
  },
  body: {
    padding: 30,
    display: "flex",
    flexDirection: "column",
  },
  categoryPill: {
    alignSelf: "flex-start",
    fontFamily: ibmPlexMono.className,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#1F2A33",
    backgroundColor: "#BAFFF5",
    padding: "4px 10px",
    borderRadius: 999,
    margin: "0 0 14px",
  },
  title: {
    fontFamily: fraunces.className,
    fontSize: 23,
    fontWeight: 600,
    color: "#1F2A33",
    margin: 0,
    lineHeight: 1.25,
  },
  titleKh: {
    fontFamily: notoSerifKhmer.className,
    fontSize: 17.5,
    color: "#1F2A33",
    margin: "4px 0 0",
    lineHeight: 1.4,
  },
  rule: {
    width: 32,
    height: 2,
    backgroundColor: "#FFDBBB",
    border: "none",
    margin: "16px 0",
  },
  description: {
    fontFamily: sourceSerif4.className,
    fontSize: 15.5,
    lineHeight: 1.6,
    color: "#496580",
    margin: 0,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid #D8EAFF",
    display: "flex",
    gap: 24,
  },
  footerCol: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  footerLabel: {
    fontFamily: ibmPlexMono.className,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#496580",
    margin: 0,
  },
  footerValue: {
    fontFamily: sourceSerif4.className,
    fontSize: 14,
    color: "#1F2A33",
    margin: "4px 0 0",
  },
};

const responsiveCss = `
  .ec-card       { box-sizing: border-box; }
  @media (max-width: 600px) {
    .ec-card       { margin: 0 16px; }
    .ec-body       { padding: 18px !important; }
    .ec-title      { font-size: 18px !important; }
    .ec-titleKh    { font-size: 15px !important; }
    .ec-photoOverlay { font-size: 10px !important; }
  }
  @media (max-width: 360px) {
    .ec-footer     { flex-direction: column !important; gap: 16px !important; }
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
  return (
    <article className="ec-card" style={styles.card}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      {photo && (
        <div style={styles.photoWrap}>
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
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(max-width: 540px) 100vw, 540px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="ec-body" style={styles.body}>
        {category && <span style={styles.categoryPill}>{category}</span>}
        <h3 className="ec-title" style={styles.title}>{title}</h3>
        {titleKh && <p className="ec-titleKh" style={styles.titleKh}>{titleKh}</p>}
        <hr style={styles.rule} />
        <p style={styles.description}>{description}</p>

        <div className="ec-footer" style={styles.footer}>
          <div style={styles.footerCol}>
            <p style={styles.footerLabel}>Source</p>
            <p style={styles.footerValue}>{contributor}</p>
          </div>
          <div style={styles.footerCol}>
            <p style={styles.footerLabel}>Place</p>
            <p style={styles.footerValue}>{place}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
