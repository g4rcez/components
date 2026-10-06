import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VirtuosoMockContext } from "react-virtuoso";
import { describe, expect, it, vi } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import { createColumns } from "../src/components/table/table-lib";

type Row = { name: string };

const columns = createColumns<Row>((column) => column.add("name", "Name", { allowFilter: false, allowSort: false }));
const rows = [{ name: "Ada" }];

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

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

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

const renderTable = (onAction = vi.fn()) =>
    render(
        <>
            <ComponentsProvider>
                <VirtuosoMockContext.Provider value={{ viewportHeight: 120, itemHeight: 56 }}>
                    <Table
                        name="row-aside-keyboard"
                        cols={columns}
                        rows={rows}
                        loading={false}
                        operations={false}
                        Aside={({ row }) => (
                            <button type="button" onClick={() => onAction(row)}>
                                Delete {row.name}
                            </button>
                        )}
                    />
                </VirtuosoMockContext.Provider>
            </ComponentsProvider>
            <button type="button">After table</button>
        </>
    );

describe("Table row aside keyboard access", () => {
    it("reveals and activates an aside action on keyboard focus", async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();
        renderTable(onAction);

        await user.tab();

        const action = screen.getByRole("button", { name: "Delete Ada" });
        const aside = action.closest('[data-component="cell-aside"]');
        expect(action).toHaveFocus();
        expect(aside).toHaveClass("__table-row__aside-visible");

        await user.keyboard("{Enter}");

        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onAction).toHaveBeenCalledWith(rows[0]);
    });

    it("stays visible when the pointer leaves while focus remains inside", async () => {
        const user = userEvent.setup();
        renderTable();

        await user.tab();

        const action = screen.getByRole("button", { name: "Delete Ada" });
        const aside = action.closest('[data-component="cell-aside"]');

        await user.hover(action);
        await user.unhover(action);

        expect(action).toHaveFocus();
        expect(aside).toHaveClass("__table-row__aside-visible");

        await user.tab();

        expect(screen.getByRole("button", { name: "After table" })).toHaveFocus();
        expect(aside).toHaveClass("__table-row__aside-hidden");
    });

    it("continues to reveal the aside on pointer hover", async () => {
        const user = userEvent.setup();
        renderTable();

        const action = screen.getByRole("button", { name: "Delete Ada" });
        const aside = action.closest('[data-component="cell-aside"]');

        await user.hover(action);

        expect(aside).toHaveClass("__table-row__aside-visible");

        await user.unhover(action);

        expect(aside).toHaveClass("__table-row__aside-hidden");
    });
});
