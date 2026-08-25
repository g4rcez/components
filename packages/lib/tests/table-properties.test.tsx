import { render, renderHook, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { axe } from "vitest-axe";
import { LocalStorage } from "storage-manager-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { createColumns, createOptionCols, type Col, useTablePreferences } from "../src/components/table/table-lib";
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
});
