---
title: DrawingEditor
description: Controlled layered raster/vector drawing with bounded JSON scenes and flattened PNG export.
package: "@g4rcez/components"
export: "{ DrawingEditor, createDrawingScene, exportDrawingPng }"
import: "import { DrawingEditor, createDrawingScene } from '@g4rcez/components/drawing-editor'"
category: form
---

# DrawingEditor

Browser Canvas 2D editor for image annotation, note drawings and small layered compositions. The library owns the canvas, transform handles, layer panel, tools, selection masks and feedback. The host owns persistence and upload policy. The editor calls no AI service and saves no file implicitly.

## Import and styles

```tsx
import { DrawingEditor, createDrawingScene, type DrawingScene } from '@g4rcez/components/drawing-editor';
import '@g4rcez/components/foundation.css';
import '@g4rcez/components/drawing-editor.css';
```

- CSS dependency closure: **button, polymorph, input, input-field, free-text, textarea, select, checkbox, alert, tooltip, resizable**.
- Use the style manifest's `drawing-editor` resolution for split CSS.
- `drawingEditorStyles` declares direct dependencies `button`, `input`, `textarea`, `select`, `checkbox`, `alert`, `resizable`. `resizable` covers the surface of Alert's Collapse composition.
- drawing-editor.css alone does not style the composed controls.
- Add no private overrides or raw app-owned editor controls.

## Controlled usage

```tsx
const [scene, setScene] = useState<DrawingScene>(() => createDrawingScene(1000, 700));
<DrawingEditor label="Note drawing" value={scene} onChange={setScene} onExport={async png => {
  // Upload this real image/png Blob, await the durable write, and surface failures.
  await uploadNoteImage(png);
}} />
```

- Source image: call `createDrawingScene(width, height, true)` and pass `sourceImage`. This adds a locked background layer for the reserved asset key `source`.
- Give dimensions in browser-oriented pixels.
- The scene does **not** copy the original image data. Persist its identity/hash separately and resolve it again on resume.
- Unlock the source layer in the panel to move, resize or rotate it.
- GIF and animated WebP flatten one browser-decoded frame. Animation is never kept.

| Prop | Contract |
| --- | --- |
| `value` / `onChange` | Required `DrawingScene` / `(scene) => void`. Echo committed values by identity. |
| `label` | Required accessible editor/canvas name. |
| `sourceImage` | Optional same-origin URL or PNG/JPEG/WebP/GIF raster data URL for the reserved `source` asset. |
| `readOnly` | View, inspect/select layers and export. No mutation. |
| `disabled` | Disable canvas input, panel interaction and export. |
| `onExport` | Optional async PNG Blob receiver. Adds Export flattened PNG. |
| `onInteractionChange` | Optional active-gesture/import/export notification. |
| `resolveImage` | Trusted raster loader `(source, signal?) => Promise<CanvasImageSource>`. Only this handler enables remote-origin source images. |
| `signal` | Optional cancellation signal for image loading and PNG export. |
| `className`, div attributes | Root composition. Do not override internal controls. |
| `ref` | `DrawingEditorHandle`: `focus()` and `exportPng(): Promise<Blob>`. |

- `value` / `onChange`: pointer previews stay internal. A completed stroke or transform emits one scene, not a base64 image per pointer event. External `value` replacement resets undo history and selection.
- `onExport`: rejections show in the UI and keep the scene. Busy state covers rasterization and the receiver.
- `onInteractionChange`: while true, suspend host autosave that would disable the editor.
- `resolveImage` MUST return an origin-clean bounded raster and MUST NOT execute SVG/HTML. The editor/export operation owns returned ImageBitmaps and closes them after use.
- `ref`: imperative export works in readOnly mode. It rejects while disabled, loading, a gesture, or another operation is active.

## Scene and validation

The pure entrypoint `@g4rcez/components/drawing-editor-scene` imports no React or browser modules, so it suits server validation. It exports scene types, `DRAWING_LIMITS`, `createDrawingScene`, `parseDrawingScene`, `serializeDrawingScene`, `deserializeDrawingScene`, geometry/hit-testing, `transformDrawingLayers`, `drawingReorder` and bounded history helpers.

`DrawingScene` stays version 1. New fields are optional. Absent fields keep the original rendering semantics, and parsing does not synthesize them.

- Document: `width`, `height`, hexadecimal/transparent `background`, raster `assets: Record<string,string>`, bottom-to-top `layers`, optional `guides: { axis: 'x' | 'y'; position: number }[]`.
- Every layer: stable id, name, visible, locked, opacity, x/y/width/height, clockwise rotation.
- Original optional `group` is **only a legacy flat selection tag**. It loads without a group layer.
- New optional `parent` is a checked structural reference to a `kind: 'group'` layer.

Layer variants:

- `paint`: immutable stroke arrays. Stroke: normalized points, hexadecimal color, pixel size, erase flag, optional normalized selection clip.
  - Optional `dynamics: true` uses each point's `pressure` (0–1) for variable width. Without it, the constant-width renderer applies.
  - Erasers remove only this paint layer's pixels.
- `image`: an asset id, or `source` from the host. Embedded raster strings occur once in assets. History shares them by reference, with no cloning during pointer movement.
- `text`: literal text, hexadecimal color, fontSize. System sans-serif. Never inserted as HTML.
- `shape`: rectangle/ellipse, fill, stroke, strokeWidth.
- `group`: `contentWidth` / `contentHeight` define its integer local coordinate system.
  - Children keep parent-local pixel coordinates. The group's x/y/width/height/rotation transform the isolated composite.
  - Groups nest to eight ancestors.
  - Visibility, opacity, masks, effects and blend mode apply once to the group pixels, not to each child.
  - A locked ancestor blocks child edits, picking, reorder, deletion and destructive pixel replacement.
- `effect` and `adjustment`: an `adjustment: DrawingEffects` transforms pixels already below the layer in the same isolated parent. The layer rectangle, transform, mask, opacity and blend mode delimit and composite the result. Both share one filter contract. Add effect starts with blur. Add adjustment starts with brightness.

All layers can carry `blend` from `DRAWING_BLENDS` (source-over, multiply, screen, overlay, darken, lighten, difference, exclusion, color, luminosity) and `effects: DrawingEffects`.

- `DEFAULT_DRAWING_EFFECTS`: blur 0, brightness/contrast/saturation 1, grayscale/invert 0.
- Ranges: blur 0–32 document pixels, brightness/contrast/saturation 0–4, grayscale/invert 0–1.
- Effects run on isolated composited content before its mask. Previews and PNG exports use the same tiled compositor.

`softMask` is `{ density, feather, base, strokes }`.

- Density and base: 0–1. Feather: 0–32 document pixels.
- A legacy normalized polygon can seed the mask and stays linked to the layer.
- Mask stroke: normalized points, size, hardness, opacity, erase (`true` hides, `false` reveals). Optional referenceWidth/referenceHeight keep brush geometry after a layer transform.
- Hardness shapes the radial brush falloff. Stroke opacity applies **once to the completed stroke**, not per overlapping stamp.
- Feather blurs the mask. Density interpolates between unrestricted alpha and the mask: `alpha = 1 - density + density * maskAlpha`.
- Density zero disables the mask and keeps it.
- Reveal on an unmasked layer starts with a black mask. Hide starts with a white mask.

`parseDrawingScene(unknown, { origin? })` reconstructs JSON-only data.

- It rejects future versions, duplicate ids, missing assets, dangling or non-group parents, cycles, excessive nesting, invalid flags/colors/numbers and budget overflow.
- Default persistence accepts raster data URLs only. Same-origin asset URLs need the explicit origin option and are not portable.
- SVG/HTML/blob/file/credential URLs are refused.
- The pure parser checks embedded raster headers before browser decode.
- Rendering also checks matching raster headers, rejects redirects, caps each fetched image at 8 MiB and bounds decoded dimensions.
- Trusted resolvers MUST return origin-clean raster sources. The decoder budget also checks their reported dimensions.

Limits:

- Canvas sides 8192. Total canvas pixels 24 million.
- 100 layers (including groups/adjustments/effects). 30 embedded assets.
- 2000 paint/mask strokes. 100,000 total points (including masks).
- 12 MiB UTF-8 scene JSON. 50 undo snapshots. 100 guides.
- Layer coordinates finite within ±32768. Extents 1–32768. Rotation ±360 degrees.
- Group content dimensions obey the canvas limits.
- Combined scene blur plus feather: 128 pixels maximum, to bound filter halos.

Compositor memory:

- 256px output tiles, shared filter halo, reusable depth-bounded scratch pool.
- Scratch allocations are capped at 24 million pixels. There is one canvas-sized output, not one canvas-sized surface per group or layer. Rendering releases scratch surfaces.
- Unique decoded source/asset images add at most **48 million pixels**. The check covers default and trusted loaders. The pure parser also checks the combined embedded raster area. The out-of-band source counts when resolved.
- Pixel creation temporarily also holds its bounded output bitmap and raster encoding canvas.
- Large documents still cost substantial memory and repaint time.

`exportDrawingPng(scene, { sourceImage?, resolveImage?, signal? })`:

- Returns actual flattened `image/png` bytes.
- Excludes guides, handles, selection and view transforms. Keeps scene transparency. Clips to canvas bounds. Rejects output over 8 MiB.
- Needs browser Canvas 2D/createImageBitmap, and Canvas filter support for effected scenes. Unsupported filters fail explicitly, never produce an incorrect image.
- It is not an SSR rasterizer.
- Export yields after every tile and checks cancellation between tiles and after encoding.
- Browser bitmap decode and PNG encoding cannot be interrupted, but cancelled results never commit or deliver.
- Decode, tainted-canvas and encoder failures propagate and leave document state unchanged.

## Tools and keyboard

- Pencil and eraser draw round strokes.
- Real pen PointerEvent pressure varies width when Pen pressure width is enabled. Mouse/touch strokes keep constant width. The editor infers no pressure from mouse velocity.
- The layer panel creates paint/text/rectangle/ellipse/image, effect and adjustment layers. It supports multiselection, rename, visibility/opacity, locks, blends, effects and nested groups.
- **Group selected** wraps adjacent sibling selections and keeps their local geometry.
- The Parent group field reparents explicitly. It keeps parent-local coordinates and does not preserve world placement.
- Clear existing flat tags separately.

Select/move tool:

- Drag layer bounds. Corner handles scale proportionally. The top handle rotates.
- Snap: 10px document grid plus canvas, guide and unselected root-layer edges/centers. Alt bypasses it.
- Nested layer movement converts through ancestor transforms.
- Rotation uses the layer's parent coordinate system. The format has no arbitrary affine shear.
- Shift constrains rotation to 15-degree steps.
- Numeric transform fields give a keyboard alternative.
- Arrow keys move selected unlocked layers 1 document pixel (Shift: 10).
- Delete/Backspace deletes. Ctrl/⌘ A selects unlocked layers. Ctrl/⌘ Z undoes. Ctrl/⌘ Shift Z or Ctrl Y redoes.
- Escape cancels a gesture, selection or active pixel operation.
- Shortcuts apply only while the canvas has focus.

View and guides:

- Zoom (10–800%), Pan view, numeric pan fields and Fit view are transient. They change no document pixels or history.
- Pointer mapping and hit/handle testing use the actual transformed canvas rectangle.
- Guides are durable document-space lines with numeric axis/position controls. They take part in snapping and never appear in PNG output.

Selections and masks:

- Rectangular and freehand selections restrict later strokes and can become linked soft layer masks.
- Keyboard rectangle fields create selections without a pointer.
- Reveal/Hide mask paint real alpha, with independent brush hardness/opacity and mask feather/density controls.
- A temporary pixel selection lives in document space. It is not durable until applied or copied.

Pixel operations:

- **Copy selected pixels** creates an independent embedded PNG layer from the actual visible composite inside the pixel selection. Every original stays untouched.
- **Merge selected pixels** and **Rasterize selected** flatten selected unlocked sibling subtrees with their masks/effects.
- Replacement happens only after rendering, encoding, asset/document-budget validation and stale-operation checks succeed.
- Destructive selections MUST be adjacent siblings.
- Include underlying siblings when you flatten adjustments or a multi-layer blended merge. Otherwise the required backing pixels are dropped.
- A single ordinary rasterized layer keeps its root blend mode and bakes its other appearance.
- Root adjustments and blended merges also bake the scene background once and clear the separate background on successful commit.
- Nested replacement stays in its parent, so ancestor effects are not baked twice.
- **Current restriction:** flattening a blurred/feathered subtree beneath a scaled ancestor is rejected, with guidance to rasterize the containing scaled group. Document-space filter radii never change silently.
- Undo/Redo snapshots keep originals and shared assets. The result uses a new asset id and real raster bytes.

Operations and cancellation:

- Import, export and pixel work block duplicate operations and show progress/Cancel.
- Replacing the controlled scene, changing the source/loader, becoming disabled/read-only, or unmounting cancels pending work.
- Identity/generation checks also stop stale results from committing into a newer scene.
- Failed or cancelled work leaves the scene and history unchanged and reports recovery feedback.
- Cancellation cannot retract a host `onExport` write already started. The host owns its durable-write semantics.

Accessibility:

- Layer selection is geometric bounding-box selection, not alpha-perfect picking.
- Standard library controls provide labels, focus and keyboard activation.
- Canvas tools use Pointer Events and capture, including cancellation.
- Status and errors are announced.
- The canvas and handles add no authored motion. Composed Alert feedback keeps its Collapse transitions and reduced-motion contract.

## Design tokens and surfaces

- `--var-drawing-editor-gap` defaults to `--var-spacing-base`.
- `--var-drawing-editor-canvas-background` defaults to `--var-color-background`.
- `--var-drawing-editor-layer-list-height` defaults to `22rem`.
- `--var-drawing-editor-handle-space` defaults to `calc(var(--var-spacing-base) * 3)`. It reserves hit-test space around the canvas, including handles on a full-canvas background.
- Canonical foreground, background, border and primary tokens own text, canvas boundary, focus and geometry handles.
- Layout stacks below 60rem. Application navigation breakpoints are unaffected.
- The canvas is a two-dimensional content surface and scales to container width. Layers stay a scrollable semantic list.
- Forced colors use Highlight for handles and focus.

## Deliberate capability boundaries

- Not supported: upstream project-codec compatibility, arbitrary SVG paths, affine shear, custom fonts, PDF signing, AI/inpaint adapters.
- The editor makes no external provider or model calls.
- Host persistence MUST check ownership, source identity, optimistic revisions and byte budgets, report durable-write receipts, and keep open work on conflicts.
- A Canvas bitmap, in-session history or pixel recipe is not a durable layered draft.

## Pixel smoke recipe (consumer verification)

Use a disposable document/source and a browser with Canvas filters. Do not use production persistence.

1. Create two overlapping colored shapes. Group them, then group that group with a third shape. Add group blur and partial opacity. Put a brightness/contrast adjustment **inside** the inner group. Apply a rectangular mask and feather to the outer group. Serialize with the pure entrypoint, deserialize and remount. Export both scenes. Compare decoded RGBA bytes (not PNG container bytes). Compare the preview canvas with the export. Expect equal pixels and retained hierarchy/effect/mask properties.
2. On an opaque solid layer, Hide mask with size 100, hardness 0.2, brush opacity 60%. Sample center, near-edge and untouched pixels. Expect: center partially hidden, edge less hidden, untouched unchanged. Set mask density 50%: center alpha must move halfway back toward the original and still differ from the edge. Change feather independently, then undo/redo. Density zero must restore the unmasked layer and keep the stored brush strokes.
3. Send pen pointer samples with pressure 0.1, 0.5 and 0.9 along a wide stroke. Inspect cross-section widths in exported pixels. Draw with a mouse and confirm constant width, although mouse event pressure is 0.5. Reload and repeat the RGBA comparison.
4. Set zoom 200% and nonzero X/Y pan with the numeric controls. Draw, pick and drag the same known document location. Inspect persisted coordinates. Use keyboard transform fields and arrows. Add a guide at X=123. Drag near it with snapping on and inspect the layer's document-space origin. Alt bypasses it. Export must contain no guide, selection, handle or view overlay pixels.
5. Set a rectangle selection over overlapping, masked/effected content and Copy selected pixels. Hide or delete the source layers. Verify the copy keeps real independent RGBA pixels, transparent outside the selection. Undo/redo and verify the original scene/asset ids return. Merge adjacent sibling layers, then rasterize a nested group and compare before/after composite pixels. Include backing siblings when an adjustment or blended merge needs them.
6. Lock the outer group. Child property fields, picking, transforms, reorder, mask painting and destructive pixel actions must not mutate it or its descendants. Unlock and repeat the same action successfully. Blocked keyboard movement/deletion and boundary reorder must also preserve undo/redo: they emit no replacement scene and create no history entry.
7. Begin export/pixel work on a larger disposable scene. Before completion, cancel between rows, replace `value`, change source, or switch disabled/readOnly. Assert no stale `onChange`, no original removal, no extra history entry, and useful cancellation feedback. Inject a decode, encoding or asset-budget failure and confirm the previous scene is retained.

Pure boundary regressions live in `tests/drawing-editor.test.ts`. They do not establish browser pixels, pressure hardware, focus, or visual behavior. Run this smoke recipe after packaging.
