import ReviewQueue from "../../components/ReviewQueue.js";
import { createClient } from "../../utils/supabase/server.js";

export const metadata = {
  title: "Review — Khmer Living Archive",
};

// Runs on the server for every request (it reads the login cookie). Entries are
// only queried after is_reviewer returns exactly true; anything else (false,
// null, an error, a signed-out visitor) gets the reviewers-only message.
export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc("is_reviewer");
  if (isReviewer !== true) return <ReviewQueue allowed={false} />;

  const { data, error } = await supabase
    .from("entries")
    .select("id, title, title_kh, description, description_kh, category, place, place_kh, contributor, contributor_kh, sources, sources_kh, photo_url, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ReviewQueue allowed initialEntries={data || []} loadFailed={Boolean(error)} />;
}
