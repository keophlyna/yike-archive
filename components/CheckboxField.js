"use client";

const styles = {
  row: { display: "flex", alignItems: "center", gap: 10, color: "var(--ink)", font: "400 15px var(--font-google-sans), sans-serif", cursor: "pointer" },
  box: { width: 18, height: 18, accentColor: "var(--red)", cursor: "pointer" },
};

export default function CheckboxField({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} style={styles.row}>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={styles.box} />
      {label}
    </label>
  );
}