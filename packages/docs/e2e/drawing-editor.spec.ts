import { expect, test } from "@playwright/test";

test("draws actual pixels, resumes a scene, and exports a decoded PNG", async ({ page }) => {
    await page.goto("/docs/drawing-editor");
    const canvas = page.getByLabel("Example drawing canvas");
    await expect(page.getByRole("button", { name: "Pencil", exact: true })).toBeEnabled();
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Drawing canvas has no bounds");
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.4);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.4, { steps: 12 });
    await page.mouse.up();
    await page.getByRole("button", { name: "Save example scene", exact: true }).click();
    await page.getByRole("button", { name: "Undo", exact: true }).click();
    await page.getByRole("button", { name: "Resume example scene", exact: true }).click();
    await page.getByRole("button", { name: "Export flattened PNG", exact: true }).click();
    const image = page.getByAltText("Flattened example drawing");
    await expect(image).toBeVisible();
    const output = await image.evaluate(async (element) => {
        const image = element as HTMLImageElement;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.drawImage(image, 0, 0);
        return {
            width: image.naturalWidth,
            height: image.naturalHeight,
            stroke: [...context.getImageData(320, 200, 1, 1).data],
            untouched: [...context.getImageData(5, 5, 1, 1).data],
        };
    });
    expect(output).toEqual({ width: 800, height: 500, stroke: [34, 34, 34, 255], untouched: [255, 255, 255, 255] });
    await page.getByLabel("Read-only preview", { exact: true }).check();
    await expect(page.getByRole("button", { name: "Add paint", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Export flattened PNG", exact: true })).toBeEnabled();
});

test("eraser removes only the active paint layer, revealing rather than damaging underlying pixels", async ({ page }) => {
    await page.goto("/docs/drawing-editor");
    const canvas = page.getByLabel("Example drawing canvas");
    await expect(page.getByRole("button", { name: "Pencil", exact: true })).toBeEnabled();
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Drawing canvas has no bounds");
    async function stroke(from: number, to: number) {
        await page.mouse.move(box!.x + box!.width * from, box!.y + box!.height * 0.4);
        await page.mouse.down();
        await page.mouse.move(box!.x + box!.width * to, box!.y + box!.height * 0.4, { steps: 12 });
        await page.mouse.up();
    }
    await stroke(0.2, 0.6);
    await page.getByRole("button", { name: "Add paint", exact: true }).click();
    await page.getByLabel("Stroke color", { exact: true }).fill("#ff0000");
    await stroke(0.2, 0.6);
    await page.getByRole("button", { name: "Eraser", exact: true }).click();
    await page.getByLabel("Stroke size (pixels)", { exact: true }).fill("20");
    await stroke(0.39, 0.41);
    await page.getByRole("button", { name: "Export flattened PNG", exact: true }).click();
    const image = page.getByAltText("Flattened example drawing");
    await expect(image).toBeVisible();
    const pixels = await image.evaluate(async (element) => {
        const image = element as HTMLImageElement;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 500;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.drawImage(image, 0, 0);
        return { erased: [...context.getImageData(320, 200, 1, 1).data], retained: [...context.getImageData(200, 200, 1, 1).data] };
    });
    expect(pixels).toEqual({ erased: [34, 34, 34, 255], retained: [255, 0, 0, 255] });
});
