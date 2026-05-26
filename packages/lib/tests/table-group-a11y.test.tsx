import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Group, type GroupItem } from "../src/components/table/group";
import { ColType } from "../src/components/table/table-lib";

type Row = { status: string };

const columns = [{ id: "status", headerLabel: "Status", type: ColType.Text }];

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

describe("table group a11y", () => {
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
                    <Group cols={columns} rows={[{ status: "active" }]} groups={groups} setGroups={setGroups} />
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
