// Loads one entry by id and converts the database row into the camelCase shape
// components/EntryCard.js expects. Every column is mapped one at a time so no
// unexpected column can leak into the view.
//
// entryNumber matches the homepage numbering: entries are listed newest-first,
// so the position is "how many entries were created after this one, plus one".
//
// Returns { entry } on success or { error } on failure. The real error object is
// handed back untouched so the caller can log it; it is never shown to a user.
export async function fetchEntry(supabase, id) {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error };

  const { count } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .gt("created_at", data.created_at);

  const position = (count || 0) + 1;

  return {
    entry: {
      title: data.title,
      titleKh: data.title_kh,
      description: data.description,
      descriptionKh: data.description_kh,
      contributor: data.contributor,
      contributorKh: data.contributor_kh,
      place: data.place,
      placeKh: data.place_kh,
      category: data.category,
      photo: data.photo_url,
      photoIsAi: data.photo_is_ai,
      phases: data.phases,
      characters: data.characters,
      garments: data.garments,
      entryNumber: String(position),
      entryId: `entry-${position}`,
    },
  };
}