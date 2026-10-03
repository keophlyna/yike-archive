import EntryDetail from "../../../components/EntryDetail.js";

// A generic title: the entry's own title can only be known after a client-side
// fetch, because utils/supabase/server.js is not configured in this project.
export const metadata = {
  title: "Archive entry — Khmer Living Archive",
};

export default async function EntryPage({ params }) {
  const { id } = await params;
  return <EntryDetail id={id} />;
}