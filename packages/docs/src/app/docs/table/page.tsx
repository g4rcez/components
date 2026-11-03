"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { ColType, createColumns, Table, useTablePreferences, uuid } from "@g4rcez/components";
import { useState } from "react";

type User = { id: string; name: string; type: string; document: string };

const cols = createColumns<User>((col) => {
    col.add(
        "name",
        ({ Properties }) => (
            <span className="flex items-center gap-2">
                <Properties />
                Nome
            </span>
        ),
        {
            type: ColType.Number,
            headerLabel: "Name",
            Element: (props) => {
                return (
                    <span className="whitespace-pre-line break-words">
                        {props.rowIndex}. {props.value}
                    </span>
                );
            },
        }
    );
    col.add("id", "ID", {
        thProps: { style: { width: "40%" } },
        Element: (props) => (
            <span>
                {props.rowIndex}. {props.value}
            </span>
        ),
    });
    col.add("type", "Type", { thProps: { style: { width: "10%" } } });
    col.add("document", "Document", { thProps: { style: { width: "22%" } } });
});

const clients = Array.from({ length: 500 }).map(
    (_, i): User => ({
        id: uuid(),
        name: `${i}`.repeat(i).substring(0, 30),
        type: i % 2 === 0 ? "pj" : "pf",
        document: i % 2 === 0 ? "000.000.000-00" : "00.000.000/0001-00",
    })
);

const groupedClients = [
    { key: "pj", name: "Companies" },
    { key: "pf", name: "Individuals" },
].map(({ key, name }, index) => ({
    ...cols.find((col) => col.id === "type")!,
    groupId: `client-type-${key}`,
    groupKey: "type" as const,
    groupName: name,
    groupTitle: <div className="text-lg font-medium uppercase">{name}</div>,
    index,
    rows: clients.filter((client) => client.type === key).slice(0, 10),
}));

export default function TablePage() {
    const preferences = useTablePreferences("@test-table", cols);
    const groupPreferences = useTablePreferences("@table-groups", cols, { groups: groupedClients });
    const selectionPreferences = useTablePreferences("@table-row-selection", cols);
    const borderPreferences = useTablePreferences("@table-border", cols);
    const [selected, setSelected] = useState<string[]>([]);
    return (
        <DocsLayout
            title="Table"
            section="Display"
            description="Virtualized tables for large datasets, complex interactions, and aligned records."
            useWhen="Use Table for related records that benefit from aligned columns, sorting, grouping, or selection."
            avoidWhen="Avoid a table when each record needs a different layout or when a short list is easier to scan as cards."
            accessibility="Keep native table semantics, provide a caption or accessible name, and keep row and column actions keyboard reachable."
        >
            <ComponentDemo
                title="Virtual and fast by default"
                description="The table component uses the react-virtuoso to guarantee a fast and virtualized table, avoiding problems with large datasets"
                code={`import { Table } from "@g4rcez/components";
function VirtualTable() {
  return (
    <Table
      cols={cols}
      rows={data}
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
                    loading={clients.length === 0}
                    getRowProps={(item: User) => (item.type === "pf" ? { className: "bg-muted" } : {})}
                />
            </ComponentDemo>
            <ComponentDemo
                title="Row selection"
                description="Set selectable and reference to add a checkbox to each row. The header checkbox selects the rows that pass the active filters, and shows a mixed state when only some are selected. Leave selected undefined to let the table keep the selection."
                code={`import { Table } from "@g4rcez/components";
import { useState } from "react";

function SelectableTable() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Table
      name="clients"
      cols={cols}
      rows={clients}
      reference="id"
      selectable
      selected={selected}
      onSelectionChange={(ids, rows) => setSelected(ids)}
    />
  );
}`}
            >
                <Table<User>
                    {...selectionPreferences}
                    name="table-row-selection"
                    rows={clients.slice(0, 20)}
                    reference="id"
                    selectable
                    selected={selected}
                    onSelectionChange={(ids) => setSelected(ids)}
                />
            </ComponentDemo>
            <ComponentDemo
                title="Column dividers"
                description="The default look has horizontal dividers only. Pass border to show the column dividers."
                code={`<Table name="clients" cols={cols} rows={clients} border />`}
            >
                <Table<User> {...borderPreferences} name="table-border" rows={clients.slice(0, 10)} border />
            </ComponentDemo>
            <ComponentDemo
                title="Grouped rows"
                description="Set the initial groups to split related rows into separate tables. Use the Group control to change or clear the grouping."
                code={`const groups = ["pj", "pf"].map((type, index) => ({
  ...cols.find((column) => column.id === "type"),
  groupId: \`client-type-\${type}\`,
  groupKey: "type",
  groupName: type,
  groupTitle: <span>{type === "pj" ? "Companies" : "Individuals"}</span>,
  index,
  rows: clients.filter((client) => client.type === type),
}));

function GroupedTable() {
  const preferences = useTablePreferences("clients-by-type", cols, { groups });

  return <Table {...preferences} name="clients-by-type" rows={clients} />;
}`}
            >
                <Table<User> {...groupPreferences} name="table-groups" rows={clients.slice(0, 20)} loading={clients.length === 0} />
            </ComponentDemo>
        </DocsLayout>
    );
}
