"use client";

import CheckboxField from "./CheckboxField.js";
import FileField from "./FileField.js";
import SelectField from "./SelectField.js";
import TextField from "./TextField.js";
import PLACES from "../utils/places.js";
import { CATEGORIES } from "../utils/validateEntry.js";

const placeOptions = PLACES.map((place) => ({ value: place.en, label: `${place.en} — ${place.kh}` }));
const categoryOptions = CATEGORIES.map((category) => ({ value: category, label: category }));

// Defaults for /contribute; the edit page overrides all three.
const defaultIntro = "Fill in the fields below. Khmer text is stored exactly as you write it, and the photo is required.";
const defaultPhotoHint = "JPG, PNG, or WebP, up to 5 MB";
const defaultSubmitLabel = "Save entry";

const styles = {
  intro: { margin: "0 0 30px", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  form: { display: "grid", gap: 22 },
  row: { display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" },
  message: { margin: 0, color: "var(--red)", font: "600 14px/1.5 var(--font-google-sans), sans-serif" },
  button: { justifySelf: "start", padding: "13px 22px", border: 0, background: "var(--red)", color: "var(--hero-fg)", font: "600 14px var(--font-google-sans), sans-serif", cursor: "pointer" },
  buttonBusy: { opacity: 0.65, cursor: "progress" },
};

export default function ContributeFields({ values, errors, message, isSaving, onChange, onPhotoChange, onSubmit, intro = defaultIntro, photoHint = defaultPhotoHint, submitLabel = defaultSubmitLabel }) {
  return (
    <>
      <p style={styles.intro}>{intro}</p>
      <form style={styles.form} onSubmit={onSubmit} noValidate>
        <TextField id="title" label="Title" value={values.title} onChange={onChange("title")} error={errors.title} maxLength={120} />
        <TextField id="title_kh" label="Title in Khmer — optional" value={values.title_kh} onChange={onChange("title_kh")} error={errors.title_kh} maxLength={120} khmer />
        <TextField id="description" label="Description" value={values.description} onChange={onChange("description")} error={errors.description} maxLength={2500} multiline />
        <TextField id="description_kh" label="Description in Khmer — optional" value={values.description_kh} onChange={onChange("description_kh")} error={errors.description_kh} maxLength={2500} multiline khmer />
        <div style={styles.row}>
          <SelectField id="category" label="Category" value={values.category} onChange={onChange("category")} options={categoryOptions} placeholder="Choose a category" error={errors.category} />
          <SelectField id="place" label="Place" value={values.place} onChange={onChange("place")} options={placeOptions} placeholder="Choose a place" error={errors.place} />
        </div>
        <div style={styles.row}>
          <TextField id="contributor" label="Contributor" value={values.contributor} onChange={onChange("contributor")} error={errors.contributor} maxLength={100} hint="A person or organization, in English" />
          <TextField id="contributor_kh" label="Contributor in Khmer — optional" value={values.contributor_kh} onChange={onChange("contributor_kh")} error={errors.contributor_kh} maxLength={100} khmer />
        </div>
        <FileField id="photo" label="Photo" hint={photoHint} error={errors.photo} onChange={onPhotoChange} />
        <CheckboxField id="photo_is_ai" label="This image is AI-generated" checked={values.photo_is_ai} onChange={onChange("photo_is_ai")} />
        {message ? <p role="alert" style={styles.message}>{message}</p> : null}
        <button style={{ ...styles.button, ...(isSaving ? styles.buttonBusy : {}) }} type="submit" disabled={isSaving}>{isSaving ? "Saving…" : submitLabel}</button>
      </form>
    </>
  );
}