// All form validation for /contribute lives here, so the components stay small
// and every rule is easy to read and defend.
//
// Nothing in this file rewrites Khmer text: values are trimmed and checked only.
// Khmer digits (០-៩), the Khmer full stop (។), and the zero-width space
// (U+200B) pass through untouched.

import PLACES from "./places.js";

export const CATEGORIES = ["History", "Performance", "Music", "Costume", "Oral History"];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const KHMER = /[\u1780-\u17ff]/;
const LETTER = /\p{L}/u;
const CONTROL = /\p{Cc}/u;
const CONTRIBUTOR_ALLOWED = /^[\p{L}\p{M}\p{N} .,;'&-()]+$/u;
// Only real URL shapes are caught here (a scheme, www., or a domain ending);
// every other character problem falls through to the allowlist message.
const URL_LIKE = /www\.|https?:|\.(?:com|net|org|edu|gov|info|biz|io|co|kh|app|dev)(?=$|[^a-zA-Z0-9.])/i;

export const findPlace = (englishName) => PLACES.find((place) => place.en === englishName) || null;

// The real file type comes from the file's first bytes, never from the
// extension or from file.type. The returned extension is the one used in the
// storage path. SVG and everything else is rejected.
const detectImage = (bytes) => {
  const hasBytes = (offset, text) => text.split("").every((char, index) => bytes[offset + index] === char.charCodeAt(0));

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { extension: "jpg", mimeType: "image/jpeg" };
  if (bytes.length >= 8 && hasBytes(0, "\x89PNG\r\n\x1a\n")) return { extension: "png", mimeType: "image/png" };
  if (bytes.length >= 12 && hasBytes(0, "RIFF") && hasBytes(8, "WEBP")) return { extension: "webp", mimeType: "image/webp" };
  return null;
};

async function checkPhoto(file) {
  if (!file) return { error: "Choose a photo", image: null };
  if (file.size === 0) return { error: "That file is empty", image: null };
  if (file.size > MAX_PHOTO_BYTES) return { error: "The photo must be 5 MB or smaller", image: null };
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const image = detectImage(head);
  if (!image) return { error: "Use a JPG, PNG, or WebP photo", image: null };
  return { error: "", image };
}

function checkTitle(value) {
  if (!value) return "Title is required";
  if (CONTROL.test(value)) return "Remove control characters";
  if (value.length < 3 || value.length > 120) return "Use 3 to 120 characters";
  if (!LETTER.test(value)) return "Add at least one letter";
  return "";
}

function checkDescription(value) {
  if (!value) return "Description is required";
  if (value.length < 30 || value.length > 2500) return "Use 30 to 2,500 characters";
  if (!LETTER.test(value)) return "Add at least one letter";
  return "";
}

function checkOptionalKhmer(value, maxLength, singleLine) {
  if (!value) return "";
  if (singleLine && CONTROL.test(value)) return "Remove control characters";
  if (value.length > maxLength) return `Use ${maxLength} characters or fewer`;
  if (!KHMER.test(value)) return "Add Khmer text, or leave this field empty";
  return "";
}

function checkCategory(value) {
  if (!value) return "Choose a category";
  if (!CATEGORIES.includes(value)) return "Choose a category from the list";
  return "";
}

function checkPlace(value, place) {
  if (!value) return "Choose a place";
  if (!place) return "Choose a place from the list";
  return "";
}

function checkContributor(value) {
  if (!value) return "Contributor is required";
  if (CONTROL.test(value)) return "Remove control characters";
  if (value.length > 100) return "Use 100 characters or fewer";
  if (URL_LIKE.test(value)) return "Enter a name, not a link or URL";
  if (!CONTRIBUTOR_ALLOWED.test(value)) return "Use letters, numbers, spaces, and . , ; ' - & ( )";
  if (/\bunknown\b/i.test(value)) return "Name the person or organization, not \u201cunknown\u201d";
  return "";
}

// Returns { ok: false, errors } with one short message per field that needs
// fixing, or { ok: true, cleaned, image } with trimmed values and the numbers
// the save step needs. place_kh is filled in from the chosen place.
export async function validateEntry(values, photoFile) {
  const cleaned = {
    title: String(values.title || "").trim(),
    title_kh: String(values.title_kh || "").trim(),
    description: String(values.description || "").trim(),
    description_kh: String(values.description_kh || "").trim(),
    category: String(values.category || "").trim(),
    place: String(values.place || "").trim(),
    contributor: String(values.contributor || "").trim(),
    contributor_kh: String(values.contributor_kh || "").trim(),
    photo_is_ai: values.photo_is_ai === true,
  };

  const place = findPlace(cleaned.place);
  const photo = await checkPhoto(photoFile);
  const errors = {
    title: checkTitle(cleaned.title),
    title_kh: checkOptionalKhmer(cleaned.title_kh, 120, true),
    description: checkDescription(cleaned.description),
    description_kh: checkOptionalKhmer(cleaned.description_kh, 2500, false),
    category: checkCategory(cleaned.category),
    place: checkPlace(cleaned.place, place),
    contributor: checkContributor(cleaned.contributor),
    contributor_kh: checkOptionalKhmer(cleaned.contributor_kh, 100, true),
    photo: photo.error,
  };

  const found = Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
  if (Object.keys(found).length > 0) return { ok: false, errors: found };

  return {
    ok: true,
    cleaned: {
      title: cleaned.title,
      title_kh: cleaned.title_kh,
      description: cleaned.description,
      description_kh: cleaned.description_kh,
      category: cleaned.category,
      place: cleaned.place,
      place_kh: place.kh,
      contributor: cleaned.contributor,
      contributor_kh: cleaned.contributor_kh,
      photo_is_ai: cleaned.photo_is_ai,
    },
    image: photo.image,
  };
}