---
title: DrawingEditor
description: Controlled layered raster/vector drawing with bounded JSON scenes and flattened PNG export.
package: "@g4rcez/components"
export: "{ DrawingEditor, createDrawingScene, exportDrawingPng }"
import: "import { DrawingEditor, createDrawingScene } from '@g4rcez/components/drawing-editor'"
category: form
---

# DrawingEditor

A browser Canvas 2D editor for image annotation, note drawings and small layered compositions. The library owns the interactive canvas, transform handles, layer panel, tools, selection masks and feedback. Compose it with your application's persistence and upload policy; it does not contact an AI service or save files implicitly.

## Import and styles

```tsx
import { DrawingEditor, createDrawingScene, type DrawingScene } from '@g4rcez/components/drawing-editor';
import '@g4rcez/components/foundation.css';
import '@g4rcez/components/drawing-editor.css';
```

The complete CSS dependency closure is **button, polymorph, input, input-field, free-text, textarea, select, checkbox, alert, tooltip, resizable**. Use the style manifest's `drawing-editor` dependency resolution when assembling split CSS; `drawingEditorStyles` declares direct dependencies `button`, `input`, `textarea`, `select`, `checkbox`, `alert`, `resizable` (including the surface used by Alert's Collapse composition). Loading only drawing-editor.css does not style its composed controls. No private overrides or raw app-owned editor controls are needed.

## Controlled usage

```tsx
const [scene, setScene] = useState<DrawingScene>(() => createDrawingScene(1000, 700));
<DrawingEditor label="Note drawing" value={scene} onChange={setScene} onExport={async png => {
  // Upload this real image/png Blob, await the durable write, and surface failures.
  await uploadNoteImage(png);
}} />
```

For a source image, use `createDrawingScene(width, height, true)` and pass `sourceImage`. This adds a locked background layer referencing the reserved asset key `source`. Supply dimensions in browser-oriented pixels. Original image data is **not** copied into the scene. Persist its identity/hash separately and resolve it again when resuming. Unlock the source layer in the panel to move/resize/rotate it. GIF and animated WebP flatten a browser-decoded frame; the editor never preserves animation.

| Prop | Contract |
| --- | --- |
| `value` / `onChange` | Required `DrawingScene` / `(scene) => void`. Echo committed values by identity. Pointer previews remain internal; a completed stroke or transform emits one scene, not a base64 image per pointer event. External replacement resets the in-session undo history and selection. |
| `label` | Required accessible editor/canvas name. |
| `sourceImage` | Optional same-origin URL or PNG/JPEG/WebP/GIF raster data URL for the reserved `source` asset. |
| `readOnly` | View, inspect/select layers and export without mutation. |
| `disabled` | Disable canvas input, panel interaction and export. |
| `onExport` | Optional async PNG Blob receiver; adds Export flattened PNG. Rejections are shown without clearing the scene. Busy state covers rasterization and the receiver. |
| `onInteractionChange` | Optional active-gesture/import/export notification. Suspend host autosave that would disable the editor while this is true. |
| `resolveImage` | Explicit trusted raster loader `(source, signal?) => Promise<CanvasImageSource>`. Only this handler can opt source-image loading into a remote origin. It must return an origin-clean bounded raster, not execute SVG/HTML. Returned ImageBitmaps transfer lifecycle ownership to the editor/export operation and are closed after use. |
| `signal` | Optional cancellation signal for image loading and PNG export. |
| `className`, div attributes | Root composition. Do not override internal controls. |
| `ref` | `DrawingEditorHandle`: `focus()` and `exportPng(): Promise<Blob>`. Imperative export works in readOnly mode, rejects while disabled/loading/a gesture/another operation is active. |

## Scene and validation

The pure entrypoint `@g4rcez/components/drawing-editor-scene` exports scene types, `DRAWING_LIMITS`, `createDrawingScene`, `parseDrawingScene`, `serializeDrawingScene`, `deserializeDrawingScene`, geometry/hit-testing, `transformDrawingLayers`, `drawingReorder` and bounded history helpers. It imports no React or browser modules and is suitable for server validation.

`DrawingScene` version 1 has `width`, `height`, hexadecimal/transparent `background`, raster `assets: Record<string,string>` and a bottom-to-top `layers` array. Every layer has a stable id, name, visible, locked, opacity, x/y/width/height, clockwise rotation, optional group id and optional normalized polygon mask.

Layer variants:

- `paint`: immutable stroke arrays. Each stroke has normalized points, hexadecimal color, pixel size, erase flag and optional normalized selection clip. Erasers remove only this paint layer's pixels.
- `image`: an asset id, or `source` supplied by the host. Embedded raster strings occur once in assets and are shared by reference in history, not cloned during pointer movement.
- `text`: literal text, hexadecimal color and fontSize. System sans-serif rendering; text is never inserted as HTML.
- `shape`: rectangle/ellipse, fill, stroke and strokeWidth.

`parseDrawingScene(unknown, { origin? })` reconstructs JSON-only data and rejects future versions, duplicate ids, missing assets, invalid flags/colors/numbers and budget overflow. Default persistence accepts raster data URLs only; same-origin asset URLs require the explicit origin option and should not be treated as portable. SVG/HTML/blob/file/credential URLs are refused. Rendering separately checks matching raster headers before bitmap decode, rejects redirects, caps each fetched image at 8 MiB and bounds decoded dimensions. A trusted `resolveImage` owns its own size/origin discipline.

Limits: canvas sides 8192, total canvas pixels 24 million, 100 layers, 30 embedded assets, 2000 strokes, 100,000 total points (including masks), 12 MiB UTF-8 scene JSON, 50 undo snapshots. Layer coordinates are finite within ±32768, extents 1–32768 and rotation ±360 degrees. A draft stores scene content, not history or temporary selection. Only canvas-sized output and one reusable layer scratch surface are allocated by the compositor; decoded images add their own memory. Large compositions still have substantial memory and repaint cost.

Default raster loading additionally caps the combined unique source/asset image area at **48 million pixels**, before decoding each next image. Hosts using the trusted resolver must enforce their own equivalent budget. The scene's original image is out-of-band, so only a host that resolves it can enforce this combined bound.

`exportDrawingPng(scene, { sourceImage?, resolveImage?, signal? })` returns actual flattened `image/png` bytes, excludes handles/selection UI, preserves scene transparency, clips to canvas bounds and rejects output over 8 MiB. It requires browser Canvas 2D/createImageBitmap; it is not an SSR rasterizer. It revalidates the scene and propagates decode, tainted-canvas and encoder failures.

## Tools and keyboard

Pencil and eraser use round strokes. The layer panel supports paint/text/rectangle/ellipse/image creation, multiselection, rename, visibility/opacity, locks, raise/lower, flat groups and ungroup. Group members move, scale and rotate together around a shared origin; this is not a nested/group-effect compositor.

Select/move tool: drag layer bounds, corner handles for proportional scaling, top handle for rotation. Snap uses a 10px grid plus canvas and unselected-layer edges/centers; Alt bypasses it. Shift constrains rotation to 15-degree steps. Numeric transform fields provide a keyboard alternative. Arrow keys move selected unlocked layers by 1px (Shift: 10px); Delete/Backspace deletes; Ctrl/⌘ A selects unlocked layers; Ctrl/⌘ Z undoes; Ctrl/⌘ Shift Z or Ctrl Y redoes. Escape cancels the active gesture or clears the selection. Shortcuts apply only while the canvas is focused, not while entering text.

Rectangular and freehand selections restrict subsequent strokes. Apply a selection as selected-layer masks or remove masks. Keyboard rectangle fields provide non-pointer selection creation. Layer masks are linked, hard-edge polygons; they move with their layer. Temporary selection is document-space and not durable until applied to a layer/stroke. Layer selection is geometric bounding-box selection, not alpha-perfect picking. Standard library controls provide labels, focus and keyboard activation; canvas tools use Pointer Events/capture, including cancellation. Status/errors are announced. The canvas and handles add no authored motion; composed Alert feedback retains its existing Collapse transitions and reduced-motion contract.

## Design tokens and surfaces

- `--var-drawing-editor-gap` defaults to `--var-spacing-base`.
- `--var-drawing-editor-canvas-background` defaults to `--var-color-background`.
- `--var-drawing-editor-layer-list-height` defaults to `22rem`.
- `--var-drawing-editor-handle-space` defaults to `calc(var(--var-spacing-base) * 3)` and reserves hit-test space around the canvas, including handles on a full-canvas background.
- Canonical foreground, background, border and primary tokens own text, canvas boundary, focus and geometry handles.
- Layout stacks below 60rem; surrounding application navigation breakpoints are unaffected. The canvas is a genuinely two-dimensional content surface and scales to container width. Layers remain a scrollable semantic list. Forced colors use Highlight for handles and focus.

## Deliberate capability boundaries

No nested groups, blend modes, adjustment/effect layers, soft/feather/density masks, pressure dynamics, document guides/zoom/pan, raster pixel-selection copy/merge, arbitrary SVG paths, custom fonts, PDF signing or AI/inpaint adapters. No upstream project-codec compatibility is claimed. Host persistence must check ownership, source identity, optimistic revisions and byte budgets, report durable-write receipts and preserve open work on conflicts. A Canvas bitmap, an in-session history or a pixel recipe is not a durable layered draft.
