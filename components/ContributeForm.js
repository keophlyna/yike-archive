"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import EntryForm from "./EntryForm.js";
import FormPageShell from "./FormPageShell.js";
import { createClient } from "../utils/supabase/client.js";
import { saveEntry } from "../utils/saveEntry.js";
import useLanguage from "./useLanguage.js";
import formText from "../utils/formText.js";

// The frame around the form is FormPageShell; these style the session lines
// that take its place before we know who the visitor is.
const styles = {
  intro: { margin: "16px 0 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

export default function ContributeForm() {
  const language = useLanguage();
  const t = formText[language];
  const supabaseRef = useRef(null);
  const [session, setSession] = useState(undefined);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setSession(data.user || null); });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next?.user || null));
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);

  // EntryForm owns the fields, the photo picker and the validation; this page
  // only decides what saving means, and reports any failure back to the form.
  const handleSave = async ({ cleaned, image, photoFile }) => {
    const saved = await saveEntry({ supabase: supabaseRef.current, userId: session.id, cleaned, image, photoFile, language });
    if (!saved.ok) {
      console.error("Could not save entry:", saved.step, saved.error?.code || "unknown");
      return { ok: false, error: saved.error, message: saved.message, field: saved.field || (saved.step === "upload" ? "photo" : null) };
    }
    setSubmitted(true);
    return { ok: true };
  };

  return (
    <FormPageShell title={t.addEntry}>
      {session === undefined
        ? <p style={styles.intro}>{t.checkingSession}</p>
        : session === null
          ? <p style={styles.intro}>{t.loginToAdd} <Link style={styles.link} href="/login">{t.logIn}</Link></p>
          : submitted
            ? <p style={styles.intro} role="status">{language === "kh"
              ? "សូមអរគុណ! ឯកសាររបស់អ្នកត្រូវបានទទួល ហើយកំពុងរង់ចាំការពិនិត្យ។ អ្នកអាចឃើញវានៅក្នុង «ឯកសាររបស់ខ្ញុំ»។ វានឹងបង្ហាញក្នុងបណ្ណសារនៅពេលអ្នកពិនិត្យយល់ព្រម។"
              : "Thank you. Your entry has been received and is waiting for review. You can find it under My entries. It will appear in the archive once a reviewer approves it."}</p>
            : <EntryForm onSave={handleSave} cancelHref="/" />}
    </FormPageShell>
  );
}
