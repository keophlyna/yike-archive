import { removePhoto, uploadPhoto } from "./uploadPhoto.js";

// Updates an entry in place. Changing the photo is optional: when no new file
// was picked, photo_url is simply left out of the update so the old photo stays.
//
// The update is filtered by id AND owner, and it always ends in .select() so we
// can prove a row really came back before telling anyone the change was saved
// (a blocked update returns zero rows with no error, which the length check catches).
//
// Returns { ok: true, id } or { ok: false, step, error, message }.
export async function updateEntry({ supabase, entryId, userId, cleaned, image, photoFile }) {
  let upload = null;

  if (image && photoFile) {
    upload = await uploadPhoto({ supabase, userId, file: photoFile, image });
    if (upload.error) return { ok: false, step: "upload", error: upload.error, message: "The photo could not be uploaded. Please try again." };
  }

  const changes = {
    title: cleaned.title,
    title_kh: cleaned.title_kh,
    description: cleaned.description,
    description_kh: cleaned.description_kh,
    category: cleaned.category,
    place: cleaned.place,
    place_kh: cleaned.place_kh,
    contributor: cleaned.contributor,
    contributor_kh: cleaned.contributor_kh,
    photo_is_ai: cleaned.photo_is_ai,
  };

  if (upload) changes.photo_url = upload.publicUrl;

  const { data, error } = await supabase
    .from("entries")
    .update(changes)
    .eq("id", entryId)
    .eq("owner", userId)
    .select();

  if (error || !data || data.length === 0) {
    if (upload) await removePhoto(supabase, upload.path);
    return {
      ok: false,
      step: "update",
      error: error || { message: "update returned no rows" },
      message: "That change wasn't saved",
    };
  }

  return { ok: true, id: data[0].id };
}