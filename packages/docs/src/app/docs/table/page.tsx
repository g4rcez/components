"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { Fragment, useState } from "react";
import {
    Button,
    ColType,
    createColumns,
    getModalScrollerRef,
    Modal,
    Table,
    useTablePreferences,
    uuid
} from "../../../../../lib/src";

type User = { id: string; name: string; type: string; document: string };

const cols = createColumns<User>((col) => {
  col.add("name", "Nome", {
    allowSort: true,
    allowFilter: true,
    type: ColType.Number,
    Element: (props) => (
      <span className="whitespace-pre-line break-words">
        {props.rowIndex}. {props.value}
      </span>
    ),
  });
  col.add("id", "ID", {
    thProps: { style: { width: "40%" } },
    Element: (props) => (
      <span>
        {props.rowIndex}. {props.value}
      </span>
    ),
  });
  col.add("type", "Type", {
    thProps: { style: { width: "10%" } },
  });
  col.add("document", "Document", {
    thProps: { style: { width: "22%" } },
  });
});

const clients = Array.from({ length: 500 }).map(
  (_, i): User => ({
    id: uuid(),
    name: `${i}`.repeat(i).substring(0, 30),
    type: i % 2 === 0 ? "pj" : "pf",
    document: i % 2 === 0 ? "000.000.000-00" : "00.000.000/0001-00",
  }),
);

export default function TablePage() {
  const preferences = useTablePreferences("@test-table", cols);
  return (
    <DocsLayout
      title="Table"
      section="Display"
      description="A high-performance, feature-rich tabular data component designed for large datasets and complex interactions."
    >
      <ComponentDemo
        title="Virtual and fast by default"
        description="The table component uses the react-virtuoso to guarantee a fast and virtualized table, avoiding problems with large datasets"
        code={`import { Table, Checkbox } from "@g4rcez/components";
function SelectionTable() {
  return (
    <Table
      cols={cols}
      rows={data}
      Aside={({ row }) => (
        <Checkbox 
          checked={isSelected(row.id)} 
          onChange={handleSelect} 
        />
      )}
      getRowProps={(item) => 
        item.type === "pf" ? { 
          style: { background: "hsla(0, 0%, 14%, 0.5)" } 
        } : {}
      }
    />
  );
}`}
      >
        <Table<User>
          {...preferences}
          name="table-selection"
          rows={clients.slice(0, 100)}
          operations={false}
          loading={clients.length === 0}
          getRowProps={(item: User) =>
            item.type === "pf" ? { className: "bg-muted" } : {}
          }
        />
      </ComponentDemo>
    </DocsLayout>
  );
}
