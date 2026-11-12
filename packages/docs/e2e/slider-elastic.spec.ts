import { expect, test, type Locator, type Page } from "@playwright/test";

const cssVar = (locator: Locator, name: string) =>
    locator.evaluate((element, property) => getComputedStyle(element).getPropertyValue(property).trim(), name);

const box = async (locator: Locator) => {
    await locator.scrollIntoViewIfNeeded();
    const result = await locator.boundingBox();
    if (!result) throw new Error("Element has no bounds");
    return result;
};

const section = (page: Page, id: string) => page.locator(`#${id}`);
const rootOf = (container: Locator) => container.locator(".__slider").first();
const thumbOf = (container: Locator) => container.locator(".__slider__thumb").first();
const trackScale = (container: Locator) =>
    container
        .locator(".__slider__track")
        .first()
        .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);

const grab = async (page: Page, container: Locator) => {
    const thumb = await box(thumbOf(container));
    await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
    await page.mouse.down();
};

test.describe("Slider", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("the range slider keeps its two thumbs", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "basic-range-slider");
        await expect(demo.getByRole("slider")).toHaveCount(2);
        await expect(demo.getByRole("slider", { name: "Range 1" })).toHaveValue("50");
        await expect(demo.getByRole("slider", { name: "Range 2" })).toHaveValue("75");
    });

    test("dragging past the end stretches the track and it springs back on release", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "elastic-volume-with-icons");
        const control = await box(demo.locator(".__slider__control"));

        await grab(page, demo);
        await expect(thumbOf(demo)).toHaveAttribute("data-dragging", "");
        await page.mouse.move(control.x + control.width + 250, control.y + control.height / 2, { steps: 14 });

        await expect.poll(() => trackScale(demo)).toBeGreaterThan(1.01);
        expect(parseFloat(await cssVar(rootOf(demo), "--slider-shift-max"))).toBeGreaterThan(0);
        expect(parseFloat(await cssVar(rootOf(demo), "--slider-shift-max"))).toBeLessThanOrEqual(36);
        await expect(demo.getByRole("slider", { name: "Volume" })).toHaveValue("100");

        await page.mouse.up();
        await expect.poll(() => trackScale(demo), { timeout: 2500 }).toBeCloseTo(1, 2);
        await expect(thumbOf(demo)).not.toHaveAttribute("data-dragging", "");
    });

    test("the thumb swells while it is held", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "elastic-volume-with-icons");
        await grab(page, demo);
        await expect.poll(() => thumbOf(demo).evaluate((element) => getComputedStyle(element).scale)).toBe("1.28");
        await page.mouse.up();
        await expect.poll(() => thumbOf(demo).evaluate((element) => getComputedStyle(element).scale)).not.toBe("1.28");
    });

    test("the value tag shows the formatted value on hover and while dragging", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "elastic-volume-with-icons");
        const tag = demo.locator(".__slider__tag").first();
        await expect(tag).toHaveText("40%");
        await expect.poll(() => tag.evaluate((element) => getComputedStyle(element).opacity)).toBe("0");
        const thumb = await box(thumbOf(demo));
        await page.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
        await expect.poll(() => tag.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    });

    test("marks hold the thumb for a few pixels, then let go", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "marks-as-detents");
        const control = await box(demo.locator(".__slider__control"));
        const slider = demo.getByRole("slider", { name: "Playback speed" });
        // Mark 1 sits a third of the way along a 0.5 to 2 range.
        const markX = control.x + control.width / 3;

        await page.mouse.move(markX + 3, control.y + control.height / 2);
        await page.mouse.down();
        await expect(slider).toHaveValue("1");
        await expect(demo.locator(".__slider__tick[data-active='true']")).toHaveCount(1);
        await page.mouse.move(markX + 60, control.y + control.height / 2, { steps: 8 });
        expect(Number(await slider.inputValue())).toBeGreaterThan(1.05);
        await page.mouse.up();
        await expect(demo.locator(".__slider__tick[data-active='true']")).toHaveCount(0);
    });

    test("pressing a labelled mark commits that value", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "marks-as-detents");
        await demo.getByText("1.5×", { exact: true }).click();
        await expect(demo.getByRole("slider", { name: "Playback speed" })).toHaveValue("1.5");
        await expect(demo.getByText("Committed [1.5]")).toBeVisible();
    });

    test("the keyboard nudges the track at a limit and the stretch settles again", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "elastic-volume-with-icons");
        const slider = demo.getByRole("slider", { name: "Volume" });
        await slider.focus();
        await page.keyboard.press("End");
        await expect(slider).toHaveValue("100");
        await page.keyboard.press("ArrowRight");
        await expect.poll(async () => parseFloat(await cssVar(rootOf(demo), "--slider-shift-max"))).toBeGreaterThan(0);
        await expect.poll(async () => parseFloat(await cssVar(rootOf(demo), "--slider-shift-max")), { timeout: 2500 }).toBeLessThan(0.1);
    });

    test("elastic={false} never stretches", async ({ page }) => {
        await page.goto("/docs/slider");
        const demo = section(page, "range-with-marks-and-no-stretch");
        const control = await box(demo.locator(".__slider__control"));
        await grab(page, demo);
        await page.mouse.move(control.x + control.width + 250, control.y + control.height / 2, { steps: 10 });
        expect(await trackScale(demo)).toBe(1);
        await page.mouse.up();
    });

    test("with reduced motion the track never stretches but the value still reaches the end", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/slider");
        const demo = section(page, "elastic-volume-with-icons");
        const control = await box(demo.locator(".__slider__control"));
        await grab(page, demo);
        await page.mouse.move(control.x + control.width + 250, control.y + control.height / 2, { steps: 10 });
        expect(await trackScale(demo)).toBe(1);
        await expect(demo.getByRole("slider", { name: "Volume" })).toHaveValue("100");
        await page.mouse.up();
    });

    test("icons sit on one row with the track at a phone width", async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto("/docs/slider");
        const demo = section(page, "brightness");
        const row = await box(demo.locator(".__slider__row"));
        const icons = demo.locator(".__slider__icon");
        const first = await box(icons.first());
        const last = await box(icons.last());
        const control = await box(demo.locator(".__slider__control"));
        expect(Math.abs(first.y - last.y)).toBeLessThan(6);
        expect(control.x).toBeGreaterThan(first.x + first.width - 1);
        expect(control.x + control.width).toBeLessThan(last.x + 1);
        expect(row.x + row.width).toBeLessThanOrEqual(360);
    });
});
