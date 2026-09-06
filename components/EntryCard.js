import Image from "next/image";

const fontSans = "var(--font-work-sans), sans-serif";
const fontSerif = "var(--font-fraunces), serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";

const styles = {
  card: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(28px, 5vw, 72px)", padding: "clamp(48px, 7vh, 96px) 0", borderBottom: "1px solid var(--rule)" },
  media: { position: "relative", width: "100%", height: "clamp(360px, 60vh, 720px)", overflow: "hidden" },
  placeholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--ink-soft)" },
  placeholderCategory: { margin: 0, font: `italic 500 clamp(28px, 4vw, 52px) ${fontSerif}`, color: "var(--ink)" },
  placeholderCaption: { margin: "12px 0 0", font: `400 12px ${fontSans}`, color: "var(--ink-soft)" },
  text: { alignSelf: "center", maxWidth: 620 },
  folio: { margin: 0, color: "var(--gold)", font: `300 clamp(52px, 8vw, 96px)/.8 ${fontSerif}`, fontStyle: "italic" },
  category: { margin: "30px 0 12px", font: `600 12px ${fontSans}`, letterSpacing: ".08em" },
  title: { margin: 0, color: "var(--ink)", font: `600 clamp(28px, 3.1vw, 40px)/1.1 ${fontSerif}` },
  titleKh: { margin: "12px 0 0", color: "var(--ink)", font: `600 clamp(23px, 2.5vw, 34px)/1.35 ${fontKhmer}` },
  rule: { width: 44, height: 2, margin: "28px 0", border: 0, background: "var(--gold)" },
  description: { maxWidth: "56ch", margin: 0, color: "var(--ink-soft)", font: `400 16px/1.7 ${fontSans}` },
  footer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--rule)" },
  footerLabel: { margin: 0, color: "var(--ink-soft)", font: `600 11px ${fontSans}`, letterSpacing: ".06em" },
  footerValue: { margin: "5px 0 0", color: "var(--ink)", font: `500 14px/1.4 ${fontSans}` },
};

const responsiveCss = `
  .ec-card { box-sizing: border-box; }
  @media (max-width: 860px) {
    .ec-card { grid-template-columns: 1fr !important; gap: 34px !important; }
    .ec-media { height: clamp(300px, 48vh, 480px) !important; }
    .ec-text { max-width: 680px !important; }
  }
  @media (max-width: 520px) {
    .ec-card { padding: 42px 0 !important; gap: 28px !important; }
    .ec-media { height: clamp(300px, 48vh, 400px) !important; }
    .ec-title { font-size: 28px !important; }
    .ec-title-kh { font-size: 23px !important; }
    .ec-description { font-size: 15px !important; }
    .ec-footer { gap: 14px !important; }
  }
`;

export default function EntryCard({ title, titleKh = "", description, contributor, place, category = "", photo, entryNumber = "1", entryId }) {
  const number = String(parseInt(entryNumber, 10) || 1).padStart(2, "0");
  const isEven = Number(number) % 2 === 0;
  const accent = isEven ? "var(--jade)" : "var(--red)";

  return (
    <article id={entryId} className="ec-card yk-reveal" style={styles.card}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      <div className="ec-media" style={{ ...styles.media, ...(photo ? {} : styles.placeholder), order: isEven ? 2 : 1 }}>
        {photo ? <Image src={photo} alt={title} fill priority={number === "01"} sizes="(max-width: 860px) 90vw, 52vw" style={{ objectFit: "cover" }} /> : <><p style={styles.placeholderCategory}>{category || "Archive entry"}</p><p style={styles.placeholderCaption}>Photograph pending</p></>}
      </div>
      <div className="ec-text" style={{ ...styles.text, order: isEven ? 1 : 2 }}>
        <span className="ec-folio" style={styles.folio} aria-hidden="true">{number}</span>
        <span className="ec-category" style={{ ...styles.category, color: accent }}>{category}</span>
        <span className="visually-hidden">Entry {number}</span>
        <h3 className="ec-title" style={styles.title}>{title}</h3>
        {titleKh && <p className="ec-title-kh" style={styles.titleKh}>{titleKh}</p>}
        <hr style={styles.rule} />
        <p className="ec-description" style={styles.description}>{description}</p>
        <div className="ec-footer" style={styles.footer}>
          <div><p style={styles.footerLabel}>Source</p><p style={styles.footerValue}>{contributor}</p></div>
          <div><p style={styles.footerLabel}>Place</p><p style={styles.footerValue}>{place}</p></div>
        </div>
      </div>
    </article>
  );
}
