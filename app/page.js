"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import collection from "../collection.config.js";
import "./home.css";
import EntryCard from "../components/EntryCard.js";
import { createClient } from "../utils/supabase/client.js";
import { useTheme } from "./ThemeContext.js";
import ThemeToggle from "./ThemeToggle.js";
import MyEntriesToggle from "../components/MyEntriesToggle.js";
import LoginPrompt from "../components/LoginPrompt.js";

const contentWidth = "min(90vw, 1760px)";
const fontSans = "var(--font-google-sans), sans-serif";
const fontSerif = "var(--font-google-sans), sans-serif";
const fontKhmer = "var(--font-noto-serif-khmer), serif";

const translations = {
  en: {
    wordmark: "Khmer Living Archive",
    searchPlaceholder: "Search the archive",
    searchLabel: "Search",
    matchingEntries: "Matching entries",
    latestEntries: "Latest entries",
    myEntries: "My entries",
    viewMine: "View my entries",
    viewAll: "View all entries",
    loginPromptTitle: "Log in to see your entries",
    loginPromptBody: "Log in, or sign up if you don't have an account yet, to view and manage the entries you've added.",
    close: "Close",
    login: "Log in",
    signup: "Sign up",
    noOwnedEntries: "You haven't added any entries yet",
    contribute: "Add an entry",
    accountMenu: "Account menu",
    currentAccount: "Current account",
    personalAccount: "Personal account",
    addEntry: "Add entry",
    logOut: "Log out",
    member: "Archive member",
    noResults: (query) => `No entries match “${query}”`,
    clearSearch: "Clear search",
    kicker: "A living record of Khmer performance",
    curatedBy: "Curated by",
    province: "Province",
    source: "Source",
    heroTitle: collection.name,
    heroDescription: collection.description,
    emptySubtitle: "Search results are empty",
    loadingEntries: "Loading entries…",
    noEntries: "No entries yet",
    noEntriesSubtitle: "Entries will appear here when they are available.",
    entriesLoadFailed: "Entries could not be loaded. Please try again later.",
  },
  kh: {
    myEntries: "ឯកសាររបស់ខ្ញុំ",
    viewMine: "មើលឯកសាររបស់ខ្ញុំ",
    viewAll: "មើលឯកសារទាំងអស់",
    loginPromptTitle: "ចូលគណនីដើម្បីមើលឯកសាររបស់អ្នក",
    loginPromptBody: "សូមចូលគណនី ឬបង្កើតគណនី ដើម្បីមើល និងគ្រប់គ្រងឯកសារដែលអ្នកបានបន្ថែម។",
    close: "បិទ",
    login: "ចូលគណនី",
    signup: "បង្កើតគណនី",
    noOwnedEntries: "អ្នកមិនទាន់បានបន្ថែមឯកសារណាមួយនៅឡើយទេ",
    contribute: "បន្ថែមឯកសារ",
    accountMenu: "ម៉ឺនុយគណនី",
    currentAccount: "គណនីបច្ចុប្បន្ន",
    personalAccount: "គណនីផ្ទាល់ខ្លួន",
    addEntry: "បន្ថែមឯកសារ",
    logOut: "ចាកចេញ",
    member: "សមាជិកបណ្ណសារ",
    wordmark: "បណ្ណសាររស់ខ្មែរ",
    searchPlaceholder: "ស្វែងរកក្នុងបណ្ណសារ",
    searchLabel: "ស្វែងរក",
    matchingEntries: "ឯកសារដែលត្រូវគ្នា",
    latestEntries: "ឯកសារថ្មីៗ",
    noResults: () => "គ្មានឯកសារណាត្រូវនឹង",
    clearSearch: "សម្អាតការស្វែងរក",
    kicker: "កំណត់ត្រាដ៏រស់រវើកនៃសិល្បៈទស្សនីយភាពខ្មែរ",
    curatedBy: "រៀបចំចងក្រងដោយ",
    province: "ខេត្ត",
    source: "ប្រភព",
    heroTitle: "បណ្ណសាររស់ខ្មែរ",
    heroDescription: "ល្ខោនយីកេ គឺជាទម្រង់សិល្បៈល្ខោនប្រពៃណីខ្មែរមួយ ដែលរួមបញ្ចូលគ្នានូវតន្ត្រី របាំ និងការនិទានរឿង។ ល្ខោនយីកេមានតម្លៃលើសពីការកម្សាន្តទៅទៀត ដោយវាបានពាំនាំនូវសាច់រឿង ភាសា តន្ត្រី ប្រពៃណី និងចំណេះដឹងផ្នែកវប្បធម៌ខ្មែរ ពីជំនាន់មួយទៅជំនាន់មួយ។ ការអភិរក្សសិល្បៈមួយនេះ គឺជួយទប់ស្កាត់មិនឱ្យចំណេះដឹងទាំងនេះត្រូវបាត់បង់ ជាពិសេសបន្ទាប់ពីសិល្បៈ និងប្រពៃណីវប្បធម៌កម្ពុជា ត្រូវបានរងការបំផ្លិចបំផ្លាញយ៉ាងធ្ងន់ធ្ងរ ក្នុងអំឡុងរបបខ្មែរក្រហម។",
    emptySubtitle: "រកមិនឃើញលទ្ធផល",
    loadingEntries: "កំពុងផ្ទុកឯកសារ…",
    noEntries: "មិនទាន់មានឯកសារនៅឡើយទេ",
    noEntriesSubtitle: "ឯកសារនឹងបង្ហាញនៅទីនេះនៅពេលមានទិន្នន័យ។",
    entriesLoadFailed: "មិនអាចផ្ទុកឯកសារបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    curatorValue: "កែវ ផ្លីនា",
    provinceValue: "ភ្នំពេញ, កម្ពុជា",
    sourceValue: "អ្នកចាស់ទុំ អ្នកសម្តែងយីកេ និងឯកសារបោះពុម្ពអំពីសិល្បៈសម្តែងខ្មែរ",
  },
};

const styles = {
  header: { position: "sticky", top: 0, zIndex: 40, width: "100%", background: "var(--page-bg)", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "transparent", transition: "box-shadow 250ms ease, border-color 250ms ease" },
  headerScrolled: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)", boxShadow: "0 8px 24px var(--shadow)" },
  headerInner: { width: contentWidth, margin: "0 auto", padding: "16px 0 13px" },
  headerTop: { display: "grid", gridTemplateColumns: "1fr minmax(280px, 520px) auto", alignItems: "start", gap: "clamp(20px, 5vw, 90px)" },
  wordmark: { display: "flex", alignItems: "center", gap: 10, fontFamily: fontSans, fontWeight: 600, fontSize: 24, color: "var(--ink)", margin: 0, lineHeight: 1.1 },
  searchAndAdd: { display: "flex", alignItems: "center", gap: 18, minWidth: 0 },
  searchWrap: { flex: "1 1 auto", minWidth: 0 },
  searchField: { position: "relative", display: "flex", alignItems: "center", borderBottom: "1px solid var(--ink-soft)" },
  searchInput: { width: "100%", padding: "5px 0 8px 36px", border: 0, background: "transparent", color: "var(--ink)", fontFamily: fontSans, fontWeight: 400, fontSize: 15, outline: "none" },
  searchButton: { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, padding: 0, border: 0, background: "transparent", cursor: "pointer", opacity: 1, transition: "opacity 220ms ease, transform 220ms ease" },
  searchSpinner: { width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--ink-soft)", borderTopColor: "var(--gold)", borderRightColor: "var(--gold)" },
  clearBtn: { position: "absolute", right: 0, width: 24, height: 24, border: 0, background: "transparent", color: "var(--ink-soft)", cursor: "pointer", fontSize: 14 },
  resultLabel: { margin: "14px 0 0", color: "var(--gold)", font: `600 10px ${fontSans}`, letterSpacing: ".08em", textTransform: "uppercase" },
  resultLinks: { display: "grid", gap: 0, margin: "4px 0 0", padding: 0, listStyle: "none", borderTop: "1px solid var(--rule)" },
  resultItem: { borderBottom: "1px solid var(--rule)" },
  resultLink: { display: "grid", gridTemplateColumns: "24px 1fr auto", alignItems: "baseline", gap: 8, width: "100%", padding: "9px 6px", color: "var(--red)", font: `500 12px ${fontSans}`, textDecoration: "none", transition: "background-color 220ms ease, color 220ms ease" },
  resultNumber: { color: "var(--ink-soft)", font: `500 11px ${fontSans}` },
  resultInfo: { display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "3px 8px", minWidth: 0 },
  resultKhmer: { color: "var(--ink-soft)", font: `400 14px ${fontKhmer}`, textDecoration: "none" },
  resultCategory: { color: "var(--ink-soft)", font: `600 10px ${fontSans}`, letterSpacing: ".04em" },
  hero: { backgroundColor: "var(--hero-bg)", backgroundImage: "linear-gradient(rgba(0, 0, 0, .48), rgba(0, 0, 0, .48)), url('/entries/hero-image.jpg')", backgroundPosition: "center", backgroundSize: "cover", color: "var(--hero-fg)" },
  heroInner: { width: contentWidth, margin: "0 auto", padding: "clamp(58px, 10vw, 138px) 0 clamp(50px, 8vw, 112px)" },
  kicker: { margin: "0 0 18px", color: "var(--gold)", font: `600 12px ${fontSans}`, letterSpacing: ".08em" },
  heroTitle: { maxWidth: 900, margin: 0, font: `700 clamp(44px, 6.4vw, 78px)/.96 ${fontSerif}` },
  heroDescription: { maxWidth: 760, margin: "30px 0 0", color: "var(--hero-fg)", font: `400 clamp(17px, 1.5vw, 21px)/1.65 ${fontSans}` },
  metaRow: { display: "flex", flexWrap: "wrap", marginTop: "clamp(42px, 6vw, 76px)" },
  meta: { minWidth: 210, flex: "1 1 210px", padding: "0 28px", borderLeft: "1px solid var(--hero-rule)" },
  metaFirst: { paddingLeft: 0, borderLeft: 0 },
  metaLabel: { margin: 0, color: "var(--gold)", font: `600 11px ${fontSans}`, letterSpacing: ".05em" },
  metaValue: { margin: "8px 0 0", color: "var(--hero-fg)", font: `400 15px/1.45 ${fontSans}` },
  main: { width: contentWidth, margin: "0 auto", padding: "clamp(56px, 8vw, 116px) 0 60px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--rule)", paddingBottom: 18 },
  sectionTitle: { margin: 0, font: `600 clamp(28px, 3vw, 42px)/1 ${fontSerif}`, color: "var(--ink)" },
  countPill: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 24, padding: "0 8px", background: "var(--ink)", color: "var(--page-bg)", font: `600 12px ${fontSans}` },
  entryList: { marginTop: 0 },
  empty: { padding: "clamp(60px, 10vw, 130px) 0", textAlign: "center" },
  emptyTitle: { margin: 0, font: `600 clamp(28px, 4vw, 46px) ${fontSerif}`, color: "var(--ink)" },
  emptyKh: { margin: "14px 0 0", color: "var(--ink-soft)", font: `400 18px ${fontKhmer}` },
  emptyClear: { marginTop: 28, padding: "10px 16px", border: 0, background: "var(--ink)", color: "var(--page-bg)", font: `600 13px ${fontSans}`, cursor: "pointer" },
  footer: { paddingTop: 22, borderTop: "1px solid var(--rule)", color: "var(--ink-soft)", font: `400 13px/1.6 ${fontSans}` },
  topButton: { position: "fixed", right: "clamp(18px, 3vw, 48px)", bottom: 24, zIndex: 30, width: 46, height: 46, border: "1px solid var(--surface-border)", borderRadius: "50%", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", fontSize: 20 },
  authLink: { color: "var(--red)", font: `600 12px ${fontSans}`, textDecoration: "none" },
  addEntryLink: { display: "inline-flex", flexShrink: 0, alignItems: "center", justifyContent: "center", gap: 7, minHeight: 40, padding: "0 15px", border: "1px solid var(--red)", borderRadius: 999, background: "var(--red)", color: "var(--hero-fg)", font: `600 13px ${fontSans}`, textDecoration: "none", whiteSpace: "nowrap", transition: "opacity 180ms ease, transform 180ms ease" },
  authButton: { padding: "7px 10px", border: "1px solid var(--surface-border)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", font: `600 12px ${fontSans}` },
  authEmail: { maxWidth: 150, overflow: "hidden", color: "var(--ink-soft)", font: `400 12px ${fontSans}`, textOverflow: "ellipsis", whiteSpace: "nowrap" },
  profileWrap: { position: "relative" },
  profileTrigger: { display: "inline-flex", alignItems: "center", gap: 7, padding: 3, border: "1px solid var(--surface-border)", borderRadius: 999, background: "var(--surface)", color: "var(--ink)", cursor: "pointer" },
  profileAvatar: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "var(--blue, #075da8)", color: "#fff", font: `600 16px ${fontSans}`, textTransform: "uppercase" },
  profileChevron: { padding: "0 8px 0 1px", color: "var(--ink-soft)", font: `500 13px ${fontSans}` },
  profileMenu: { position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 60, width: "min(330px, calc(100vw - 32px))", padding: 12, background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--surface-border)", borderRadius: 16, boxShadow: "0 14px 36px var(--shadow)" },
  profileEyebrow: { margin: "4px 8px 10px", color: "var(--ink-soft)", font: `500 12px ${fontSans}` },
  profileSummary: { display: "grid", gridTemplateColumns: "48px minmax(0, 1fr)", alignItems: "center", gap: 12, padding: 12, border: "1px solid var(--surface-border)", borderRadius: 12 },
  profileSummaryAvatar: { width: 48, height: 48, fontSize: 19 },
  profileDetails: { minWidth: 0 },
  profileName: { overflow: "hidden", margin: 0, color: "var(--ink)", font: `600 14px ${fontSans}`, textOverflow: "ellipsis", whiteSpace: "nowrap" },
  profileType: { margin: "3px 0 0", color: "var(--ink-soft)", font: `400 12px ${fontSans}` },
  profileEmail: { overflow: "hidden", margin: "4px 0 0", color: "var(--ink-soft)", font: `400 12px ${fontSans}`, textOverflow: "ellipsis", whiteSpace: "nowrap" },
  profileAction: { display: "flex", width: "100%", alignItems: "center", gap: 10, marginTop: 7, padding: "11px 12px", border: 0, borderRadius: 9, background: "transparent", color: "var(--ink)", font: `500 14px ${fontSans}`, textAlign: "left", textDecoration: "none", cursor: "pointer" },
  profileDivider: { height: 1, margin: "8px 4px", background: "var(--rule)" },
};

function getEntrySearchText(entry) {
  const nestedText = [
    ...(entry.phases || []).flatMap((phase) => [phase.num, phase.phase, phase.title, phase.kh, phase.text, phase.textKh]),
    ...(entry.characters || []).flatMap((character) => [character.role, character.kh, character.tag, character.text, character.textKh]),
    ...(entry.garments || []).flatMap((garment) => [garment.name, garment.kh, garment.text, garment.textKh]),
  ];

  return [
    entry.title,
    entry.titleKh,
    entry.description,
    entry.descriptionKh,
    entry.category,
    entry.contributor,
    entry.contributorKh,
    entry.place,
    entry.placeKh,
    ...nestedText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function getLanguageLabel(language) {
  return language === "kh" ? "KH" : "EN";
}

export default function Home() {
  const { theme } = useTheme();
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [entriesError, setEntriesError] = useState(false);
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [showMine, setShowMine] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleRef = useRef(null);
  const promptRef = useRef(null);
  const loginLinkRef = useRef(null);
  const profileRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const inputRef = useRef(null);
  const searchTimerRef = useRef(null);
  const supabaseRef = useRef(null);
  const searchIconSrc = theme === "dark" ? "/entries/search-icon-sand.png" : "/entries/search-icon.png";

  useEffect(() => {
    const stored = window.localStorage.getItem("yike-language");
    if (stored === "en" || stored === "kh") {
      setLanguage(stored);
      document.documentElement.lang = stored;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("yike-language", language);
    } catch (_) {}
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      supabaseRef.current = null;
      setAuthReady(true);
      setEntriesError(true);
      setEntriesLoading(false);
      return;
    }

    let active = true;
    supabaseRef.current = supabase;
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setAuthReady(true); }).catch(() => setAuthReady(true));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setEntriesError(true);
          setEntriesLoading(false);
          return;
        }

        setEntries((data || []).map((entry) => ({
          ...entry,
          titleKh: entry.title_kh,
          descriptionKh: entry.description_kh,
          contributorKh: entry.contributor_kh,
          placeKh: entry.place_kh,
          photo: entry.photo_url,
          photoIsAi: entry.photo_is_ai,
        })));
        setEntriesLoading(false);
      });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    try { if (user && window.sessionStorage.getItem("yike-view-mine") === "1") setShowMine(true); } catch (_) {}
  }, [authReady, user]);

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
    try { window.sessionStorage.removeItem("yike-view-mine"); } catch (_) {}
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  useEffect(() => {
    if (!showLoginPrompt) return;
    loginLinkRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") closeLoginPrompt(); };
    const onPointerDown = (event) => { if (!promptRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) closeLoginPrompt(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("pointerdown", onPointerDown); };
  }, [showLoginPrompt]);

  useEffect(() => {
    if (!profileOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileTriggerRef.current?.focus();
      }
    };
    const onPointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [profileOpen]);

  const handleToggleMine = () => {
    if (!authReady) return;
    if (!user) {
      try { window.sessionStorage.setItem("yike-view-mine", "1"); } catch (_) {}
      setShowLoginPrompt(true);
      return;
    }
    const next = !showMine;
    setShowMine(next);
    try { if (next) window.sessionStorage.setItem("yike-view-mine", "1"); else window.sessionStorage.removeItem("yike-view-mine"); } catch (_) {}
  };

  const commitSearch = (nextQuery = query) => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setShowSuggestions(false);
    setIsSearching(true);
    searchTimerRef.current = setTimeout(() => {
      setCommittedQuery(nextQuery);
      setIsSearching(false);
      searchTimerRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 2); setShowTop(window.scrollY > 640); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === "Escape" && document.activeElement === inputRef.current) { setQuery(""); setCommittedQuery(""); setShowSuggestions(false); inputRef.current?.blur(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const t = translations[language] || translations.en;
  const isSearchActive = committedQuery.trim().length > 0;
  const filtered = useMemo(() => {
    const terms = committedQuery.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => {
      const owned = !(showMine && user) || entry.owner === user.id;
      const text = getEntrySearchText(entry);
      return owned && terms.every((term) => text.includes(term));
    });
  }, [entries, committedQuery, showMine, user]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((observed) => {
      observed.forEach((item) => { if (item.isIntersecting) { item.target.classList.add("is-visible"); revealObserver.unobserve(item.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".yk-reveal").forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, [filtered, entriesLoading]);

  const heroMeta = language === "kh"
    ? {
        curator: t.curatorValue || "កែវ ផល្នា",
        province: t.provinceValue || "ភ្នំពេញ កម្ពុជា",
        source: t.sourceValue || "អ្នកចាស់ទុំ និងអ្នកសម្តែងយីកេ",
      }
    : {
        curator: collection.curator,
        province: collection.province,
        source: collection.source,
      };
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const suggestionResults = normalizedQuery ? entries.filter((entry) => {
    const searchableText = getEntrySearchText(entry);
    return searchableText.includes(normalizedQuery);
  }) : [];

  const clearSearch = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    setIsSearching(false);
    setQuery("");
    setCommittedQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleLogout = async () => {
    if (!supabaseRef.current) return;
    await supabaseRef.current.auth.signOut();
    setUser(null);
    setShowMine(false);
    try { window.sessionStorage.removeItem("yike-view-mine"); } catch (_) {}
  };

  const getDisplayTitle = (entry) => {
    if (language === "kh" && entry.titleKh) return entry.titleKh;
    return entry.title;
  };
  const profileName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || t.member;
  const profileInitial = (user?.email?.[0] || profileName[0] || "Y").toLocaleUpperCase();

  return (
    <>
      <a className="yk-skip-link" href="#main">Skip to entries</a>
      <header style={{ ...styles.header, ...(scrolled ? styles.headerScrolled : {}) }}>
        <div className="yk-header-inner" style={styles.headerInner}>
          <div className="yk-header-top" style={styles.headerTop}>
            <p className="yk-wordmark" style={styles.wordmark}><Image src="/entries/lakhon-yike-logo.png" alt="" width={2000} height={1414} priority style={{ display: "block", width: 64, height: "auto", objectFit: "contain" }} />{t.wordmark}</p>
            <div className="yk-search-wrap" style={styles.searchAndAdd}>
            <form style={styles.searchWrap} role="search" onSubmit={(event) => { event.preventDefault(); commitSearch(); }}>
              <label htmlFor="archive-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>{t.searchLabel}</label>
              <div style={styles.searchField}>
                <input id="archive-search" ref={inputRef} type="search" value={query} onChange={(event) => { const nextValue = event.target.value; setQuery(nextValue); setShowSuggestions(nextValue.trim().length > 0); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); commitSearch(event.currentTarget.value); } }} placeholder={t.searchPlaceholder} className="yk-search-input" style={styles.searchInput} autoComplete="off" />
                <button type="button" aria-label={t.searchLabel} onClick={() => commitSearch()} style={styles.searchButton}>
                  {isSearching ? <span className="yk-search-spinner" style={styles.searchSpinner} aria-hidden="true" /> : <Image src={searchIconSrc} alt="" width={18} height={18} priority={false} style={{ display: "block", opacity: 1 }} />}
                </button>
                {query ? <button type="button" className="yk-clear-btn" style={styles.clearBtn} onClick={clearSearch} aria-label={t.clearSearch}>x</button> : null}
              </div>
              {showSuggestions && normalizedQuery && suggestionResults.length > 0 && <>
                <p style={styles.resultLabel}>{t.matchingEntries}</p>
                <ul style={styles.resultLinks} aria-label={t.matchingEntries}>
                  {suggestionResults.map((entry, index) => {
                    const suggestionLabel = getDisplayTitle(entry);
                    return (
                      <li style={styles.resultItem} key={`${entry.title}-${index}`}>
                        <a className="yk-result-link" style={styles.resultLink} href="#" onClick={(event) => { event.preventDefault(); setQuery(suggestionLabel); commitSearch(suggestionLabel); }}>
                          <span style={styles.resultNumber}>{String(index + 1).padStart(2, "0")}</span>
                          <span style={styles.resultInfo}><span>{suggestionLabel}</span>{language === "kh" && entry.titleKh ? <span className="yk-result-khmer" style={styles.resultKhmer}>{entry.titleKh}</span> : null}</span>
                          {entry.category && <span style={styles.resultCategory}>{entry.category}</span>}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>}
            </form>
            {user && <Link href="/contribute" style={styles.addEntryLink}><span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>+</span>{t.addEntry}</Link>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div ref={profileRef} style={styles.profileWrap}>
                <button ref={profileTriggerRef} type="button" aria-label={t.accountMenu} aria-expanded={profileOpen} aria-haspopup="dialog" onClick={() => setProfileOpen((open) => !open)} style={styles.profileTrigger}>
                  <span aria-hidden="true" style={styles.profileAvatar}>{profileInitial}</span><span aria-hidden="true" style={styles.profileChevron}>⌄</span>
                </button>
                {profileOpen && <div role="dialog" aria-label={t.accountMenu} style={styles.profileMenu}>
                  <p style={styles.profileEyebrow}>{t.currentAccount}</p>
                  <div style={styles.profileSummary}>
                    <span aria-hidden="true" style={{ ...styles.profileAvatar, ...styles.profileSummaryAvatar }}>{profileInitial}</span>
                    <div style={styles.profileDetails}>
                      <p style={styles.profileName}>{user ? profileName : t.member}</p>
                      <p style={styles.profileType}>{t.personalAccount}</p>
                      {user?.email && <p style={styles.profileEmail}>{user.email}</p>}
                    </div>
                  </div>
                  <div style={styles.profileDivider} />
                  <div style={{ padding: "0 3px" }}>
                    <MyEntriesToggle buttonRef={toggleRef} active={showMine} onClick={() => { handleToggleMine(); if (user) setProfileOpen(false); }} labelOn={t.viewAll} labelOff={t.viewMine} busy={!authReady} />
                  </div>
                  {!user && <>
                    <div style={styles.profileDivider} />
                    <Link href="/login" style={styles.profileAction}>{t.login}</Link>
                    <Link href="/signup" style={styles.profileAction}>{t.signup}</Link>
                  </>}
                  {user && <>
                    <div style={styles.profileDivider} />
                    <button type="button" onClick={() => { handleLogout(); setProfileOpen(false); }} style={{ ...styles.profileAction, color: "var(--red)" }}>{t.logOut}</button>
                  </>}
                  {showLoginPrompt && <LoginPrompt dialogRef={promptRef} firstLinkRef={loginLinkRef} title={t.loginPromptTitle} body={t.loginPromptBody} loginLabel={t.login} signupLabel={t.signup} closeLabel={t.close} onClose={closeLoginPrompt} />}
                </div>}
              </div>
              <button type="button" onClick={() => setLanguage((current) => (current === "en" ? "kh" : "en"))} aria-label="Language toggle" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 54, height: 32, border: "1px solid var(--surface-border)", borderRadius: 999, background: "var(--surface)", color: "var(--ink)", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", fontFamily: fontSans, boxShadow: "0 0 0 1px var(--surface-border)" }}>
                {getLanguageLabel(language)}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {!isSearchActive && !showMine && <section style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.kicker}>{t.kicker}</p>
          <h1 className="yk-hero-title" style={styles.heroTitle}>{t.heroTitle}</h1>
          <p style={styles.heroDescription}>{t.heroDescription}</p>
          <div style={styles.metaRow}>
            <div className="yk-meta" style={{ ...styles.meta, ...styles.metaFirst }}><p style={styles.metaLabel}>{t.curatedBy}</p><p style={styles.metaValue}>{heroMeta.curator}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>{t.province}</p><p style={styles.metaValue}>{heroMeta.province}</p></div>
            <div className="yk-meta" style={styles.meta}><p style={styles.metaLabel}>{t.source}</p><p style={styles.metaValue}>{heroMeta.source}</p></div>
          </div>
        </div>
      </section>}

      <main id="main" style={styles.main}>
        <section aria-labelledby="latest-heading">
          <div style={styles.sectionHeader}><h2 id="latest-heading" style={styles.sectionTitle}>{showMine ? t.myEntries : t.latestEntries}</h2><span style={styles.countPill} aria-label={entriesLoading ? t.loadingEntries : `${filtered.length} entries`}>{entriesLoading ? "…" : filtered.length}</span></div>
          {entriesLoading ? <div style={styles.empty} role="status"><h2 style={styles.emptyTitle}>{t.loadingEntries}</h2></div>
            : entriesError ? <div style={styles.empty} role="alert"><h2 style={styles.emptyTitle}>{t.entriesLoadFailed}</h2></div>
              : showMine && user && !committedQuery.trim() && filtered.length === 0 ? <div style={styles.empty}><h2 style={styles.emptyTitle}>{t.noOwnedEntries}</h2><Link href="/contribute" style={styles.authLink}>{t.contribute}</Link></div>
                : entries.length === 0 ? <div style={styles.empty}><h2 style={styles.emptyTitle}>{t.noEntries}</h2><p style={styles.emptyKh}>{t.noEntriesSubtitle}</p></div>
                : filtered.length > 0 ? <div style={styles.entryList}>{filtered.map(({ entry, index }) => <EntryCard key={entry.id || entry.title || index} id={entry.id} canManage={Boolean(user) && entry.owner === user.id} userId={user?.id} onDeleted={(deletedId) => setEntries((current) => current.filter((item) => item.id !== deletedId))} entryId={`entry-${index + 1}`} entryNumber={String(index + 1)} {...entry} language={language} />)}</div>
                  : <div style={styles.empty}><h2 style={styles.emptyTitle}>{language === "kh" ? `គ្មានឯកសារណាមួយត្រូវនឹង “${committedQuery || query}”` : `No entries match “${committedQuery || query}”`}</h2><p style={styles.emptyKh}>{t.emptySubtitle}</p><button type="button" className="yk-empty-clear" style={styles.emptyClear} onClick={clearSearch}>{t.clearSearch}</button></div>}
        </section>
        <footer style={styles.footer}>{language === "kh" ? "កំណត់ត្រាដែលកំពុងរីកចម្រើនអំពីយីកេ ដែលត្រូវបានសាងសង់ដោយក្តីស្រមៃ និងការយកចិត្តទុកដាក់ក្នុង ICT 340 នៅมหาวิทยาลัยអាមេរិកខេត្តភ្នំពេញ ប្រចាំឆ្នាំ 2026." : "A growing record of Yike, built with care in ICT 340 at the American University of Phnom Penh, Fall 2026."} <span>· {entriesLoading ? "…" : entries.length} entries</span></footer>
      </main>
      <button type="button" className={`yk-back-top${showTop ? " is-visible" : ""}`} style={styles.topButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </>
  );
}
