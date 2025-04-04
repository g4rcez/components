"use client";
import { DocsLayout } from "@/components/docs-layout";
import {
  Card,
  createColumns,
  Table,
  useTablePreferences,
  uuid,
} from "../../../../../lib/src";

type User = { id: string; name: string; type: string; document: string };

const cols = createColumns<User>((col) => {
  col.add("id", "Nome", { allowSort: false });
  col.add("type", "Type", { allowSort: false, allowFilter: false });
  col.add("document", "Document", { allowSort: false, allowFilter: false });
});

const clients = Array.from({ length: 100 })
  .map(
    (_, i): User => ({
      id: uuid(),
      name: `Cliente ${i}`,
      type: i % 2 === 0 ? "pj" : "pf",
      document: i % 2 === 0 ? "00000000000" : "00000000000000",
    }),
  )
  .sort((a, b) => a.id.localeCompare(b.id));

export default function TablePage() {
  const preferences = useTablePreferences("@test", cols);
  return (
    <DocsLayout
      title="Table"
      section="display"
      description="The tradicional tabular way to visualize your data."
    >
      <Card container="px-0 py-0" className="px-0">
        <Table<User>
          {...preferences}
          sticky={40}
          name="table"
          rows={clients}
          operations={false}
        />
      </Card>
    </DocsLayout>
  );
}
