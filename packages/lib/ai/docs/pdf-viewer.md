# PdfViewer

Import `PdfViewer`, `PdfPageImage` and `PdfPageRequest` from `@g4rcez/components/pdf-viewer`. Load foundation CSS, then the manifest dependency closure for `pdf-viewer.css` (Button, Select, Alert and their dependencies), then the viewer stylesheet.

- The viewer shows labelled Previous/Next buttons, page selection, zoom (fit-width, 100%, 150%, 200%), bounded scrollable raster content, loading status and explicit retry.
- Zoom changes presentation, not decoder resolution.
- The viewer bundles no PDF parser.
- The host MUST authorize and read the retained original.
- The host MUST provide a stable `renderPage({page,signal})` adapter that uses its PDF decoder.
- Page numbers are one-based. `pageCount` is 1–1000.
- Change `documentKey` when the original bytes change. The viewer resets to page one and never shows old raster content under a new source or page label.
- Page or source change cancels the prior request. The host MUST honor the AbortSignal. The viewer suppresses late results even when the renderer cannot cancel.
- A renderer exception stays visible. The viewer never shows a stale page.

Return `{src,width,height}` from the adapter:

- `src`: PNG, JPEG or WebP base64 data URL, at most 24 MiB.
- `width`, `height`: positive finite numbers, at most 8192 pixels per side and 8 MP total.
- The viewer rejects SVG, remote URLs and active document embedding before image attachment.
- The host MUST enforce PDF, input, decode and embedded-image limits.

Not implemented: PDF scripts, links, forms, attachments, printing, annotations, text selection, signatures. Keep extracted accessible text and unchanged-original download in the host. Raster preview does not replace that text and does not guarantee font, color or layout fidelity.
