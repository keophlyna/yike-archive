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
    <article style={styles.card}>
      {photo && (
        <div style={styles.photoWrap}>
          {entryNumber && (
            <span style={{ ...styles.photoOverlay, ...styles.entryBadge }}>
              {entryNumber}
            </span>
          )}
          <span style={{ ...styles.photoOverlay, ...styles.visualBadge }}>
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

      <div style={styles.body}>
        {category && <span style={styles.categoryPill}>{category}</span>}
        <h3 style={styles.title}>{title}</h3>
        {titleKh && <p style={styles.titleKh}>{titleKh}</p>}
        <hr style={styles.rule} />
        <p style={styles.description}>{description}</p>

        <div style={styles.footer}>
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
