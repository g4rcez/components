import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import { Group, type GroupItem } from "../src/components/table/group";
import { createColumns, createOptionCols } from "../src/components/table/table-lib";

type Row = { status: string };

const columns = createColumns<Row>((column) => {
    column.add("status", "Status", {
        groupTitle: (
            <span>
                Status group: <strong>Active</strong>
            </span>
        ),
    });
});

const grouped = {
    ...columns[0],
    groupId: "group-active",
    groupKey: "status",
    groupName: "active",
    index: 0,
    rows: [{ status: "active" }],
} satisfies GroupItem<Row>;

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

describe("table group a11y", () => {
    it("labels each grouped table with the column groupTitle", () => {
        render(
            <ComponentsProvider>
                <Table name="grouped-status" cols={columns} rows={grouped.rows} groups={[grouped]} operations={false} />
            </ComponentsProvider>
        );

        const heading = screen.getByRole("heading", { name: "Status group: Active" });
        expect(heading).toHaveClass("__table-root__group-title");
        expect(heading.closest("section")).toHaveAccessibleName("Status group: Active");
    });

    it("uses provider map labels for group controls", async () => {
        const user = userEvent.setup();

        const TestApp = () => {
            const [groups, setGroups] = useState<GroupItem<Row>[]>([grouped]);

            return (
                <ComponentsProvider
                    map={{
                        tableGroupOrderTitle: "Arrange segments",
                        tableGroupPlaceholder: "Pick a segment",
                        tableGroupTypeTitle: "Segment type",
                    }}
                >
                    <Group cols={columns} rows={[{ status: "active" }]} groups={groups} setGroups={setGroups} options={createOptionCols(columns)} />
                </ComponentsProvider>
            );
        };

        render(<TestApp />);

        await user.click(screen.getByRole("button", { name: /Group/ }));

        expect(screen.getByRole("combobox", { name: "Segment type" })).toBeInTheDocument();
        expect(screen.getByText("Pick a segment")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Arrange segments" })).toBeInTheDocument();
    });

    it("names group controls and reorders groups with arrow keys", async () => {
        const user = userEvent.setup();
        const second = {
            ...grouped,
            groupId: "group-inactive",
            groupName: "inactive",
            index: 1,
            rows: [{ status: "inactive" }],
        } satisfies GroupItem<Row>;

        const TestApp = () => {
            const [groups, setGroups] = useState<GroupItem<Row>[]>([grouped, second]);

            return (
                <ComponentsProvider>
                    <Group
                        cols={columns}
                        rows={[{ status: "active" }, { status: "inactive" }]}
                        groups={groups}
                        setGroups={setGroups}
                        options={createOptionCols(columns)}
                    />
                </ComponentsProvider>
            );
        };

        render(<TestApp />);
        await user.click(screen.getByRole("button", { name: /Group/ }));

        expect(screen.getByRole("button", { name: /delete|clear/i })).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /reorder/i })).toHaveLength(2);

        const getOrder = () => screen.getAllByRole("button", { name: /reorder/i }).map((button) => button.parentElement?.textContent);
        const firstHandle = screen.getAllByRole("button", { name: /reorder/i })[0];
        firstHandle.focus();
        await user.keyboard("{ArrowDown}");

        await waitFor(() => expect(getOrder()).toEqual(["inactive", "active"]));

        const secondHandle = screen.getAllByRole("button", { name: /reorder/i })[1];
        secondHandle.focus();
        await user.keyboard("{ArrowDown}");

        await waitFor(() => expect(getOrder()).toEqual(["inactive", "active"]));
    });
});
