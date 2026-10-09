import { act, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { LocalStorage } from "storage-manager-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { createColumns, createOptionCols, type Col, type TableGetters, useTablePreferences } from "../src/components/table/table-lib";
import { Row as TableRow } from "../src/components/table/row";
import { TableHeader } from "../src/components/table/thead";

type Row = { name: string; email: string; status: string };

const resizeObserver = global.ResizeObserver;

afterEach(() => {
    vi.restoreAllMocks();
    global.ResizeObserver = resizeObserver;
});

const columns = createColumns<Row>((column) => {
    column.add(
        "name",
        ({ Properties }) => (
            <>
                <Properties />
                Name
            </>
        ),
        { headerLabel: "Name" }
    );
    column.add("email", "Email");
    column.add("status", "Status");
});

const TestTable = () => {
    const [cols, setCols] = useState<Col<Row>[]>(columns);
    const visibleCols = cols.filter((column) => column.visible !== false);

    return (
        <table>
            <thead>
                <TableHeader
                    columns={cols}
                    headers={visibleCols}
                    filters={[]}
                    setCols={setCols}
                    sorters={[]}
                    setFilters={() => undefined}
                    setSorters={() => undefined}
                    loading={false}
                    inlineFilter={false}
                    inlineSorter={false}
                />
            </thead>
            <tbody>
                <tr>{TableRow(0, { name: "Alice", email: "alice@example.com", status: "Active" }, { cols: visibleCols, loading: false })}</tr>
            </tbody>
        </table>
    );
};

const headerIds = () => screen.getAllByRole("columnheader").map((header) => header.dataset.tableheader);

describe("Table column Properties", () => {
    it("creates text options for component headers", () => {
        expect(createOptionCols(columns).map(({ label, value }) => ({ label, value }))).toEqual([
            { label: "Name", value: "name" },
            { label: "Email", value: "email" },
            { label: "Status", value: "status" },
        ]);
    });

    it("renders a visible and keyboard-accessible column resize control", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <ComponentsProvider>
                <TestTable />
            </ComponentsProvider>
        );

        const nameHeader = screen.getByRole("columnheader", { name: /Name/ });
        vi.spyOn(nameHeader, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 100, 40));
        const resizeButton = screen.getByRole("button", { name: "Resize column: Name" });

        expect(resizeButton).toHaveAttribute("title", "Resize column");
        expect(resizeButton).toHaveAttribute("aria-keyshortcuts", "ArrowLeft ArrowRight");
        expect(resizeButton.querySelector("svg")).toBeNull();

        resizeButton.focus();
        await user.keyboard("{ArrowRight}");
        expect(nameHeader).toHaveStyle({ width: "110px" });
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("lets users reorder and hide columns while keeping its host column visible", async () => {
        class ResizeObserverMock {
            observe() {}
            unobserve() {}
            disconnect() {}
        }

        global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
        const user = userEvent.setup();
        render(
            <ComponentsProvider>
                <TestTable />
            </ComponentsProvider>
        );

        expect(headerIds()).toEqual(["name", "email", "status"]);
        expect(within(screen.getAllByRole("cell")[0]!).getByText("Name")).toBeInTheDocument();

        const propertiesButton = screen.getByRole("button", { name: "Properties" });
        let propertiesButtonLeft = 40;
        vi.spyOn(propertiesButton, "getBoundingClientRect").mockImplementation(() => new DOMRect(propertiesButtonLeft, 20, 20, 20));
        await user.click(propertiesButton);

        const dialog = screen.getByRole("dialog", { name: "Columns" });
        await waitFor(() => expect(dialog.style.transform).not.toBe(""));
        const initialPosition = dialog.style.transform;
        expect(within(dialog).getByRole("checkbox", { name: "Name" })).toBeDisabled();

        const reorderStatus = within(dialog).getByRole("button", { name: /Reorder Status/ });
        reorderStatus.focus();
        await user.keyboard("{ArrowUp}");
        expect(headerIds()).toEqual(["name", "status", "email"]);

        propertiesButtonLeft = 400;
        await user.click(within(dialog).getByRole("checkbox", { name: "Email" }));
        window.dispatchEvent(new Event("resize"));
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
        await waitFor(() => expect(headerIds()).toEqual(["name", "status"]));
        expect(within(dialog).getByRole("checkbox", { name: "Email" })).not.toBeChecked();
        expect(dialog.style.transform).toBe(initialPosition);

        expect((await axe(dialog)).violations).toHaveLength(0);
    });

    it("restores saved visibility and order while adding new columns", () => {
        const savedColumns = [{ ...columns[2], visible: false }, columns[0]];
        vi.spyOn(LocalStorage, "get").mockReturnValue({
            cols: savedColumns,
            filters: [],
            groups: [],
            sorters: [],
        });
        vi.spyOn(LocalStorage, "set").mockImplementation(() => undefined);

        const { result } = renderHook(() => useTablePreferences("properties-test", columns));

        expect(result.current.cols.map((column) => column.id)).toEqual(["status", "name", "email"]);
        expect(result.current.cols[0]?.visible).toBe(false);
        expect(result.current.cols[2]?.visible).not.toBe(false);
    });

    it("reads and reconciles preferences only at mount while updates still persist", () => {
        const readColumnId = vi.fn(() => "name" as const);
        const watchedColumns: Col<Row>[] = [
            {
                ...columns[0]!,
                get id() {
                    return readColumnId();
                },
            },
            ...columns.slice(1),
        ];
        const get = vi.spyOn(LocalStorage, "get").mockReturnValue({ cols: [columns[0]], groups: [], sorters: [], filters: [] });
        const set = vi.spyOn(LocalStorage, "set").mockImplementation(() => undefined);
        const { result, rerender } = renderHook(() => useTablePreferences("mount-only", watchedColumns));
        expect(get).toHaveBeenCalledTimes(1);
        expect(readColumnId).toHaveBeenCalled();
        readColumnId.mockClear();
        set.mockClear();

        rerender();
        const updatedColumns = result.current.cols.map((col) => ({ ...col, visible: false }));
        act(() => result.current.set({ ...result.current, cols: updatedColumns, rows: [], pagination: null }));

        expect(result.current.cols).toEqual(updatedColumns);
        expect(set).toHaveBeenLastCalledWith("@components/table-mount-only", expect.objectContaining({ cols: updatedColumns }));
        expect(get).toHaveBeenCalledTimes(1);
        expect(readColumnId).not.toHaveBeenCalled();
    });

    it("preserves initial overrides, saved group rows, and the original persistence key after prop changes", () => {
        const saved: TableGetters<Row> = {
            cols: columns,
            rows: [],
            pagination: null,
            filters: [],
            sorters: [{ id: "saved", value: "email", label: "Email", type: "desc" as TableGetters<Row>["sorters"][number]["type"] }],
            groups: [
                {
                    ...columns[2]!,
                    rows: [{ name: "Ada", email: "ada@example.com", status: "Active" }],
                    index: 0,
                    groupId: "active",
                    groupName: "Active",
                    groupKey: "status",
                },
            ],
        };
        vi.spyOn(LocalStorage, "get").mockReturnValue(saved);
        const set = vi.spyOn(LocalStorage, "set").mockImplementation(() => undefined);
        const options: Partial<TableGetters<Row>> = { sorters: [] };
        const { result, rerender } = renderHook(({ name, cols, overrides }) => useTablePreferences(name, cols, overrides), {
            initialProps: { name: "original", cols: columns, overrides: options },
        });
        expect(result.current.sorters).toEqual([]);
        expect(result.current.groups).toEqual(saved.groups);
        const initialColumns = result.current.cols;

        rerender({ name: "renamed", cols: columns.slice(1), overrides: { groups: [], sorters: saved.sorters } });
        expect(result.current.name).toBe("renamed");
        expect(result.current.cols).toBe(initialColumns);
        expect(result.current.sorters).toEqual([]);
        expect(result.current.groups).toEqual(saved.groups);
        act(() => result.current.set({ ...saved, cols: initialColumns }));
        expect(set).toHaveBeenLastCalledWith("@components/table-original", expect.objectContaining({ groups: saved.groups }));
    });
});
