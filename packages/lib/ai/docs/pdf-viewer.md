# PdfViewer

Import `PdfViewer`, `PdfPageImage` and `PdfPageRequest` from `@g4rcez/components/pdf-viewer`. Load foundation and the manifest dependency closure for `pdf-viewer.css` (Button, Select and Alert plus their dependencies) before the viewer stylesheet.

The viewer provides labelled Previous/Next and page selection, fit-width/100%/150%/200% zoom, bounded scrollable raster content, loading status and explicit retry. It does not bundle a PDF parser. The application must authorize/read the retained original and provide a stable `renderPage({page,signal})` adapter using its PDF decoder. Page numbers are one-based; pageCount is 1–1000. Change `documentKey` when original bytes change. This resets to page one and prevents old raster content appearing under a new source or page label.

Return `{src,width,height}` with a PNG/JPEG/WebP base64 data URL, positive finite dimensions, at most 8192 pixels per side and 8 MP total. The encoded URL is capped at 24 MiB. SVG, remote URLs and active document embedding are rejected before image attachment. The host must separately enforce PDF/input/decode/embedded-image limits and must honor the AbortSignal to stop obsolete work. The viewer suppresses late results even when a renderer cannot cancel.

PDF scripts, links, forms, attachments, printing, annotations, text selection and signatures are not implemented. Keep extracted accessible text and unchanged-original download in the host application. Raster preview is not an accessible replacement for that text or a guarantee of font/color/layout fidelity. Zoom changes presentation, not decoder resolution. Retry is explicit; page/source changes cancel the prior request. A renderer exception remains visible rather than showing a stale page.
