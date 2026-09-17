import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RenderOnView } from "../src/components/core/render-on-view/render-on-view";

class IntersectionObserverMock {
    static instances: IntersectionObserverMock[] = [];
    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        IntersectionObserverMock.instances.push(this);
    }

    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();

    trigger(entries: Array<Partial<IntersectionObserverEntry>>) {
        this.callback(entries as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
    }
}

describe("RenderOnView", () => {
    beforeEach(() => {
        IntersectionObserverMock.instances = [];
        vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    });

    afterEach(() => vi.unstubAllGlobals());

    it("defers content, supports polymorphic elements, and guards observer entries", () => {
        const onIntersection = vi.fn();

        render(
            <RenderOnView as="section" data-testid="render-on-view" data-state="deferred" onIntersection={onIntersection}>
                <span>Deferred content</span>
            </RenderOnView>
        );

        const root = screen.getByTestId("render-on-view");
        expect(root.tagName).toBe("SECTION");
        expect(root).toHaveAttribute("data-state", "deferred");
        expect(root).not.toHaveAttribute("onintersection");
        expect(screen.queryByText("Deferred content")).not.toBeInTheDocument();

        const observer = IntersectionObserverMock.instances[0];
        expect(observer).toBeDefined();
        act(() => {
            observer?.trigger([]);
        });
        expect(onIntersection).not.toHaveBeenCalled();

        act(() => {
            observer?.trigger([{ isIntersecting: false }]);
        });
        expect(screen.queryByText("Deferred content")).not.toBeInTheDocument();

        act(() => {
            observer?.trigger([{ isIntersecting: true }]);
        });
        expect(onIntersection).toHaveBeenCalledTimes(1);
        expect(screen.getByText("Deferred content")).toBeInTheDocument();

        act(() => {
            observer?.trigger([{ isIntersecting: true }]);
        });
        expect(onIntersection).toHaveBeenCalledTimes(2);
    });
});
