"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Fragment, useCallback, useState } from "react";
import {
  Card,
  Checkbox,
  ColType,
  createColumns,
  Table,
  useTablePreferences,
  uuid,
} from "../../../../../lib/src";
import { useStableRef } from "../../../../../lib/src/hooks/use-stable-ref";

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
  col.add("id", "ID", );
  col.add("type", "Type");
  col.add("document", "Document");
});

const clients = Array.from({ length: 100 }).map(
  (_, i): User => ({
    id: uuid(),
    name: i,
    type: i % 2 === 0 ? "pj" : "pf",
    document: i % 2 === 0 ? "000.000.000-00" : "00.000.000/0001-00",
  }),
);

export default function TablePage() {
  const preferences = useTablePreferences("@test", cols);
  const [map, setMap] = useState(new Map<string, any>());
  const mapRef = useStableRef(map);

  const Aside = useCallback(
    (props: any) => (
      <div className="flex h-full px-1 items-center">
        <Checkbox
          checked={mapRef.current.has(props.row.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            setMap((prev) => {
              const clone = new Map(prev);
              if (checked) clone.set(props.row.id, props.row);
              else clone.delete(props.row.id);
              return clone;
            });
          }}
        />
      </div>
    ),
    [map],
  );

  return (
    <DocsLayout
      title="Table"
      section="display"
      description="The tradicional tabular way to visualize your data."
    >
      <Card container="px-0 py-0 pb-0" className="py-0 pb-0 lg:px-0 px-0">
        <Table<User>
          {...preferences}
          name="table"
          Aside={Aside}
          rows={clients}
          operations={false}
          loading={clients.length === 0}
        />
      </Card>
    </DocsLayout>
  );
}
