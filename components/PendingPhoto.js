import Image from "next/image";
import { cardTranslations } from "./entryCardText.js";
import { styles } from "./entryCardStyles.js";

// next/image parses src with new URL() and throws during render if it cannot,
// which takes the whole page down with it. A photo is only rendered when it is
// a local path or an absolute URL shaped like the ones allowed in
// next.config.mjs (https, *.supabase.co); anything else — for example a row
// whose photo_url still contains the <YOUR-PROJECT-REF> placeholder — is
// treated as absent so the card falls back to its placeholder.
export function resolveImageSrc(photo) {
  if (typeof photo !== "string" || !photo) return null;
  if (photo.startsWith("/")) return photo;
  try {
    const url = new URL(photo);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co") ? photo : null;
  } catch {
    return null;
  }
}

export default function PendingPhoto({ className = "", photo, alt = "", language = "en" }) {
  const text = cardTranslations[language] || cardTranslations.en;
  const imageSrc = resolveImageSrc(photo);
  return (
    <div className={className} style={styles.featurePhoto}>
      {imageSrc ? <Image src={imageSrc} alt={alt} fill sizes="(max-width: 860px) 90vw, 25vw" style={{ objectFit: "cover" }} /> : <div><p style={styles.featurePhotoText}>{text.photographPending}</p><p style={styles.featurePhotoCaption}>{text.imageToBeAdded}</p></div>}
    </div>
  );
}
