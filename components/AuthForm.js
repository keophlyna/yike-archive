"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useLanguage from "./useLanguage.js";
import formText from "../utils/formText.js";
import { createClient } from "../utils/supabase/client.js";

const styles = {
	page: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 20px", background: "var(--hero-bg)", color: "var(--hero-fg)" },
	panel: { width: "min(100%, 440px)", padding: "clamp(28px, 6vw, 52px)", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--surface-border)" },
	eyebrow: { margin: "0 0 14px", color: "var(--gold)", font: "600 11px var(--font-google-sans), sans-serif", letterSpacing: ".08em", textTransform: "uppercase" },
	title: { margin: 0, color: "var(--ink)", font: "600 clamp(32px, 7vw, 48px)/1 var(--font-google-sans), sans-serif" },
	intro: { margin: "16px 0 30px", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
	form: { display: "grid", gap: 18 },
	label: { display: "grid", gap: 8, color: "var(--ink-soft)", font: "600 12px var(--font-google-sans), sans-serif" },
	input: { width: "100%", padding: "12px 0", border: 0, borderBottom: "1px solid var(--ink-soft)", borderRadius: 0, background: "transparent", color: "var(--ink)", font: "400 16px var(--font-google-sans), sans-serif", outline: "none" },
	button: { marginTop: 8, padding: "13px 18px", border: 0, background: "var(--red)", color: "var(--hero-fg)", font: "600 14px var(--font-google-sans), sans-serif", cursor: "pointer" },
	message: { margin: 0, color: "var(--red)", font: "400 14px/1.5 var(--font-google-sans), sans-serif" },
	footer: { margin: "24px 0 0", color: "var(--ink-soft)", font: "400 14px var(--font-google-sans), sans-serif" },
	link: { color: "var(--jade)", fontWeight: 600 },
};

export default function AuthForm({ mode }) {
	const language = useLanguage();
	const t = formText[language];
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isLogin = mode === "login";

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage("");
		setIsSubmitting(true);
		const supabase = createClient();

		if (!supabase) {
			setIsSubmitting(false);
			setMessage(isLogin ? t.invalidLogin : t.createFailed);
			return;
		}

		const result = isLogin
			? await supabase.auth.signInWithPassword({ email, password })
			: await supabase.auth.signUp({ email, password });

		setIsSubmitting(false);
		if (result.error) {
			setMessage(isLogin ? t.invalidLogin : t.createFailed);
			return;
		}
		if (isLogin || result.data.session) {
			router.replace("/");
			return;
		}
		setMessage(t.confirmEmail);
	};

	return (
		<main style={styles.page}>
			<section style={styles.panel}>
				<p style={styles.eyebrow}>{t.archive}</p>
				<h1 style={styles.title}>{isLogin ? t.welcome : t.createAccount}</h1>
				<p style={styles.intro}>{isLogin ? t.signInIntro : t.joinIntro}</p>
				<form style={styles.form} onSubmit={handleSubmit}>
					<label style={styles.label}>{t.email}<input style={styles.input} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
					<label style={styles.label}>{t.password}<input style={styles.input} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} minLength={6} required /></label>
					{message && <p role="alert" style={styles.message}>{message}</p>}
					<button style={styles.button} type="submit" disabled={isSubmitting}>{isSubmitting ? t.pleaseWait : isLogin ? t.logIn : t.signUp}</button>
				</form>
				<p style={styles.footer}>{isLogin ? t.newToArchive : t.alreadyAccount} <Link style={styles.link} href={isLogin ? "/signup" : "/login"}>{isLogin ? t.signUp : t.logIn}</Link></p>
			</section>
		</main>
	);
}
