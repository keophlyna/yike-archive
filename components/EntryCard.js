import Image from "next/image";
import Link from "next/link";
import EntryActions from "./EntryActions.js";
import "./entry-card.css";
import { cardTranslations } from "./entryCardText.js";
import { styles } from "./entryCardStyles.js";
import { resolveImageSrc } from "./PendingPhoto.js";
import PerformanceSection from "./PerformanceSection.js";
import CostumeSection from "./CostumeSection.js";

export default function EntryCard({ id, canManage, userId, onDeleted, title, titleKh = "", description, descriptionKh = "", contributor, contributorKh = "", sourceText = "", sourceTextKh = "", publishedAt, detail = false, place, placeKh = "", category = "", photo, photoIsAi = false, entryNumber = "1", entryId, phases = [], characters = [], garments = [], language = "en" }) {
  const number = String(parseInt(entryNumber, 10) || 1).padStart(2, "0");
  const isEven = Number(number) % 2 === 0;
  const accent = isEven ? "var(--jade)" : "var(--red)";
  const displayTitle = language === "kh" && titleKh ? titleKh : title;
  const displayDescription = language === "kh" && descriptionKh ? descriptionKh : description;
  const displayContributor = language === "kh" && contributorKh ? contributorKh : contributor;
  const displayPlace = language === "kh" && placeKh ? placeKh : place;
  const translations = cardTranslations[language] || cardTranslations.en;
  const imageSrc = resolveImageSrc(photo);
  const displaySources = language === "kh" && sourceTextKh ? sourceTextKh : sourceText;
  const publishedDate = publishedAt ? new Intl.DateTimeFormat(language === "kh" ? "km-KH" : "en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(publishedAt)) : "";

  return (
    <article id={entryId} className={`ec-card${detail ? " ec-detail-card" : ""} yk-reveal`} style={{ ...styles.card, ...(detail ? styles.detailCard : {}) }}>
      {canManage && <EntryActions entryId={id} userId={userId} title={displayTitle} language={language} onDeleted={onDeleted} />}
      <div className="ec-media" style={{ ...styles.media, ...(imageSrc ? {} : styles.placeholder), ...(detail ? styles.detailMedia : { order: isEven ? 2 : 1 }) }}>
        {imageSrc && photoIsAi ? <span style={styles.aiBadge}>AI-generated image</span> : null}
        {imageSrc ? <Image src={imageSrc} alt={displayTitle} fill priority={number === "01"} sizes="(max-width: 860px) 90vw, 52vw" style={{ objectFit: "cover" }} /> : <><p style={styles.placeholderCategory}>{category || translations.archiveEntry}</p><p style={styles.placeholderCaption}>{translations.photographPending}</p></>}
      </div>
      <div className="ec-text" style={{ ...styles.text, ...(detail ? styles.detailText : { order: isEven ? 1 : 2 }) }}>
        {detail ? <>
          <div className="ec-detail-header" style={styles.detailHeader}>
            <div className="ec-detail-identity" style={styles.detailIdentity}>
              <span className="ec-folio" style={{ ...styles.folio, ...styles.detailFolio }} aria-hidden="true">{number}</span>
              <span className="visually-hidden">Entry {number}</span>
              <span className="ec-category" style={{ ...styles.category, ...styles.detailCategory, color: accent }}>{category}</span>
              <h3 className="ec-title" style={{ ...styles.title, ...styles.detailTitle }}>{displayTitle}</h3>
              {titleKh && <p className="ec-title-kh" style={{ ...styles.titleKh, ...styles.detailTitleKh }}>{titleKh}</p>}
            </div>
            <div className="ec-detail-info" style={styles.detailInfo}>
              {publishedDate ? <p style={styles.published}>{translations.published}: {publishedDate}</p> : null}
              <p style={styles.detailContributor}>{translations.source}: {displayContributor}</p>
            </div>
          </div>
          <hr style={styles.detailRule} />
          <p className="ec-description ec-detail-description" style={{ ...styles.description, ...styles.detailDescription }}>{displayDescription}</p>
          <div className="ec-footer ec-detail-footer" style={{ ...styles.footer, ...styles.detailFooter }}>
            {displaySources ? <div className="ec-detail-sources"><p style={styles.footerLabel}>{translations.sources}</p><p style={{ ...styles.footerValue, whiteSpace: "pre-wrap" }}>{displaySources}</p></div> : null}
            <div className="ec-detail-place" style={styles.detailPlace}><p style={styles.footerLabel}>{translations.place}</p><p style={styles.footerValue}>{displayPlace}</p></div>
          </div>
        </> : <>
          <span className="ec-folio" style={styles.folio} aria-hidden="true">{number}</span>
          <span className="ec-category" style={{ ...styles.category, color: accent }}>{category}</span>
          <span className="visually-hidden">Entry {number}</span>
          <h3 className="ec-title" style={styles.title}>{displayTitle}</h3>
          {titleKh && <p className="ec-title-kh" style={styles.titleKh}>{titleKh}</p>}
          <hr style={styles.rule} />
          <p className="ec-description ec-description-excerpt" style={styles.description}>{displayDescription}</p>
          {id ? <Link className="ec-read-more" href={`/entries/${id}`} style={styles.readMore}>{translations.readMore}<span className="ec-read-more-arrow" aria-hidden="true">→</span></Link> : null}
          <div className="ec-footer" style={styles.footer}>
            <div><p style={styles.footerLabel}>{translations.source}</p><p style={styles.footerValue}>{displayContributor}</p></div>
            <div><p style={styles.footerLabel}>{translations.place}</p><p style={styles.footerValue}>{displayPlace}</p></div>
          </div>
        </>}
      </div>
      {/* These sections are nullable columns in the database, and a default
          parameter only covers undefined, so null is coalesced before .map. */}
      {category === "Performance" && Array.isArray(phases) && phases.length > 0 && <PerformanceSection accent={accent} phases={phases} language={language} />}
      {category === "Costume" && <CostumeSection accent={accent} characters={characters || []} garments={garments || []} language={language} />}
    </article>
  );
}
