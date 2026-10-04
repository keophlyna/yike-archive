"use client";

import { useRef, useState } from "react";
import ContributeFields from "./ContributeFields.js";
import { validateEntry } from "../utils/validateEntry.js";

const emptyValues = { title: "", title_kh: "", description: "", description_kh: "", category: "", place: "", contributor: "", contributor_kh: "", photo_is_ai: false };

// Shared by /contribute and /entries/<id>/edit so both run exactly the same
// validation and render the same fields. The caller only supplies the starting
// values and onSave, which receives the validated payload and resolves to
// { ok: true } (the caller navigates away) or
// { ok: false, error, message, field } to show message above the form and
// message again next to field.
export default function EntryForm({ initialValues, onSave, photoRequired = true, photoHint, intro, submitLabel }) {
  const [values, setValues] = useState(initialValues || emptyValues);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const clearField = (name) => setErrors((current) => (current[name] ? { ...current, [name]: "" } : current));

  const handleChange = (name) => (value) => {
    setValues((current) => ({ ...current, [name]: value }));
    clearField(name);
  };

  const handlePhotoChange = (file) => {
    setPhoto(file);
    clearField("photo");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setMessage("");

    const checked = await validateEntry(values, photo, { photoRequired });
    if (!checked.ok) {
      setErrors(checked.errors);
      setMessage("Please fix the fields marked below.");
      savingRef.current = false;
      setIsSaving(false);
      return;
    }

    const result = await onSave({ cleaned: checked.cleaned, image: checked.image, photoFile: photo });
    if (!result.ok) {
      setErrors(result.field ? { [result.field]: result.message } : {});
      setMessage(result.message);
      savingRef.current = false;
      setIsSaving(false);
    }
    // On success the caller navigates, so the form stays disabled on purpose.
  };

  return <ContributeFields values={values} errors={errors} message={message} isSaving={isSaving} onChange={handleChange} onPhotoChange={handlePhotoChange} onSubmit={handleSubmit} intro={intro} photoHint={photoHint} submitLabel={submitLabel} photoRequired={photoRequired} />;
}