"use client";
import type React from "react";
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { css } from "../../../lib/dom";
import { Button } from "../../core/button/button";
import { Alert } from "../../display/alert/alert";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import { Textarea } from "../input/textarea";
import { Select } from "../select/select";
import {
    DEFAULT_DRAWING_EFFECTS,
    DRAWING_BLENDS,
    DRAWING_LIMITS,
    drawingAncestors,
    drawingCommit,
    drawingDescendants,
    drawingHitTest,
    drawingLayerLocked,
    drawingSceneLocalPoint,
    drawingSceneWorldPoint,
    drawingRedo,
    drawingReorder,
    drawingUndo,
    parseDrawingScene,
    transformDrawingLayers,
    type DrawingEffects,
    type DrawingHistory,
    type DrawingLayer,
    type DrawingPoint,
    type DrawingScene,
    type DrawingStroke,
} from "./scene";
import {
    drawingHandlePoints,
    exportDrawingPng,
    loadDrawingImages,
    releaseDrawingImages,
    renderDrawingScene,
    type DrawingImages,
    type DrawingRenderOptions,
} from "./render";
import { drawingEditorStyles } from "./drawing-editor.styles";
import { drawingRasterDimensions, drawingRasterSourceDimensions } from "./raster";
export * from "./scene";
export { exportDrawingPng } from "./render";
export type { DrawingRenderOptions } from "./render";
export interface DrawingEditorHandle {
    exportPng(): Promise<Blob>;
    focus(): void;
}
export interface DrawingEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, DrawingRenderOptions {
    value: DrawingScene;
    onChange(scene: DrawingScene): void;
    label: string;
    readOnly?: boolean;
    disabled?: boolean;
    onExport?: (png: Blob) => void | Promise<void>;
    onInteractionChange?: (active: boolean) => void;
}
type Tool = "select" | "pencil" | "eraser" | "rectangle-mask" | "freehand-mask" | "mask-reveal" | "mask-hide" | "pan";
type Gesture = {
    pointer: number;
    start: DrawingPoint;
    scene: DrawingScene;
    preview?: DrawingScene;
    ids: string[];
    mode: "move" | "resize" | "rotate" | "stroke" | "mask" | "paint-mask" | "pan";
    layer?: DrawingLayer;
    stroke?: DrawingStroke;
    points: DrawingPoint[];
    client?: DrawingPoint;
};
const toolLabels: Record<Tool, string> = {
    select: "Select / move",
    pencil: "Pencil",
    eraser: "Eraser",
    "rectangle-mask": "Rectangle selection",
    "freehand-mask": "Freehand selection",
    "mask-reveal": "Reveal mask",
    "mask-hide": "Hide mask",
    pan: "Pan view",
};
function readRasterData(blob: Blob, signal: AbortSignal): Promise<string> {
    const { promise, resolve, reject } = Promise.withResolvers<string>();
    const reader = new FileReader();
    const cancelled = () => {
        cleanup();
        reader.abort();
        reject(new Error("Raster operation cancelled; drawing unchanged."));
    };
    const cleanup = () => signal.removeEventListener("abort", cancelled);
    reader.onload = () => {
        cleanup();
        resolve(String(reader.result));
    };
    reader.onerror = () => {
        cleanup();
        reject(new Error("Could not read raster pixels"));
    };
    reader.onabort = () => {
        cleanup();
        reject(new Error("Raster operation cancelled; drawing unchanged."));
    };
    signal.addEventListener("abort", cancelled, { once: true });
    if (signal.aborted) cancelled();
    else reader.readAsDataURL(blob);
    return promise;
}
export const DrawingEditor = forwardRef<DrawingEditorHandle, DrawingEditorProps>(function DrawingEditor(
    {
        value,
        onChange,
        label,
        readOnly = false,
        disabled = false,
        sourceImage,
        resolveImage,
        signal,
        onExport,
        onInteractionChange,
        className,
        ...props
    },
    ref
) {
    const id = useId();
    const canvas = useRef<HTMLCanvasElement>(null);
    const scratch = useRef<HTMLCanvasElement | null>(null);
    const images = useRef<DrawingImages>(new Map());
    const history = useRef<DrawingHistory>({ past: [], present: value, future: [] });
    const gesture = useRef<Gesture | null>(null);
    const frame = useRef<number | null>(null);
    const operation = useRef(false);
    const lifetime = useRef(0);
    const cancellation = useRef<AbortController | null>(null);
    const latest = useRef(value);
    latest.current = value;
    const writable = useRef(!disabled && !readOnly);
    writable.current = !disabled && !readOnly;
    const currentSource = useRef({ sourceImage, resolveImage, disabled });
    currentSource.current = { sourceImage, resolveImage, disabled };
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [pressure, setPressure] = useState(true);
    const [hardness, setHardness] = useState(0.5);
    const [brushOpacity, setBrushOpacity] = useState(1);
    const [guideAxis, setGuideAxis] = useState<"x" | "y">("x");
    const [guidePosition, setGuidePosition] = useState(100);
    const imageReady = useRef(false);
    const [transient, setTransient] = useState<DrawingScene | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [tool, setTool] = useState<Tool>("pencil");
    const [color, setColor] = useState("#222222");
    const [size, setSize] = useState(6);
    const [snap, setSnap] = useState(true);
    const [selection, setSelection] = useState<DrawingPoint[]>([]);
    const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: value.width, height: value.height });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [exporting, setExporting] = useState(false);
    const [retry, setRetry] = useState(0);
    const scene = transient ?? value;
    const active = scene.layers.find((layer) => layer.id === selected.at(-1));
    const blocked = disabled || readOnly || loading || exporting || Boolean(signal?.aborted);
    const imageKeys = value.layers.flatMap((layer) => (layer.kind === "image" ? [layer.asset] : [])).join("/");
    const editable = selected.filter((identifier) => !drawingLayerLocked(scene, identifier));
    useEffect(() => {
        if (value !== history.current.present) {
            history.current = { past: [], present: value, future: [] };
            if (gesture.current) onInteractionChange?.(false);
            gesture.current = null;
            setTransient(null);
            setSelected([]);
            setSelection([]);
        }
    }, [value, onInteractionChange]);
    useEffect(() => {
        if ((disabled || readOnly) && gesture.current) {
            gesture.current = null;
            setTransient(null);
            onInteractionChange?.(false);
        }
    }, [disabled, readOnly, onInteractionChange]);
    useEffect(() => {
        const controller = new AbortController();
        let owned: DrawingImages | undefined;
        imageReady.current = false;
        setLoading(true);
        setError("");
        const abort = () => controller.abort();
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) controller.abort();
        loadDrawingImages(value, { sourceImage, resolveImage, signal: controller.signal }).then(
            (result) => {
                owned = result;
                if (controller.signal.aborted) {
                    releaseDrawingImages(result);
                    owned = undefined;
                    return;
                }
                images.current = result;
                imageReady.current = true;
                setLoading(false);
            },
            (failure) => {
                if (!controller.signal.aborted) {
                    setError(failure instanceof Error ? failure.message : "Could not load drawing images");
                    setLoading(false);
                }
            }
        );
        return () => {
            imageReady.current = false;
            controller.abort();
            signal?.removeEventListener("abort", abort);
            if (owned) releaseDrawingImages(owned);
        };
    }, [value.assets, imageKeys, sourceImage, resolveImage, signal, retry]);
    const paint = useCallback(
        (next = scene, draft?: { layerId: string; stroke: DrawingStroke }) => {
            if (!canvas.current || !imageReady.current || loading || error) return;
            try {
                scratch.current ??= document.createElement("canvas");
                renderDrawingScene(canvas.current, next, images.current, scratch.current, draft);
            } catch (failure) {
                setError(failure instanceof Error ? failure.message : "Drawing could not be rendered");
            }
        },
        [scene, loading, error]
    );
    useEffect(() => {
        paint();
    }, [paint]);
    useEffect(
        () => () => {
            lifetime.current++;
            cancellation.current?.abort();
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        },
        []
    );
    useEffect(() => {
        cancellation.current?.abort();
    }, [value, disabled, readOnly, sourceImage, resolveImage, signal]);
    useEffect(() => {
        const abort = () => {
            const current = gesture.current;
            gesture.current = null;
            setTransient(null);
            cancellation.current?.abort();
            if (frame.current !== null) {
                cancelAnimationFrame(frame.current);
                frame.current = null;
            }
            if (current && current.mode !== "pan") onInteractionChange?.(false);
            setLoading(false);
            setNotice("Drawing cancelled. Supply a fresh cancellation signal to continue.");
            paint(value);
        };
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
        return () => signal?.removeEventListener("abort", abort);
    }, [signal, value, paint, onInteractionChange]);
    function commit(next: DrawingScene, operationCommit = false) {
        if (!writable.current || gesture.current || signal?.aborted || (operation.current && !operationCommit)) return false;
        if (next === history.current.present) return false;
        const used = new Set(next.layers.flatMap((layer) => (layer.kind === "image" ? [layer.asset] : [])));
        if (Object.keys(next.assets).some((key) => !used.has(key)))
            next = { ...next, assets: Object.fromEntries(Object.entries(next.assets).filter(([key]) => used.has(key))) };
        try {
            parseDrawingScene(next, { origin: window.location.origin });
            let pixels = 0;
            for (const key of used) {
                const image = images.current.get(key) as
                    | { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number }
                    | undefined;
                const dimensions = image
                    ? { width: image.naturalWidth ?? image.width, height: image.naturalHeight ?? image.height }
                    : next.assets[key]?.startsWith("data:")
                      ? drawingRasterSourceDimensions(next.assets[key]!)
                      : undefined;
                if (!dimensions || typeof dimensions.width !== "number" || typeof dimensions.height !== "number")
                    throw new Error("Image dimensions are unavailable; wait for images to load before editing.");
                pixels += dimensions.width * dimensions.height;
                if (pixels > DRAWING_LIMITS.imagePixels) throw new Error("Drawing images exceed the 48 megapixel combined decode budget");
            }
            history.current = drawingCommit(history.current, next);
            setTransient(null);
            onChange(next);
            setNotice("Drawing changed. Save your draft to retain it.");
            setError("");
            return true;
        } catch (failure) {
            setTransient(null);
            setError(failure instanceof Error ? failure.message : "Drawing change exceeds the document budget");
            return false;
        }
    }
    function patch(update: Partial<DrawingLayer>, ids = editable) {
        commit({
            ...value,
            layers: value.layers.map((layer) =>
                ids.includes(layer.id) &&
                !drawingAncestors(value, layer.id).some((owner) => owner.locked) &&
                (!layer.locked || Object.keys(update).every((key) => key === "locked"))
                    ? ({ ...layer, ...update } as DrawingLayer)
                    : layer
            ),
        });
    }
    function undo(redo = false) {
        if (blocked || gesture.current || operation.current || signal?.aborted) return;
        const next = redo ? drawingRedo(history.current) : drawingUndo(history.current);
        history.current = next;
        onChange(next.present);
        setTransient(null);
        setNotice(redo ? "Change restored." : "Change undone.");
    }
    async function rasterExport(deliver?: (png: Blob) => void | Promise<void>): Promise<Blob> {
        if (disabled || loading || operation.current || gesture.current) throw new Error("Finish the current drawing operation before exporting");
        const generation = lifetime.current;
        const snapshot = value;
        const controller = new AbortController();
        cancellation.current = controller;
        const abort = () => controller.abort();
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
        operation.current = true;
        setExporting(true);
        onInteractionChange?.(true);
        try {
            const png = await exportDrawingPng(snapshot, { sourceImage, resolveImage, signal: controller.signal });
            controller.signal.throwIfAborted();
            if (
                generation !== lifetime.current ||
                snapshot !== latest.current ||
                currentSource.current.disabled ||
                currentSource.current.sourceImage !== sourceImage ||
                currentSource.current.resolveImage !== resolveImage
            )
                throw new Error("Drawing closed, replaced or its source changed during export");
            await deliver?.(png);
            if (generation === lifetime.current) setNotice("PNG exported.");
            return png;
        } finally {
            signal?.removeEventListener("abort", abort);
            cancellation.current = null;
            operation.current = false;
            if (generation === lifetime.current) {
                setExporting(false);
                onInteractionChange?.(false);
            }
        }
    }
    useImperativeHandle(ref, () => ({ exportPng: () => rasterExport(), focus: () => canvas.current?.focus() }));
    async function importBitmap(file: File) {
        if (blocked || operation.current || gesture.current) return;
        if (file.size > 8 * 1024 * 1024 || !/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
            setError("Choose a raster image up to 8 MiB.");
            return;
        }
        const generation = lifetime.current;
        const controller = new AbortController();
        cancellation.current = controller;
        const abort = () => controller.abort();
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
        operation.current = true;
        setExporting(true);
        onInteractionChange?.(true);
        try {
            controller.signal.throwIfAborted();
            drawingRasterDimensions(new Uint8Array(await file.arrayBuffer()), file.type);
            controller.signal.throwIfAborted();
            const image = await createImageBitmap(file, { imageOrientation: "from-image" });
            const width = image.width;
            const height = image.height;
            image.close();
            if (width > DRAWING_LIMITS.side || height > DRAWING_LIMITS.side || width * height > DRAWING_LIMITS.pixels)
                throw new Error("Bitmap exceeds drawing image dimensions");
            const data = await readRasterData(file, controller.signal);
            controller.signal.throwIfAborted();
            if (generation !== lifetime.current || value !== latest.current || !writable.current) return;
            const identifier = crypto.randomUUID();
            const asset = crypto.randomUUID();
            if (
                commit(
                    {
                        ...value,
                        assets: { ...value.assets, [asset]: data },
                        layers: [
                            ...value.layers,
                            {
                                id: identifier,
                                kind: "image",
                                asset,
                                name: file.name.slice(0, 160),
                                visible: true,
                                locked: false,
                                opacity: 1,
                                rotation: 0,
                                x: 0,
                                y: 0,
                                width: Math.min(width, value.width),
                                height: Math.max(1, height * Math.min(1, value.width / width)),
                            },
                        ],
                    },
                    true
                )
            ) {
                setSelected([identifier]);
                setTool("select");
            }
        } catch (failure) {
            if (generation === lifetime.current) setError(failure instanceof Error ? failure.message : "Could not import bitmap");
        } finally {
            signal?.removeEventListener("abort", abort);
            cancellation.current = null;
            operation.current = false;
            if (generation === lifetime.current) {
                setExporting(false);
                onInteractionChange?.(false);
            }
        }
    }
    function selectLayer(layer: DrawingLayer, multiple = false) {
        const ids = layer.group ? scene.layers.filter((item) => item.group === layer.group).map((item) => item.id) : [layer.id];
        setSelected((current) =>
            multiple
                ? ids.every((identifier) => current.includes(identifier))
                    ? current.filter((identifier) => !ids.includes(identifier))
                    : [...new Set([...current, ...ids])]
                : ids
        );
    }
    function add(kind: "paint" | "text" | "shape" | "effect" | "adjustment", shape: "rectangle" | "ellipse" = "rectangle") {
        if (blocked) return;
        const identifier = crypto.randomUUID();
        const base = {
            id: identifier,
            name: `${kind === "shape" ? shape : kind} ${value.layers.length + 1}`,
            x: kind === "paint" ? 0 : value.width * 0.2,
            y: kind === "paint" ? 0 : value.height * 0.2,
            width: kind === "paint" ? value.width : Math.max(1, value.width * 0.5),
            height: kind === "paint" ? value.height : Math.max(1, value.height * 0.25),
            rotation: 0,
            visible: true,
            opacity: 1,
            locked: false,
        };
        const layer: DrawingLayer =
            kind === "paint"
                ? { ...base, kind, strokes: [] }
                : kind === "text"
                  ? { ...base, kind, text: "Your text", color, fontSize: 36 }
                  : kind === "shape"
                    ? { ...base, kind, shape, fill: color, stroke: color, strokeWidth: 0 }
                    : {
                          ...base,
                          x: 0,
                          y: 0,
                          width: value.width,
                          height: value.height,
                          kind,
                          adjustment: { ...DEFAULT_DRAWING_EFFECTS, ...(kind === "effect" ? { blur: 2 } : { brightness: 1.2 }) },
                      };
        if (commit({ ...value, layers: [...value.layers, layer] })) {
            setSelected([identifier]);
            setTool(kind === "paint" ? "pencil" : "select");
        }
    }
    function point(event: React.PointerEvent<HTMLDivElement>): DrawingPoint {
        const box = canvas.current!.getBoundingClientRect();
        const x = ((event.clientX - box.left) * value.width) / box.width;
        const y = ((event.clientY - box.top) * value.height) / box.height;
        return tool === "select" ? { x, y } : { x: Math.max(0, Math.min(value.width, x)), y: Math.max(0, Math.min(value.height, y)) };
    }
    function groupSelected() {
        const roots = value.layers.filter(
            (layer) => editable.includes(layer.id) && !drawingAncestors(value, layer.id).some((owner) => editable.includes(owner.id))
        );
        if (!roots.length || roots.some((layer) => layer.parent !== roots[0]!.parent)) {
            setError("Group layers within the same parent.");
            return;
        }
        const siblings = value.layers.filter((layer) => layer.parent === roots[0]!.parent);
        const positions = roots.map((layer) => siblings.indexOf(layer));
        if (Math.max(...positions) - Math.min(...positions) + 1 !== roots.length) {
            setError("Select adjacent sibling layers before grouping to preserve stacking order.");
            return;
        }
        const parent = value.layers.find((layer) => layer.id === roots[0]!.parent);
        const width = parent?.kind === "group" ? parent.contentWidth : value.width;
        const height = parent?.kind === "group" ? parent.contentHeight : value.height;
        const identifier = crypto.randomUUID();
        const members = roots.map((layer) => layer.id);
        const last = Math.max(...roots.map((layer) => value.layers.indexOf(layer)));
        const group: DrawingLayer = {
            id: identifier,
            name: "Group",
            kind: "group",
            x: 0,
            y: 0,
            width,
            height,
            contentWidth: width,
            contentHeight: height,
            rotation: 0,
            visible: true,
            locked: false,
            opacity: 1,
            ...(parent ? { parent: parent.id } : {}),
        };
        const layers = value.layers.map((layer) => (members.includes(layer.id) ? { ...layer, parent: identifier, group: undefined } : layer));
        layers.splice(last + 1, 0, group);
        if (commit({ ...value, layers })) {
            setSelected([identifier]);
            setTool("select");
        }
    }
    async function pixels(mode: "copy" | "merge" | "rasterize") {
        if (blocked || operation.current || gesture.current) return;
        const snapshot = value;
        const generation = lifetime.current;
        const controller = new AbortController();
        cancellation.current = controller;
        const abort = () => controller.abort();
        signal?.addEventListener("abort", abort, { once: true });
        if (signal?.aborted) abort();
        operation.current = true;
        setExporting(true);
        onInteractionChange?.(true);
        try {
            const roots = snapshot.layers.filter(
                (layer) => editable.includes(layer.id) && !drawingAncestors(snapshot, layer.id).some((owner) => editable.includes(owner.id))
            );
            const affected = drawingDescendants(
                snapshot,
                roots.map((layer) => layer.id)
            );
            if (mode !== "copy" && (!roots.length || affected.some((identifier) => drawingLayerLocked(snapshot, identifier))))
                throw new Error("Unlock every selected layer and descendant before replacing pixels.");
            if (mode !== "copy" && roots.some((layer) => layer.parent !== roots[0]!.parent))
                throw new Error("Merge or rasterize layers within the same parent.");
            if (mode !== "copy") {
                const siblings = snapshot.layers.filter((layer) => layer.parent === roots[0]!.parent);
                const positions = roots.map((layer) => siblings.indexOf(layer));
                const first = Math.min(...positions);
                const last = Math.max(...positions);
                if (last - first + 1 !== roots.length) throw new Error("Select adjacent sibling layers to preserve stacking order.");
                if (
                    first > 0 &&
                    roots.some(
                        (layer) =>
                            layer.kind === "effect" ||
                            layer.kind === "adjustment" ||
                            (roots.length > 1 && layer.blend && layer.blend !== "source-over")
                    )
                )
                    throw new Error("Include the layers beneath adjustments or blended merges so their composited pixels are retained.");
            }
            const parent = mode === "copy" ? undefined : snapshot.layers.find((layer) => layer.id === roots[0]!.parent);
            const bakeBackground =
                mode !== "copy" &&
                !parent &&
                roots.some(
                    (layer) =>
                        layer.kind === "effect" || layer.kind === "adjustment" || (roots.length > 1 && layer.blend && layer.blend !== "source-over")
                );
            if (
                mode !== "copy" &&
                parent &&
                drawingAncestors(snapshot, roots[0]!.id).some(
                    (owner) => owner.kind === "group" && (owner.width !== owner.contentWidth || owner.height !== owner.contentHeight)
                ) &&
                snapshot.layers.some(
                    (layer) =>
                        affected.includes(layer.id) &&
                        ((layer.effects?.blur ?? 0) > 0 ||
                            (layer.softMask?.feather ?? 0) > 0 ||
                            ((layer.kind === "effect" || layer.kind === "adjustment") && layer.adjustment.blur > 0))
                )
            )
                throw new Error("Rasterize the containing scaled group to preserve document-space blur and feather.");
            const width = parent?.kind === "group" ? parent.contentWidth : snapshot.width;
            const height = parent?.kind === "group" ? parent.contentHeight : snapshot.height;
            const input: DrawingScene =
                mode === "copy"
                    ? snapshot
                    : {
                          ...snapshot,
                          width,
                          height,
                          guides: undefined,
                          background: bakeBackground ? snapshot.background : "transparent",
                          layers: snapshot.layers
                              .filter((layer) => affected.includes(layer.id))
                              .map((layer) =>
                                  roots.some((root) => root.id === layer.id)
                                      ? { ...layer, parent: undefined, ...(roots.length === 1 && !bakeBackground ? { blend: undefined } : {}) }
                                      : layer
                              ),
                      };
            const png = await exportDrawingPng(input, { sourceImage, resolveImage, signal: controller.signal });
            controller.signal.throwIfAborted();
            let output = png;
            if (mode === "copy") {
                const bitmap = await createImageBitmap(png);
                const raster = document.createElement("canvas");
                raster.width = width;
                raster.height = height;
                try {
                    const context = raster.getContext("2d");
                    if (!context) throw new Error("Canvas 2D rendering is unavailable");
                    if (selection.length >= 3) {
                        context.beginPath();
                        selection.forEach((point, index) => (index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)));
                        context.closePath();
                        context.clip("evenodd");
                    }
                    context.drawImage(bitmap, 0, 0);
                    const encoding = Promise.withResolvers<Blob>();
                    raster.toBlob(
                        (blob) => (blob ? encoding.resolve(blob) : encoding.reject(new Error("Browser could not encode selected pixels"))),
                        "image/png"
                    );
                    output = await encoding.promise;
                } finally {
                    bitmap.close();
                    raster.width = 1;
                    raster.height = 1;
                }
            }
            if (output.size > 8 * 1024 * 1024) throw new Error("Selected pixels exceed the 8 MiB raster budget.");
            const data = await readRasterData(output, controller.signal);
            controller.signal.throwIfAborted();
            if (
                generation !== lifetime.current ||
                latest.current !== snapshot ||
                !writable.current ||
                currentSource.current.sourceImage !== sourceImage ||
                currentSource.current.resolveImage !== resolveImage
            )
                throw new Error("Drawing changed; pixel operation was discarded.");
            const asset = crypto.randomUUID();
            const identifier = crypto.randomUUID();
            const layer: DrawingLayer = {
                id: identifier,
                kind: "image",
                asset,
                name: mode === "copy" ? "Selection pixels" : mode === "merge" ? "Merged pixels" : "Rasterized pixels",
                x: 0,
                y: 0,
                width,
                height,
                rotation: 0,
                visible: true,
                opacity: 1,
                locked: false,
                ...(parent ? { parent: parent.id } : {}),
                ...(mode !== "copy" && !bakeBackground && roots.length === 1 && roots[0]!.blend ? { blend: roots[0]!.blend } : {}),
            };
            const insertion = mode === "copy" ? snapshot.layers.length : Math.max(...roots.map((root) => snapshot.layers.indexOf(root)));
            const layers = snapshot.layers.flatMap((item, index) => [
                ...(mode === "copy" || !affected.includes(item.id) ? [item] : []),
                ...(index === insertion && mode !== "copy" ? [layer] : []),
            ]);
            if (mode === "copy") layers.push(layer);
            if (
                commit(
                    {
                        ...snapshot,
                        background: bakeBackground ? "transparent" : snapshot.background,
                        assets: { ...snapshot.assets, [asset]: data },
                        layers,
                    },
                    true
                )
            ) {
                setSelected([identifier]);
                setTool("select");
                setNotice("Independent raster pixels created. Originals remain available through Undo.");
            }
        } catch (failure) {
            if (generation === lifetime.current)
                setError(
                    controller.signal.aborted
                        ? "Pixel operation cancelled; drawing unchanged."
                        : failure instanceof Error
                          ? failure.message
                          : "Pixel operation failed; drawing unchanged."
                );
        } finally {
            signal?.removeEventListener("abort", abort);
            cancellation.current = null;
            operation.current = false;
            if (generation === lifetime.current) {
                setExporting(false);
                onInteractionChange?.(false);
            }
        }
    }
    function pointerDown(event: React.PointerEvent<HTMLDivElement>) {
        if (
            disabled ||
            loading ||
            exporting ||
            operation.current ||
            signal?.aborted ||
            error ||
            gesture.current ||
            event.button !== 0 ||
            (readOnly && tool !== "pan")
        )
            return;
        event.preventDefault();
        canvas.current?.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        const start = point(event);
        const initial: Gesture = { pointer: event.pointerId, start, scene: value, ids: editable, mode: "move", points: [start] };
        if (tool === "pan") {
            initial.mode = "pan";
            initial.client = { x: event.clientX - pan.x, y: event.clientY - pan.y };
            gesture.current = initial;
            return;
        }
        if (tool === "mask-reveal" || tool === "mask-hide") {
            if (!active || drawingLayerLocked(value, active.id)) {
                setNotice("Select an unlocked layer to paint its mask.");
                return;
            }
            initial.mode = "paint-mask";
            initial.layer = active;
            initial.points = [drawingSceneLocalPoint(value, start, active)];
            const settings = active.softMask ?? { density: 1, feather: 0, base: active.mask || tool === "mask-reveal" ? 0 : 1, strokes: [] };
            initial.preview = {
                ...value,
                layers: value.layers.map((item) =>
                    item.id === active.id
                        ? {
                              ...item,
                              softMask: {
                                  ...settings,
                                  strokes: [
                                      ...settings.strokes,
                                      {
                                          points: initial.points,
                                          size,
                                          hardness,
                                          opacity: brushOpacity,
                                          erase: tool === "mask-hide",
                                          referenceWidth: active.width,
                                          referenceHeight: active.height,
                                      },
                                  ],
                              },
                          }
                        : item
                ),
            };
            gesture.current = initial;
            setTransient(initial.preview);
            onInteractionChange?.(true);
            return;
        }
        if (tool.endsWith("mask")) {
            initial.mode = "mask";
            setSelection([start]);
        } else if (tool === "pencil" || tool === "eraser") {
            let layer = active;
            if (layer && (drawingAncestors(value, layer.id).some((owner) => owner.locked) || (layer.kind === "paint" && layer.locked))) {
                setNotice("Unlock the selected paint layer and its ancestor groups before painting.");
                return;
            }
            if (!layer || layer.kind !== "paint" || drawingLayerLocked(value, layer.id) || !layer.visible) {
                if (tool === "eraser") {
                    setNotice("Select an unlocked paint layer to erase its strokes.");
                    return;
                }
                layer = {
                    id: crypto.randomUUID(),
                    name: `Paint ${value.layers.length + 1}`,
                    kind: "paint",
                    x: 0,
                    y: 0,
                    width: value.width,
                    height: value.height,
                    rotation: 0,
                    visible: true,
                    opacity: 1,
                    locked: false,
                    strokes: [],
                };
                initial.scene = { ...value, layers: [...value.layers, layer] };
                setSelected([layer.id]);
            }
            initial.mode = "stroke";
            initial.layer = layer;
            initial.stroke = {
                points: [{ ...drawingSceneLocalPoint(initial.scene, start, layer), pressure: event.pointerType === "pen" ? event.pressure : 1 }],
                color,
                size,
                dynamics: pressure && event.pointerType === "pen",
                erase: tool === "eraser",
                ...(selection.length >= 3 ? { mask: selection.map((item) => drawingSceneLocalPoint(initial.scene, item, layer!)) } : {}),
            };
        } else {
            const tolerance = (12 * value.width) / canvas.current!.getBoundingClientRect().width;
            const handle =
                active && !drawingLayerLocked(value, active.id)
                    ? drawingHandlePoints(active, value.width / 25, value).findIndex(
                          (handlePoint) => Math.hypot(start.x - handlePoint.x, start.y - handlePoint.y) < tolerance
                      )
                    : -1;
            if (handle >= 0 && active) {
                initial.mode = handle === 4 ? "rotate" : "resize";
                initial.layer = active;
            } else {
                const hit = drawingHitTest(value, start);
                if (!hit) {
                    setSelected([]);
                    return;
                }
                if (!selected.includes(hit.id)) {
                    selectLayer(hit, event.shiftKey);
                    initial.ids = hit.group
                        ? value.layers.filter((layer) => layer.group === hit.group && !drawingLayerLocked(value, layer.id)).map((layer) => layer.id)
                        : [hit.id];
                }
                initial.layer = hit;
            }
        }
        gesture.current = initial;
        onInteractionChange?.(true);
    }
    function pointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const current = gesture.current;
        if (!current || current.pointer !== event.pointerId) return;
        if (current.mode === "pan" && current.client) {
            setPan({ x: event.clientX - current.client.x, y: event.clientY - current.client.y });
            return;
        }
        if (blocked) return;
        const next = point(event);
        if (current.mode === "paint-mask" && current.layer) {
            if (current.points.length < DRAWING_LIMITS.points) current.points.push(drawingSceneLocalPoint(current.scene, next, current.layer));
            const layer = current.layer;
            const settings = layer.softMask ?? { density: 1, feather: 0, base: layer.mask || tool === "mask-reveal" ? 0 : 1, strokes: [] };
            current.preview = {
                ...current.scene,
                layers: current.scene.layers.map((item) =>
                    item.id === layer.id
                        ? {
                              ...item,
                              softMask: {
                                  ...settings,
                                  strokes: [
                                      ...settings.strokes,
                                      {
                                          points: [...current.points],
                                          size,
                                          hardness,
                                          opacity: brushOpacity,
                                          erase: tool === "mask-hide",
                                          referenceWidth: layer.width,
                                          referenceHeight: layer.height,
                                      },
                                  ],
                              },
                          }
                        : item
                ),
            };
            setTransient(current.preview);
            return;
        }
        if (current.mode === "stroke" && current.stroke && current.layer) {
            const local = {
                ...drawingSceneLocalPoint(current.scene, next, current.layer),
                pressure: event.pointerType === "pen" ? event.pressure : 1,
            };
            const last = current.stroke.points.at(-1)!;
            if (
                Math.hypot((local.x - last.x) * value.width, (local.y - last.y) * value.height) > 0.5 &&
                current.stroke.points.length < DRAWING_LIMITS.points
            )
                current.stroke.points.push(local);
            if (frame.current === null)
                frame.current = requestAnimationFrame(() => {
                    frame.current = null;
                    if (gesture.current === current) paint(current.scene, { layerId: current.layer!.id, stroke: current.stroke! });
                });
            return;
        }
        if (current.mode === "mask") {
            if (tool === "rectangle-mask")
                current.points = [current.start, { x: next.x, y: current.start.y }, next, { x: current.start.x, y: next.y }];
            else if (
                current.points.length < DRAWING_LIMITS.points &&
                Math.hypot(next.x - current.points.at(-1)!.x, next.y - current.points.at(-1)!.y) > 2
            )
                current.points.push(next);
            setSelection([...current.points]);
            return;
        }
        const layer = current.layer;
        if (!layer) return;
        let dx = next.x - current.start.x;
        let dy = next.y - current.start.y;
        if (snap && !event.altKey && current.mode === "move") {
            const targetsX = [
                0,
                value.width / 2,
                value.width,
                ...(value.guides ?? []).filter((guide) => guide.axis === "x").map((guide) => guide.position),
                ...value.layers
                    .filter((item) => !current.ids.includes(item.id) && item.visible && !item.parent)
                    .flatMap((item) => [item.x, item.x + item.width / 2, item.x + item.width]),
            ];
            const targetsY = [
                0,
                value.height / 2,
                value.height,
                ...(value.guides ?? []).filter((guide) => guide.axis === "y").map((guide) => guide.position),
                ...value.layers
                    .filter((item) => !current.ids.includes(item.id) && item.visible && !item.parent)
                    .flatMap((item) => [item.y, item.y + item.height / 2, item.y + item.height]),
            ];
            const snapTo = (position: number, targets: number[]) =>
                targets.reduce(
                    (nearest, target) => (Math.abs(target - position) < Math.abs(nearest - position) ? target : nearest),
                    Math.round(position / 10) * 10
                );
            const world = drawingSceneWorldPoint(value, { x: 0, y: 0 }, layer);
            dx = snapTo(world.x + dx, targetsX) - world.x;
            dy = snapTo(world.y + dy, targetsY) - world.y;
        }
        const origin = drawingSceneWorldPoint(current.scene, { x: 0.5, y: 0.5 }, layer);
        const angle =
            ((Math.atan2(next.y - origin.y, next.x - origin.x) - Math.atan2(current.start.y - origin.y, current.start.x - origin.x)) * 180) / Math.PI;
        const scale =
            current.mode === "resize"
                ? Math.max(
                      0.01,
                      Math.hypot(next.x - origin.x, next.y - origin.y) /
                          Math.max(1, Math.hypot(current.start.x - origin.x, current.start.y - origin.y))
                  )
                : 1;
        current.preview = transformDrawingLayers(
            current.scene,
            current.ids,
            current.mode === "move"
                ? { kind: "move", dx, dy }
                : current.mode === "rotate"
                  ? { kind: "rotate", degrees: event.shiftKey ? Math.round(angle / 15) * 15 : angle, origin }
                  : { kind: "scale", factor: scale, origin }
        );
        setTransient(current.preview);
    }
    function pointerEnd(event: React.PointerEvent<HTMLDivElement>, cancel = false) {
        const current = gesture.current;
        if (!current || current.pointer !== event.pointerId) return;
        gesture.current = null;
        if (frame.current !== null) {
            cancelAnimationFrame(frame.current);
            frame.current = null;
        }
        onInteractionChange?.(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (cancel) {
            setTransient(null);
            paint(value);
            setNotice("Gesture cancelled.");
            return;
        }
        if (current.mode === "stroke" && current.stroke && current.layer) {
            const stroke = current.stroke;
            const layerId = current.layer.id;
            commit({
                ...current.scene,
                layers: current.scene.layers.map((layer) =>
                    layer.id === layerId && layer.kind === "paint" ? { ...layer, strokes: [...layer.strokes, stroke] } : layer
                ),
            });
        } else if (current.mode === "mask") {
            if (current.points.length < 3) setSelection([]);
            setNotice("Selection restricts new strokes. Apply it as a layer mask, or clear selection.");
        } else if (current.preview) commit(current.preview);
    }
    function removeSelected() {
        if (!editable.length) return;
        const removed = drawingDescendants(value, editable);
        if (removed.some((identifier) => drawingLayerLocked(value, identifier))) {
            setError("Unlock descendants before deleting a group.");
            return;
        }
        commit({ ...value, layers: value.layers.filter((layer) => !removed.includes(layer.id)) });
        setSelected([]);
    }
    function keyDown(event: React.KeyboardEvent<HTMLCanvasElement>) {
        if (event.key === "Escape" && operation.current) {
            cancellation.current?.abort();
            event.preventDefault();
            return;
        }
        if (blocked) return;
        const command = event.metaKey || event.ctrlKey;
        if (event.key === "Escape") {
            gesture.current = null;
            onInteractionChange?.(false);
            setTransient(null);
            setSelection([]);
            paint(value);
            event.preventDefault();
            return;
        }
        if (command && event.key.toLowerCase() === "z") {
            event.preventDefault();
            undo(event.shiftKey);
            return;
        }
        if (command && event.key.toLowerCase() === "y") {
            event.preventDefault();
            undo(true);
            return;
        }
        if (command && event.key.toLowerCase() === "a") {
            event.preventDefault();
            setSelected(value.layers.filter((layer) => !drawingLayerLocked(value, layer.id)).map((layer) => layer.id));
            return;
        }
        if (event.key === "Delete" || event.key === "Backspace") {
            event.preventDefault();
            removeSelected();
            return;
        }
        const offsets: Record<string, DrawingPoint> = {
            ArrowLeft: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
            ArrowUp: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
        };
        const offset = offsets[event.key];
        if (offset) {
            event.preventDefault();
            const step = event.shiftKey ? 10 : 1;
            commit(transformDrawingLayers(value, editable, { kind: "move", dx: offset.x * step, dy: offset.y * step }));
        }
    }
    return (
        <div
            {...props}
            className={css(drawingEditorStyles.className({}), className)}
            data-component="drawing-editor"
            aria-label={label}
            aria-disabled={disabled || undefined}
        >
            <div className="__drawing-editor__toolbar" role="group" aria-label="Drawing tools">
                {(Object.keys(toolLabels) as Tool[]).map((name) => (
                    <Button
                        key={name}
                        size="small"
                        theme={tool === name ? "primary" : "neutral"}
                        aria-pressed={tool === name}
                        disabled={name === "pan" ? disabled || exporting : blocked}
                        onClick={() => {
                            if (!gesture.current) setTool(name);
                        }}
                    >
                        {toolLabels[name]}
                    </Button>
                ))}
                <Input
                    title="Stroke color"
                    size="small"
                    type="color"
                    value={color}
                    disabled={blocked}
                    onChange={(event) => setColor(event.target.value)}
                />
                <Input
                    title="Stroke size (pixels)"
                    size="small"
                    type="number"
                    min={0.5}
                    max={256}
                    step={0.5}
                    value={String(size)}
                    disabled={blocked}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (next >= 0.5 && next <= 256) setSize(next);
                    }}
                />
                <Checkbox checked={pressure} disabled={blocked} onChange={(event) => setPressure(event.target.checked)}>
                    Pen pressure width (mouse: constant width)
                </Checkbox>
                <Input
                    title="Mask brush hardness (%)"
                    type="number"
                    min={0}
                    max={100}
                    value={String(hardness * 100)}
                    disabled={blocked}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (next >= 0 && next <= 100) setHardness(next / 100);
                    }}
                />
                <Input
                    title="Mask brush opacity (%)"
                    type="number"
                    min={0}
                    max={100}
                    value={String(brushOpacity * 100)}
                    disabled={blocked}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (next >= 0 && next <= 100) setBrushOpacity(next / 100);
                    }}
                />
                <Checkbox checked={snap} disabled={blocked} onChange={(event) => setSnap(event.target.checked)}>
                    Snap to grid and edges (Alt bypasses)
                </Checkbox>
                <Button size="small" theme="neutral" disabled={blocked || !history.current.past.length} onClick={() => undo()}>
                    Undo
                </Button>
                <Button size="small" theme="neutral" disabled={blocked || !history.current.future.length} onClick={() => undo(true)}>
                    Redo
                </Button>
            </div>
            <div className="__drawing-editor__toolbar" role="group" aria-label="View and guides">
                <Input
                    title="Zoom (%)"
                    type="number"
                    min={10}
                    max={800}
                    step={10}
                    value={String(Math.round(zoom * 100))}
                    disabled={disabled || exporting}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (next >= 10 && next <= 800) setZoom(next / 100);
                    }}
                />
                <Input
                    title="View pan X (screen pixels)"
                    type="number"
                    value={String(pan.x)}
                    disabled={disabled || exporting}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isFinite(next)) setPan((current) => ({ ...current, x: next }));
                    }}
                />
                <Input
                    title="View pan Y (screen pixels)"
                    type="number"
                    value={String(pan.y)}
                    disabled={disabled || exporting}
                    onChange={(event) => {
                        const next = Number(event.target.value);
                        if (Number.isFinite(next)) setPan((current) => ({ ...current, y: next }));
                    }}
                />
                <Button
                    size="small"
                    theme="neutral"
                    disabled={disabled || exporting}
                    onClick={() => {
                        setZoom(1);
                        setPan({ x: 0, y: 0 });
                    }}
                >
                    Fit view
                </Button>
                <Select
                    title="Guide axis"
                    required
                    value={guideAxis}
                    disabled={blocked}
                    options={[
                        { value: "x", label: "Vertical" },
                        { value: "y", label: "Horizontal" },
                    ]}
                    onChange={(event) => setGuideAxis(event.target.value === "y" ? "y" : "x")}
                />
                <Input
                    title="Guide position (document pixels)"
                    type="number"
                    min={0}
                    max={guideAxis === "x" ? value.width : value.height}
                    value={String(guidePosition)}
                    disabled={blocked}
                    onChange={(event) => setGuidePosition(Number(event.target.value))}
                />
                <Button
                    size="small"
                    theme="neutral"
                    disabled={blocked || (value.guides?.length ?? 0) >= 100}
                    onClick={() => commit({ ...value, guides: [...(value.guides ?? []), { axis: guideAxis, position: guidePosition }] })}
                >
                    Add guide
                </Button>
                <Button size="small" theme="neutral" disabled={blocked || !value.guides?.length} onClick={() => commit({ ...value, guides: [] })}>
                    Clear guides
                </Button>
            </div>
            {exporting && (
                <Alert theme="info">
                    Processing pixels…{" "}
                    <Button size="small" theme="neutral" onClick={() => cancellation.current?.abort()}>
                        Cancel operation
                    </Button>
                </Alert>
            )}
            {loading && <Alert theme="info">Loading drawing images…</Alert>}
            {error && (
                <Alert theme="danger">
                    {error}{" "}
                    <Button
                        size="small"
                        theme="neutral"
                        onClick={() => {
                            setError("");
                            setRetry((value) => value + 1);
                        }}
                    >
                        Retry rendering
                    </Button>
                </Alert>
            )}
            <div className="__drawing-editor__workspace">
                <div className="__drawing-editor__viewport">
                    <div
                        className="__drawing-editor__stage"
                        style={{ width: `${zoom * 100}%`, transform: `translate(${pan.x}px, ${pan.y}px)` }}
                        onPointerDown={pointerDown}
                        onPointerMove={pointerMove}
                        onPointerUp={(event) => pointerEnd(event)}
                        onPointerCancel={(event) => pointerEnd(event, true)}
                        onLostPointerCapture={(event) => {
                            if (gesture.current?.pointer === event.pointerId) pointerEnd(event, true);
                        }}
                    >
                        <div className="__drawing-editor__canvas-frame" style={{ aspectRatio: `${value.width} / ${value.height}` }}>
                            <canvas
                                ref={canvas}
                                width={value.width}
                                height={value.height}
                                tabIndex={disabled ? -1 : 0}
                                aria-label={`${label} canvas`}
                                aria-describedby={`${id}-help`}
                                aria-disabled={blocked}
                                onKeyDown={keyDown}
                            />
                            <svg className="__drawing-editor__overlay" viewBox={`0 0 ${value.width} ${value.height}`} aria-hidden="true">
                                {active && tool === "select" && !drawingLayerLocked(scene, active.id) && (
                                    <>
                                        <polygon
                                            points={drawingHandlePoints(active, value.width / 25, scene)
                                                .slice(0, 4)
                                                .map((item) => `${item.x},${item.y}`)
                                                .join(" ")}
                                        />
                                        {drawingHandlePoints(active, value.width / 25, scene).map((item, index) => (
                                            <circle key={index} cx={item.x} cy={item.y} r={value.width / 120} />
                                        ))}
                                    </>
                                )}
                                {(scene.guides ?? []).map((guide, index) => (
                                    <line
                                        key={index}
                                        x1={guide.axis === "x" ? guide.position : 0}
                                        x2={guide.axis === "x" ? guide.position : value.width}
                                        y1={guide.axis === "y" ? guide.position : 0}
                                        y2={guide.axis === "y" ? guide.position : value.height}
                                    />
                                ))}
                                {selection.length > 1 && (
                                    <polygon
                                        className="__drawing-editor__selection"
                                        points={selection.map((item) => `${item.x},${item.y}`).join(" ")}
                                    />
                                )}
                            </svg>
                        </div>
                    </div>
                    <p id={`${id}-help`}>
                        Select layers in the list or on canvas. Drag corner handles to scale, the round top handle to rotate; Shift snaps rotation.
                        Arrow keys move (Shift: 10 px). Delete removes unlocked layers. ⌘/Ctrl Z undoes, Shift Z redoes. Escape cancels a gesture or
                        selection. All transforms are also available as labeled fields.
                    </p>
                </div>
                <section className="__drawing-editor__layers" aria-label="Drawing layers">
                    <h3>
                        Layers · {scene.layers.length}/{DRAWING_LIMITS.layers}
                    </h3>
                    <div className="__drawing-editor__toolbar" role="group" aria-label="Add layer">
                        <Button size="small" disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers} onClick={() => add("paint")}>
                            Add paint
                        </Button>
                        <Button size="small" disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers} onClick={() => add("text")}>
                            Add text
                        </Button>
                        <Button size="small" disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers} onClick={() => add("shape")}>
                            Rectangle
                        </Button>
                        <Button
                            size="small"
                            disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers}
                            onClick={() => add("shape", "ellipse")}
                        >
                            Ellipse
                        </Button>
                        <Button size="small" disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers} onClick={() => add("adjustment")}>
                            Add adjustment
                        </Button>
                        <Button size="small" disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers} onClick={() => add("effect")}>
                            Add effect
                        </Button>
                    </div>
                    <Input
                        title="Add bitmap image layer"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        disabled={blocked || value.layers.length >= DRAWING_LIMITS.layers}
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (file) void importBitmap(file);
                        }}
                    />
                    <div className="__drawing-editor__properties" role="group" aria-label="Keyboard rectangle selection">
                        {(["x", "y", "width", "height"] as const).map((key) => (
                            <Input
                                key={key}
                                title={`Selection ${key} (pixels)`}
                                type="number"
                                min={key === "width" || key === "height" ? 1 : 0}
                                max={key === "x" || key === "width" ? value.width : value.height}
                                value={String(selectionBox[key])}
                                disabled={blocked}
                                onChange={(event) => setSelectionBox((current) => ({ ...current, [key]: Number(event.target.value) }))}
                            />
                        ))}
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked}
                            onClick={() => {
                                const { x, y, width, height } = selectionBox;
                                if (
                                    ![x, y, width, height].every(Number.isFinite) ||
                                    x < 0 ||
                                    y < 0 ||
                                    width <= 0 ||
                                    height <= 0 ||
                                    x + width > value.width ||
                                    y + height > value.height
                                ) {
                                    setError("Rectangle selection must remain within the canvas");
                                    return;
                                }
                                setSelection([
                                    { x, y },
                                    { x: x + width, y },
                                    { x: x + width, y: y + height },
                                    { x, y: y + height },
                                ]);
                                setNotice("Rectangle selection ready.");
                            }}
                        >
                            Set rectangle selection
                        </Button>
                    </div>
                    {!scene.layers.length && <p>No layers. Add paint, text, a shape or an image to begin.</p>}
                    <ol className="__drawing-editor__layer-list">
                        {scene.layers
                            .slice()
                            .reverse()
                            .map((layer) => (
                                <li key={layer.id}>
                                    <Button
                                        size="small"
                                        theme={selected.includes(layer.id) ? "primary" : "neutral"}
                                        aria-pressed={selected.includes(layer.id)}
                                        disabled={disabled || exporting || Boolean(gesture.current)}
                                        onClick={(event) => selectLayer(layer, event.shiftKey)}
                                    >
                                        {layer.name || "Untitled layer"} · {layer.kind}
                                        {layer.parent ? ` · in ${scene.layers.find((owner) => owner.id === layer.parent)?.name ?? layer.parent}` : ""}
                                        {layer.group ? " · legacy group" : ""}
                                        {drawingLayerLocked(scene, layer.id) ? " · locked" : ""}
                                    </Button>
                                    <Checkbox
                                        checked={selected.includes(layer.id)}
                                        disabled={disabled || exporting || Boolean(gesture.current)}
                                        onChange={() => selectLayer(layer, true)}
                                    >
                                        Select {layer.name}
                                    </Checkbox>
                                </li>
                            ))}
                    </ol>
                    {active && (
                        <div className="__drawing-editor__properties">
                            <Input
                                title="Layer name"
                                value={active.name}
                                maxLength={160}
                                disabled={blocked || drawingLayerLocked(scene, active.id)}
                                onChange={(event) => patch({ name: event.target.value }, [active.id])}
                            />
                            <Checkbox
                                checked={active.visible}
                                disabled={blocked || drawingLayerLocked(scene, active.id)}
                                onChange={(event) => patch({ visible: event.target.checked }, [active.id])}
                            >
                                Visible
                            </Checkbox>
                            <Checkbox
                                checked={active.locked}
                                disabled={blocked || drawingAncestors(scene, active.id).some((owner) => owner.locked)}
                                onChange={(event) => patch({ locked: event.target.checked }, [active.id])}
                            >
                                Lock layer
                            </Checkbox>
                            <Input
                                title="Layer opacity (%)"
                                type="number"
                                min={0}
                                max={100}
                                value={String(Math.round(active.opacity * 100))}
                                disabled={blocked || drawingLayerLocked(scene, active.id)}
                                onChange={(event) => {
                                    const next = Number(event.target.value);
                                    if (next >= 0 && next <= 100) patch({ opacity: next / 100 });
                                }}
                            />
                            {(["x", "y", "width", "height", "rotation"] as const).map((key) => (
                                <Input
                                    key={key}
                                    title={`Layer ${key}${key === "rotation" ? " (degrees)" : " (parent pixels)"}`}
                                    type="number"
                                    step="any"
                                    value={String(Math.round(active[key] * 100) / 100)}
                                    min={key === "width" || key === "height" ? 1 : key === "rotation" ? -360 : -32768}
                                    max={key === "rotation" ? 360 : 32768}
                                    disabled={blocked || drawingLayerLocked(scene, active.id)}
                                    onChange={(event) => {
                                        const next = Number(event.target.value);
                                        if (Number.isFinite(next)) patch({ [key]: next }, [active.id]);
                                    }}
                                />
                            ))}
                            {active.kind === "text" && (
                                <>
                                    <Textarea
                                        title="Text layer content"
                                        maxLength={4000}
                                        value={active.text}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ text: event.target.value } as Partial<DrawingLayer>, [active.id])}
                                    />
                                    <Input
                                        title="Text font size"
                                        type="number"
                                        min={1}
                                        max={1024}
                                        value={String(active.fontSize)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ fontSize: Number(event.target.value) } as Partial<DrawingLayer>, [active.id])}
                                    />
                                    <Input
                                        title="Text color"
                                        type="color"
                                        value={active.color.slice(0, 7)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ color: event.target.value } as Partial<DrawingLayer>, [active.id])}
                                    />
                                </>
                            )}
                            {active.kind === "shape" && (
                                <>
                                    <Input
                                        title="Shape fill"
                                        type="color"
                                        value={active.fill.slice(0, 7)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ fill: event.target.value } as Partial<DrawingLayer>, [active.id])}
                                    />
                                    <Input
                                        title="Shape outline"
                                        type="color"
                                        value={active.stroke.slice(0, 7)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ stroke: event.target.value } as Partial<DrawingLayer>, [active.id])}
                                    />
                                    <Input
                                        title="Outline width"
                                        type="number"
                                        min={0}
                                        max={256}
                                        value={String(active.strokeWidth)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) => patch({ strokeWidth: Number(event.target.value) } as Partial<DrawingLayer>, [active.id])}
                                    />
                                </>
                            )}
                            <Select
                                title="Parent group (coordinates stay parent-local)"
                                required
                                value={active.parent ?? ":root"}
                                disabled={blocked || drawingLayerLocked(scene, active.id)}
                                options={[
                                    { value: ":root", label: "Document root" },
                                    ...value.layers
                                        .filter(
                                            (layer) =>
                                                layer.kind === "group" &&
                                                layer.id !== active.id &&
                                                !drawingAncestors(value, layer.id).some((owner) => owner.id === active.id) &&
                                                !drawingLayerLocked(value, layer.id)
                                        )
                                        .map((group) => ({ value: group.id, label: group.name })),
                                ]}
                                onChange={(event) => patch({ parent: event.target.value === ":root" ? undefined : event.target.value }, [active.id])}
                            />
                            <Select
                                title="Blend mode"
                                required
                                value={active.blend ?? "source-over"}
                                disabled={blocked || drawingLayerLocked(scene, active.id)}
                                options={DRAWING_BLENDS.map((blend) => ({ value: blend, label: blend }))}
                                onChange={(event) => {
                                    const blend = DRAWING_BLENDS.find((item) => item === event.target.value);
                                    if (blend) patch({ blend }, [active.id]);
                                }}
                            />
                            {active.kind !== "effect" && active.kind !== "adjustment" && (
                                <Button
                                    size="small"
                                    theme="neutral"
                                    disabled={blocked || drawingLayerLocked(scene, active.id)}
                                    onClick={() => patch({ effects: { ...DEFAULT_DRAWING_EFFECTS } }, [active.id])}
                                >
                                    {active.effects ? "Reset layer effects" : "Enable layer effects"}
                                </Button>
                            )}
                            {(active.kind === "effect" || active.kind === "adjustment" || active.effects) &&
                                (Object.keys(DEFAULT_DRAWING_EFFECTS) as (keyof DrawingEffects)[]).map((key) => {
                                    const adjustment = active.kind === "effect" || active.kind === "adjustment";
                                    const effects = adjustment ? active.adjustment : active.effects!;
                                    return (
                                        <Input
                                            key={key}
                                            title={`${adjustment ? "Adjustment" : "Layer effect"} ${key}`}
                                            type="number"
                                            min={0}
                                            max={key === "blur" ? 32 : key === "grayscale" || key === "invert" ? 1 : 4}
                                            step={key === "blur" ? 1 : 0.05}
                                            value={String(effects[key])}
                                            disabled={blocked || drawingLayerLocked(scene, active.id)}
                                            onChange={(event) =>
                                                patch(
                                                    adjustment
                                                        ? ({ adjustment: { ...effects, [key]: Number(event.target.value) } } as Partial<DrawingLayer>)
                                                        : { effects: { ...effects, [key]: Number(event.target.value) } },
                                                    [active.id]
                                                )
                                            }
                                        />
                                    );
                                })}
                            {active.softMask && (
                                <>
                                    <Input
                                        title="Mask density (%)"
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={String(active.softMask.density * 100)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) =>
                                            patch({ softMask: { ...active.softMask!, density: Number(event.target.value) / 100 } }, [active.id])
                                        }
                                    />
                                    <Input
                                        title="Mask feather (document pixels)"
                                        type="number"
                                        min={0}
                                        max={32}
                                        value={String(active.softMask.feather)}
                                        disabled={blocked || drawingLayerLocked(scene, active.id)}
                                        onChange={(event) =>
                                            patch({ softMask: { ...active.softMask!, feather: Number(event.target.value) } }, [active.id])
                                        }
                                    />
                                </>
                            )}
                            {active.mask && !active.softMask && (
                                <Button
                                    size="small"
                                    theme="neutral"
                                    disabled={blocked || drawingLayerLocked(scene, active.id)}
                                    onClick={() => patch({ softMask: { density: 1, feather: 0, base: 0, strokes: [] } }, [active.id])}
                                >
                                    Enable soft mask
                                </Button>
                            )}
                        </div>
                    )}
                    <div className="__drawing-editor__toolbar" role="group" aria-label="Layer actions">
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked || !editable.length}
                            onClick={() => commit(drawingReorder(value, editable, 1))}
                        >
                            Raise
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked || !editable.length}
                            onClick={() => commit(drawingReorder(value, editable, -1))}
                        >
                            Lower
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked || !editable.length || value.layers.length >= DRAWING_LIMITS.layers}
                            onClick={groupSelected}
                        >
                            Group selected
                        </Button>
                        <Button size="small" theme="neutral" disabled={blocked || !editable.length} onClick={() => patch({ group: undefined })}>
                            Clear legacy group tag
                        </Button>
                        <Button size="small" theme="neutral" disabled={blocked || selection.length < 3} onClick={() => void pixels("copy")}>
                            Copy selected pixels
                        </Button>
                        <Button size="small" theme="neutral" disabled={blocked || editable.length < 2} onClick={() => void pixels("merge")}>
                            Merge selected pixels
                        </Button>
                        <Button size="small" theme="neutral" disabled={blocked || !editable.length} onClick={() => void pixels("rasterize")}>
                            Rasterize selected
                        </Button>
                        <Button size="small" theme="ghost-danger" disabled={blocked || !editable.length} onClick={removeSelected}>
                            Delete selected
                        </Button>
                        <Button size="small" theme="neutral" disabled={blocked || !selection.length} onClick={() => setSelection([])}>
                            Clear selection
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked || selection.length < 3 || !editable.length}
                            onClick={() => {
                                if (selection.length * editable.length > DRAWING_LIMITS.points) {
                                    setError("Selected layer masks would exceed the drawing point budget");
                                    return;
                                }
                                commit({
                                    ...value,
                                    layers: value.layers.map((layer) =>
                                        editable.includes(layer.id)
                                            ? {
                                                  ...layer,
                                                  mask: selection.map((point) => drawingSceneLocalPoint(value, point, layer)),
                                                  softMask: { density: 1, feather: 0, base: 0, strokes: [] },
                                              }
                                            : layer
                                    ),
                                });
                            }}
                        >
                            Mask selected layers
                        </Button>
                        <Button
                            size="small"
                            theme="neutral"
                            disabled={blocked || !editable.length}
                            onClick={() => patch({ mask: undefined, softMask: undefined })}
                        >
                            Remove layer masks
                        </Button>
                    </div>
                </section>
            </div>
            <p role="status" aria-live="polite">
                {readOnly ? "Read-only drawing. " : ""}
                {disabled ? "Drawing disabled. " : ""}
                {value.width} × {value.height} · {selected.length} selected. {notice}
            </p>
            {onExport && (
                <Button
                    theme="primary"
                    loading={exporting}
                    disabled={disabled || loading || Boolean(error)}
                    onClick={async () => {
                        setError("");
                        try {
                            await rasterExport(onExport);
                        } catch (failure) {
                            setError(failure instanceof Error ? failure.message : "PNG export failed");
                        }
                    }}
                >
                    Export flattened PNG
                </Button>
            )}
        </div>
    );
});
