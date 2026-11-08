import { cardTranslations } from "./entryCardText.js";
import { styles } from "./entryCardStyles.js";
import PendingPhoto from "./PendingPhoto.js";

export default function CostumeSection({ accent, characters, garments, language = "en" }) {
  const alternateAccent = accent === "var(--red)" ? "var(--jade)" : "var(--red)";
  const text = cardTranslations[language] || cardTranslations.en;

  // Contributed entries have no characters or garments yet, so each half only
  // renders when it has cards; otherwise its heading would sit above nothing.
  return (
    <section className="ec-feature-section yk-reveal" style={styles.featureSection} aria-label={text.costumeStudy}>
      {characters.length > 0 ? <>
      <p style={styles.featureKicker}>{text.costumeStudy}</p>
      <h3 style={{ ...styles.featureHeading, color: accent }}>{text.characterArchetypes}</h3>
      <div className="ec-archetype-grid" style={styles.archetypeGrid}>{characters.map((character, index) => { const characterAccent = index % 2 === 0 ? accent : alternateAccent; const displayRole = language === "kh" && character.kh ? character.kh : character.role; const displayText = language === "kh" && character.textKh ? character.textKh : character.text; return <article className="ec-archetype yk-reveal" style={{ ...styles.archetypeCard, borderTopColor: characterAccent }} key={character.role}>
        <PendingPhoto photo={character.photo} alt={displayRole} language={language} />
        <h5 style={{ ...styles.featureTitle, marginTop: 20, color: characterAccent }}>{displayRole}</h5>{language === "kh" && character.kh ? <p style={styles.featureKhmer}>{character.kh}</p> : null}<span style={styles.archetypeTag}>{character.tag}</span><p style={styles.featureDescription}>{displayText}</p>
      </article>; })}</div>
      </> : null}
      {garments.length > 0 ? <div className="ec-garments" style={styles.featureSection}>
        <p style={styles.featureKicker}>{text.materialLanguage}</p>
        <h3 style={{ ...styles.featureHeading, color: accent }}>{text.keyGarmentSymbolism}</h3>
        <div className="ec-garment-grid" style={styles.garmentGrid}>{garments.map((garment, index) => { const garmentAccent = index % 2 === 0 ? accent : alternateAccent; const displayName = language === "kh" && garment.kh ? garment.kh : garment.name; const displayText = language === "kh" && garment.textKh ? garment.textKh : garment.text; return <article className="ec-garment yk-reveal" style={{ ...styles.garmentCard, borderTopColor: garmentAccent }} key={garment.name}>
          <PendingPhoto photo={garment.photo} alt={displayName} language={language} />
          <h5 style={{ ...styles.featureTitle, marginTop: 20, color: garmentAccent }}>{displayName}</h5>{language === "kh" && garment.kh ? <p style={styles.featureKhmer}>{garment.kh}</p> : null}<p style={styles.featureDescription}>{displayText}</p>
        </article>; })}</div>
      </div> : null}
    </section>
  );
}
