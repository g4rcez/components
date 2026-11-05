import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { PdfViewer, type PdfPageImage, type PdfPageRequest } from "../src/components/display/pdf-viewer/pdf-viewer";
const first: PdfPageImage = { src: "data:image/png;base64,AA==", width: 100, height: 200 };
const second: PdfPageImage = { src: "data:image/png;base64,AQ==", width: 200, height: 100 };
function deferred() {
    let resolve!: (image: PdfPageImage) => void;
    const promise = new Promise<PdfPageImage>((done) => {
        resolve = done;
    });
    return { promise, resolve };
}

describe("PdfViewer", () => {
    it("cancels an obsolete page and never shows its late raster under another page label", async () => {
        const a = deferred(),
            b = deferred();
        const requests: PdfPageRequest[] = [];
        const renderer = (request: PdfPageRequest) => {
            requests.push(request);
            return request.page === 1 ? a.promise : b.promise;
        };
        render(
            <ComponentsProvider>
                <PdfViewer label="Retained original" documentKey="a" pageCount={2} renderPage={renderer} />
            </ComponentsProvider>
        );
        await waitFor(() => expect(requests).toHaveLength(1));
        fireEvent.click(screen.getByRole("button", { name: "Next PDF page" }));
        await waitFor(() => expect(requests).toHaveLength(2));
        expect(requests[0]!.signal.aborted).toBe(true);
        await act(async () => b.resolve(second));
        expect(screen.getByRole("img")).toHaveAttribute("src", second.src);
        await act(async () => a.resolve(first));
        expect(screen.getByRole("img")).toHaveAttribute("src", second.src);
        expect(screen.getByRole("img")).toHaveAccessibleName(/page 2 of 2/);
        expect(screen.getByRole("button", { name: "Next PDF page" })).toBeDisabled();
    });
    it("removes the old raster and resets page one when the underlying original is replaced", async () => {
        const next = deferred();
        const renderer = async () => first;
        const { rerender } = render(
            <ComponentsProvider>
                <PdfViewer label="PDF" documentKey="old" pageCount={2} renderPage={renderer} />
            </ComponentsProvider>
        );
        await screen.findByRole("img");
        fireEvent.click(screen.getByRole("button", { name: "Next PDF page" }));
        await waitFor(() => expect(screen.getByRole("img")).toHaveAccessibleName(/page 2 of 2/));
        rerender(
            <ComponentsProvider>
                <PdfViewer label="PDF" documentKey="new" pageCount={1} renderPage={() => next.promise} />
            </ComponentsProvider>
        );
        expect(screen.queryByRole("img")).toBeNull();
        expect(screen.getByRole("button", { name: "Previous PDF page" })).toBeDisabled();
        await act(async () => next.resolve(second));
        expect(screen.getByRole("img")).toHaveAccessibleName(/page 1 of 1/);
    });
    it("does not load remote or active image URLs and allows an explicit retry after renderer failure", async () => {
        let calls = 0;
        const renderer = async () => (++calls === 1 ? { ...first, src: "https://example.test/private.png" } : second);
        render(
            <ComponentsProvider>
                <PdfViewer label="PDF" documentKey="a" pageCount={1} renderPage={renderer} />
            </ComponentsProvider>
        );
        await screen.findByText("The page renderer returned an unsupported or oversized raster.");
        expect(screen.queryByRole("img")).toBeNull();
        expect(calls).toBe(1);
        fireEvent.click(screen.getByRole("button", { name: "Retry PDF page" }));
        expect(await screen.findByRole("img")).toHaveAttribute("src", second.src);
    });
});
