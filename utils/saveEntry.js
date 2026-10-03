// Uploads the photo to the Supabase Storage bucket "photos" and then inserts
// the entry. Exactly twelve columns are written, one by one, so nothing from
// the form object is ever spread into the insert (no id, created_at, or status
// is sent, and owner comes from the session, never from the form).
//
// Returns { ok: true, id } on success, or { ok: false, step, error, message }
// on failure. The error object is for console.error only; `message` is the
// short, safe line the caller shows to the user.

import { removePhoto, uploadPhoto } from "./uploadPhoto.js";

export async function saveEntry({ supabase, userId, cleaned, image, photoFile }) {
  const upload = await uploadPhoto({ supabase, userId, file: photoFile, image });

  if (upload.error) return { ok: false, step: "upload", error: upload.error, message: "The photo could not be uploaded. Please try again." };

  const { data, error: insertError } = await supabase
    .from("entries")
    .insert({
      title: cleaned.title,
      title_kh: cleaned.title_kh,
      description: cleaned.description,
      description_kh: cleaned.description_kh,
      category: cleaned.category,
      place: cleaned.place,
      place_kh: cleaned.place_kh,
      contributor: cleaned.contributor,
      contributor_kh: cleaned.contributor_kh,
      photo_url: upload.publicUrl,
      photo_is_ai: cleaned.photo_is_ai,
      owner: userId,
    })
    .select("id")
    .single();

  if (insertError) {
    await removePhoto(supabase, upload.path);
    return { ok: false, step: "insert", error: insertError, message: "Your entry could not be saved. Please try again in a moment." };
  }

  return { ok: true, id: data.id };
}