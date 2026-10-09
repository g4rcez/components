import { act, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Table } from "../src/components/table";
import { createColumns } from "../src/components/table/table-lib";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderVirtuoso = vi.hoisted(() => vi.fn());

vi.mock("react-virtuoso", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-virtuoso")>();
    return {
        ...actual,
        TableVirtuoso: (props: ComponentProps<typeof actual.TableVirtuoso>) => {
            renderVirtuoso();
            return <actual.TableVirtuoso {...props} />;
        },
    };
});

class IntersectionObserverMock implements IntersectionObserver {
    static instances: IntersectionObserverMock[] = [];
    root = null;
    rootMargin = "0px";
    thresholds = [];
    observe = vi.fn<(target: Element) => void>();
    unobserve = vi.fn<(target: Element) => void>();
    disconnect = vi.fn();
    takeRecords = () => [];

    constructor(private readonly callback: IntersectionObserverCallback) {
        IntersectionObserverMock.instances.push(this);
    }

    emit(isIntersecting: boolean) {
        const target = this.observe.mock.calls[0]![0];
        const rect = target.getBoundingClientRect();
        this.callback(
            [
                {
                    target,
                    isIntersecting,
                    intersectionRatio: isIntersecting ? 1 : 0,
                    time: 0,
                    boundingClientRect: rect,
                    intersectionRect: rect,
                    rootBounds: null,
                },
            ],
            this
        );
    }
}

const columns = createColumns<{ name: string }>((column) => column.add("name", "Name", { allowFilter: false, allowSort: false }));
const rows = [{ name: "Ada" }];

const fixture = (loadingMore: boolean, onScrollEnd: () => void) => (
    <ComponentsProvider>
        <VirtuosoMockContext.Provider value={{ viewportHeight: 120, itemHeight: 56 }}>
            <Table name="loading-performance" cols={columns} rows={rows} operations={false} loadingMore={loadingMore} onScrollEnd={onScrollEnd} />
        </VirtuosoMockContext.Provider>
    </ComponentsProvider>
);

beforeEach(() => {
    IntersectionObserverMock.instances = [];
    renderVirtuoso.mockClear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal(
        "ResizeObserver",
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
    );
});

afterEach(() => vi.unstubAllGlobals());

describe("Table loading sentinel", () => {
    it("notifies on each intersecting event while loading without rendering unused footer state", () => {
        const onScrollEnd = vi.fn();
        render(fixture(true, onScrollEnd));
        const observer = IntersectionObserverMock.instances[0]!;
        expect(observer.observe).toHaveBeenCalledTimes(1);
        expect(observer.observe.mock.calls[0]![0]).toHaveAttribute("aria-hidden", "true");
        const initialRenders = renderVirtuoso.mock.calls.length;

        act(() => observer.emit(true));
        act(() => observer.emit(true));
        act(() => observer.emit(false));

        expect(onScrollEnd).toHaveBeenCalledTimes(2);
        expect(renderVirtuoso).toHaveBeenCalledTimes(initialRenders);
    });

    it("uses the latest callback and loading flag and disconnects on unmount", () => {
        const first = vi.fn();
        const latest = vi.fn();
        const { rerender, unmount } = render(fixture(false, first));
        const observer = IntersectionObserverMock.instances[0]!;
        act(() => observer.emit(true));
        expect(first).not.toHaveBeenCalled();

        rerender(fixture(true, latest));
        act(() => observer.emit(false));
        expect(latest).not.toHaveBeenCalled();
        act(() => observer.emit(true));
        expect(latest).toHaveBeenCalledTimes(1);
        expect(first).not.toHaveBeenCalled();

        rerender(fixture(false, latest));
        act(() => observer.emit(true));
        expect(latest).toHaveBeenCalledTimes(1);
        expect(IntersectionObserverMock.instances).toHaveLength(1);
        unmount();
        expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });
});
