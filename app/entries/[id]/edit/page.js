import EntryEditor from "../../../../components/EntryEditor.js";

export const metadata = {
  title: "Edit an entry — Khmer Living Archive",
};

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  return <EntryEditor id={id} />;
}