import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Masonry, type MasonryLayout } from "../src/components/display/masonry/masonry";

const createRect = (width: number, height: number): DOMRect =>
    ({
        bottom: height,
        height,
        left: 0,
        right: width,
        top: 0,
        width,
        x: 0,
        y: 0,
        toJSON: () => ({}),
    }) as DOMRect;

class MockResizeObserver implements ResizeObserver {
    static instances: MockResizeObserver[] = [];

    private readonly elements = new Set<Element>();

    constructor(private readonly callback: ResizeObserverCallback) {
        MockResizeObserver.instances.push(this);
    }

    observe = vi.fn((target: Element) => {
        this.elements.add(target);
    });

    unobserve = vi.fn((target: Element) => {
        this.elements.delete(target);
    });

    disconnect = vi.fn(() => {
        this.elements.clear();
    });

    trigger() {
        this.callback(
            Array.from(this.elements, (target) => ({
                borderBoxSize: [],
                contentBoxSize: [],
                contentRect: createRect(240, 0),
                devicePixelContentBoxSize: [],
                target,
            })) as ResizeObserverEntry[],
            this
        );
    }
}

const itemHeights = new Map([
    ["Alpha", 120],
    ["Beta", 80],
    ["Gamma", 60],
]);

const resetItemHeights = () => {
    itemHeights.set("Alpha", 120);
    itemHeights.set("Beta", 80);
    itemHeights.set("Gamma", 60);
};

const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

describe("Masonry", () => {
    let originalResizeObserver: typeof ResizeObserver | undefined;
    let rectSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        originalResizeObserver = globalThis.ResizeObserver;
        MockResizeObserver.instances = [];
        resetItemHeights();
        globalThis.ResizeObserver = MockResizeObserver as typeof ResizeObserver;

        rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function getBoundingClientRect(this: Element) {
            if (this.getAttribute("data-component") === "masonry") {
                return createRect(240, 0);
            }

            const label = this.textContent?.trim() ?? "";
            return createRect(0, itemHeights.get(label) ?? 40);
        });
    });

    afterEach(() => {
        rectSpy.mockRestore();
        if (originalResizeObserver) {
            globalThis.ResizeObserver = originalResizeObserver;
        } else {
            Reflect.deleteProperty(globalThis, "ResizeObserver");
        }
    });

    it("renders source-ordered list semantics by default", () => {
        render(
            <Masonry>
                <article>Alpha</article>
                <article>Beta</article>
                <article>Gamma</article>
            </Masonry>
        );

        const root = screen.getByRole("list");
        const items = screen.getAllByRole("listitem");

        expect(root).toHaveAttribute("data-component", "masonry");
        expect(root).not.toHaveAttribute("role", "grid");
        expect(root).toHaveStyle({ position: "relative", width: "100%" });
        expect(items).toHaveLength(3);
        expect(items.map((item) => item.textContent)).toEqual(["Alpha", "Beta", "Gamma"]);
        items.forEach((item) => {
            expect(item).toHaveAttribute("data-component", "masonry-item");
            expect(item).toHaveStyle({ position: "absolute", boxSizing: "border-box" });
        });
    });

    it("reports measured layout after resize", async () => {
        const onLayoutChange = vi.fn();

        render(
            <Masonry columns={2} gutter={10} onLayoutChange={onLayoutChange}>
                <article>Alpha</article>
                <article>Beta</article>
                <article>Gamma</article>
            </Masonry>
        );

        MockResizeObserver.instances.forEach((observer) => observer.trigger());

        await waitFor(() => expect(onLayoutChange).toHaveBeenCalled());

        expect(onLayoutChange).toHaveBeenLastCalledWith({
            columns: 2,
            gutter: 10,
            height: 150,
            items: [
                { column: 0, height: 120, index: 0, left: 0, top: 0, width: 115 },
                { column: 1, height: 80, index: 1, left: 125, top: 0, width: 115 },
                { column: 1, height: 60, index: 2, left: 125, top: 90, width: 115 },
            ],
        });
    });

    it("remeasures when fresh changes", async () => {
        const onLayoutChange = vi.fn();
        const { rerender } = render(
            <Masonry columns={2} gutter={10} fresh="initial" onLayoutChange={onLayoutChange}>
                <article>Alpha</article>
                <article>Beta</article>
            </Masonry>
        );

        MockResizeObserver.instances.forEach((observer) => observer.trigger());
        await waitFor(() => expect(onLayoutChange).toHaveBeenCalledTimes(1));

        itemHeights.set("Beta", 140);
        rerender(
            <Masonry columns={2} gutter={10} fresh="updated" onLayoutChange={onLayoutChange}>
                <article>Alpha</article>
                <article>Beta</article>
            </Masonry>
        );

        await waitFor(() => expect(onLayoutChange).toHaveBeenCalledTimes(2));
        expect(onLayoutChange.mock.calls.at(-1)?.[0].height).toBe(140);
    });

    it("remeasures when an item changes height", async () => {
        const onLayoutChange = vi.fn();

        render(
            <Masonry columns={2} gutter={10} onLayoutChange={onLayoutChange}>
                <article>Alpha</article>
                <article>Beta</article>
                <article>Gamma</article>
            </Masonry>
        );

        MockResizeObserver.instances.forEach((observer) => observer.trigger());
        await waitFor(() => expect(onLayoutChange).toHaveBeenCalledTimes(1));

        itemHeights.set("Gamma", 140);
        MockResizeObserver.instances.forEach((observer) => observer.trigger());

        await waitFor(() => expect(onLayoutChange).toHaveBeenCalledTimes(2));
        expect(onLayoutChange.mock.calls.at(-1)?.[0].height).toBe(230);
    });

    it("does not re-emit equal layouts when consumers store layout state", async () => {
        const onLayoutChange = vi.fn();

        function LayoutConsumer() {
            const [layout, setLayout] = React.useState<MasonryLayout | null>(null);

            return (
                <React.Fragment>
                    <Masonry
                        columns={2}
                        gutter={10}
                        onLayoutChange={(nextLayout) => {
                            onLayoutChange(nextLayout);
                            setLayout(nextLayout);
                        }}
                    >
                        <article>Alpha</article>
                        <article>Beta</article>
                        <article>Gamma</article>
                    </Masonry>
                    <output>{layout?.height ?? "pending"}</output>
                </React.Fragment>
            );
        }

        render(<LayoutConsumer />);

        MockResizeObserver.instances.forEach((observer) => observer.trigger());
        await screen.findByText("150");
        expect(onLayoutChange).toHaveBeenCalledTimes(1);

        MockResizeObserver.instances.forEach((observer) => observer.trigger());
        await waitForFrame();
        expect(onLayoutChange).toHaveBeenCalledTimes(1);
    });
});
