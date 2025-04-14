"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Fragment } from "react";
import {
  Card,
  ColType,
  createColumns,
  Table,
  useTablePreferences,
  uuid,
} from "../../../../../lib/src";

type User = { id: string; name: number; type: string; document: string };

const cols = createColumns<User>((col) => {
  col.add("name", "Nome", {
    type: ColType.Number,
    Element: (props) => (
      <Fragment>
        {props.rowIndex}. {props.value}
      </Fragment>
    ),
  });
  col.add("type", "Type", { allowSort: false, allowFilter: false });
  col.add("document", "Document", { allowSort: false, allowFilter: false });
});

const clients = Array.from({ length: 100 }).map(
  (_, i): User => ({
    id: uuid(),
    name: i,
    type: i % 2 === 0 ? "pj" : "pf",
    document: i % 2 === 0 ? "00000000000" : "00000000000000",
  }),
);

export default function TablePage() {
  const preferences = useTablePreferences("@test", cols);
  return (
    <DocsLayout
      title="Table"
      section="display"
      description="The tradicional tabular way to visualize your data."
    >
      <Card container="px-0 py-0 pb-0" className="py-0 pb-0 lg:px-0 px-0">
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
