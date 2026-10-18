"use client";

import { useEffect, useState } from "react";

export default function useLanguage() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("yike-language");
    if (stored === "en" || stored === "kh") setLanguage(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return language;
}
