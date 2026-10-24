"use client";

import CheckboxField from "./CheckboxField.js";
import Link from "next/link";
import FileField from "./FileField.js";
import SelectField from "./SelectField.js";
import TextField from "./TextField.js";
import PLACES from "../utils/places.js";
import { CATEGORIES } from "../utils/validateEntry.js";
import useLanguage from "./useLanguage.js";
import formText from "../utils/formText.js";

const categoryTextKey = { History: "categoryHistory", Performance: "categoryPerformance", Music: "categoryMusic", Costume: "categoryCostume", "Oral History": "categoryOralHistory" };

// Defaults for /contribute; the edit page overrides all three.
const styles = {
  intro: { margin: "0 0 8px", color: "var(--ink-soft)", font: "400 15px/1.6 var(--font-google-sans), sans-serif" },
  legend: { margin: "0 0 26px", color: "var(--ink-soft)", font: "400 13px/1.5 var(--font-google-sans), sans-serif" },
  marker: { color: "var(--red)", fontWeight: 700 },
  form: { display: "grid", gap: 22 },
  row: { display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" },
  message: { margin: 0, color: "var(--red)", font: "600 14px/1.5 var(--font-google-sans), sans-serif" },
  actions: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  button: { justifySelf: "start", minHeight: 44, padding: "13px 22px", border: 0, background: "var(--red)", color: "var(--hero-fg)", font: "600 14px var(--font-google-sans), sans-serif", cursor: "pointer" },
  cancel: { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: "11px 20px", border: "1px solid var(--surface-border)", background: "var(--surface)", color: "var(--ink)", font: "600 14px var(--font-google-sans), sans-serif", textDecoration: "none" },
  buttonBusy: { opacity: 0.65, cursor: "progress" },
};

export default function ContributeFields({ values, errors, message, isSaving, onChange, onInvalidInput, onPhotoChange, onSubmit, intro, photoHint, submitLabel, photoRequired = true, cancelHref }) {
  const language = useLanguage();
  const t = formText[language];
  const categoryOptions = CATEGORIES.map((category) => ({ value: category, label: language === "kh" ? t[categoryTextKey[category]] : category }));
  const placeOptions = PLACES.map((place) => ({ value: place.en, label: language === "kh" ? place.kh : place.en }));
  return (
    <>
      <p style={styles.intro}>{intro || t.fillFields}</p>
      <p style={styles.legend}>{t.requiredLegend}</p>
      <form className="yk-entry-form" style={styles.form} onSubmit={onSubmit} noValidate>
        <TextField id="title" label={t.title} value={values.title} onChange={onChange("title")} onInvalidInput={onInvalidInput("title")} error={errors.title} maxLength={120} required titleTextEntryOnly trimOnBlur />
        <TextField id="title_kh" label={t.titleKh} value={values.title_kh} onChange={onChange("title_kh")} error={errors.title_kh} maxLength={120} khmer />
        <TextField id="description" label={t.description} value={values.description} onChange={onChange("description")} error={errors.description} maxLength={2500} multiline required />
        <TextField id="description_kh" label={t.descriptionKh} value={values.description_kh} onChange={onChange("description_kh")} error={errors.description_kh} maxLength={2500} multiline khmer />
        <div style={styles.row}>
          <SelectField id="category" label={t.category} value={values.category} onChange={onChange("category")} options={categoryOptions} placeholder={t.chooseCategory} error={errors.category} required />
          <SelectField id="place" label={t.place} value={values.place} onChange={onChange("place")} options={placeOptions} placeholder={t.choosePlace} error={errors.place} required />
        </div>
        <div style={styles.row}>
          <TextField id="contributor" label={t.contributor} value={values.contributor} onChange={onChange("contributor")} onInvalidInput={onInvalidInput("contributor")} error={errors.contributor} maxLength={100} hint={t.contributorHint} required textEntryOnly trimOnBlur />
          <TextField id="contributor_kh" label={t.contributorKh} value={values.contributor_kh} onChange={onChange("contributor_kh")} error={errors.contributor_kh} maxLength={100} khmer />
        </div>
        <TextField id="sources" label={t.sources} value={values.sources} onChange={onChange("sources")} error={errors.sources} maxLength={2500} multiline />
        <TextField id="sources_kh" label={t.sourcesKh} value={values.sources_kh} onChange={onChange("sources_kh")} error={errors.sources_kh} maxLength={2500} multiline khmer />
        <FileField id="photo" label={t.photo} hint={photoHint || t.photoHint} error={errors.photo} onChange={onPhotoChange} required={photoRequired} />
        <CheckboxField id="photo_is_ai" label={t.aiPhoto} checked={values.photo_is_ai} onChange={onChange("photo_is_ai")} />
        {message ? <p role="alert" style={styles.message}>{message}</p> : null}
        <div style={styles.actions}>
          <button style={{ ...styles.button, ...(isSaving ? styles.buttonBusy : {}) }} type="submit" disabled={isSaving}>{isSaving ? t.saving : submitLabel || t.saveEntry}</button>
          {cancelHref && <Link href={cancelHref} style={styles.cancel}>{t.cancel}</Link>}
        </div>
      </form>
    </>
  );
}
