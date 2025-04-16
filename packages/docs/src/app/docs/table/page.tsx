"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Fragment, useEffect, useState } from "react";
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
    allowSort: true,
    allowFilter: true,
    type: ColType.Number,
    Element: (props) => (
      <Fragment>
        {props.rowIndex}. {props.value}
      </Fragment>
    ),
  });
  col.add("id", "ID");
  col.add("type", "Type");
  col.add("document", "Document");
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TablePage() {
  const preferences = useTablePreferences("@test", cols);
  const [clients, setClients] = useState<User[]>([]);

  useEffect(() => {
    const req = async () => {
      await sleep(3000);
      setClients(
        Array.from({ length: 1000 }).map(
          (_, i): User => ({
            id: uuid(),
            name: i,
            type: i % 2 === 0 ? "pj" : "pf",
            document: i % 2 === 0 ? "00000000000" : "00000000000000",
          }),
        ),
      );
    };
    req();
  }, []);

  return (
    <DocsLayout
      title="Table"
      section="display"
      description="The tradicional tabular way to visualize your data."
    >
      <Card container="px-0 py-0 pb-0" className="py-0 pb-0 lg:px-0 px-0">
        <Table<User>
          {...preferences}
          loading={clients.length === 0}
          sticky={40}
          name="table"
          rows={clients}
          operations={false}
        />
      </Card>
    </DocsLayout>
  );
}
