"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { ColType, createColumns, Table, useTablePreferences, uuid } from "@g4rcez/components";

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
                    loading={clients.length === 0}
                    getRowProps={(item: User) => (item.type === "pf" ? { className: "bg-muted" } : {})}
                />
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
