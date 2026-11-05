import {
    DRAWING_LIMITS,
    drawingSceneWorldPoint,
    isDrawingImageSource,
    parseDrawingScene,
    type DrawingEffects,
    type DrawingLayer,
    type DrawingPoint,
    type DrawingScene,
    type DrawingStroke,
} from "./scene";
import { drawingRasterDimensions } from "./raster";
export interface DrawingRenderOptions {
    sourceImage?: string;
    signal?: AbortSignal;
    /** Explicit trusted loader for remote images. Must return an origin-clean raster. */ resolveImage?: (
        source: string,
        signal?: AbortSignal
    ) => Promise<CanvasImageSource>;
}
export type DrawingImages = ReadonlyMap<string, CanvasImageSource>;
export async function loadDrawingImages(scene: DrawingScene, options: DrawingRenderOptions = {}): Promise<DrawingImages> {
    const images = new Map<string, CanvasImageSource>();
    let imagePixels = 0;
    const sources: Readonly<Record<string, string>> = { ...scene.assets, ...(options.sourceImage ? { source: options.sourceImage } : {}) };
    try {
        for (const key of new Set(scene.layers.flatMap((layer) => (layer.kind === "image" ? [layer.asset] : [])))) {
            options.signal?.throwIfAborted();
            const source = sources[key];
            if (!source) throw new Error(`Missing image asset: ${key}`);
            if (options.resolveImage) {
                const image = await options.resolveImage(source, options.signal);
                images.set(key, image);
                options.signal?.throwIfAborted();
                const dimensions = image as { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };
                const width = dimensions.naturalWidth ?? dimensions.width;
                const height = dimensions.naturalHeight ?? dimensions.height;
                if (
                    typeof width !== "number" ||
                    typeof height !== "number" ||
                    !Number.isInteger(width) ||
                    !Number.isInteger(height) ||
                    width <= 0 ||
                    height <= 0 ||
                    width > DRAWING_LIMITS.side ||
                    height > DRAWING_LIMITS.side ||
                    width * height > DRAWING_LIMITS.pixels ||
                    (imagePixels += width * height) > DRAWING_LIMITS.imagePixels
                )
                    throw new Error("Resolved image exceeds drawing decode budget");
                continue;
            }
            if (!isDrawingImageSource(source, window.location.origin)) throw new Error("Drawing images must be same-origin or raster data URLs");
            let blob: Blob;
            if (source.startsWith("data:")) {
                const encoded = source.slice(source.indexOf(",") + 1);
                if (encoded.length > Math.ceil((8 * 1024 * 1024) / 3) * 4) throw new Error("Drawing image exceeds 8 MiB");
                const binary = atob(encoded);
                if (binary.length > 8 * 1024 * 1024) throw new Error("Drawing image exceeds 8 MiB");
                blob = new Blob([Uint8Array.from(binary, (character) => character.charCodeAt(0))], { type: source.slice(5, source.indexOf(";")) });
            } else {
                const response = await fetch(source, { signal: options.signal, redirect: "error", credentials: "same-origin" });
                if (!response.ok || !/^image\/(png|jpeg|webp|gif)(;|$)/i.test(response.headers.get("content-type") ?? ""))
                    throw new Error("Drawing asset is not a supported raster image");
                const reader = response.body?.getReader();
                if (!reader) throw new Error("Drawing image is empty");
                const chunks: Uint8Array[] = [];
                let length = 0;
                try {
                    while (true) {
                        const item = await reader.read();
                        if (item.done) break;
                        length += item.value.byteLength;
                        if (length > 8 * 1024 * 1024) throw new Error("Drawing image exceeds 8 MiB");
                        chunks.push(item.value);
                    }
                } finally {
                    await reader.cancel().catch(() => {});
                }
                blob = new Blob(chunks as BlobPart[], { type: response.headers.get("content-type")!.split(";")[0]! });
            }
            const dimensions = drawingRasterDimensions(new Uint8Array(await blob.arrayBuffer()), blob.type);
            imagePixels += dimensions.width * dimensions.height;
            if (imagePixels > DRAWING_LIMITS.imagePixels) throw new Error("Drawing images exceed the 48 megapixel combined decode budget");
            const image = await createImageBitmap(blob, { imageOrientation: "from-image" });
            if (image.width > 8192 || image.height > 8192 || image.width * image.height > 24_000_000) {
                image.close();
                throw new Error("Drawing image exceeds dimension budget");
            }
            images.set(key, image);
        }
        return images;
    } catch (error) {
        releaseDrawingImages(images);
        throw error;
    }
}
export function releaseDrawingImages(images: DrawingImages): void {
    for (const image of images.values()) if (image instanceof ImageBitmap) image.close();
}
function clipPath(context: CanvasRenderingContext2D, points: DrawingPoint[]) {
    context.beginPath();
    points.forEach((point, i) => (i === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)));
    context.closePath();
    context.clip("evenodd");
}
function strokePath(context: CanvasRenderingContext2D, stroke: DrawingStroke, scene: DrawingScene) {
    context.save();
    if (stroke.mask) clipPath(context, stroke.mask);
    context.scale(1 / scene.width, 1 / scene.height);
    context.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
    context.strokeStyle = stroke.color;
    context.fillStyle = stroke.color;
    context.lineWidth = stroke.size;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (stroke.dynamics) {
        for (let i = 0; i < stroke.points.length; i++) {
            const point = stroke.points[i]!;
            const previous = stroke.points[Math.max(0, i - 1)]!;
            const distance = Math.hypot((point.x - previous.x) * scene.width, (point.y - previous.y) * scene.height);
            const steps = Math.max(1, Math.ceil(distance / Math.max(0.25, stroke.size / 8)));
            for (let step = 0; step <= steps; step++) {
                const t = step / steps;
                const pressure = (previous.pressure ?? 1) * (1 - t) + (point.pressure ?? 1) * t;
                context.beginPath();
                context.arc(
                    (previous.x + (point.x - previous.x) * t) * scene.width,
                    (previous.y + (point.y - previous.y) * t) * scene.height,
                    (stroke.size * Math.max(0.05, pressure)) / 2,
                    0,
                    Math.PI * 2
                );
                context.fill();
            }
        }
    } else {
        context.beginPath();
        stroke.points.forEach((point, i) =>
            i === 0 ? context.moveTo(point.x * scene.width, point.y * scene.height) : context.lineTo(point.x * scene.width, point.y * scene.height)
        );
        if (stroke.points.length === 1) {
            const point = stroke.points[0]!;
            context.arc(point.x * scene.width, point.y * scene.height, context.lineWidth / 2, 0, Math.PI * 2);
            context.fill();
        } else context.stroke();
    }
    context.restore();
}
function renderLayer(context: CanvasRenderingContext2D, layer: DrawingLayer, scene: DrawingScene, images: DrawingImages) {
    context.save();
    context.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
    context.rotate((layer.rotation * Math.PI) / 180);
    context.scale(layer.width, layer.height);
    context.translate(-0.5, -0.5);
    if (layer.mask && !layer.softMask && !layer.effects) clipPath(context, layer.mask);
    if (layer.kind === "image") {
        const image = images.get(layer.asset);
        if (!image) throw new Error("Drawing image has not loaded");
        context.drawImage(image, 0, 0, 1, 1);
    } else if (layer.kind === "paint") for (const stroke of layer.strokes) strokePath(context, stroke, scene);
    else if (layer.kind === "text") {
        context.scale(1 / layer.width, 1 / layer.height);
        context.fillStyle = layer.color;
        context.font = `${layer.fontSize}px sans-serif`;
        context.textBaseline = "top";
        layer.text.split("\n").forEach((line, i) => context.fillText(line, 0, i * layer.fontSize * 1.2, layer.width));
    } else if (layer.kind === "shape") {
        context.beginPath();
        if (layer.shape === "ellipse") context.ellipse(0.5, 0.5, 0.5, 0.5, 0, 0, Math.PI * 2);
        else context.rect(0, 0, 1, 1);
        context.fillStyle = layer.fill;
        context.fill();
        if (layer.strokeWidth) {
            context.lineWidth = layer.strokeWidth / layer.width;
            context.strokeStyle = layer.stroke;
            context.stroke();
        }
    }
    context.restore();
}
function effectFilter(effects?: DrawingEffects): string {
    return effects
        ? `blur(${effects.blur}px) brightness(${effects.brightness}) contrast(${effects.contrast}) saturate(${effects.saturation}) grayscale(${effects.grayscale}) invert(${effects.invert})`
        : "none";
}
type Draft = { layerId: string; stroke: DrawingStroke };
/** Tiles share a bounded pool, including isolated groups. No surface is retained per layer. */
function compositor(canvas: HTMLCanvasElement, scene: DrawingScene, images: DrawingImages, scratch: HTMLCanvasElement, draft?: Draft) {
    canvas.width = scene.width;
    canvas.height = scene.height;
    const output = canvas.getContext("2d");
    if (!output) throw new Error("Canvas 2D rendering is unavailable");
    if (
        !("filter" in output) &&
        scene.layers.some((layer) => layer.effects || layer.softMask?.feather || layer.kind === "effect" || layer.kind === "adjustment")
    )
        throw new Error("This browser does not support Canvas 2D filters; use a browser with filter support to render this scene.");
    const radius = scene.layers.reduce(
        (sum, layer) =>
            sum +
            (layer.effects?.blur ?? 0) +
            (layer.softMask?.feather ?? 0) +
            (layer.kind === "adjustment" || layer.kind === "effect" ? layer.adjustment.blur : 0),
        0
    );
    if (radius > 128) throw new Error("Combined blur and feather exceeds the 128 pixel compositor budget");
    const halo = Math.ceil(radius * 3);
    const side = 256 + halo * 2;
    const pool = [scratch];
    let used = 0;
    function acquire(): HTMLCanvasElement {
        const surface = pool[used] ?? document.createElement("canvas");
        if (!pool[used]) pool.push(surface);
        if ((used + 1) * side * side > 24_000_000)
            throw new Error("Drawing isolation exceeds the 24 megapixel scratch budget; reduce blur or group depth");
        used++;
        if (surface.width !== side || surface.height !== side) {
            surface.width = side;
            surface.height = side;
        }
        const context = surface.getContext("2d");
        if (!context) throw new Error("Canvas 2D rendering is unavailable");
        context.resetTransform();
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
        context.filter = "none";
        context.clearRect(0, 0, side, side);
        return surface;
    }
    function transform(context: CanvasRenderingContext2D, layer: DrawingLayer) {
        context.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
        context.rotate((layer.rotation * Math.PI) / 180);
        if (layer.kind === "group") {
            context.scale(layer.width / layer.contentWidth, layer.height / layer.contentHeight);
            context.translate(-layer.contentWidth / 2, -layer.contentHeight / 2);
        } else {
            context.scale(layer.width, layer.height);
            context.translate(-0.5, -0.5);
        }
    }
    function maskLayer(surface: HTMLCanvasElement, layer: DrawingLayer, matrix: DOMMatrix) {
        if (
            !layer.softMask &&
            layer.kind !== "effect" &&
            layer.kind !== "adjustment" &&
            (layer.kind !== "group" || !layer.mask) &&
            (!layer.effects || !layer.mask)
        )
            return;
        const mask = acquire();
        const m = mask.getContext("2d")!;
        const settings = layer.softMask;
        m.setTransform(matrix);
        transform(m, layer);
        if (layer.kind === "group") m.scale(layer.contentWidth, layer.contentHeight);
        m.fillStyle = `rgba(255,255,255,${settings?.base ?? (layer.mask ? 0 : 1)})`;
        m.fillRect(0, 0, 1, 1);
        if (layer.mask) {
            m.fillStyle = "#ffffff";
            m.beginPath();
            layer.mask.forEach((point, index) => (index ? m.lineTo(point.x, point.y) : m.moveTo(point.x, point.y)));
            m.closePath();
            m.fill("evenodd");
        }
        for (const stroke of settings?.strokes ?? []) {
            const brush = acquire();
            const brushContext = brush.getContext("2d")!;
            brushContext.setTransform(m.getTransform());
            brushContext.scale(1 / (stroke.referenceWidth ?? scene.width), 1 / (stroke.referenceHeight ?? scene.height));
            for (let i = 0; i < stroke.points.length; i++) {
                const point = stroke.points[i]!;
                const previous = stroke.points[Math.max(0, i - 1)]!;
                const width = stroke.referenceWidth ?? scene.width;
                const height = stroke.referenceHeight ?? scene.height;
                const distance = Math.hypot((point.x - previous.x) * width, (point.y - previous.y) * height);
                const steps = Math.min(4096, Math.max(1, Math.ceil(distance / Math.max(0.5, stroke.size / 8))));
                for (let step = 0; step <= steps; step++) {
                    const t = step / steps;
                    const x = (previous.x + (point.x - previous.x) * t) * width;
                    const y = (previous.y + (point.y - previous.y) * t) * height;
                    const radius = stroke.size / 2;
                    const gradient = brushContext.createRadialGradient(x, y, radius * Math.min(0.999, stroke.hardness), x, y, radius);
                    gradient.addColorStop(0, "#ffffff");
                    gradient.addColorStop(1, "rgba(255,255,255,0)");
                    brushContext.fillStyle = gradient;
                    brushContext.fillRect(x - radius, y - radius, radius * 2, radius * 2);
                }
            }
            m.save();
            m.resetTransform();
            m.globalCompositeOperation = stroke.erase ? "destination-out" : "source-over";
            m.globalAlpha = stroke.opacity;
            m.drawImage(brush, 0, 0);
            m.restore();
            used--;
        }
        m.resetTransform();
        const density = settings?.density ?? 1;
        const softened = acquire();
        const soft = softened.getContext("2d")!;
        soft.filter = `blur(${settings?.feather ?? 0}px)`;
        soft.globalAlpha = density;
        soft.drawImage(mask, 0, 0);
        soft.filter = "none";
        soft.globalAlpha = 1;
        soft.globalCompositeOperation = "lighter";
        soft.fillStyle = `rgba(255,255,255,${1 - density})`;
        soft.fillRect(0, 0, side, side);
        if (layer.kind === "effect" || layer.kind === "adjustment") {
            const region = acquire();
            const regionContext = region.getContext("2d")!;
            regionContext.setTransform(matrix);
            transform(regionContext, layer);
            regionContext.fillStyle = "#ffffff";
            regionContext.fillRect(0, 0, 1, 1);
            soft.globalCompositeOperation = "destination-in";
            soft.drawImage(region, 0, 0);
            used--;
        }
        const context = surface.getContext("2d")!;
        context.save();
        context.resetTransform();
        context.globalCompositeOperation = "destination-in";
        context.drawImage(softened, 0, 0);
        context.restore();
        used -= 2;
    }
    function children(target: HTMLCanvasElement, parent: string | undefined, matrix: DOMMatrix) {
        const context = target.getContext("2d")!;
        for (const original of scene.layers) {
            if (original.parent !== parent || !original.visible || !original.opacity) continue;
            const layer =
                draft?.layerId === original.id && original.kind === "paint"
                    ? { ...original, strokes: [...original.strokes, draft.stroke] }
                    : original;
            const surface = acquire();
            const c = surface.getContext("2d")!;
            if (layer.kind === "group") {
                c.setTransform(matrix);
                transform(c, layer);
                children(surface, layer.id, c.getTransform());
            } else if (layer.kind === "effect" || layer.kind === "adjustment") {
                c.filter = effectFilter(layer.adjustment);
                c.drawImage(target, 0, 0);
                c.filter = "none";
            } else {
                c.setTransform(matrix);
                renderLayer(c, layer, scene, images);
            }
            if ((layer.kind === "effect" || layer.kind === "adjustment") && layer.blend && layer.blend !== "source-over") {
                const blended = acquire();
                const blendedContext = blended.getContext("2d")!;
                blendedContext.drawImage(target, 0, 0);
                blendedContext.globalCompositeOperation = layer.blend;
                blendedContext.drawImage(surface, 0, 0);
                c.clearRect(0, 0, side, side);
                c.drawImage(blended, 0, 0);
                used--;
            }
            if (layer.effects) {
                const filtered = acquire();
                const filteredContext = filtered.getContext("2d")!;
                filteredContext.filter = effectFilter(layer.effects);
                filteredContext.drawImage(surface, 0, 0);
                c.save();
                c.resetTransform();
                c.clearRect(0, 0, side, side);
                c.drawImage(filtered, 0, 0);
                c.restore();
                used--;
            }
            maskLayer(surface, layer, matrix);
            context.save();
            context.resetTransform();
            context.globalCompositeOperation = layer.blend ?? "source-over";
            context.globalAlpha = layer.opacity;
            if (layer.kind === "effect" || layer.kind === "adjustment") {
                // Replace only the affected alpha, retaining the original beneath partial masks/opacity.
                const coverage = acquire();
                const coverageContext = coverage.getContext("2d")!;
                coverageContext.fillStyle = "#ffffff";
                coverageContext.fillRect(0, 0, side, side);
                maskLayer(coverage, layer, matrix);
                context.globalCompositeOperation = "destination-out";
                context.drawImage(coverage, 0, 0);
                used--;
                context.globalCompositeOperation = "lighter";
            }
            context.drawImage(surface, 0, 0);
            context.restore();
            used--;
        }
    }
    return {
        tile(x: number, y: number) {
            used = 0;
            const root = acquire();
            const context = root.getContext("2d")!;
            context.fillStyle = scene.background;
            context.fillRect(0, 0, side, side);
            const matrix = new DOMMatrix().translate(halo - x, halo - y);
            children(root, undefined, matrix);
            const width = Math.min(256, scene.width - x);
            const height = Math.min(256, scene.height - y);
            output.drawImage(root, halo, halo, width, height, x, y, width, height);
        },
        dispose() {
            for (const surface of pool) {
                surface.width = 1;
                surface.height = 1;
            }
        },
    };
}
export function renderDrawingScene(
    canvas: HTMLCanvasElement,
    scene: DrawingScene,
    images: DrawingImages,
    scratch: HTMLCanvasElement,
    draft?: Draft
): void {
    const renderer = compositor(canvas, scene, images, scratch, draft);
    try {
        for (let y = 0; y < scene.height; y += 256) for (let x = 0; x < scene.width; x += 256) renderer.tile(x, y);
    } finally {
        renderer.dispose();
    }
}
export function drawingHandlePoints(layer: DrawingLayer, rotationOffset = 24, scene?: DrawingScene): DrawingPoint[] {
    const document = scene ?? ({ layers: [layer] } as DrawingScene);
    return [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0.5, y: -rotationOffset / layer.height },
    ].map((point) => drawingSceneWorldPoint(document, point, layer));
}
/** Exports actual flattened PNG bytes, without canvas UI, handles or selection outlines. */
export async function exportDrawingPng(value: DrawingScene, options: DrawingRenderOptions = {}): Promise<Blob> {
    const scene = parseDrawingScene(value, { origin: typeof window === "undefined" ? undefined : window.location.origin });
    const images = await loadDrawingImages(scene, options);
    try {
        options.signal?.throwIfAborted();
        const canvas = document.createElement("canvas");
        const scratch = document.createElement("canvas");
        const renderer = compositor(canvas, scene, images, scratch);
        try {
            for (let y = 0; y < scene.height; y += 256)
                for (let x = 0; x < scene.width; x += 256) {
                    options.signal?.throwIfAborted();
                    renderer.tile(x, y);
                    const pause = Promise.withResolvers<void>();
                    setTimeout(pause.resolve, 0);
                    await pause.promise;
                }
        } finally {
            renderer.dispose();
        }
        const encoding = Promise.withResolvers<Blob>();
        canvas.toBlob((result) => (result ? encoding.resolve(result) : encoding.reject(new Error("Browser could not encode PNG"))), "image/png");
        const blob = await encoding.promise;
        options.signal?.throwIfAborted();
        if (blob.size > 8 * 1024 * 1024) throw new Error("Flattened PNG exceeds 8 MiB; reduce canvas dimensions or content");
        return blob;
    } finally {
        releaseDrawingImages(images);
    }
}
