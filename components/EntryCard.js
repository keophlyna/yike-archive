import Image from "next/image";

const fontSans = "var(--font-google-sans), sans-serif";
const fontSerif = "var(--font-google-sans), sans-serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";

const cardTranslations = {
  en: {
    source: "Source",
    place: "Place",
    photographPending: "Photograph pending",
    imageToBeAdded: "Image to be added",
    performanceStudy: "Performance study",
    dramaticPhases: "The Four Dramatic Phases",
    costumeStudy: "Costume study",
    characterArchetypes: "Character Archetypes",
    materialLanguage: "Material language",
    keyGarmentSymbolism: "Key Garment Symbolism",
    arena: "In-The-Round Staging",
    audience: "Audience",
    musicians: "Musicians",
    actionArea: "Action Area / Rom Kbach",
    archiveEntry: "Archive entry",
  },
  kh: {
    source: "ប្រភព",
    place: "ទីតាំង",
    photographPending: "រូបថតកំពុងរង់ចាំ",
    imageToBeAdded: "រូបភាពត្រូវបន្ថែម",
    performanceStudy: "ការសិក្សាเกี่ยวกับការសម្តែង",
    dramaticPhases: "ជំហានសម្តែងទាំង ៤",
    costumeStudy: "ការសិក្សាអំពីសម្លៀកបំពាក់",
    characterArchetypes: "តួអង្គនិងនិមិត្តសញ្ញា",
    materialLanguage: "ភាសា និងវត្ថុធាតុ",
    keyGarmentSymbolism: "និមិត្តសញ្ញាសម្លៀកបំពាក់",
    arena: "ទីលានសម្តែងជុំវិញ",
    audience: "ទស្សនិកជន",
    musicians: "អ្នកតន្ត្រី",
    actionArea: "តំបន់សកម្មភាព / រាំក្បាច់",
    archiveEntry: "ធាតុបណ្ណសារ",
  },
};

const styles = {
  card: { display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "clamp(28px, 5vw, 72px)", padding: "clamp(48px, 7vh, 96px) 0", borderBottom: "1px solid var(--rule)" },
  media: { position: "relative", width: "100%", height: "clamp(360px, 60vh, 720px)", overflow: "hidden" },
  placeholder: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--ink-soft)" },
  placeholderCategory: { margin: 0, font: `600 clamp(28px, 4vw, 52px) ${fontSerif}`, color: "var(--ink)" },
  placeholderCaption: { margin: "12px 0 0", font: `400 12px ${fontSans}`, color: "var(--ink-soft)" },
  text: { alignSelf: "center", maxWidth: 620 },
  folio: { margin: 0, color: "var(--gold)", font: `700 clamp(52px, 8vw, 96px)/.8 ${fontSerif}` },
  category: { margin: "30px 0 12px", font: `600 12px ${fontSans}`, letterSpacing: ".08em" },
  title: { margin: 0, color: "var(--ink)", font: `600 clamp(28px, 3.1vw, 40px)/1.1 ${fontSerif}` },
  titleKh: { margin: "12px 0 0", color: "var(--ink)", font: `600 clamp(23px, 2.5vw, 34px)/1.35 ${fontKhmer}` },
  rule: { width: 44, height: 2, margin: "28px 0", border: 0, background: "var(--gold)" },
  description: { maxWidth: "56ch", margin: 0, color: "var(--ink-soft)", font: `400 16px/1.7 ${fontSans}` },
  footer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--rule)" },
  footerLabel: { margin: 0, color: "var(--ink-soft)", font: `600 11px ${fontSans}`, letterSpacing: ".06em" },
  footerValue: { margin: "5px 0 0", color: "var(--ink)", font: `500 14px/1.4 ${fontSans}` },
  featureSection: { gridColumn: "1 / -1", order: 3, paddingTop: "clamp(28px, 5vh, 72px)" },
  featureHeading: { margin: 0, color: "var(--ink)", font: `600 clamp(28px, 3vw, 42px)/1 ${fontSerif}` },
  featureKicker: { margin: "0 0 10px", color: "var(--gold)", font: `600 11px ${fontSans}`, letterSpacing: ".08em", textTransform: "uppercase" },
  featureIntro: { maxWidth: "56ch", margin: "14px 0 0", color: "var(--ink-soft)", font: `400 16px/1.7 ${fontSans}` },
  timeline: { position: "relative", display: "grid", gap: "clamp(28px, 5vw, 72px)", marginTop: "clamp(28px, 5vh, 56px)" },
  timelineLine: { position: "absolute", top: 0, bottom: 0, left: 11, width: 1, background: "var(--rule)", transformOrigin: "top", zIndex: 0 },
  timelineItem: { position: "relative", display: "grid", gridTemplateColumns: "minmax(180px, .7fr) 1.3fr", gap: "clamp(28px, 5vw, 72px)", paddingLeft: 40 },
  timelineMarker: { position: "absolute", top: 4, left: 0, width: 24, height: 24, border: "1px solid var(--rule)", background: "var(--page-bg)", zIndex: 1 },
  featureTitle: { margin: 0, color: "var(--ink)", font: `600 clamp(22px, 2.4vw, 32px)/1.15 ${fontSerif}` },
  featureKhmer: { margin: "9px 0 0", color: "var(--ink-soft)", font: `400 clamp(16px, 1.6vw, 21px)/1.4 ${fontKhmer}` },
  featureDescription: { maxWidth: "56ch", margin: "14px 0 0", color: "var(--ink-soft)", font: `400 15px/1.7 ${fontSans}` },
  featurePhoto: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "clamp(180px, 22vw, 300px)", minHeight: 0, aspectRatio: "4 / 3", overflow: "hidden", background: "var(--surface)", border: "1px solid var(--surface-border)", color: "var(--ink-soft)" },
  featurePhotoText: { margin: 0, font: `600 16px ${fontSerif}`, textAlign: "center" },
  featurePhotoCaption: { margin: "7px 0 0", font: `400 11px ${fontSans}`, textAlign: "center" },
  stagingBlock: { display: "grid", gridTemplateColumns: "minmax(260px, .8fr) 1.2fr", gap: "clamp(28px, 5vw, 72px)", alignItems: "center", marginTop: "clamp(48px, 7vh, 96px)", paddingTop: "clamp(28px, 5vh, 56px)", borderTop: "1px solid var(--rule)" },
  arena: { position: "relative", width: "min(100%, 420px)", aspectRatio: "1", margin: "0 auto", border: "1px solid var(--rule)", borderRadius: "50%" },
  arenaCenter: { position: "absolute", top: "50%", left: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "42%", aspectRatio: "1", padding: 12, border: "1px solid var(--gold)", borderRadius: "50%", background: "var(--surface)", color: "var(--ink)", transform: "translate(-50%, -50%)", textAlign: "center", font: `600 13px/1.3 ${fontSans}` },
  arenaLabel: { position: "absolute", color: "var(--ink-soft)", font: `600 11px ${fontSans}`, letterSpacing: ".06em" },
  stagingCopy: { maxWidth: "56ch" },
  stagingLead: { margin: 0, color: "var(--ink)", font: `600 clamp(21px, 2.3vw, 30px)/1.25 ${fontSerif}` },
  stagingText: { margin: "16px 0 0", color: "var(--ink-soft)", font: `400 15px/1.7 ${fontSans}` },
  archetypeGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(16px, 2.5vw, 32px)", marginTop: "clamp(28px, 5vh, 56px)" },
  archetypeCard: { minWidth: 0, paddingTop: 18, borderTop: "2px solid var(--red)" },
  archetypeTag: { display: "inline-block", margin: "16px 0 0", color: "var(--ink-soft)", font: `600 11px ${fontSans}`, letterSpacing: ".05em" },
  garmentGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(16px, 2.5vw, 32px)", marginTop: "clamp(28px, 5vh, 56px)" },
  garmentCard: { position: "relative", minWidth: 0, overflow: "hidden", paddingTop: 18, borderTop: "2px solid var(--gold)" },
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
  @media (prefers-reduced-motion: no-preference) {
    .ec-feature-section.is-visible .ec-timeline-line { transform: scaleY(1); transition: transform 700ms ease; }
    .ec-timeline-line { transform: scaleY(0); }
    .ec-phase.yk-reveal, .ec-archetype.yk-reveal { transition: opacity 700ms ease, transform 240ms ease, box-shadow 240ms ease; }
    .ec-phase:nth-of-type(2), .ec-archetype:nth-child(2) { transition-delay: 100ms; }
    .ec-phase:nth-of-type(3), .ec-archetype:nth-child(3) { transition-delay: 200ms; }
    .ec-phase:nth-of-type(4), .ec-archetype:nth-child(4) { transition-delay: 300ms; }
    .ec-phase:hover, .ec-archetype:hover { transform: translateY(-4px) rotate(.5deg); box-shadow: 0 8px 20px var(--shadow); }
    .ec-garment.yk-reveal { opacity: 0; transform: translateY(28px) scale(.96); transition: opacity 800ms ease, transform 260ms ease, box-shadow 240ms ease; }
    .ec-garment.yk-reveal.is-visible { opacity: 1; transform: translateY(0) scale(1); }
    .ec-garment:nth-child(2) { transition-delay: 130ms; }
    .ec-garment:nth-child(3) { transition-delay: 260ms; }
    .ec-garment:nth-child(4) { transition-delay: 390ms; }
    .ec-garment::after { position: absolute; top: 0; left: -120%; width: 70%; height: 100%; background: linear-gradient(115deg, transparent, color-mix(in srgb, var(--gold) 18%, transparent), transparent); content: ""; pointer-events: none; transform: skewX(-18deg); }
    .ec-garment:hover { transform: translateY(-4px) scale(1) !important; box-shadow: 0 8px 20px var(--shadow); }
    .ec-garment:hover::after { left: 150%; transition: left 700ms ease; }
    .ec-arena { animation: ec-arena-pulse 5s ease-in-out infinite; }
    @keyframes ec-arena-pulse {
      0%, 100% { box-shadow: 0 0 0 transparent; }
      50% { box-shadow: 0 0 18px var(--gold); }
    }
  }
  @media (max-width: 860px) {
    .ec-phase { grid-template-columns: minmax(150px, .7fr) 1.3fr !important; }
    .ec-staging { grid-template-columns: 1fr !important; }
    .ec-arena { max-width: 360px; }
    .ec-archetype-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .ec-garment-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .ec-phase-photo, .ec-archetype .ec-feature-photo, .ec-garment .ec-feature-photo { height: clamp(180px, 28vw, 260px) !important; }
  }
  @media (max-width: 520px) {
    .ec-phase { grid-template-columns: 1fr !important; padding-left: 34px !important; }
    .ec-phase-photo, .ec-archetype .ec-feature-photo, .ec-garment .ec-feature-photo { height: clamp(180px, 58vw, 260px) !important; }
    .ec-archetype-grid { grid-template-columns: 1fr !important; }
    .ec-garment-grid { grid-template-columns: 1fr !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ec-garment.yk-reveal { opacity: 1; transform: none; }
    .ec-garment::after { display: none; }
  }
`;

function PendingPhoto({ className = "", photo, alt = "", language = "en" }) {
  const text = cardTranslations[language] || cardTranslations.en;
  return (
    <div className={className} style={styles.featurePhoto}>
      {photo ? <Image src={photo} alt={alt} fill sizes="(max-width: 860px) 90vw, 25vw" style={{ objectFit: "cover" }} /> : <div><p style={styles.featurePhotoText}>{text.photographPending}</p><p style={styles.featurePhotoCaption}>{text.imageToBeAdded}</p></div>}
    </div>
  );
}

function PerformanceSection({ accent, phases, language = "en" }) {
  const alternateAccent = accent === "var(--red)" ? "var(--jade)" : "var(--red)";
  const text = cardTranslations[language] || cardTranslations.en;
  const arenaDescription = language === "kh"
    ? [
        "ខុសពីឆាកល្ខោនបែបបស្ចិមប្រទេស ឬឆាកសម្តែងផ្លូវការក្នុងរាជវាំង ជាប្រពៃណី ល្ខោនយីកេតែងតែត្រូវបានសម្តែងនៅលើទីធ្លារាងជារង្វង់បើកចំហ។",
        "ការរៀបចំជាទម្រង់ ៣៦០ ដឺក្រេនេះ បានលុបបំបាត់នូវរបាំងរវាងតួសម្តែង និងអ្នកភូមិទូទៅ។ ក្រុមតន្ត្រីករអង្គុយនៅជាប់នឹងទីតាំងសម្តែង ដែលអនុញ្ញាតឱ្យអ្នកវាយស្គរមេ អាចតម្រូវចង្វាក់នៃការសម្តែងបានភ្លាមៗយ៉ាងរស់រវើក ផ្អែកទៅតាមប្រតិកម្មផ្ទាល់របស់ទស្សនិកជន។",
      ]
    : [
        "Unlike Western proscenium arches or formal court stages, Lakhon Yike is traditionally performed in an open arena circle.",
        "This 360-degree layout removes boundaries between actors and common villagers. Musicians sit adjacent to the acting space, allowing the lead Skor Mei drummer to dynamically adjust performance tempo based on live audience reactions.",
      ];

  return (
    <section className="ec-feature-section yk-reveal" style={styles.featureSection} aria-labelledby="dramatic-phases-heading">
      <p style={styles.featureKicker}>{text.performanceStudy}</p>
      <h3 id="dramatic-phases-heading" style={{ ...styles.featureHeading, color: accent }}>{text.dramaticPhases}</h3>
      <div className="ec-timeline" style={styles.timeline}>
        <span className="ec-timeline-line" style={styles.timelineLine} aria-hidden="true" />
        {phases.map((phase, index) => { const phaseAccent = index % 2 === 0 ? accent : alternateAccent; const displayTitle = language === "kh" && phase.kh ? phase.kh : phase.title; const displayText = language === "kh" && phase.textKh ? phase.textKh : phase.text; return <article className="ec-phase yk-reveal" style={styles.timelineItem} key={phase.title}>
          <span className="ec-phase-marker" style={{ ...styles.timelineMarker, borderColor: phaseAccent }} aria-hidden="true" />
          <PendingPhoto className="ec-phase-photo" photo={phase.photo} alt={displayTitle} language={language} />
          <div><span style={{ ...styles.archetypeTag, color: phaseAccent }}>{phase.num} / {language === "kh" && phase.kh ? phase.kh : phase.phase}</span><h5 style={{ ...styles.featureTitle, color: phaseAccent }}>{displayTitle}</h5>{language === "kh" && phase.kh ? <p style={styles.featureKhmer}>{phase.kh}</p> : null}<p style={styles.featureDescription}>{displayText}</p></div>
        </article>; })}
      </div>
      <div className="ec-staging" style={styles.stagingBlock}>
        <div className="ec-arena" style={styles.arena} aria-label={text.arena}>
          <span style={{ ...styles.arenaLabel, top: "8%", left: "50%", transform: "translateX(-50%)" }}>{text.audience}</span>
          <span style={{ ...styles.arenaLabel, top: "50%", left: "5%", transform: "translateY(-50%)" }}>{text.audience}</span>
          <span style={{ ...styles.arenaLabel, top: "50%", right: "5%", transform: "translateY(-50%)" }}>{text.audience}</span>
          <span style={{ ...styles.arenaLabel, bottom: "8%", left: "50%", transform: "translateX(-50%)" }}>{text.musicians}</span>
          <span className="ec-arena-center" style={styles.arenaCenter}>{text.actionArea}</span>
        </div>
        <div style={styles.stagingCopy}><h5 style={styles.stagingLead}>{text.arena}</h5><p style={styles.stagingText}>{arenaDescription[0]}</p><p style={styles.stagingText}>{arenaDescription[1]}</p></div>
      </div>
    </section>
  );
}

function CostumeSection({ accent, characters, garments, language = "en" }) {
  const alternateAccent = accent === "var(--red)" ? "var(--jade)" : "var(--red)";
  const text = cardTranslations[language] || cardTranslations.en;

  return (
    <section className="ec-feature-section yk-reveal" style={styles.featureSection} aria-labelledby="character-archetypes-heading">
      <p style={styles.featureKicker}>{text.costumeStudy}</p>
      <h3 id="character-archetypes-heading" style={{ ...styles.featureHeading, color: accent }}>{text.characterArchetypes}</h3>
      <div className="ec-archetype-grid" style={styles.archetypeGrid}>{characters.map((character, index) => { const characterAccent = index % 2 === 0 ? accent : alternateAccent; const displayRole = language === "kh" && character.kh ? character.kh : character.role; const displayText = language === "kh" && character.textKh ? character.textKh : character.text; return <article className="ec-archetype yk-reveal" style={{ ...styles.archetypeCard, borderTopColor: characterAccent }} key={character.role}>
        <PendingPhoto photo={character.photo} alt={displayRole} language={language} />
        <h5 style={{ ...styles.featureTitle, marginTop: 20, color: characterAccent }}>{displayRole}</h5>{language === "kh" && character.kh ? <p style={styles.featureKhmer}>{character.kh}</p> : null}<span style={styles.archetypeTag}>{character.tag}</span><p style={styles.featureDescription}>{displayText}</p>
      </article>; })}</div>
      <div className="ec-garments" style={styles.featureSection}>
        <p style={styles.featureKicker}>{text.materialLanguage}</p>
        <h3 style={{ ...styles.featureHeading, color: accent }}>{text.keyGarmentSymbolism}</h3>
        <div className="ec-garment-grid" style={styles.garmentGrid}>{garments.map((garment, index) => { const garmentAccent = index % 2 === 0 ? accent : alternateAccent; const displayName = language === "kh" && garment.kh ? garment.kh : garment.name; const displayText = language === "kh" && garment.textKh ? garment.textKh : garment.text; return <article className="ec-garment yk-reveal" style={{ ...styles.garmentCard, borderTopColor: garmentAccent }} key={garment.name}>
          <PendingPhoto photo={garment.photo} alt={displayName} language={language} />
          <h5 style={{ ...styles.featureTitle, marginTop: 20, color: garmentAccent }}>{displayName}</h5>{language === "kh" && garment.kh ? <p style={styles.featureKhmer}>{garment.kh}</p> : null}<p style={styles.featureDescription}>{displayText}</p>
        </article>; })}</div>
      </div>
    </section>
  );
}

export default function EntryCard({ title, titleKh = "", description, descriptionKh = "", contributor, contributorKh = "", place, placeKh = "", category = "", photo, entryNumber = "1", entryId, phases = [], characters = [], garments = [], language = "en" }) {
  const number = String(parseInt(entryNumber, 10) || 1).padStart(2, "0");
  const isEven = Number(number) % 2 === 0;
  const accent = isEven ? "var(--jade)" : "var(--red)";
  const displayTitle = language === "kh" && titleKh ? titleKh : title;
  const displayDescription = language === "kh" && descriptionKh ? descriptionKh : description;
  const displayContributor = language === "kh" && contributorKh ? contributorKh : contributor;
  const displayPlace = language === "kh" && placeKh ? placeKh : place;
  const translations = cardTranslations[language] || cardTranslations.en;

  return (
    <article id={entryId} className="ec-card yk-reveal" style={styles.card}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      <div className="ec-media" style={{ ...styles.media, ...(photo ? {} : styles.placeholder), order: isEven ? 2 : 1 }}>
        {photo ? <Image src={photo} alt={displayTitle} fill priority={number === "01"} sizes="(max-width: 860px) 90vw, 52vw" style={{ objectFit: "cover" }} /> : <><p style={styles.placeholderCategory}>{category || translations.archiveEntry}</p><p style={styles.placeholderCaption}>{translations.photographPending}</p></>}
      </div>
      <div className="ec-text" style={{ ...styles.text, order: isEven ? 1 : 2 }}>
        <span className="ec-folio" style={styles.folio} aria-hidden="true">{number}</span>
        <span className="ec-category" style={{ ...styles.category, color: accent }}>{category}</span>
        <span className="visually-hidden">Entry {number}</span>
        <h3 className="ec-title" style={styles.title}>{displayTitle}</h3>
        {titleKh && <p className="ec-title-kh" style={styles.titleKh}>{titleKh}</p>}
        <hr style={styles.rule} />
        <p className="ec-description" style={styles.description}>{displayDescription}</p>
        <div className="ec-footer" style={styles.footer}>
          <div><p style={styles.footerLabel}>{translations.source}</p><p style={styles.footerValue}>{displayContributor}</p></div>
          <div><p style={styles.footerLabel}>{translations.place}</p><p style={styles.footerValue}>{displayPlace}</p></div>
        </div>
      </div>
      {category === "Performance" && <PerformanceSection accent={accent} phases={phases} language={language} />}
      {category === "Costume" && <CostumeSection accent={accent} characters={characters} garments={garments} language={language} />}
    </article>
  );
}
