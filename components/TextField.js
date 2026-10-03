"use client";

const styles = {
  field: { display: "grid", gap: 6 },
  label: { color: "var(--ink-soft)", font: "600 12px var(--font-google-sans), sans-serif" },
  hint: { margin: 0, color: "var(--ink-soft)", font: "400 12px/1.5 var(--font-google-sans), sans-serif" },
  input: { width: "100%", padding: "11px 0", border: 0, borderBottom: "1px solid var(--ink-soft)", borderRadius: 0, background: "transparent", color: "var(--ink)", font: "400 16px/1.6 var(--font-google-sans), sans-serif", outline: "none" },
  khmer: { fontFamily: "var(--font-noto-serif-khmer), serif" },
  multiline: { minHeight: 120, resize: "vertical" },
  message: { margin: 0, color: "var(--red)", font: "400 13px/1.4 var(--font-google-sans), sans-serif" },
};

export default function TextField({ id, label, hint, value, onChange, error, maxLength, multiline = false, khmer = false, rows = 6 }) {
  const fieldStyle = { ...styles.input, ...(multiline ? styles.multiline : {}), ...(khmer ? styles.khmer : {}) };
  const shared = {
    id,
    value,
    onChange: (event) => onChange(event.target.value),
    maxLength,
    autoComplete: "off",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };

  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      {hint ? <p id={`${id}-hint`} style={styles.hint}>{hint}</p> : null}
      {multiline ? <textarea {...shared} rows={rows} style={fieldStyle} /> : <input {...shared} type="text" style={fieldStyle} />}
      {error ? <p id={`${id}-error`} role="alert" style={styles.message}>{error}</p> : null}
    </div>
  );
}