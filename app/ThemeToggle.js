"use client";

import { useTheme } from "./ThemeContext.js";

const TRACK_WIDTH = 56;
const TRACK_HEIGHT = 28;
const KNOB_SIZE = 22;
const KNOB_OFFSET = 3;
const SLIDE = TRACK_WIDTH - KNOB_SIZE - KNOB_OFFSET * 2;

const COLOR_TRANSITION =
  "background-color 450ms cubic-bezier(.4,0,.2,1), color 450ms cubic-bezier(.4,0,.2,1), border-color 450ms cubic-bezier(.4,0,.2,1)";

const styles = {
  button: {
    position: "relative",
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 999,
    border: "1px solid var(--card-border)",
    backgroundColor: "var(--card-border)",
    cursor: "pointer",
    padding: 0,
    overflow: "hidden",
    transition: COLOR_TRANSITION,
  },
  knob: {
    position: "absolute",
    top: KNOB_OFFSET,
    left: KNOB_OFFSET,
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: "50%",
    backgroundColor: "var(--text-primary)",
    transform: "translateX(0px)",
    transition: `transform 450ms cubic-bezier(.4,0,.2,1), ${COLOR_TRANSITION}`,
    pointerEvents: "none",
  },
  knobDark: {
    transform: `translateX(${SLIDE}px)`,
  },
  icon: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 14,
    height: 14,
    color: "var(--text-secondary)",
    transition: `opacity 450ms cubic-bezier(.4,0,.2,1), ${COLOR_TRANSITION}`,
  },
  sun: { left: 7, opacity: 1 },
  sunHidden: { opacity: 0 },
  moon: { right: 7, opacity: 0 },
  moonVisible: { opacity: 1 },
};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="14"
      height="14"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="14"
      height="14"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={styles.button}
    >
      <span
        style={{
          ...styles.icon,
          ...styles.sun,
          ...(isDark ? styles.sunHidden : {}),
        }}
      >
        <SunIcon />
      </span>
      <span
        style={{
          ...styles.icon,
          ...styles.moon,
          ...(isDark ? styles.moonVisible : {}),
        }}
      >
        <MoonIcon />
      </span>
      <span style={{ ...styles.knob, ...(isDark ? styles.knobDark : {}) }} />
    </button>
  );
}
