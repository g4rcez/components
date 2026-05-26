import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { ColType } from "../src/components/table/table-lib";
import { Filter, type FilterConfig } from "../src/components/table/filter";

type Row = { status: string };

const columns = [{ id: "status", headerLabel: "Status", type: ColType.Text }];
const filter = {
    id: "filter-status",
    label: "Status",
    name: "status",
    type: ColType.Text,
    operation: { value: "contains", label: "Contains", symbol: "includes" },
    value: "active",
} satisfies FilterConfig<Row>;

describe("table filter a11y", () => {
    it("labels icon-only delete buttons and keeps deletion behavior intact", async () => {
        const user = userEvent.setup();

        class ResizeObserverMock {
            observe() {}
            unobserve() {}
            disconnect() {}
        }

        class IntersectionObserverMock {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() {
                return [];
            }
        }

        global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
        global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

        const TestApp = () => {
            const [filters, setFilters] = useState<FilterConfig<Row>[]>([filter]);

            return (
                <ComponentsProvider map={{ tableFilterDeleteLabel: (label) => `Remove ${label} filter` }}>
                    <Filter cols={columns} filters={filters} set={setFilters} options={[{ value: "status", label: "Status" }]} />
                </ComponentsProvider>
            );
        };

        render(<TestApp />);

        await user.click(screen.getByRole("button", { name: /Filters/ }));

        const deleteButton = screen.getByRole("button", { name: "Remove Status filter" });
        expect(deleteButton).toBeInTheDocument();

        const axeResults = await axe(screen.getByRole("list"));

        expect(axeResults.violations).toHaveLength(0);

        await user.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: "Remove Status filter" })).not.toBeInTheDocument();
        });
    });
});
