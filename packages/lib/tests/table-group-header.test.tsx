import { render, screen } from "@testing-library/react";
import { VirtuosoMockContext } from "react-virtuoso";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import type { FilterConfig } from "../src/components/table/filter";
import type { GroupItem } from "../src/components/table/group";
import { ColType, createColumns } from "../src/components/table/table-lib";

type Row = { id: string; name: string; status: string | null };

const columns = createColumns<Row>((column) => {
    column.add("name", "Name", { allowFilter: false });
    column.add("status", "Status", { allowFilter: false });
});

const rows: Row[] = [
    { id: "1", name: "Ada", status: "active" },
    { id: "2", name: "Bob", status: "inactive" },
    { id: "3", name: "Cy", status: "active" },
];

const group = (groupName: string, index: number): GroupItem<Row> => ({
    ...columns[1],
    groupId: `group-${groupName}`,
    groupKey: "status",
    groupName,
    index,
    rows: [],
});

const activeThenInactive = [group("active", 0), group("inactive", 1)];

const filterName = (value: string): FilterConfig<Row> => ({
    id: "filter-name",
    label: "Name",
    name: "name",
    type: ColType.Text,
    operation: { value: "is", label: "Is", symbol: "is" },
    value,
});

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

const renderTable = (props: { rows?: Row[]; groups?: GroupItem<Row>[]; filters?: FilterConfig<Row>[]; sticky?: number } = {}) =>
    render(
        <ComponentsProvider>
            <VirtuosoMockContext.Provider value={{ viewportHeight: 600, itemHeight: 48 }}>
                <Table<Row>
                    name="grouped"
                    cols={columns}
                    rows={props.rows ?? rows}
                    groups={props.groups ?? activeThenInactive}
                    filters={props.filters}
                    loading={false}
                    sticky={props.sticky}
                    operations={false}
                />
            </VirtuosoMockContext.Provider>
        </ComponentsProvider>
    );

const groupNames = (container: HTMLElement) => Array.from(container.querySelectorAll('th[scope="rowgroup"]')).map((th) => th.textContent);

describe("grouped table", () => {
    it("renders one column header and one named row per group", () => {
        const { container } = renderTable();

        expect(container.querySelectorAll("thead")).toHaveLength(1);
        expect(groupNames(container)).toEqual(["active", "inactive"]);
        expect(screen.getByText("Ada")).toBeInTheDocument();
        expect(screen.getByText("Cy")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("keeps the group row below a header that sticks at an offset", () => {
        const { container } = renderTable({ sticky: 56 });

        expect(container.querySelector('th[scope="rowgroup"]')?.closest("tr")).toHaveStyle({ top: "56px" });
    });

    it("hides a group whose rows are all filtered out", () => {
        const { container } = renderTable({ filters: [filterName("Bob")] });

        expect(groupNames(container)).toEqual(["inactive"]);
        expect(screen.queryByText("Ada")).toBeNull();
    });

    it("keeps groups set in code, named after groupName and holding their own rows", () => {
        const { container } = renderTable({
            groups: [
                { ...group("Companies", 0), rows: [rows[0], rows[2]] },
                { ...group("Individuals", 1), rows: [rows[1]] },
            ],
        });

        expect(groupNames(container)).toEqual(["Companies", "Individuals"]);
    });

    it("regroups from the current rows instead of a snapshot", () => {
        const { container } = renderTable({ rows: [...rows, { id: "4", name: "Di", status: "pending" }] });

        expect(groupNames(container)).toEqual(["active", "inactive", "pending"]);
    });

    it("names an empty value 'No value'", () => {
        const { container } = renderTable({ rows: [{ id: "1", name: "Ada", status: null }], groups: [group("null", 0)] });

        expect(groupNames(container)).toEqual(["No value"]);
    });

    it("shows the empty state once when every group is filtered out", () => {
        const { container } = renderTable({ filters: [filterName("Nobody")] });

        expect(container.querySelectorAll("thead")).toHaveLength(1);
        expect(groupNames(container)).toEqual([]);
        expect(screen.getAllByText("No data")).toHaveLength(1);
    });
});
