import { act, render, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Resizable } from "../src/components/core/resizable/resizable";

const { animateMock, stopMock } = vi.hoisted(() => ({
    animateMock: vi.fn(),
    stopMock: vi.fn(),
}));

vi.mock("motion/react", async () => {
    const React = await vi.importActual<typeof import("react")>("react");

    return {
        animate: animateMock,
        motion: {
            div: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ style, ...props }, ref) => {
                const height = style?.height;
                const safeStyle = typeof height === "object" && height !== null ? { ...style, height: undefined } : style;
                return <div ref={ref} style={safeStyle} {...props} />;
            }),
        },
        useMotionValue: (initial: number) => ({ current: initial }),
    };
});

class TestResizeObserver implements ResizeObserver {
    static instances: TestResizeObserver[] = [];

    readonly observe = vi.fn();
    readonly unobserve = vi.fn();
    readonly disconnect = vi.fn();
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        TestResizeObserver.instances.push(this);
    }

    trigger(height: number) {
        this.callback(
            [
                {
                    contentRect: { height },
                } as ResizeObserverEntry,
            ],
            this
        );
    }
}

describe("Resizable", () => {
    beforeEach(() => {
        TestResizeObserver.instances = [];
        globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;
        animateMock.mockReset();
        stopMock.mockReset();
        animateMock.mockReturnValue({ stop: stopMock });
    });

    it("animates open content from a collapsed height after measuring", async () => {
        const { container } = render(
            <Resizable open>
                <div>Content</div>
            </Resizable>
        );

        expect(container.firstElementChild).toHaveStyle({ height: "0px" });

        act(() => TestResizeObserver.instances[0]?.trigger(48));

        await waitFor(() => {
            expect(animateMock).toHaveBeenLastCalledWith(expect.anything(), 48, expect.objectContaining({ type: "spring" }));
        });
    });

    it("animates when open content grows", async () => {
        render(
            <Resizable open>
                <div>Content</div>
            </Resizable>
        );

        act(() => TestResizeObserver.instances[0]?.trigger(48));
        await waitFor(() => expect(animateMock).toHaveBeenLastCalledWith(expect.anything(), 48, expect.anything()));

        act(() => TestResizeObserver.instances[0]?.trigger(96));

        await waitFor(() => {
            expect(animateMock).toHaveBeenLastCalledWith(expect.anything(), 96, expect.objectContaining({ type: "spring" }));
        });
    });

    it("opens to the latest measured height when toggled", async () => {
        const { rerender } = render(
            <Resizable open={false}>
                <div>Content</div>
            </Resizable>
        );

        act(() => TestResizeObserver.instances[0]?.trigger(72));
        await waitFor(() => expect(animateMock).toHaveBeenLastCalledWith(expect.anything(), 0, expect.anything()));

        rerender(
            <Resizable open>
                <div>Content</div>
            </Resizable>
        );

        await waitFor(() => {
            expect(animateMock).toHaveBeenLastCalledWith(expect.anything(), 72, expect.objectContaining({ type: "spring" }));
        });
    });
});
