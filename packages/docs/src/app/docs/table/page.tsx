"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card, createColumns, Table, uuid } from "../../../../../lib/src";

type User = { id: string; name: string; type: string; document: string };

const cols = createColumns<User>((col) => {
  col.add("name", "Name");
  col.add("document", "Document");
});

const clients = Array.from({ length: 50 })
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
  return (
    <DocsLayout
      title="Table"
      section="display"
      description="The tradicional tabular way to visualize your data."
    >
      <Card className="px-4">
        <Table<User>
          inlineFilter
          name="table"
          cols={cols}
          rows={clients}
          operations={false}
          inlineSorter={false}
          setFilters={(e) => console.log("FILTERS ", e)}
        />
      </Card>
    </DocsLayout>
  );
}
