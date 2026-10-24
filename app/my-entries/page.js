"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../utils/supabase/client.js";
import useLanguage from "../../components/useLanguage.js";

const text = {
  en: { title: "My entries", loading: "Loading your entries…", login: "Log in to see your entries.", loginLink: "Log in", empty: "You haven't submitted any entries yet.", failed: "Your entries could not be loaded. Please try again.", back: "Back to the archive", pending: "Waiting for review", published: "Published", returned: "Returned for changes" },
  kh: { title: "ឯកសាររបស់ខ្ញុំ", loading: "កំពុងផ្ទុកឯកសាររបស់អ្នក…", login: "សូមចូលគណនីដើម្បីមើលឯកសាររបស់អ្នក។", loginLink: "ចូលគណនី", empty: "អ្នកមិនទាន់បានដាក់ស្នើឯកសារណាមួយទេ។", failed: "មិនអាចផ្ទុកឯកសាររបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។", back: "ត្រឡប់ទៅបណ្ណសារ", pending: "កំពុងរង់ចាំការពិនិត្យ", published: "បានផ្សាយ", returned: "បានបញ្ជូនត្រឡប់មកវិញ" },
};

const styles = {
  page: { width: "min(90vw, 1000px)", margin: "0 auto", padding: "48px 0", color: "var(--ink)" },
  back: { color: "var(--red)", fontSize: 14 },
  title: { margin: "32px 0 20px", font: "600 clamp(30px, 5vw, 48px)/1.1 var(--font-google-sans), sans-serif" },
  list: { margin: 0, padding: 0, listStyle: "none", borderTop: "1px solid var(--rule)" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, padding: "18px 4px", borderBottom: "1px solid var(--rule)" },
  entry: { color: "var(--ink)", fontSize: 17, fontWeight: 600 },
  status: { color: "var(--ink-soft)", fontSize: 14, whiteSpace: "nowrap" },
  message: { color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.6 },
};

export default function MyEntriesPage() {
  const language = useLanguage();
  const t = text[language];
  const [state, setState] = useState("loading");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) { setState("signed-out"); return; }
      const { data, error } = await supabase.from("entries").select("id, title, title_kh, status").eq("owner", user.id).order("created_at", { ascending: false });
      if (!active) return;
      if (error) { setState("error"); return; }
      setEntries(data || []);
      setState("ready");
    })().catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, []);

  return <main className="yk-my-entries" style={styles.page}>
    <Link href="/" style={styles.back}>{t.back}</Link>
    <h1 style={styles.title}>{t.title}</h1>
    {state === "loading" ? <p style={styles.message} role="status">{t.loading}</p>
      : state === "signed-out" ? <p style={styles.message}>{t.login} <Link href="/login">{t.loginLink}</Link></p>
        : state === "error" ? <p style={styles.message} role="alert">{t.failed}</p>
          : entries.length === 0 ? <p style={styles.message}>{t.empty}</p>
            : <ul className="yk-my-entries-list" style={styles.list}>{entries.map((entry) => <li key={entry.id} style={styles.row}>
              <Link className="yk-my-entry-title" href={`/entries/${entry.id}`} style={styles.entry}>{language === "kh" && entry.title_kh ? entry.title_kh : entry.title}</Link>
              <span className="yk-my-entry-status" style={styles.status}>{t[entry.status] || entry.status}</span>
            </li>)}</ul>}
  </main>;
}
