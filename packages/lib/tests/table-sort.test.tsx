import { render, screen } from "@testing-library/react";
import { VirtuosoMockContext } from "react-virtuoso";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import type { Sorter } from "../src/components/table/sort";
import { createColumns } from "../src/components/table/table-lib";

type Row = { id: string; name: string };

const columns = createColumns<Row>((column) => {
    column.add("name", "Name", { allowFilter: false });
});

const byNameDescending: Sorter<Row> = { id: "sort-name", value: "name", type: "desc" as Sorter<Row>["type"], label: "Name" };

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverMock {
    root = null;
    rootMargin = "0px";
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

describe("Table sort", () => {
    it("shows the sorted order and keeps the rows prop in its original order", () => {
        const rows: Row[] = [
            { id: "1", name: "Ada" },
            { id: "2", name: "Bob" },
            { id: "3", name: "Cy" },
        ];

        render(
            <ComponentsProvider>
                <VirtuosoMockContext.Provider value={{ viewportHeight: 600, itemHeight: 48 }}>
                    <Table<Row>
                        name="sort"
                        cols={columns}
                        rows={rows}
                        reference="id"
                        loading={false}
                        operations={false}
                        sorters={[byNameDescending]}
                    />
                </VirtuosoMockContext.Provider>
            </ComponentsProvider>
        );

        expect(screen.getAllByText(/^(Ada|Bob|Cy)$/).map((name) => name.textContent)).toEqual(["Cy", "Bob", "Ada"]);
        expect(rows.map((row) => row.name)).toEqual(["Ada", "Bob", "Cy"]);
    });
});
