import { cardTranslations } from "./entryCardText.js";
import { styles } from "./entryCardStyles.js";
import PendingPhoto from "./PendingPhoto.js";

export default function PerformanceSection({ accent, phases, language = "en" }) {
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
