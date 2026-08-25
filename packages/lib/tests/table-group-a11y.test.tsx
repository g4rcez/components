import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
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
});
