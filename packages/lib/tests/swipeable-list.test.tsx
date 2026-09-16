import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VirtuosoMockContext } from "react-virtuoso";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SwipeableList, type SwipeableListItem } from "../src/components/display/swipeable-list/swipeable-list";

const renderVirtualized = (items: SwipeableListItem[], props: Partial<ComponentProps<typeof SwipeableList>> = {}) =>
    render(
        <VirtuosoMockContext.Provider value={{ viewportHeight: 120, itemHeight: 56 }}>
            <SwipeableList items={items} {...props} />
        </VirtuosoMockContext.Provider>
    );

const items: SwipeableListItem[] = Array.from({ length: 100 }, (_, index) => ({
    id: `item-${index}`,
    title: `Item ${index}`,
    rightActions: [
        {
            id: "delete",
            label: "Delete",
            icon: <span aria-hidden>×</span>,
            tone: "danger",
        },
    ],
}));

describe("SwipeableList virtualization", () => {
    beforeEach(() => {
        global.ResizeObserver = class ResizeObserver {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        } as unknown as typeof ResizeObserver;
    });

    it("renders only the visible portion of a large list", () => {
        renderVirtualized(items);

        expect(screen.getByText("Item 0")).toBeInTheDocument();
        expect(screen.queryByText("Item 99")).not.toBeInTheDocument();
    });

    it("renders semantic list elements", () => {
        renderVirtualized([items[0]]);

        expect(screen.getByRole("list")).toBeInTheDocument();
        expect(screen.getByRole("listitem")).toHaveTextContent("Item 0");
    });

    it("applies className gap utilities to the virtualized list", () => {
        renderVirtualized([items[0]], { className: "gap-6" });

        expect(screen.getByTestId("virtuoso-item-list")).toHaveClass("gap-6");
    });

    it("keeps revealed actions interactive", async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();
        const item = items[0];

        renderVirtualized([item], {
            defaultValue: { id: item.id, side: "right" },
            onAction,
        });

        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(onAction).toHaveBeenCalledWith({
            item,
            action: item.rightActions?.[0],
            side: "right",
        });
    });
});
