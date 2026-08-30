import collection from "../collection.config.js";
import EntryCard from "../components/EntryCard.js";

const styles = {
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "80px 24px",
  },
  kicker: {
    fontFamily: "'Courier New', Montserrat",
    color: "#9e1212",
    fontSize: 14,
    letterSpacing: 1,
  },
  title: {
    fontSize: 52,
    fontWeight: 700,
    margin: "16px 0 12px",
    lineHeight: 1.1,
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    marginTop: 48,
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#97A1B3",
    margin: 0,
  },
  cardValue: {
    fontSize: 16,
    margin: "6px 0 0",
  },
  section: {
    marginTop: 64,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 14,
    color: "#FFB703",
    marginTop: 48,
  },
  footer: {
    marginTop: 64,
    paddingTop: 24,
    borderTop: "1px solid #2E3644",
    fontSize: 13,
    color: "#5A6373",
  },
};

export default function Home() {
  return (
    <main style={styles.wrap}>
      <p style={styles.kicker}>KHMER LIVING ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.card}>
        <p style={styles.cardLabel}>CURATED BY</p>
        <p style={styles.cardValue}>{collection.curator}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>SOURCE</p>
        <p style={styles.cardValue}>{collection.source}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.cardLabel}>PROVINCE</p>
        <p style={styles.cardValue}>{collection.province}</p>
      </div>

      <section style={styles.section}>
        <p style={styles.cardLabel}>LATEST ENTRY</p>
        <div style={{ marginTop: 16 }}>
          <EntryCard
            title="History & Cultural Context of Lakhon Yike"
            description="A foundational historical narrative detailing the origins, development, and cultural evolution of Lakhon Yike in Cambodia. It explores historical connections with Cham/Malay musical traditions, its flourishing in rural communities (particularly in Takeo province), royal patronage during the 20th century, and resilience in the post-1979 cultural reconstruction era."
            contributor="Royal University of Fine Arts (RUFA)"
            place="Cambodia"
            photo="/entries/entry1.jpg"
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <EntryCard
            title="Performance Structure, Staging & Movement"
            description="Documentation of traditional Yike performance structures and choreographic movement. This entry covers the ritualistic opening ceremony (Hom Rong), the invocation of ancestral teachers, stage geography, vocal call-and-response dynamics, and ensemble cast organization (typically ranging from 12 to 25 performers including actors, musicians, and chorus)."
            contributor="Yike - Wikipedia"
            place="Cambodia"
            photo="/entries/entry2.png"
          />
        </div>
      </section>

      <p style={styles.count}>entries in the archive: 2 (for now)</p>

      <footer style={styles.footer}>
        A growing record of Yike, built with care in ICT 340 at the American
        University of Phnom Penh, Fall 2026.
      </footer>
    </main>
  );
}
