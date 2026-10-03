"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ContributeFields from "./ContributeFields.js";
import { createClient } from "../utils/supabase/client.js";
import { saveEntry } from "../utils/saveEntry.js";
import { validateEntry } from "../utils/validateEntry.js";

const emptyValues = { title: "", title_kh: "", description: "", description_kh: "", category: "", place: "", contributor: "", contributor_kh: "", photo_is_ai: false };

const styles = {
  page: { minHeight: "100vh", padding: "clamp(32px, 6vh, 72px) 20px", background: "var(--page-bg)" },
  panel: { width: "min(100%, 880px)", margin: "0 auto", padding: "clamp(28px, 5vw, 52px)", background: "var(--surface)", border: "1px solid var(--surface-border)" },
  eyebrow: { margin: "0 0 14px", color: "var(--gold)", font: "600 11px var(--font-google-sans), sans-serif", letterSpacing: ".08em", textTransform: "uppercase" },
  title: { margin: 0, color: "var(--ink)", font: "600 clamp(30px, 5vw, 44px)/1.05 var(--font-google-sans), sans-serif" },
  intro: { margin: "16px 0 0", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  link: { color: "var(--jade)", fontWeight: 600 },
};

export default function ContributeForm() {
  const router = useRouter();
  const supabaseRef = useRef(null);
  const [session, setSession] = useState(undefined);
  const [values, setValues] = useState(emptyValues);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabaseRef.current = supabase;
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setSession(data.user || null); });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next?.user || null));
    return () => { active = false; authListener.subscription.unsubscribe(); };
  }, []);

  const handleChange = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: "" } : current));
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
    setErrors((current) => (current.photo ? { ...current, photo: "" } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMessage("");

    const checked = await validateEntry(values, photo);
    if (!checked.ok) {
      setErrors(checked.errors);
      setMessage("Please fix the fields marked below.");
      setIsSaving(false);
      return;
    }

    const saved = await saveEntry({ supabase: supabaseRef.current, userId: session.id, cleaned: checked.cleaned, image: checked.image, photoFile: photo });
    if (!saved.ok) {
      console.error("Could not save entry:", saved.step, saved.error);
      const text = saved.step === "upload" ? "The photo could not be uploaded. Please try again." : "Your entry could not be saved. Please try again in a moment.";
      setErrors(saved.step === "upload" ? { photo: text } : {});
      setMessage(text);
      setIsSaving(false);
      return;
    }

    router.push(`/entries/${saved.id}`);
  };

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>Khmer Living Archive</p>
        <h1 style={styles.title}>Add an entry</h1>
        {session === undefined
          ? <p style={styles.intro}>Checking your session…</p>
          : session === null
            ? <p style={styles.intro}>Log in to add an entry. <Link style={styles.link} href="/login">Log in</Link></p>
            : <ContributeFields values={values} errors={errors} message={message} isSaving={isSaving} onChange={handleChange} onPhotoChange={handlePhotoChange} onSubmit={handleSubmit} />}
      </section>
    </main>
  );
}