"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EntryForm from "./EntryForm.js";
import FormPageShell from "./FormPageShell.js";
import { createClient } from "../utils/supabase/client.js";
import { fetchEntry } from "../utils/fetchEntry.js";
import { updateEntry } from "../utils/updateEntry.js";

// The frame around the form is FormPageShell; these style the status lines that
// take its place while loading, or when access is refused.
const styles = {
  intro: { margin: "16px 0 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

const editIntro = "Change what you need and save. Khmer text is stored exactly as you write it, and the photo is only replaced if you pick a new one.";
const editPhotoHint = "JPG, PNG, or WebP, up to 5 MB — leave this empty to keep the current photo";

// The fetched entry is camelCase for EntryCard; this form is snake_case.
const toFormValues = (entry) => ({
  title: entry.title || "", title_kh: entry.titleKh || "",
  description: entry.description || "", description_kh: entry.descriptionKh || "",
  category: entry.category || "", place: entry.place || "",
  contributor: entry.contributor || "", contributor_kh: entry.contributorKh || "",
  photo_is_ai: entry.photoIsAi === true,
});

export default function EntryEditor({ id }) {
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
          console.error("Could not load the entry", result.error);
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
        console.error("Could not load the entry", err);
        if (active) setStatus("error");
      }
    })();

    return () => { active = false; };
  }, [id]);

  // The photo is optional here: uploadEntry only sets photo_url when a new file
  // was picked, so leaving the picker empty keeps the existing photo.
  const handleSave = async ({ cleaned, image, photoFile }) => {
    const result = await updateEntry({ supabase: supabaseRef.current, entryId: id, userId, cleaned, image, photoFile });
    if (!result.ok) {
      console.error("Could not update the entry:", result.step, result.error);
      return { ok: false, error: result.error, message: result.message, field: result.field || (result.step === "upload" ? "photo" : null) };
    }
    router.push(`/entries/${id}`);
    return { ok: true };
  };

  return (
    <FormPageShell title="Edit this entry">
      {status === "loading" ? <p style={styles.intro}>Checking your session…</p>
        : status === "missing" ? <p style={styles.intro}>That entry could not be found. <Link style={styles.link} href="/">Back to the archive</Link></p>
          : status === "error" ? <p style={styles.intro}>We could not load this entry. Please try again in a moment.</p>
            : status === "denied" ? <p style={styles.intro}>You can only edit entries you added yourself. <Link style={styles.link} href={`/entries/${id}`}>Back to the entry</Link></p>
              : <EntryForm initialValues={values} onSave={handleSave} photoRequired={false} photoHint={editPhotoHint} intro={editIntro} submitLabel="Save changes" cancelHref={`/entries/${id}`} />}
    </FormPageShell>
  );
}
