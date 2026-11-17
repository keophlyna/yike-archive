import ReviewQueue from "../../components/review/ReviewQueue.js";
import { createClient } from "../../utils/supabase/server.js";

export const metadata = {
  title: "Review — Khmer Living Archive",
};

// Runs on the server for every request (it reads the login cookie). Entries are
// only queried after is_reviewer returns exactly true; anything else (false,
// null, an error, a signed-out visitor) gets the reviewers-only message.
//
// A reviewer's own entries stay in the queue but are marked isOwn, so they show
// without Publish/Return: review_entry refuses to decide them, and another
// reviewer has to. The owner id itself is not passed on to the browser.
export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc("is_reviewer");
  if (isReviewer !== true) return <ReviewQueue allowed={false} />;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <ReviewQueue allowed={false} />;

  const { data, error } = await supabase
    .from("entries")
    .select("id, title, title_kh, description, description_kh, category, place, place_kh, contributor, contributor_kh, sources, sources_kh, photo_url, created_at, owner")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const entries = (data || []).map(({ owner, ...entry }) => ({ ...entry, isOwn: owner === user.id }));
  return <ReviewQueue allowed initialEntries={entries} loadFailed={Boolean(error)} />;
}
