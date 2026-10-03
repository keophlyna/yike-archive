"use client";

// The accept list is a convenience for the file picker only. The real type
// check happens in utils/validateEntry.js against the file's first bytes.
const ACCEPT = ".jpg,.jpeg,.png,.webp";

const styles = {
  field: { display: "grid", gap: 6 },
  label: { color: "var(--ink-soft)", font: "600 12px var(--font-google-sans), sans-serif" },
  hint: { margin: 0, color: "var(--ink-soft)", font: "400 12px/1.5 var(--font-google-sans), sans-serif" },
  input: { width: "100%", padding: "11px 0", border: 0, borderBottom: "1px solid var(--ink-soft)", borderRadius: 0, background: "transparent", color: "var(--ink)", font: "400 14px var(--font-google-sans), sans-serif", outline: "none" },
  message: { margin: 0, color: "var(--red)", font: "400 13px/1.4 var(--font-google-sans), sans-serif" },
};

export default function FileField({ id, label, hint, error, onChange }) {
  const handleChange = (event) => {
    const files = event.target.files;
    onChange(files && files[0] ? files[0] : null);
  };

  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      {hint ? <p id={`${id}-hint`} style={styles.hint}>{hint}</p> : null}
      <input id={id} type="file" accept={ACCEPT} onChange={handleChange} style={styles.input} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} />
      {error ? <p id={`${id}-error`} role="alert" style={styles.message}>{error}</p> : null}
    </div>
  );
}