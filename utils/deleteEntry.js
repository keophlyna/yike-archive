// Deletes an entry the signed-in user owns. Filtered by id AND owner, and it
// always ends in .select() so we can prove a row really came back before
// claiming the delete happened (a blocked delete returns zero rows, not an error).
//
// Returns { ok: true, id } or { ok: false, error, message }.
export async function deleteEntry({ supabase, entryId, userId }) {
  const { data, error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq("owner", userId)
    .select();

  if (error || !data || data.length === 0) {
    return {
      ok: false,
      error: error || { message: "delete returned no rows" },
      message: "That change wasn't saved",
    };
  }

  return { ok: true, id: data[0].id };
}