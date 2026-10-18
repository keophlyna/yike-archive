"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EntryForm from "./EntryForm.js";
import FormPageShell from "./FormPageShell.js";
import { createClient } from "../utils/supabase/client.js";
import { fetchEntry } from "../utils/fetchEntry.js";
import { updateEntry } from "../utils/updateEntry.js";
import useLanguage from "./useLanguage.js";
import formText from "../utils/formText.js";

// The frame around the form is FormPageShell; these style the status lines that
// take its place while loading, or when access is refused.
const styles = {
  intro: { margin: "16px 0 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

// The fetched entry is camelCase for EntryCard; this form is snake_case.
const toFormValues = (entry) => ({
  title: entry.title || "", title_kh: entry.titleKh || "",
  description: entry.description || "", description_kh: entry.descriptionKh || "",
  category: entry.category || "", place: entry.place || "",
  contributor: entry.contributor || "", contributor_kh: entry.contributorKh || "",
  sources: entry.sourceText || "", sources_kh: entry.sourceTextKh || "",
  photo_is_ai: entry.photoIsAi === true,
});

export default function EntryEditor({ id }) {
  const language = useLanguage();
  const t = formText[language];
  const router = useRouter();
  const supabaseRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [values, setValues] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;
    let active = true;

    (async () => {
      try {
        const [result, session] = await Promise.all([fetchEntry(supabase, id), supabase.auth.getUser()]);
        if (!active) return;
        if (result.error) {
          console.error("Could not load the entry", result.error.code || "unknown");
          setStatus(result.error.code === "PGRST116" ? "missing" : "error");
          return;
        }
        const viewerId = session.data.user ? session.data.user.id : "";
        if (!viewerId || result.owner !== viewerId) {
          setStatus("denied");
          return;
        }
        setUserId(viewerId);
        setValues(toFormValues(result.entry));
        setStatus("ready");
      } catch (err) {
        console.error("Could not load the entry");
        if (active) setStatus("error");
      }
    })();

    return () => { active = false; };
  }, [id]);

  // The photo is optional here: uploadEntry only sets photo_url when a new file
  // was picked, so leaving the picker empty keeps the existing photo.
  const handleSave = async ({ cleaned, image, photoFile }) => {
    const result = await updateEntry({ supabase: supabaseRef.current, entryId: id, userId, cleaned, image, photoFile, language });
    if (!result.ok) {
      console.error("Could not update the entry:", result.step, result.error?.code || "unknown");
      return { ok: false, error: result.error, message: result.message, field: result.field || (result.step === "upload" ? "photo" : null) };
    }
    router.push(`/entries/${id}`);
    return { ok: true };
  };

  return (
    <FormPageShell title={t.editEntry}>
      {status === "loading" ? <p style={styles.intro}>{t.checkingSession}</p>
        : status === "missing" ? <p style={styles.intro}>{t.missingEntry} <Link style={styles.link} href="/">{t.backArchive}</Link></p>
          : status === "error" ? <p style={styles.intro}>{t.loadFailed}</p>
            : status === "denied" ? <p style={styles.intro}>{t.deniedEdit} <Link style={styles.link} href={`/entries/${id}`}>{t.backEntry}</Link></p>
              : <EntryForm initialValues={values} onSave={handleSave} photoRequired={false} photoHint={t.editPhotoHint} intro={t.editIntro} submitLabel={t.saveChanges} cancelHref={`/entries/${id}`} />}
    </FormPageShell>
  );
}
