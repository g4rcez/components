import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import type { FilterConfig } from "../src/components/table/filter";
import { Row as TableRow } from "../src/components/table/row";
import { ColType, createColumns } from "../src/components/table/table-lib";

type Row = { id: string; name: string; status: string };

const rows: Row[] = [
    { id: "1", name: "Ada", status: "active" },
    { id: "2", name: "Bob", status: "inactive" },
    { id: "3", name: "Cy", status: "active" },
];

const columns = createColumns<Row>((column) => {
    column.add("name", "Name", { allowFilter: false });
    column.add("status", "Status", { allowFilter: false, allowSort: false });
});

const activeOnly = {
    id: "filter-status",
    label: "Status",
    name: "status",
    type: ColType.Text,
    operation: { value: "is", label: "Is", symbol: "is" },
    value: "active",
} satisfies FilterConfig<Row>;

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

afterEach(() => {
    vi.restoreAllMocks();
});

const renderTable = (props: Partial<ComponentProps<typeof Table<Row>>> = {}) =>
    render(
        <ComponentsProvider>
            <VirtuosoMockContext.Provider value={{ viewportHeight: 600, itemHeight: 48 }}>
                <Table<Row> name="selection" cols={columns} rows={[...rows]} reference="id" loading={false} operations={false} {...props} />
            </VirtuosoMockContext.Provider>
        </ComponentsProvider>
    );

const selectAll = () => screen.getByRole("checkbox", { name: "Select all rows" });
const selectRow = (id: string) => screen.getByRole("checkbox", { name: `Select row ${id}` });

describe("Table row selection", () => {
    it("renders no selection column without selectable", () => {
        renderTable();

        expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
        expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    });

    it("moves the header checkbox through unchecked, mixed and checked", async () => {
        const user = userEvent.setup();
        renderTable({ selectable: true });

        expect(selectAll()).not.toBeChecked();

        await user.click(selectRow("1"));
        expect(selectAll()).toBePartiallyChecked();

        await user.click(selectAll());
        expect(selectAll()).toBeChecked();
        expect(selectRow("1")).toBeChecked();
        expect(selectRow("2")).toBeChecked();
        expect(selectRow("3")).toBeChecked();

        await user.click(selectAll());
        expect(selectAll()).not.toBeChecked();
        expect(selectRow("1")).not.toBeChecked();
        expect(selectRow("2")).not.toBeChecked();
        expect(selectRow("3")).not.toBeChecked();
    });

    it("selects only the rows that pass the active filters", async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();
        renderTable({ selectable: true, filters: [activeOnly], onSelectionChange });

        await user.click(selectAll());

        expect(onSelectionChange).toHaveBeenLastCalledWith(["1", "3"], [rows[0], rows[2]]);
        expect(selectAll()).toBeChecked();
    });

    it("calls onSelectionChange in controlled mode and renders only the selected prop", async () => {
        const user = userEvent.setup();
        const onSelectionChange = vi.fn();
        renderTable({ selectable: true, selected: ["2"], onSelectionChange });

        await user.click(selectRow("1"));

        expect(onSelectionChange).toHaveBeenCalledTimes(1);
        expect(onSelectionChange).toHaveBeenCalledWith(["2", "1"], [rows[0], rows[1]]);
        expect(selectRow("1")).not.toBeChecked();
        expect(selectRow("2")).toBeChecked();
        expect(selectAll()).toBePartiallyChecked();
    });

    it("keeps the uncontrolled selection when the sort changes", async () => {
        const user = userEvent.setup();
        renderTable({ selectable: true });

        await user.click(selectRow("2"));
        await user.click(screen.getByRole("button", { name: "Order by Name" }));
        await user.click(screen.getByRole("button", { name: "Order by Name" }));

        expect(selectRow("1")).not.toBeChecked();
        expect(selectRow("2")).toBeChecked();
        expect(selectRow("3")).not.toBeChecked();
    });

    it("reaches each checkbox with Tab and toggles it with Space", async () => {
        const user = userEvent.setup();
        renderTable({ selectable: true, cols: createColumns<Row>((column) => column.add("name", "Name", { allowFilter: false, allowSort: false })) });

        await user.tab();
        expect(selectAll()).toHaveFocus();

        await user.tab();
        expect(selectRow("1")).toHaveFocus();
        await user.keyboard(" ");
        expect(selectRow("1")).toBeChecked();

        await user.tab();
        expect(selectRow("2")).toHaveFocus();
    });

    it("renders one empty cell for the undefined row a grouped table hands over for a group header slot", () => {
        const selection = {
            isSelected: (item: Row) => item.id === "1",
            label: (item: Row | undefined, index: number) => `Select row ${item?.id ?? index + 1}`,
            toggle: () => undefined,
        };
        const context = { cols: columns, loading: false, selection } as unknown as Parameters<typeof TableRow<Row>>[2];

        const { container } = render(
            <table>
                <tbody>
                    <tr>{TableRow<Row>(0, undefined as unknown as Row, context)}</tr>
                </tbody>
            </table>
        );

        expect(container.querySelectorAll("td")).toHaveLength(1);
        expect(container.querySelector("td")).toBeEmptyDOMElement();
        expect(container.querySelectorAll("input, [role=checkbox]")).toHaveLength(0);
    });

    it("disables the checkboxes while loading", () => {
        renderTable({ selectable: true, loading: true });

        expect(selectAll()).toBeDisabled();
        expect(screen.getAllByRole("checkbox", { name: /^Select row/ })[0]).toBeDisabled();
    });

    it("renders no selection column and logs one error when reference is missing", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
        renderTable({ selectable: true, reference: undefined });

        expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
        expect(error).toHaveBeenCalledTimes(1);
        expect(error).toHaveBeenCalledWith(
            'Table "selection": `selectable` needs `reference` to identify rows. The selection column is not rendered.'
        );
    });
});

describe("Table toolbar", () => {
    it("names each trigger with its visible text", () => {
        renderTable({ operations: true });

        expect(screen.getByRole("button", { name: "Filter: None" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sort by: None" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Group: None" })).toBeInTheDocument();
    });

    it("shows the first column label and the count of the other columns", () => {
        renderTable({
            operations: true,
            filters: [activeOnly, { ...activeOnly, id: "filter-name", name: "name", label: "Name" }],
        });

        expect(screen.getByRole("button", { name: "Filter: Status +1" })).toBeInTheDocument();
    });
});
