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

`DrawingScene` remains version 1. New fields are optional; absent fields retain the original rendering semantics and are not synthesized during parsing. The document has `width`, `height`, hexadecimal/transparent `background`, raster `assets: Record<string,string>`, a bottom-to-top `layers` array and optional `guides: { axis: 'x' | 'y'; position: number }[]`. Every layer has a stable id, name, visible, locked, opacity, x/y/width/height and clockwise rotation. The original optional `group` is **only a legacy flat selection tag** and remains loadable without a corresponding group layer. The new optional `parent` is a checked structural reference to a `kind: 'group'` layer.

Layer variants:

- `paint`: immutable stroke arrays. Each stroke has normalized points, hexadecimal color, pixel size, erase flag and optional normalized selection clip. Optional `dynamics: true` uses each point's `pressure` (0–1) for variable width; an absent dynamics flag preserves the original constant-width renderer. Erasers remove only this paint layer's pixels.
- `image`: an asset id, or `source` supplied by the host. Embedded raster strings occur once in assets and are shared by reference in history, not cloned during pointer movement.
- `text`: literal text, hexadecimal color and fontSize. System sans-serif rendering; text is never inserted as HTML.
- `shape`: rectangle/ellipse, fill, stroke and strokeWidth.
- `group`: `contentWidth` / `contentHeight` define its integer local coordinate system. Children retain parent-local pixel coordinates while the group's x/y/width/height/rotation transform the isolated composite. Groups nest to eight ancestors. Visibility, opacity, masks, effects and blend mode apply to the resulting group pixels once, rather than independently to each child. A locked ancestor blocks child edits, picking, reorder, deletion and destructive pixel replacement.
- `effect` and `adjustment`: an `adjustment: DrawingEffects` transforms pixels already below the layer in the same isolated parent. The layer rectangle, transform, mask, opacity and blend mode delimit/composite the result. These layers share the same explicit filter contract; Add effect starts with blur, Add adjustment starts with brightness.

All layers may carry `blend` from `DRAWING_BLENDS` (source-over, multiply, screen, overlay, darken, lighten, difference, exclusion, color, luminosity) and `effects: DrawingEffects`. `DEFAULT_DRAWING_EFFECTS` supplies blur 0, brightness/contrast/saturation 1 and grayscale/invert 0. Blur is 0–32 document pixels, brightness/contrast/saturation 0–4 and grayscale/invert 0–1. Effects run on isolated composited content before its mask; previews and PNG exports use the same tiled compositor.

`softMask` is `{ density, feather, base, strokes }`. Density and base are 0–1; feather is 0–32 document pixels. A legacy normalized polygon can seed the mask and remains linked to the layer. A mask stroke has normalized points, size, hardness, opacity and erase (`true` hides; `false` reveals), with optional referenceWidth/referenceHeight preserving brush geometry when a layer is later transformed. Hardness shapes the radial brush falloff; stroke opacity is applied **once to the completed stroke**, not once per overlapping stamp. Feather blurs the resulting mask; density independently interpolates between unrestricted alpha and that mask: `alpha = 1 - density + density * maskAlpha`. Density zero disables the mask without discarding it. Reveal on a previously unmasked layer starts with a black mask; Hide starts with a white mask.

`parseDrawingScene(unknown, { origin? })` reconstructs JSON-only data and rejects future versions, duplicate ids, missing assets, dangling/non-group parents, cycles, excessive nesting, invalid flags/colors/numbers and budget overflow. Default persistence accepts raster data URLs only; same-origin asset URLs require the explicit origin option and should not be treated as portable. SVG/HTML/blob/file/credential URLs are refused. Embedded raster headers are checked by the pure parser before browser decode. Rendering separately checks matching raster headers, rejects redirects, caps each fetched image at 8 MiB and bounds decoded dimensions. Trusted resolvers must return origin-clean raster sources; their reported dimensions are also checked against the decoder budget.

Limits: canvas sides 8192, total canvas pixels 24 million, 100 layers (including groups/adjustments/effects), 30 embedded assets, 2000 paint/mask strokes, 100,000 total points (including masks), 12 MiB UTF-8 scene JSON, 50 undo snapshots and 100 guides. Layer coordinates are finite within ±32768, extents 1–32768 and rotation ±360 degrees. Group content dimensions obey the canvas limits. Combined scene blur plus feather is bounded to 128 pixels to bound filter halos.

The compositor processes 256px output tiles with a shared filter halo and reusable, depth-bounded scratch pool. Scratch allocations are capped at 24 million pixels; there is one canvas-sized output, not a canvas-sized surface for every group/layer. Scratch surfaces are released after rendering. Unique decoded source/asset images add at most **48 million pixels**, checked for both default and trusted loaders; the pure parser checks the combined embedded raster area too. The out-of-band source is counted when resolved. Pixel creation temporarily also holds its bounded output bitmap and raster encoding canvas. Large documents still have substantial memory and repaint cost.

`exportDrawingPng(scene, { sourceImage?, resolveImage?, signal? })` returns actual flattened `image/png` bytes, excludes guides, handles, selection and view transforms, preserves scene transparency, clips to canvas bounds and rejects output over 8 MiB. It requires browser Canvas 2D/createImageBitmap and Canvas filter support for effected scenes; unsupported filters fail explicitly rather than silently producing an incorrect image. It is not an SSR rasterizer. Export yields after every tile and checks cancellation between tiles and after encoding. Browser bitmap decode/PNG encoding cannot themselves be interrupted, but cancelled results never commit or deliver. Decode, tainted-canvas and encoder failures propagate without replacing document state.

## Tools and keyboard

Pencil and eraser use round strokes. Real pen PointerEvent pressure varies width when Pen pressure width is enabled; mouse/touch strokes retain constant width. No synthetic pressure is inferred from mouse velocity. The layer panel supports paint/text/rectangle/ellipse/image, effect and adjustment creation, multiselection, rename, visibility/opacity, locks, blends, effects and nested groups. **Group selected** wraps adjacent sibling selections without changing their local geometry. The Parent group field explicitly reparents while retaining parent-local coordinates; it does not promise to preserve world placement. Existing flat tags can be cleared separately.

Select/move tool: drag layer bounds, corner handles for proportional scaling, top handle for rotation. Snap uses a 10px document grid plus canvas, guide and unselected root-layer edges/centers; Alt bypasses it. Nested layer movement is converted through ancestor transforms. Rotation is in the layer's parent coordinate system; arbitrary affine shear is not part of this scene format. Shift constrains rotation to 15-degree steps. Numeric transform fields provide a keyboard alternative. Arrow keys move selected unlocked layers by 1 document pixel (Shift: 10); Delete/Backspace deletes; Ctrl/⌘ A selects unlocked layers; Ctrl/⌘ Z undoes; Ctrl/⌘ Shift Z or Ctrl Y redoes. Escape cancels a gesture/selection or active pixel operation. Shortcuts apply only while the canvas is focused.

Zoom (10–800%), Pan view, numeric pan fields and Fit view are transient viewing controls and do not alter document pixels or history. Pointer mapping and hit/handle testing use the actual transformed canvas rectangle. Guides are durable document-space lines with numeric axis/position controls; they participate in snapping but never appear in PNG output.

Rectangular and freehand selections restrict subsequent strokes and can become linked soft layer masks. Keyboard rectangle fields provide non-pointer selection creation. Reveal/Hide mask paint real alpha with independent brush hardness/opacity and mask feather/density controls. Temporary pixel selection is document-space and is not durable until applied/copied.

**Copy selected pixels** creates an independent embedded PNG layer from the actual visible composite inside the pixel selection, leaving every original untouched. **Merge selected pixels** and **Rasterize selected** flatten selected unlocked sibling subtrees with their masks/effects; replacement happens only after rendering, encoding, asset/document-budget validation and stale-operation checks succeed. Destructive selections must be adjacent siblings. Include underlying siblings when flattening adjustments or a multi-layer blended merge, so the required backing pixels are not silently dropped. A single ordinary rasterized layer retains its root blend mode; its other appearance is baked. Root adjustments/blended merges also bake the scene background once and clear the separate background on successful commit. Nested replacement stays in its parent, so ancestor effects are not baked twice. **Current restriction:** flattening a blurred/feathered subtree beneath a scaled ancestor is rejected with recovery guidance to rasterize the containing scaled group; it does not silently change document-space filter radii. Originals and shared assets remain in Undo/Redo snapshots; the result uses a new asset id and real raster bytes.

Import, export and pixel work prevent duplicate operations and expose progress/Cancel. Replacing the controlled scene, changing the source/loader, becoming disabled/read-only or unmounting cancels pending work. Identity/generation checks additionally prevent stale results from committing into a newer scene. Failed/cancelled work leaves the scene and history unchanged and reports recovery feedback. Cancellation cannot retract a host `onExport` write already started; the host remains responsible for its own durable-write semantics.

Layer selection is geometric bounding-box selection, not alpha-perfect picking. Standard library controls provide labels, focus and keyboard activation; canvas tools use Pointer Events/capture, including cancellation. Status/errors are announced. The canvas and handles add no authored motion; composed Alert feedback retains its existing Collapse transitions and reduced-motion contract.

## Design tokens and surfaces

- `--var-drawing-editor-gap` defaults to `--var-spacing-base`.
- `--var-drawing-editor-canvas-background` defaults to `--var-color-background`.
- `--var-drawing-editor-layer-list-height` defaults to `22rem`.
- `--var-drawing-editor-handle-space` defaults to `calc(var(--var-spacing-base) * 3)` and reserves hit-test space around the canvas, including handles on a full-canvas background.
- Canonical foreground, background, border and primary tokens own text, canvas boundary, focus and geometry handles.
- Layout stacks below 60rem; surrounding application navigation breakpoints are unaffected. The canvas is a genuinely two-dimensional content surface and scales to container width. Layers remain a scrollable semantic list. Forced colors use Highlight for handles and focus.

## Deliberate capability boundaries

No upstream project-codec compatibility, arbitrary SVG paths, affine shear, custom fonts, PDF signing or AI/inpaint adapters. No external provider or model calls are made. Host persistence must check ownership, source identity, optimistic revisions and byte budgets, report durable-write receipts and preserve open work on conflicts. A Canvas bitmap, an in-session history or a pixel recipe is not a durable layered draft.

## Pixel smoke recipe (consumer verification)

Use a disposable document/source and a browser with Canvas filters; do not point these exercises at production persistence.

1. Create two overlapping colored shapes, group them, then group that group with a third shape. Add group blur and partial opacity. Put a brightness/contrast adjustment **inside** the inner group. Apply a rectangular mask and feather to the outer group. Serialize with the pure entrypoint, deserialize and remount. Export both scenes and compare decoded RGBA bytes (not PNG container bytes), and compare the preview canvas against the export. Expect equal pixels and retained hierarchy/effect/mask properties.
2. On an opaque solid layer, Hide mask with size 100, hardness 0.2, brush opacity 60%. Sample center, near edge and untouched pixels. Center must be partially hidden, edge less hidden and untouched unchanged. Set mask density to 50%: center alpha must move halfway back toward the original while remaining different from the edge. Change feather independently; then undo/redo. Density zero must restore the unmasked layer without erasing the stored brush strokes.
3. Send pen pointer samples with pressure 0.1, 0.5 and 0.9 along a wide stroke; inspect cross-section widths in exported pixels. Draw with a mouse and confirm constant width even though mouse event pressure is 0.5. Reload and repeat the RGBA comparison.
4. Set zoom 200% and nonzero X/Y pan using the numeric controls. Draw/pick/drag the same known document location and inspect persisted coordinates. Use keyboard transform fields and arrows. Add a guide at X=123; drag near it with snapping enabled and inspect the layer's document-space origin. Alt bypasses it. Export must contain no guide/selection/handle/view overlay pixels.
5. Set a rectangle selection over overlapping, masked/effected content and Copy selected pixels. Hide/delete the source layers and verify the copy retains real independent RGBA pixels, with transparency outside the selection. Undo/redo and verify original scene/asset ids return. Merge adjacent sibling layers, then rasterize a nested group and compare before/after composite pixels; include backing siblings when an adjustment/blended merge requires them.
6. Lock the outer group. Child property fields, picking, transforms, reorder, mask painting and destructive pixel actions must not mutate it or descendants. Unlock and repeat the same action successfully.
   Blocked keyboard movement/deletion and boundary reorder must also preserve undo/redo: they emit no replacement scene and create no history entry.
7. Begin export/pixel work on a larger disposable scene; cancel between rows, replace `value`, change source, or switch disabled/readOnly before completion. Assert no stale `onChange`, no original removal, no extra history entry and useful cancellation feedback. Inject decode/encoding/asset-budget failure and confirm the previous scene is retained.

Pure boundary regressions live in `tests/drawing-editor.test.ts`. They do not establish browser pixels, pressure hardware, focus, or visual behavior; run this smoke recipe after packaging.
