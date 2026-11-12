"use client";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";
import { ColType, createColumns, Table, Tag, useTablePreferences } from "@g4rcez/components";
import { useState } from "react";
import { type Language, languages, type Paradigm, paradigmTheme } from "./languages";

const initials = (name = "") =>
    name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const cols = createColumns<Language>((col) => {
    col.add(
        "name",
        ({ Properties }) => (
            <span className="flex items-center gap-2">
                <Properties />
                Language
            </span>
        ),
        {
            type: ColType.Text,
            headerLabel: "Language",
            Element: (props) => <span className="text-sm font-medium">{props.value}</span>,
        }
    );
    col.add("creator", "Creator", {
        type: ColType.Text,
        Element: (props) => (
            <span className="flex items-center gap-2 text-sm">
                <span
                    aria-hidden="true"
                    className="bg-muted inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium"
                >
                    {initials(props.value)}
                </span>
                {props.value}
            </span>
        ),
    });
    col.add("paradigm", "Paradigm", {
        type: ColType.Text,
        Element: (props) => (
            <Tag appearance="soft" size="tiny" theme={paradigmTheme[props.value]}>
                {props.value}
            </Tag>
        ),
    });
});

const paradigms = Object.keys(paradigmTheme) as Paradigm[];

const groupedLanguages = paradigms.map((paradigm, index) => ({
    ...cols.find((col) => col.id === "paradigm")!,
    groupId: `language-paradigm-${index}`,
    groupKey: "paradigm" as const,
    groupName: paradigm,
    groupTitle: <span className="font-medium">{paradigm}</span>,
    index,
    rows: languages.filter((item) => item.paradigm === paradigm),
}));

export default function TablePage() {
    const preferences = useTablePreferences("@table-languages", cols, { groups: groupedLanguages });
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
                description="One table with every option on: 200 rows rendered by react-virtuoso with window scroll, so only the rows near the viewport are in the DOM and the page scrolls with the table. The header stays sticky, the checkbox column selects rows, the toolbar sorts, filters and groups, the Properties button reorders columns, and border adds the column dividers."
                code={`import { ColType, createColumns, Table, Tag, useTablePreferences } from "@g4rcez/components";
import { useState } from "react";

const cols = createColumns<Language>((col) => {
  col.add("name", ({ Properties }) => <span><Properties /> Language</span>, { type: ColType.Text });
  col.add("creator", "Creator", { type: ColType.Text });
  col.add("paradigm", "Paradigm", {
    type: ColType.Text,
    Element: (props) => <Tag appearance="soft" size="small" theme={theme[props.value]}>{props.value}</Tag>,
  });
});

const groups = paradigms.map((paradigm, index) => ({
  ...cols.find((column) => column.id === "paradigm"),
  groupId: \`language-paradigm-\${index}\`,
  groupKey: "paradigm",
  groupName: paradigm,
  groupTitle: <span>{paradigm}</span>,
  index,
  rows: languages.filter((item) => item.paradigm === paradigm),
}));

function LanguagesTable() {
  const preferences = useTablePreferences("languages", cols, { groups });
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Table
      {...preferences}
      border
      selectable
      operations
      name="languages"
      reference="id"
      rows={languages}
      selected={selected}
      onSelectionChange={(ids) => setSelected(ids)}
    />
  );
}`}
            >
                <div className="w-full [--var-table-cell-padding:0.5rem] [--var-table-head-cell-block-size:2.25rem] [--var-table-properties-trigger-min-block-size:2rem] [--var-table-row-block-size:2.25rem] [--var-table-selection-target-size:1.75rem]">
                    <Table<Language>
                        {...preferences}
                        border
                        selectable
                        operations
                        name="table-languages"
                        reference="id"
                        rows={languages}
                        selected={selected}
                        onSelectionChange={(ids) => setSelected(ids)}
                    />
                </div>
            </ComponentDemo>
        </DocsLayout>
    );
}
