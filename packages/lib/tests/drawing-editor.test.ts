import { describe, expect, it } from "vitest";
import {
    DEFAULT_DRAWING_EFFECTS,
    createDrawingScene,
    deserializeDrawingScene,
    drawingAncestors,
    drawingCommit,
    drawingDescendants,
    drawingHitTest,
    drawingLayerLocked,
    drawingLocalPoint,
    drawingRedo,
    drawingReorder,
    drawingSceneLocalPoint,
    drawingSceneWorldPoint,
    drawingUndo,
    drawingWorldPoint,
    isDrawingImageSource,
    parseDrawingScene,
    serializeDrawingScene,
    transformDrawingLayers,
    type DrawingHistory,
    type DrawingLayer,
    type DrawingScene,
} from "../src/components/form/drawing-editor/scene";
import { drawingRasterDimensions } from "../src/components/form/drawing-editor/raster";
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jO1sAAAAASUVORK5CYII=";
function shape(id: string, extra: Partial<DrawingLayer> = {}): DrawingLayer {
    return {
        id,
        name: id,
        kind: "shape",
        shape: "rectangle",
        fill: "#112233",
        stroke: "#000000",
        strokeWidth: 0,
        x: 10,
        y: 20,
        width: 100,
        height: 60,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        ...extra,
    } as DrawingLayer;
}
describe("drawing geometry and history", () => {
    it("roundtrips rotated normalized coordinates without changing layer dimensions", () => {
        const layer = shape("rotated", { rotation: 67 });
        const normalized = { x: 0.23, y: 0.81 };
        const world = drawingWorldPoint(normalized, layer);
        const local = drawingLocalPoint(world, layer);
        expect(local.x).toBeCloseTo(normalized.x, 12);
        expect(local.y).toBeCloseTo(normalized.y, 12);
        expect(layer.width).toBe(100);
    });
    it("rotates grouped layer centers around one origin and respects locks", () => {
        const first = shape("first", { x: 0, y: 0, width: 10, height: 10, group: "g" });
        const second = shape("second", { x: 20, y: 0, width: 10, height: 10, group: "g" });
        const locked = shape("locked", { locked: true });
        const scene = { ...createDrawingScene(100, 100), layers: [first, second, locked] };
        const rotated = transformDrawingLayers(scene, ["first", "second", "locked"], { kind: "rotate", degrees: 90, origin: { x: 5, y: 5 } });
        expect(rotated.layers[0]).toMatchObject({ x: 0, y: 0, rotation: 90 });
        expect(rotated.layers[1]!.x).toBeCloseTo(0);
        expect(rotated.layers[1]!.y).toBeCloseTo(20);
        expect(rotated.layers[2]).toBe(locked);
        const scaled = transformDrawingLayers(scene, ["first", "second"], { kind: "scale", factor: 2, origin: { x: 0, y: 0 } });
        expect(scaled.layers[1]).toMatchObject({ x: 40, width: 20, height: 20 });
        expect(scene.layers[1]).toBe(second);
    });
    it("hit tests rotated masked layers top-first, excluding hidden and locked layers", () => {
        const lower = shape("lower");
        const upper = shape("upper", {
            rotation: 90,
            mask: [
                { x: 0, y: 0 },
                { x: 0.5, y: 0 },
                { x: 0.5, y: 1 },
                { x: 0, y: 1 },
            ],
        });
        const scene = { ...createDrawingScene(), layers: [lower, upper] };
        expect(drawingHitTest(scene, drawingWorldPoint({ x: 0.2, y: 0.5 }, upper))?.id).toBe("upper");
        expect(drawingHitTest(scene, drawingWorldPoint({ x: 0.8, y: 0.5 }, upper))?.id).toBe("lower");
        expect(drawingHitTest({ ...scene, layers: [{ ...upper, locked: true }] }, drawingWorldPoint({ x: 0.2, y: 0.5 }, upper))).toBeUndefined();
    });
    it("reorders a selection stably and bounds history while clearing abandoned redo", () => {
        const first = { ...createDrawingScene(), layers: ["a", "b", "c", "d"].map((id) => shape(id)) };
        const raised = drawingReorder(first, ["a", "b"], 1);
        expect(raised.layers.map((layer) => layer.id)).toEqual(["c", "a", "b", "d"]);
        expect(first.layers.map((layer) => layer.id)).toEqual(["a", "b", "c", "d"]);
        let history: DrawingHistory = { past: [], present: first, future: [] };
        for (let i = 0; i < 60; i++) history = drawingCommit(history, { ...first, background: i % 2 ? "#ffffff" : "#000000" });
        expect(history.past).toHaveLength(50);
        const undone = drawingUndo(history);
        expect(drawingRedo(undone).present).toBe(history.present);
        const branch = drawingCommit(undone, first);
        expect(branch.future).toEqual([]);
        expect(drawingRedo(branch)).toBe(branch);
    });
    it("preserves scene and redo identity when a reorder cannot move or no layer is editable", () => {
        const scene = { ...createDrawingScene(100, 100), layers: [shape("only")] };
        const history: DrawingHistory = { past: [], present: scene, future: [{ ...scene, background: "#ffffff" }] };
        expect(drawingReorder(scene, ["only"], 1)).toBe(scene);
        expect(drawingReorder(scene, ["only"], -1)).toBe(scene);
        expect(transformDrawingLayers(scene, [], { kind: "move", dx: 1, dy: 0 })).toBe(scene);
        expect(drawingCommit(history, drawingReorder(scene, ["only"], 1))).toBe(history);
    });
});
describe("drawing serialization and ingress", () => {
    it("preserves grouped image, text and masked eraser paths as JSON without embedding the source", () => {
        const scene: DrawingScene = {
            ...createDrawingScene(100, 80, true),
            assets: { bitmap: png },
            layers: [
                shape("shape", { group: "group" }),
                { ...shape("image"), kind: "image", asset: "bitmap" },
                { ...shape("text"), kind: "text", text: "<script>literal text</script>", color: "#112233", fontSize: 16 },
                {
                    ...shape("paint"),
                    kind: "paint",
                    strokes: [
                        {
                            points: [{ x: 0.1, y: 0.2 }],
                            color: "#112233",
                            size: 3,
                            erase: true,
                            mask: [
                                { x: 0, y: 0 },
                                { x: 1, y: 0 },
                                { x: 1, y: 1 },
                            ],
                        },
                    ],
                },
            ],
        };
        const result = deserializeDrawingScene(serializeDrawingScene(scene));
        expect(result.layers[3]).toMatchObject({
            kind: "paint",
            strokes: [
                {
                    erase: true,
                    mask: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                    ],
                },
            ],
        });
        expect(result.assets.bitmap).toBe(png);
        expect(result.assets).not.toHaveProperty("source");
        expect(result.layers[2]).toMatchObject({ text: "<script>literal text</script>" });
    });
    it("rejects nonfinite geometry, future versions, duplicate IDs, missing assets and excessive budgets", () => {
        const base = createDrawingScene();
        for (const bad of [
            { ...base, version: 2 },
            { ...base, width: 8193 },
            { ...base, width: 8192, height: 8192 },
            { ...base, layers: [shape("a", { rotation: NaN })] },
            { ...base, layers: [shape("same"), shape("same")] },
            { ...base, layers: [{ ...shape("i"), kind: "image", asset: "absent" }] },
            { ...base, layers: Array.from({ length: 101 }, (_, index) => shape(String(index))) },
        ])
            expect(() => parseDrawingScene(bad)).toThrow();
        expect(() => parseDrawingScene({ ...base, assets: { source: png } })).toThrow("Reserved");
    });
    it("refuses SVG/HTML, remote redirects and credential URLs at the default source boundary", () => {
        expect(isDrawingImageSource(png)).toBe(true);
        expect(isDrawingImageSource("/owned.png", "https://example.test")).toBe(true);
        for (const value of [
            "data:image/svg+xml;base64,PHN2Zz4=",
            "data:text/html;base64,PHN2Zz4=",
            "https://other.test/image.png",
            "https://user:pass@example.test/x",
            "blob:https://example.test/id",
        ])
            expect(isDrawingImageSource(value, "https://example.test")).toBe(false);
        expect(() => parseDrawingScene({ ...createDrawingScene(), assets: { remote: "https://other.test/a.png" } })).toThrow();
        expect(() => drawingRasterDimensions(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>'), "image/png")).toThrow();
    });
    it("bounds raster header dimensions before bitmap decoding", () => {
        const bytes = Uint8Array.from(atob(png.split(",")[1]!), (character) => character.charCodeAt(0));
        expect(drawingRasterDimensions(bytes, "image/png")).toEqual({ width: 1, height: 1 });
        new DataView(bytes.buffer).setUint32(16, 8193);
        expect(() => drawingRasterDimensions(bytes, "image/png")).toThrow("8192");
    });
});
describe("drawing hierarchy and extended version-one invariants", () => {
    function group(id: string, parent?: string): DrawingLayer {
        return {
            ...shape(id),
            kind: "group",
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            contentWidth: 100,
            contentHeight: 100,
            ...(parent ? { parent } : {}),
        };
    }
    it("preserves legacy persisted data without synthesizing hierarchy or changing optional defaults", () => {
        const legacy: DrawingScene = {
            ...createDrawingScene(100, 100, true),
            assets: { original: png },
            layers: [
                shape("one", {
                    group: "unmaterialized-legacy-tag",
                    mask: [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 },
                        { x: 1, y: 1 },
                    ],
                }),
                { ...shape("two"), kind: "paint", strokes: [{ points: [{ x: 0.25, y: 0.75 }], size: 6, color: "#112233", erase: false }] },
            ],
        };
        const first = serializeDrawingScene(legacy);
        const restored = deserializeDrawingScene(first);
        expect(JSON.parse(serializeDrawingScene(restored))).toEqual(JSON.parse(first));
        expect(restored.layers[0]).not.toHaveProperty("parent");
        expect(restored.layers[0]).not.toHaveProperty("softMask");
        expect(restored.layers[1]).not.toHaveProperty("effects");
        expect(restored).not.toHaveProperty("guides");
        expect(restored.layers[0]!.group).toBe("unmaterialized-legacy-tag");
    });
    it("rejects cycles, self-parenting, missing groups, non-group parents and excessive depth", () => {
        const base = createDrawingScene(100, 100);
        for (const layers of [
            [group("a", "a")],
            [group("a", "b"), group("b", "a")],
            [shape("child", { parent: "absent" })],
            [shape("owner"), shape("child", { parent: "owner" })],
            Array.from({ length: 10 }, (_, index) => group(`g${index}`, index ? `g${index - 1}` : undefined)),
        ])
            expect(() => parseDrawingScene({ ...base, layers })).toThrow();
        expect(() => parseDrawingScene({ ...base, layers: [group("duplicate"), shape("duplicate")] })).toThrow("Duplicate");
    });
    it("roundtrips nested local geometry and pressure, masks, guides and adjustments without dropping properties", () => {
        const outer = {
            ...group("outer"),
            x: 30,
            y: 40,
            width: 200,
            height: 200,
            rotation: 35,
            opacity: 0.8,
            effects: { ...DEFAULT_DRAWING_EFFECTS, blur: 2 },
        };
        const inner = { ...group("inner", "outer"), x: 5, y: 10, rotation: -12 };
        const paint: DrawingLayer = {
            ...shape("paint", {
                parent: "inner",
                blend: "multiply",
                softMask: {
                    density: 0.6,
                    feather: 4,
                    base: 0,
                    strokes: [{ points: [{ x: 0.2, y: 0.3 }], size: 30, opacity: 0.7, hardness: 0.4, erase: false }],
                },
            }),
            kind: "paint",
            strokes: [
                {
                    points: [
                        { x: 0.1, y: 0.2, pressure: 0.15 },
                        { x: 0.4, y: 0.5, pressure: 0.85 },
                    ],
                    color: "#112233",
                    size: 20,
                    erase: false,
                    dynamics: true,
                },
            ],
        };
        const scene = parseDrawingScene({
            ...createDrawingScene(500, 500),
            layers: [
                outer,
                inner,
                paint,
                { ...shape("adjust", { parent: "inner" }), kind: "adjustment", adjustment: { ...DEFAULT_DRAWING_EFFECTS, contrast: 1.5 } },
            ],
            guides: [{ axis: "x", position: 125 }],
        });
        const local = { x: 0.3, y: 0.4 };
        const world = drawingSceneWorldPoint(scene, local, paint);
        const inverse = drawingSceneLocalPoint(scene, world, paint);
        expect(inverse.x).toBeCloseTo(local.x, 10);
        expect(inverse.y).toBeCloseTo(local.y, 10);
        expect(deserializeDrawingScene(serializeDrawingScene(scene))).toEqual(scene);
        expect(drawingAncestors(scene, "paint").map((layer) => layer.id)).toEqual(["inner", "outer"]);
        expect(drawingDescendants(scene, ["outer"])).toEqual(["outer", "inner", "paint", "adjust"]);
    });
    it("honors a locked ancestor for transforms, reorder and picking, then permits an unlocked child", () => {
        const owner = { ...group("owner"), locked: true };
        const child = shape("child", { parent: "owner", x: 0, y: 0, width: 10, height: 10 });
        const sibling = shape("sibling", { parent: "owner" });
        const scene = { ...createDrawingScene(100, 100), layers: [owner, child, sibling] };
        expect(drawingLayerLocked(scene, "child")).toBe(true);
        expect(transformDrawingLayers(scene, ["child"], { kind: "move", dx: 10, dy: 20 })).toBe(scene);
        expect(drawingReorder(scene, ["child"], 1)).toBe(scene);
        expect(drawingHitTest(scene, { x: 5, y: 5 })).toBeUndefined();
        const unlocked = { ...scene, layers: [{ ...owner, locked: false }, child, sibling] };
        expect(drawingLayerLocked(unlocked, "child")).toBe(false);
        expect(drawingHitTest(unlocked, { x: 5, y: 5 })?.id).toBe("child");
        expect(transformDrawingLayers(unlocked, ["owner", "child"], { kind: "move", dx: 10, dy: 20 }).layers[1]).toBe(child);
        const history: DrawingHistory = { past: [], present: scene, future: [unlocked] };
        expect(drawingCommit(history, transformDrawingLayers(scene, ["child"], { kind: "move", dx: 1, dy: 0 }))).toBe(history);
        expect(drawingCommit(history, drawingReorder(scene, ["child"], -1))).toBe(history);
    });
    it("bounds mask points, pressure, guide positions, convolution and embedded decoded pixels", () => {
        const base = createDrawingScene(100, 100);
        expect(() =>
            parseDrawingScene({
                ...base,
                layers: [
                    {
                        ...shape("paint"),
                        kind: "paint",
                        strokes: [{ points: [{ x: 0, y: 0, pressure: 1.1 }], color: "#112233", size: 4, erase: false, dynamics: true }],
                    },
                ],
            })
        ).toThrow();
        expect(() =>
            parseDrawingScene({
                ...base,
                layers: [
                    shape("mask", {
                        softMask: {
                            density: 1,
                            feather: 0,
                            base: 1,
                            strokes: [
                                {
                                    points: Array.from({ length: 100001 }, () => ({ x: 0.5, y: 0.5 })),
                                    size: 6,
                                    opacity: 1,
                                    hardness: 1,
                                    erase: false,
                                },
                            ],
                        },
                    }),
                ],
            })
        ).toThrow("point budget");
        expect(() => parseDrawingScene({ ...base, guides: [{ axis: "x", position: 101 }] })).toThrow();
        expect(() =>
            parseDrawingScene({
                ...base,
                layers: Array.from({ length: 5 }, (_, index) => shape(`blur${index}`, { effects: { ...DEFAULT_DRAWING_EFFECTS, blur: 32 } })),
            })
        ).toThrow("128 pixel");
        const bytes = Uint8Array.from(atob(png.split(",")[1]!), (character) => character.charCodeAt(0));
        const header = new DataView(bytes.buffer);
        header.setUint32(16, 4096);
        header.setUint32(20, 4096);
        const largeHeader = `data:image/png;base64,${btoa(String.fromCharCode(...bytes))}`;
        expect(() => parseDrawingScene({ ...base, assets: { first: largeHeader, second: largeHeader, third: largeHeader } })).toThrow("48 megapixel");
    });
});
