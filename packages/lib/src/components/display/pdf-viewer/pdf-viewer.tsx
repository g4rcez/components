"use client";
import { useEffect, useMemo, useState } from "react";
import { css } from "../../../lib/dom";
import { Button } from "../../core/button/button";
import { Alert } from "../alert/alert";
import { Select } from "../../form/select/select";
import { pdfViewerStyles } from "./pdf-viewer.styles";

export interface PdfPageImage {
    src: string;
    width: number;
    height: number;
}
export interface PdfPageRequest {
    page: number;
    signal: AbortSignal;
}
export interface PdfViewerProps {
    label: string;
    /** Change when the underlying retained PDF changes; resets to page one. */
    documentKey: string;
    pageCount: number;
    /** Rasterize locally. Return only a bounded PNG/JPEG/WebP data URL, never a remote URL or SVG. */
    renderPage(request: PdfPageRequest): Promise<PdfPageImage>;
    className?: string;
}
interface PageResult {
    key: string;
    image?: PdfPageImage;
    error?: string;
}
const zooms = [
    { value: "fit", label: "Fit width" },
    { value: "1", label: "100%" },
    { value: "1.5", label: "150%" },
    { value: "2", label: "200%" },
];

/** Local raster-only PDF presentation. The host owns decoding, authorization and extracted text. */
export function PdfViewer({ label, documentKey, pageCount, renderPage, className }: PdfViewerProps) {
    const [selected, setSelected] = useState({ documentKey, page: 1 });
    const [zoom, setZoom] = useState("fit");
    const [retry, setRetry] = useState(0);
    const [result, setResult] = useState<PageResult | null>(null);
    const valid = Number.isInteger(pageCount) && pageCount >= 1 && pageCount <= 1000;
    const page = selected.documentKey === documentKey ? Math.min(selected.page, pageCount) : 1;
    const key = JSON.stringify([documentKey, page, retry]);
    const current = result?.key === key ? result : null;
    const loading = valid && !current;
    const pages = useMemo(
        () =>
            valid ? Array.from({ length: pageCount }, (_, index) => ({ value: String(index + 1), label: `Page ${index + 1} of ${pageCount}` })) : [],
        [pageCount, valid]
    );
    useEffect(() => {
        if (!valid) return;
        const controller = new AbortController();
        Promise.resolve()
            .then(() => renderPage({ page, signal: controller.signal }))
            .then((image) => {
                if (controller.signal.aborted) return;
                if (
                    image.src.length > 24 * 1024 * 1024 ||
                    !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image.src) ||
                    !Number.isFinite(image.width) ||
                    !Number.isFinite(image.height) ||
                    image.width <= 0 ||
                    image.height <= 0 ||
                    image.width > 8192 ||
                    image.height > 8192 ||
                    image.width * image.height > 8_000_000
                )
                    throw new Error("The page renderer returned an unsupported or oversized raster.");
                setResult({ key, image });
            })
            .catch((error) => {
                if (!controller.signal.aborted)
                    setResult({ key, error: error instanceof Error ? error.message : "The PDF page could not be rendered." });
            });
        return () => controller.abort();
    }, [documentKey, page, retry, renderPage, valid, key]);
    function choose(next: number) {
        setSelected({ documentKey, page: next });
    }
    return (
        <section data-component="pdf-viewer" aria-label={label} className={css(pdfViewerStyles.className({}), className)}>
            {!valid ? (
                <Alert theme="danger">Choose a PDF with 1–1000 pages.</Alert>
            ) : (
                <>
                    <div data-slot="toolbar" className={pdfViewerStyles.slots.toolbar}>
                        <Button type="button" theme="neutral" disabled={page <= 1} onClick={() => choose(page - 1)}>
                            Previous PDF page
                        </Button>
                        <Select
                            title="PDF page"
                            required
                            value={String(page)}
                            onChange={(event) => choose(Number(event.target.value))}
                            options={pages}
                        />
                        <Button type="button" theme="neutral" disabled={page >= pageCount} onClick={() => choose(page + 1)}>
                            Next PDF page
                        </Button>
                        <Select title="PDF zoom" required value={zoom} onChange={(event) => setZoom(event.target.value)} options={zooms} />
                    </div>
                    <p role="status">
                        Page {page} of {pageCount}
                        {loading ? " · Rendering locally…" : current?.error ? " · Rendering failed" : ""}
                    </p>
                    {current?.error && (
                        <>
                            <Alert theme="danger">{current.error}</Alert>
                            <Button type="button" theme="neutral" onClick={() => setRetry((value) => value + 1)}>
                                Retry PDF page
                            </Button>
                        </>
                    )}
                    <div
                        data-slot="page"
                        className={pdfViewerStyles.slots.page}
                        aria-busy={loading}
                        tabIndex={0}
                        role="region"
                        aria-label="Scrollable PDF page image"
                    >
                        {current?.image && (
                            <img
                                alt={`${label} · page ${page} of ${pageCount}. Raster preview; use extracted text for accessible reading.`}
                                src={current.image.src}
                                width={current.image.width}
                                height={current.image.height}
                                style={{
                                    width: zoom === "fit" ? `min(100%, ${current.image.width}px)` : current.image.width * Number(zoom),
                                    maxWidth: "none",
                                }}
                            />
                        )}
                    </div>
                </>
            )}
        </section>
    );
}
