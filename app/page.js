import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";
import entries from "../data/data_entries.js";
import ThemeToggle from "./ThemeToggle.js";
import {
  fraunces,
  sourceSerif4,
  ibmPlexMono,
} from "../app/fonts.js";

const COLOR_TRANSITION =
  "background-color 450ms cubic-bezier(.4,0,.2,1), color 450ms cubic-bezier(.4,0,.2,1), border-color 450ms cubic-bezier(.4,0,.2,1)";

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
    fontFamily: ibmPlexMono.className,
    color: "#9e1212",
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    margin: 0,
  },
  title: {
    fontFamily: fraunces.className,
    fontSize: 52,
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: "16px 0 12px",
    lineHeight: 1.1,
    transition: COLOR_TRANSITION,
  },
  description: {
    fontFamily: sourceSerif4.className,
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
    fontFamily: ibmPlexMono.className,
    fontSize: 12,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: 0,
    transition: COLOR_TRANSITION,
  },
  cardValue: {
    fontFamily: sourceSerif4.className,
    fontSize: 16,
    color: "var(--text-primary)",
    margin: "6px 0 0",
    transition: COLOR_TRANSITION,
  },
  section: {
    marginTop: 64,
  },
  count: {
    fontFamily: ibmPlexMono.className,
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
    fontFamily: sourceSerif4.className,
    transition: COLOR_TRANSITION,
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
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
        {entries.map((entry, index) => (
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
        ))}
      </section>

      <p style={styles.count}>entries in the archive: 2 (for now)</p>

      <footer style={styles.footer}>
        A growing record of Yike, built with care in ICT 340 at the American
        University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}
