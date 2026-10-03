"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import EntryForm from "./EntryForm.js";
import FormPageShell from "./FormPageShell.js";
import { createClient } from "../utils/supabase/client.js";
import { saveEntry } from "../utils/saveEntry.js";

// The frame around the form is FormPageShell; these style the session lines
// that take its place before we know who the visitor is.
const styles = {
  intro: { margin: "16px 0 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

export default function ContributeForm() {
  const router = useRouter();
  const supabaseRef = useRef(null);
  const [session, setSession] = useState(undefined);

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
    const saved = await saveEntry({ supabase: supabaseRef.current, userId: session.id, cleaned, image, photoFile });
    if (!saved.ok) {
      console.error("Could not save entry:", saved.step, saved.error);
      return { ok: false, error: saved.error, message: saved.message, field: saved.step === "upload" ? "photo" : null };
    }
    router.push(`/entries/${saved.id}`);
    return { ok: true };
  };

  return (
    <FormPageShell title="Add an entry">
      {session === undefined
        ? <p style={styles.intro}>Checking your session…</p>
        : session === null
          ? <p style={styles.intro}>Log in to add an entry. <Link style={styles.link} href="/login">Log in</Link></p>
          : <EntryForm onSave={handleSave} />}
    </FormPageShell>
  );
}