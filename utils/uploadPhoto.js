// The single place that knows how a photo reaches Supabase Storage: bucket
// "photos", path <user id>/<uuid>.<extension>. The extension always comes from
// the validated file type in utils/validateEntry.js, never from the filename.

const BUCKET = "photos";

const randomName = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export async function uploadPhoto({ supabase, userId, file, image }) {
  const path = `${userId}/${randomName()}.${image.extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: image.mimeType, upsert: false });

  if (error) return { error };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

// Best-effort cleanup for a photo whose row write failed. Never throws: the
// real failure is already being reported, so this only adds a log line.
export async function removePhoto(supabase, path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error("Could not remove the orphaned photo", path, error);
  return !error;
}