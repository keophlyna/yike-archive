"use client";

const buttonStyle = {
  padding: "7px 10px",
  border: "1px solid var(--surface-border)",
  background: "var(--surface)",
  color: "var(--ink)",
  cursor: "pointer",
  font: "600 12px var(--font-google-sans), sans-serif",
};

export default function MyEntriesToggle({ active, onClick, labelOn, labelOff, busy, buttonRef }) {
  return <button ref={buttonRef} type="button" aria-pressed={active} aria-busy={busy} disabled={busy} onClick={onClick} style={buttonStyle}>{active ? labelOn : labelOff}</button>;
}
