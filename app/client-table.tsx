"use client";
import { Card } from "~/components/display/card";
import { Table } from "~/components/table";
import { ColType, createColumns, useTablePreferences } from "~/components/table/table-lib";
import { uuid } from "~/lib/fns";

type State = {
    id: string;
    index: number;
    name: string;
    category: string;
};

const rows = Array.from({ length: 10 }).map((_, i) => ({
    id: uuid(),
    index: i,
    name: `Name ${i}`,
    category: i % 2 === 0 ? "A" : "B",
}));

const columns = createColumns<State>((col) => {
    col.add("id", "ID");
    col.add("name", "Name");
    col.add("index", "Index", { type: ColType.Number, });
    col.add("category", "Category");
});

export const ClientTable = () => {
    const config = useTablePreferences("table", { cols: columns });
    return (
        <Card>
            <Table<State> {...config} rows={rows} />
        </Card>
    );
};
