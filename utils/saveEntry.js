// Uploads the photo to the Supabase Storage bucket "photos" and then inserts
// the entry. Exactly twelve columns are written, one by one, so nothing from
// the form object is ever spread into the insert (no id, created_at, or status
// is sent, and owner comes from the session, never from the form).
//
// Returns { ok: true, id } on success, or { ok: false, step, error } on failure.
// The caller decides what the user is told and logs the raw error itself.

const BUCKET = "photos";

const randomName = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export async function saveEntry({ supabase, userId, cleaned, image, photoFile }) {
  const path = `${userId}/${randomName()}.${image.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, photoFile, { contentType: image.mimeType, upsert: false });

  if (uploadError) return { ok: false, step: "upload", error: uploadError };

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

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
      photo_url: urlData.publicUrl,
      photo_is_ai: cleaned.photo_is_ai,
      owner: userId,
    })
    .select("id")
    .single();

  if (insertError) {
    const { error: cleanupError } = await supabase.storage.from(BUCKET).remove([path]);
    if (cleanupError) console.error("Could not remove the orphaned photo", path, cleanupError);
    return { ok: false, step: "insert", error: insertError };
  }

  return { ok: true, id: data.id };
}