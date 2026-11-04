import { DRAWING_LIMITS } from "./limits";
import { drawingRasterSourceDimensions } from "./raster";
export { DRAWING_LIMITS } from "./limits";
export interface DrawingPoint {
    x: number;
    y: number;
    pressure?: number;
}
export interface DrawingStroke {
    points: DrawingPoint[];
    color: string;
    size: number;
    erase: boolean;
    mask?: DrawingPoint[];
    dynamics?: boolean;
}
export interface DrawingMaskStroke {
    points: DrawingPoint[];
    size: number;
    opacity: number;
    hardness: number;
    erase: boolean;
    referenceWidth?: number;
    referenceHeight?: number;
}
export interface DrawingMask {
    density: number;
    feather: number;
    base: number;
    strokes: DrawingMaskStroke[];
}
export const DRAWING_BLENDS = [
    "source-over",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "difference",
    "exclusion",
    "color",
    "luminosity",
] as const;
export type DrawingBlend = (typeof DRAWING_BLENDS)[number];
export interface DrawingEffects {
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
    invert: number;
}
export const DEFAULT_DRAWING_EFFECTS: DrawingEffects = { blur: 0, brightness: 1, contrast: 1, saturation: 1, grayscale: 0, invert: 0 };
export interface DrawingTransform {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}
export interface DrawingLayerBase extends DrawingTransform {
    id: string;
    name: string;
    visible: boolean;
    opacity: number;
    locked: boolean;
    /** Legacy flat selection tag; not a hierarchy reference. */ group?: string;
    parent?: string;
    mask?: DrawingPoint[];
    softMask?: DrawingMask;
    blend?: DrawingBlend;
    effects?: DrawingEffects;
}
export type DrawingLayer = DrawingLayerBase &
    (
        | { kind: "paint"; strokes: DrawingStroke[] }
        | { kind: "image"; asset: string }
        | { kind: "text"; text: string; color: string; fontSize: number }
        | { kind: "shape"; shape: "rectangle" | "ellipse"; fill: string; stroke: string; strokeWidth: number }
        | { kind: "group"; contentWidth: number; contentHeight: number }
        | { kind: "effect" | "adjustment"; adjustment: DrawingEffects }
    );
/** Images live once in assets. The reserved `source` key is supplied by the host, never embedded in a draft. */
export interface DrawingScene {
    version: 1;
    width: number;
    height: number;
    background: string;
    assets: Record<string, string>;
    layers: DrawingLayer[];
    guides?: { axis: "x" | "y"; position: number }[];
}
export interface DrawingHistory {
    past: DrawingScene[];
    present: DrawingScene;
    future: DrawingScene[];
}
const idPattern = /^[A-Za-z0-9_-]{1,80}$/;
const colorPattern = /^(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|transparent)$/;
export function isDrawingImageSource(value: string, origin?: string): boolean {
    if (/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) return true;
    if (!origin) return false;
    try {
        const url = new URL(value, origin);
        return url.origin === origin && ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
    } catch {
        return false;
    }
}
function object(value: unknown, allowed: string[]): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some((key) => !allowed.includes(key)))
        throw new Error("Invalid drawing object");
    return value as Record<string, unknown>;
}
function number(value: unknown, min: number, max: number): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) throw new Error("Drawing geometry exceeds bounds");
    return value;
}
function text(value: unknown, max: number): string {
    if (typeof value !== "string" || value.length > max) throw new Error("Invalid drawing text");
    return value;
}
function color(value: unknown): string {
    const result = text(value, 11);
    if (!colorPattern.test(result)) throw new Error("Use hexadecimal drawing colors");
    return result;
}
function bool(value: unknown): boolean {
    if (typeof value !== "boolean") throw new Error("Invalid drawing flag");
    return value;
}
function id(value: unknown): string {
    const result = text(value, 80);
    if (!idPattern.test(result)) throw new Error("Invalid drawing identifier");
    return result;
}
/** Validates every field, budgets and asset reference; returns fresh JSON-only data. No HTML or SVG is accepted. */
export function parseDrawingScene(value: unknown, options: { origin?: string } = {}): DrawingScene {
    const root = object(value, ["version", "width", "height", "background", "assets", "layers", "guides"]);
    if (root.version !== 1) throw new Error("Unsupported drawing version");
    const width = number(root.width, 1, DRAWING_LIMITS.side);
    const height = number(root.height, 1, DRAWING_LIMITS.side);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width * height > DRAWING_LIMITS.pixels)
        throw new Error("Drawing canvas exceeds 24 megapixels");
    const rawAssets = root.assets;
    if (!rawAssets || typeof rawAssets !== "object" || Array.isArray(rawAssets) || Object.keys(rawAssets).length > DRAWING_LIMITS.assets)
        throw new Error("Too many drawing assets");
    const assets: Record<string, string> = Object.create(null);
    let embedded = 0;
    let points = 0;
    let strokes = 0;
    for (const [key, raw] of Object.entries(rawAssets)) {
        id(key);
        if (key === "source" || key === "__proto__" || key === "constructor" || key === "prototype") throw new Error("Reserved drawing asset");
        const source = text(raw, DRAWING_LIMITS.bytes);
        embedded += source.length;
        if (embedded > DRAWING_LIMITS.bytes || !isDrawingImageSource(source, options.origin))
            throw new Error("Drawing image must be bounded raster data or an allowed same-origin URL");
        assets[key] = source;
    }
    let decodedPixels = 0;
    for (const source of Object.values(assets)) {
        if (!source.startsWith("data:")) continue;
        const dimensions = drawingRasterSourceDimensions(source);
        decodedPixels += dimensions.width * dimensions.height;
        if (decodedPixels > DRAWING_LIMITS.imagePixels) throw new Error("Drawing images exceed the 48 megapixel combined decode budget");
    }
    function path(raw: unknown, minimum = 3): DrawingPoint[] {
        if (!Array.isArray(raw) || raw.length < minimum || (points += raw.length) > DRAWING_LIMITS.points)
            throw new Error("Drawing path exceeds point budget");
        return raw.map((item) => {
            const point = object(item, ["x", "y", "pressure"]);
            return {
                x: number(point.x, -32768, 32768),
                y: number(point.y, -32768, 32768),
                ...(point.pressure === undefined ? {} : { pressure: number(point.pressure, 0, 1) }),
            };
        });
    }
    function effects(raw: unknown): DrawingEffects {
        const item = object(raw, ["blur", "brightness", "contrast", "saturation", "grayscale", "invert"]);
        return {
            blur: number(item.blur, 0, 32),
            brightness: number(item.brightness, 0, 4),
            contrast: number(item.contrast, 0, 4),
            saturation: number(item.saturation, 0, 4),
            grayscale: number(item.grayscale, 0, 1),
            invert: number(item.invert, 0, 1),
        };
    }
    function softMask(raw: unknown): DrawingMask {
        const item = object(raw, ["density", "feather", "base", "strokes"]);
        if (!Array.isArray(item.strokes) || (strokes += item.strokes.length) > DRAWING_LIMITS.strokes)
            throw new Error("Drawing exceeds stroke budget");
        return {
            density: number(item.density, 0, 1),
            feather: number(item.feather, 0, 32),
            base: number(item.base, 0, 1),
            strokes: item.strokes.map((rawStroke) => {
                const stroke = object(rawStroke, ["points", "size", "opacity", "hardness", "erase", "referenceWidth", "referenceHeight"]);
                return {
                    points: path(stroke.points, 1),
                    size: number(stroke.size, 0.5, 256),
                    opacity: number(stroke.opacity, 0, 1),
                    hardness: number(stroke.hardness, 0, 1),
                    erase: bool(stroke.erase),
                    ...(stroke.referenceWidth === undefined ? {} : { referenceWidth: number(stroke.referenceWidth, 1, 32768) }),
                    ...(stroke.referenceHeight === undefined ? {} : { referenceHeight: number(stroke.referenceHeight, 1, 32768) }),
                };
            }),
        };
    }
    if (!Array.isArray(root.layers) || root.layers.length > DRAWING_LIMITS.layers) throw new Error("Drawing exceeds layer budget");
    const identifiers = new Set<string>();
    const layers = root.layers.map((raw): DrawingLayer => {
        const layer = object(raw, [
            "id",
            "name",
            "visible",
            "opacity",
            "locked",
            "group",
            "parent",
            "mask",
            "softMask",
            "blend",
            "effects",
            "adjustment",
            "contentWidth",
            "contentHeight",
            "x",
            "y",
            "width",
            "height",
            "rotation",
            "kind",
            "strokes",
            "asset",
            "text",
            "color",
            "fontSize",
            "shape",
            "fill",
            "stroke",
            "strokeWidth",
        ]);
        const identifier = id(layer.id);
        if (identifiers.has(identifier)) throw new Error("Duplicate drawing layer");
        identifiers.add(identifier);
        const base: DrawingLayerBase = {
            id: identifier,
            name: text(layer.name, 160),
            visible: bool(layer.visible),
            opacity: number(layer.opacity, 0, 1),
            locked: bool(layer.locked),
            x: number(layer.x, -32768, 32768),
            y: number(layer.y, -32768, 32768),
            width: number(layer.width, 1, 32768),
            height: number(layer.height, 1, 32768),
            rotation: number(layer.rotation, -360, 360),
            ...(layer.group === undefined ? {} : { group: id(layer.group) }),
            ...(layer.mask === undefined ? {} : { mask: path(layer.mask) }),
        };
        if (layer.parent !== undefined) base.parent = id(layer.parent);
        if (layer.blend !== undefined) {
            if (!DRAWING_BLENDS.includes(layer.blend as DrawingBlend)) throw new Error("Invalid drawing blend");
            base.blend = layer.blend as DrawingBlend;
        }
        if (layer.effects !== undefined) base.effects = effects(layer.effects);
        if (layer.softMask !== undefined) base.softMask = softMask(layer.softMask);
        if (layer.kind === "group") {
            const contentWidth = number(layer.contentWidth, 1, DRAWING_LIMITS.side);
            const contentHeight = number(layer.contentHeight, 1, DRAWING_LIMITS.side);
            if (!Number.isInteger(contentWidth) || !Number.isInteger(contentHeight) || contentWidth * contentHeight > DRAWING_LIMITS.pixels)
                throw new Error("Drawing group content exceeds canvas budget");
            return { ...base, kind: "group", contentWidth, contentHeight };
        }
        if (layer.kind === "effect" || layer.kind === "adjustment") return { ...base, kind: layer.kind, adjustment: effects(layer.adjustment) };
        if (layer.kind === "paint") {
            if (!Array.isArray(layer.strokes) || (strokes += layer.strokes.length) > DRAWING_LIMITS.strokes)
                throw new Error("Drawing exceeds stroke budget");
            return {
                ...base,
                kind: "paint",
                strokes: layer.strokes.map((rawStroke) => {
                    const stroke = object(rawStroke, ["points", "color", "size", "erase", "mask", "dynamics"]);
                    return {
                        points: path(stroke.points, 1),
                        color: color(stroke.color),
                        size: number(stroke.size, 0.5, 256),
                        erase: bool(stroke.erase),
                        ...(stroke.mask === undefined ? {} : { mask: path(stroke.mask) }),
                        ...(stroke.dynamics === undefined ? {} : { dynamics: bool(stroke.dynamics) }),
                    };
                }),
            };
        }
        if (layer.kind === "image") {
            const asset = id(layer.asset);
            if (asset !== "source" && !Object.hasOwn(assets, asset)) throw new Error("Missing drawing asset");
            return { ...base, kind: "image", asset };
        }
        if (layer.kind === "text")
            return { ...base, kind: "text", text: text(layer.text, 4000), color: color(layer.color), fontSize: number(layer.fontSize, 1, 1024) };
        if (layer.kind === "shape" && (layer.shape === "rectangle" || layer.shape === "ellipse"))
            return {
                ...base,
                kind: "shape",
                shape: layer.shape,
                fill: color(layer.fill),
                stroke: color(layer.stroke),
                strokeWidth: number(layer.strokeWidth, 0, 256),
            };
        throw new Error("Unsupported drawing layer");
    });
    const result: DrawingScene = { version: 1, width, height, background: color(root.background), assets, layers };
    const byId = new Map(layers.map((layer) => [layer.id, layer]));
    for (const layer of layers) {
        const visited = new Set([layer.id]);
        let parent = layer.parent;
        let depth = 0;
        while (parent) {
            const owner = byId.get(parent);
            if (!owner || owner.kind !== "group") throw new Error("Dangling drawing group");
            if (visited.has(parent)) throw new Error("Cyclic drawing groups");
            visited.add(parent);
            if (++depth > 8) throw new Error("Drawing group depth exceeds eight");
            parent = owner.parent;
        }
    }
    if (root.guides !== undefined) {
        if (!Array.isArray(root.guides) || root.guides.length > 100) throw new Error("Drawing guide budget exceeded");
        result.guides = root.guides.map((raw) => {
            const guide = object(raw, ["axis", "position"]);
            if (guide.axis !== "x" && guide.axis !== "y") throw new Error("Invalid guide axis");
            return { axis: guide.axis, position: number(guide.position, 0, guide.axis === "x" ? width : height) };
        });
    }
    if (
        layers.reduce(
            (sum, layer) =>
                sum +
                (layer.effects?.blur ?? 0) +
                (layer.softMask?.feather ?? 0) +
                (layer.kind === "adjustment" || layer.kind === "effect" ? layer.adjustment.blur : 0),
            0
        ) > 128
    )
        throw new Error("Combined blur and feather exceeds the 128 pixel compositor budget");
    if (new TextEncoder().encode(JSON.stringify(result)).byteLength > DRAWING_LIMITS.bytes) throw new Error("Drawing exceeds 12 MiB document budget");
    return result;
}
export function createDrawingScene(width = 1000, height = 700, source = false): DrawingScene {
    return parseDrawingScene({
        version: 1,
        width,
        height,
        background: "transparent",
        assets: {},
        layers: source
            ? [
                  {
                      id: "background",
                      name: "Source image",
                      kind: "image",
                      asset: "source",
                      x: 0,
                      y: 0,
                      width,
                      height,
                      rotation: 0,
                      visible: true,
                      opacity: 1,
                      locked: true,
                  },
              ]
            : [],
    });
}
export function serializeDrawingScene(scene: DrawingScene, options: { origin?: string } = {}): string {
    return JSON.stringify(parseDrawingScene(scene, options));
}
export function deserializeDrawingScene(json: string, options: { origin?: string } = {}): DrawingScene {
    if (json.length > DRAWING_LIMITS.bytes) throw new Error("Drawing exceeds document budget");
    return parseDrawingScene(JSON.parse(json), options);
}
export function drawingLocalPoint(point: DrawingPoint, layer: DrawingTransform): DrawingPoint {
    const angle = (-layer.rotation * Math.PI) / 180;
    const dx = point.x - layer.x - layer.width / 2;
    const dy = point.y - layer.y - layer.height / 2;
    return {
        x: (dx * Math.cos(angle) - dy * Math.sin(angle)) / layer.width + 0.5,
        y: (dx * Math.sin(angle) + dy * Math.cos(angle)) / layer.height + 0.5,
    };
}
export function drawingWorldPoint(point: DrawingPoint, layer: DrawingTransform): DrawingPoint {
    const angle = (layer.rotation * Math.PI) / 180;
    const dx = (point.x - 0.5) * layer.width;
    const dy = (point.y - 0.5) * layer.height;
    return {
        x: layer.x + layer.width / 2 + dx * Math.cos(angle) - dy * Math.sin(angle),
        y: layer.y + layer.height / 2 + dx * Math.sin(angle) + dy * Math.cos(angle),
    };
}
export function drawingContains(point: DrawingPoint, polygon: DrawingPoint[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const a = polygon[i]!;
        const b = polygon[j]!;
        if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
}
export function drawingHitTest(scene: DrawingScene, point: DrawingPoint): DrawingLayer | undefined {
    return scene.layers
        .slice()
        .reverse()
        .find((layer) => {
            if (
                layer.kind === "group" ||
                layer.kind === "effect" ||
                layer.kind === "adjustment" ||
                drawingLayerLocked(scene, layer.id) ||
                !drawingLayerVisible(scene, layer.id)
            )
                return false;
            const local = drawingSceneLocalPoint(scene, point, layer);
            return local.x >= 0 && local.x <= 1 && local.y >= 0 && local.y <= 1 && (!layer.mask || drawingContains(local, layer.mask));
        });
}
export function drawingCommit(history: DrawingHistory, next: DrawingScene): DrawingHistory {
    return next === history.present
        ? history
        : { past: [...history.past, history.present].slice(-DRAWING_LIMITS.history), present: next, future: [] };
}
export function drawingUndo(history: DrawingHistory): DrawingHistory {
    const previous = history.past.at(-1);
    return previous ? { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] } : history;
}
export function drawingRedo(history: DrawingHistory): DrawingHistory {
    const next = history.future[0];
    return next ? { past: [...history.past, history.present], present: next, future: history.future.slice(1) } : history;
}
export function drawingReorder(scene: DrawingScene, ids: string[], direction: -1 | 1): DrawingScene {
    const layers = [...scene.layers];
    const positions = direction === 1 ? layers.map((_, i) => i).reverse() : layers.map((_, i) => i);
    for (const index of positions) {
        const layer = layers[index]!;
        if (!ids.includes(layer.id) || drawingLayerLocked(scene, layer.id)) continue;
        let target = index + direction;
        while (layers[target] && layers[target]!.parent !== layer.parent) target += direction;
        if (layers[target] && !ids.includes(layers[target]!.id)) [layers[index], layers[target]] = [layers[target]!, layer];
    }
    return layers.every((layer, index) => layer === scene.layers[index]) ? scene : { ...scene, layers };
}
export type DrawingLayerTransform =
    | { kind: "move"; dx: number; dy: number }
    | { kind: "rotate"; degrees: number; origin: DrawingPoint }
    | { kind: "scale"; factor: number; origin: DrawingPoint };
/** Moves in document space; scales about a document-space origin. Rotation remains parent-local (no affine shear). */
export function transformDrawingLayers(scene: DrawingScene, ids: string[], transform: DrawingLayerTransform): DrawingScene {
    const layers = scene.layers.map((layer): DrawingLayer => {
        if (
            !ids.includes(layer.id) ||
            drawingLayerLocked(scene, layer.id) ||
            drawingAncestors(scene, layer.id).some((owner) => ids.includes(owner.id))
        )
            return layer;
        const parentPoint = (point: DrawingPoint): DrawingPoint => {
            let local = point;
            for (const owner of drawingAncestors(scene, layer.id).reverse())
                if (owner.kind === "group") {
                    const normalized = drawingLocalPoint(local, owner);
                    local = { x: normalized.x * owner.contentWidth, y: normalized.y * owner.contentHeight };
                }
            return local;
        };
        if (transform.kind === "move") {
            const start = parentPoint({ x: 0, y: 0 });
            const end = parentPoint({ x: transform.dx, y: transform.dy });
            return { ...layer, x: layer.x + end.x - start.x, y: layer.y + end.y - start.y };
        }
        const origin = parentPoint(transform.origin);
        if (transform.kind === "scale") {
            const factor = Math.max(0.01, transform.factor);
            return {
                ...layer,
                x: origin.x + (layer.x - origin.x) * factor,
                y: origin.y + (layer.y - origin.y) * factor,
                width: Math.max(1, layer.width * factor),
                height: Math.max(1, layer.height * factor),
                ...(layer.kind === "text" ? { fontSize: Math.max(1, Math.min(1024, layer.fontSize * factor)) } : {}),
            };
        }
        const angle = (transform.degrees * Math.PI) / 180;
        const dx = layer.x + layer.width / 2 - origin.x;
        const dy = layer.y + layer.height / 2 - origin.y;
        return {
            ...layer,
            x: origin.x + dx * Math.cos(angle) - dy * Math.sin(angle) - layer.width / 2,
            y: origin.y + dx * Math.sin(angle) + dy * Math.cos(angle) - layer.height / 2,
            rotation: (((layer.rotation + transform.degrees) % 360) + 360) % 360,
        };
    });
    return layers.every((layer, index) => layer === scene.layers[index]) ? scene : { ...scene, layers };
}
/** Structural ancestors are distinct from legacy flat group tags. */
export function drawingAncestors(scene: DrawingScene, identifier: string): DrawingLayer[] {
    const result: DrawingLayer[] = [];
    const seen = new Set([identifier]);
    let parent = scene.layers.find((layer) => layer.id === identifier)?.parent;
    while (parent) {
        const layer = scene.layers.find((item) => item.id === parent);
        if (!layer || seen.has(parent)) break;
        seen.add(parent);
        result.push(layer);
        parent = layer.parent;
    }
    return result;
}
export function drawingLayerLocked(scene: DrawingScene, identifier: string): boolean {
    const layer = scene.layers.find((item) => item.id === identifier);
    return !layer || layer.locked || drawingAncestors(scene, identifier).some((owner) => owner.locked);
}
export function drawingLayerVisible(scene: DrawingScene, identifier: string): boolean {
    const layer = scene.layers.find((item) => item.id === identifier);
    return Boolean(layer?.visible && layer.opacity && drawingAncestors(scene, identifier).every((owner) => owner.visible && owner.opacity));
}
export function drawingSceneLocalPoint(scene: DrawingScene, point: DrawingPoint, layer: DrawingLayer): DrawingPoint {
    let local = point;
    for (const owner of drawingAncestors(scene, layer.id).reverse()) {
        if (owner.kind !== "group") continue;
        const normalized = drawingLocalPoint(local, owner);
        local = { x: normalized.x * owner.contentWidth, y: normalized.y * owner.contentHeight };
    }
    return drawingLocalPoint(local, layer);
}
export function drawingSceneWorldPoint(scene: DrawingScene, point: DrawingPoint, layer: DrawingLayer): DrawingPoint {
    let world = drawingWorldPoint(point, layer);
    for (const owner of drawingAncestors(scene, layer.id))
        if (owner.kind === "group") world = drawingWorldPoint({ x: world.x / owner.contentWidth, y: world.y / owner.contentHeight }, owner);
    return world;
}
export function drawingDescendants(scene: DrawingScene, ids: string[]): string[] {
    return scene.layers
        .filter((layer) => ids.includes(layer.id) || drawingAncestors(scene, layer.id).some((owner) => ids.includes(owner.id)))
        .map((layer) => layer.id);
}
