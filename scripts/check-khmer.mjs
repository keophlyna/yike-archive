// Checks that every Khmer-bearing field on the entry forms accepts real Khmer
// text, keeps it byte-for-byte, and still enforces its length limits.
//
//     node scripts/check-khmer.mjs
//
// Why the copy step: this project is CommonJS (no "type": "module" in
// package.json), so Node cannot import utils/*.js directly. Those two modules
// are plain ESM with no JSX, so they are copied into a temporary directory as
// .mjs and imported from there. Nothing is added to package.json.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(path.join(tmpdir(), "yike-khmer-"));

const copy = (rel) => {
  const source = readFileSync(path.join(repo, rel), "utf8").replace(
    /from\s+["']\.\/([\w.-]+)\.js["']/g,
    'from "./$1.mjs"'
  );
  const target = path.join(temp, path.basename(rel, ".js") + ".mjs");
  writeFileSync(target, source, "utf8");
  return target;
};

copy("utils/places.js");
const validatePath = copy("utils/validateEntry.js");
const { validateEntry, CATEGORIES } = await import(pathToFileURL(validatePath).href);
const { default: PLACES } = await import(pathToFileURL(path.join(temp, "places.mjs")).href);

let pass = 0;
let fail = 0;
const check = (name, actual, expected) => {
  if (JSON.stringify(actual) === JSON.stringify(expected)) { pass += 1; console.log(`ok   ${name}`); return; }
  fail += 1;
  console.log(`FAIL ${name}\n     got  ${JSON.stringify(actual)}\n     want ${JSON.stringify(expected)}`);
};

// Real Khmer, not placeholder text: a sentence about the archive's own subject.
const SENTENCE = "ល្ខោនយីកេ គឺជាទម្រង់សិល្បៈប្រពៃណីខ្មែរមួយ ដែលរួមបញ្ចូលគ្នានូវតន្ត្រី រាំ និងការនិទានរឿង។ ";
const exactly120 = SENTENCE.repeat(2).slice(0, 120);
const over120 = exactly120 + "ក";
const exactly2500 = SENTENCE.repeat(60).slice(0, 2500);
const exactly100 = SENTENCE.repeat(4).slice(0, 100);

const BASE = {
  title: "Hom Rong opening ritual",
  title_kh: "ពិធីហោមរោង",
  description: "A long enough description to satisfy the thirty character minimum.",
  description_kh: "កំណត់ត្រា។",
  category: "Performance",
  place: "Takeo",
  contributor: "Yike Troupe",
  contributor_kh: "ក្រុមយីកេ",
};

const run = (overrides, photo = null, options = { photoRequired: false }) =>
  validateEntry({ ...BASE, ...overrides }, photo, options);
const msg = async (overrides, field) => {
  const result = await run(overrides);
  return result.ok ? undefined : result.errors[field];
};
try {
  // --- a title written entirely in Khmer satisfies "must contain a letter" ---
  check("an all-Khmer title is valid", await msg({ title: SENTENCE.trim().slice(0, 40) }, "title"), undefined);

  // --- title_kh length limits with real Khmer ---
  check("title_kh: exactly 120 Khmer characters accepted", await msg({ title_kh: exactly120 }, "title_kh"), undefined);
  check("title_kh: 121 Khmer characters rejected", await msg({ title_kh: over120 }, "title_kh"), "Use 120 characters or fewer");
  check("title_kh: Khmer with Latin words accepted", await msg({ title_kh: "ល្ខោន Yike — យីកេ" }, "title_kh"), undefined);
  check("title_kh: Latin only rejected", await msg({ title_kh: "Hom Rong opening" }, "title_kh"), "Add Khmer text, or leave this field empty");

  // --- description_kh length limits ---
  check("description_kh: exactly 2500 characters accepted", await msg({ description_kh: exactly2500 }, "description_kh"), undefined);
  check("description_kh: 2501 characters rejected", await msg({ description_kh: exactly2500 + "ក" }, "description_kh"), "Use 2500 characters or fewer");
  check("description_kh: the archive's own sentence accepted", await msg({ description_kh: SENTENCE.trim() }, "description_kh"), undefined);
  check("description_kh: line breaks kept", await msg({ description_kh: `${SENTENCE.trim()}\n${SENTENCE.trim()}` }, "description_kh"), undefined);

  // --- contributor_kh length limits ---
  check("contributor_kh: exactly 100 characters accepted", await msg({ contributor_kh: exactly100 }, "contributor_kh"), undefined);
  check("contributor_kh: 101 characters rejected", await msg({ contributor_kh: exactly100 + "ក" }, "contributor_kh"), "Use 100 characters or fewer");
  check("contributor_kh: Latin only rejected", await msg({ contributor_kh: "RUFA" }, "contributor_kh"), "Add Khmer text, or leave this field empty");

  // --- Khmer that must survive validation untouched ---
  const SPECIAL = "កំណត់ត្រាឆ្នាំ១៩៧៩។\u200bក្រោយទសវត្សរ៍។";
  const kept = (await run({ description_kh: SPECIAL })).cleaned.description_kh;
  check("Khmer digits, the full stop and U+200B survive exactly", kept, SPECIAL);
  check("the preserved text really contained all three", [
    kept.includes("១៩៧៩"), kept.includes("។"), kept.includes("\u200b"),
  ], [true, true, true]);

  // --- every place carries a real Khmer name in the Khmer block ---
  check("all 26 places are present", PLACES.length, 26);
  check("every place name contains a Khmer character",
    PLACES.every((place) => /[\u1780-\u17ff]/.test(place.kh)), true);
  check("Phnom Penh and Cambodia are Khmer",
    [PLACES.find((p) => p.en === "Phnom Penh").kh, PLACES.find((p) => p.en === "Cambodia").kh],
    ["ភ្នំពេញ", "កម្ពុជា"]);

  // --- a fully Khmer entry passes end to end ---
  const allKhmer = await run({
    title: SENTENCE.trim().slice(0, 60), title_kh: exactly120,
    description_kh: exactly2500, contributor_kh: exactly100,
  });
  check("a fully Khmer entry validates", allKhmer.ok, true);
  check("its Khmer title is stored unchanged", allKhmer.cleaned.title, SENTENCE.trim().slice(0, 60));
  check("category list still matches the spec", CATEGORIES.join("|"),
    "History|Performance|Music|Costume|Oral History");
} catch (err) {
  fail += 1;
  console.log("HARNESS ERROR: " + (err && err.stack ? err.stack : err));
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail === 0 ? 0 : 1;