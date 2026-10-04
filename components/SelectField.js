"use client";

const styles = {
  field: { display: "grid", gap: 6 },
  label: { color: "var(--ink-soft)", font: "600 12px var(--font-google-sans), sans-serif" },
  marker: { color: "var(--red)" },
  select: { width: "100%", padding: "11px 0", border: 0, borderBottom: "1px solid var(--ink-soft)", borderRadius: 0, background: "transparent", color: "var(--ink)", font: "400 16px var(--font-google-sans), sans-serif", outline: "none" },
  message: { margin: 0, color: "var(--red)", font: "400 13px/1.4 var(--font-google-sans), sans-serif" },
};

export default function SelectField({ id, label, value, onChange, options, placeholder, error, required = false }) {
  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}{required ? <span style={styles.marker} aria-hidden="true"> *</span> : null}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} style={styles.select} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {error ? <p id={`${id}-error`} role="alert" style={styles.message}>{error}</p> : null}
    </div>
  );
}