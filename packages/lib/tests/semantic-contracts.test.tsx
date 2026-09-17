import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Polymorph } from "../src/components/core/polymorph/polymorph";
import { SkeletonCell, SkeletonList } from "../src/components/display/skeleton/skeleton";
import { Timeline, TimelineItem } from "../src/components/display/timeline/timeline";
import { EventPill } from "../src/components/page-calendar/event-pill";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Table } from "../src/components/table";
import { createColumns } from "../src/components/table/table-lib";

class TestResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class TestIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

global.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;
global.IntersectionObserver = TestIntersectionObserver as unknown as typeof IntersectionObserver;

describe("semantic contracts", () => {
    it("uses the documented span default for Polymorph", () => {
        render(<Polymorph data-testid="polymorph">Content</Polymorph>);

        expect(screen.getByTestId("polymorph")).toHaveProperty("tagName", "SPAN");
    });

    it("renders Timeline semantic defaults and omits button attributes for non-buttons", () => {
        render(
            <Timeline>
                <TimelineItem>
                    <TimelineItem.Body>Body</TimelineItem.Body>
                    <TimelineItem.Right>Right</TimelineItem.Right>
                    <TimelineItem.Right as="time">Time</TimelineItem.Right>
                </TimelineItem>
            </Timeline>
        );

        expect(screen.getByText("Body")).toHaveProperty("tagName", "SECTION");
        expect(screen.getByText("Right")).toHaveProperty("tagName", "BUTTON");

        const time = screen.getByText("Time");
        expect(time).toHaveProperty("tagName", "TIME");
        expect(time).not.toHaveAttribute("type");
    });

    it("keeps skeleton list rows deterministic, bounded, and synchronized", () => {
        const { rerender } = render(<SkeletonList rows={2} />);
        const list = screen.getByRole("status", { name: "Loading content" });
        const getRows = () => Array.from(list.children) as HTMLElement[];

        expect(list).toHaveProperty("tagName", "UL");

        expect(getRows()).toHaveLength(2);
        expect(screen.getAllByRole("status")).toHaveLength(1);

        const widths = getRows().map((row) => Number.parseFloat(row.style.width));
        expect(widths.every((width) => width >= 60 && width <= 100)).toBe(true);
        expect(widths.some((width) => width < 100)).toBe(true);

        rerender(<SkeletonList rows={4} />);
        expect(getRows()).toHaveLength(4);
    });

    it("keeps SkeletonCell decorative inside a loading region", () => {
        render(<div data-testid="cell-wrapper">{SkeletonCell}</div>);

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(screen.getByTestId("cell-wrapper").firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("localizes one table loading status owner", () => {
        type Row = { status: string };
        const cols = createColumns<Row>((column) => column.add("status", "Status"));

        render(
            <ComponentsProvider map={{ skeletonLoading: "Chargement" }}>
                <Table<Row> name="loading-table" cols={cols} rows={[]} loading operations={false} />
            </ComponentsProvider>
        );

        const statuses = screen.getAllByRole("status");
        expect(statuses).toHaveLength(1);
        expect(statuses[0]).toHaveAccessibleName("Chargement");
    });

    it("uses phrasing content inside a noncompact event button", () => {
        render(
            <ComponentsProvider>
                <EventPill event={{ id: "event-1", title: "Review", date: new Date("2025-01-02T09:30:00Z") }} onClick={() => {}} />
            </ComponentsProvider>
        );

        const button = screen.getByRole("button", { name: /Review at/ });
        expect(button.querySelectorAll("div")).toHaveLength(0);
    });
});
