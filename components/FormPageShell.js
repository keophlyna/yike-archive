  const styles = {
  page: { minHeight: "100vh", padding: "clamp(32px, 6vh, 72px) 20px", background: "var(--page-bg)" },
  panel: { width: "min(100%, 880px)", margin: "0 auto", padding: "clamp(28px, 5vw, 52px)", background: "var(--surface)", border: "1px solid var(--surface-border)" },
  eyebrow: { margin: "0 0 14px", color: "var(--gold)", font: "600 11px var(--font-google-sans), sans-serif", letterSpacing: ".08em", textTransform: "uppercase" },
  title: { margin: 0, color: "var(--ink)", font: "600 clamp(30px, 5vw, 44px)/1.05 var(--font-google-sans), sans-serif" },
};

// The frame shared by /contribute and /entries/<id>/edit: both are the same
// archive form on the same panel, so the panel and its eyebrow live here.
export default function FormPageShell({ eyebrow = "Khmer Living Archive", title, children }) {
  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>{eyebrow}</p>
        <h1 style={styles.title}>{title}</h1>
        {children}
      </section>
    </main>
  );
}