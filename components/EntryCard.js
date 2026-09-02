// ============================================================
//  EntryCard
//
//  Renders a single Yike archive entry: its title, a short
//  description, the person or community who contributed it,
//  and the place the entry belongs to.
// ============================================================

import Image from "next/image";

const styles = {
  card: {
    padding: 24,
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
  },
  photoWrap: {
    position: "relative",
    width: "100%",
    height: 320,
    borderRadius: 8,
    overflow: "hidden",
    margin: "0 0 20px",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Arial Black', sans-serif",
    margin: "0 0 12px",
  },
  description: {
    fontSize: 16,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "0 0 20px",
  },
  label: {
    fontSize: 12,
    color: "#97A1B3",
    margin: "12px 0 0",
  },
  value: {
    fontSize: 16,
    margin: "6px 0 0",
  },
};

export default function EntryCard({ title, description, contributor, place, photo }) {
  return (
    <article style={styles.card}>
      {photo && (
        <div style={styles.photoWrap}>
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(max-width: 720px) 100vw, 720px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>

      <p style={styles.label}>CONTRIBUTED BY</p>
      <p style={styles.value}>{contributor}</p>

      <p style={styles.label}>PLACE</p>
      <p style={styles.value}>{place}</p>
    </article>
  );
}
