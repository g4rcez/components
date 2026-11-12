import { expect, test, type Locator, type Page } from "@playwright/test";

/** Samples the surface's size on every frame for `ms` after the callback runs. */
const sampleSurface = (page: Page, root: Locator, ms: number) =>
    root.evaluate(
        (element, duration) =>
            new Promise<Array<{ w: number; h: number }>>((resolve) => {
                const samples: Array<{ w: number; h: number }> = [];
                const start = performance.now();
                const tick = () => {
                    const surface = element.querySelector(".__morph-select__surface");
                    if (surface) {
                        const rect = surface.getBoundingClientRect();
                        samples.push({ w: Math.round(rect.width), h: Math.round(rect.height) });
                    }
                    if (performance.now() - start < duration) requestAnimationFrame(tick);
                    else resolve(samples);
                };
                tick();
            }),
        ms
    );

const status = (page: Page) => page.locator("#language-picker");
const trigger = (page: Page) => status(page).getByRole("combobox");

test.describe("MorphSelect", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("the surface grows out of the trigger's own box into the list", async ({ page }) => {
        await page.goto("/docs/morph-select");
        const root = status(page).locator(".__morph-select").first();
        const closed = (await trigger(page).boundingBox())!;
        const sampling = sampleSurface(page, root, 900);
        await trigger(page).click();
        const samples = await sampling;

        expect(samples.length).toBeGreaterThan(6);
        expect(Math.abs(samples[0].w - closed.width)).toBeLessThan(closed.width * 0.5 + 8);
        expect(samples[0].h).toBeLessThan(closed.height + 40);
        const last = samples[samples.length - 1];
        expect(last.w).toBeGreaterThanOrEqual(270);
        expect(last.h).toBeGreaterThan(closed.height * 4);
        expect(new Set(samples.map((sample) => sample.h)).size).toBeGreaterThan(4);
    });

    test("with reduced motion the surface is at full size from its first frame", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/morph-select");
        const root = status(page).locator(".__morph-select").first();
        const sampling = sampleSurface(page, root, 400);
        await trigger(page).click();
        const samples = await sampling;
        const last = samples[samples.length - 1];
        expect(last.w).toBeGreaterThanOrEqual(270);
        // No growth: once the surface exists, even its first sampled frame is already (within sub-pixel settling) the final size.
        // A zero-sized sample is the browser's first layout of the freshly inserted node, not a growth frame
        // (the surface's inline style already holds the final size on that frame).
        const shown = samples.filter((sample) => sample.h > 0 && sample.w > 0);
        expect(shown.length).toBeGreaterThan(3);
        expect(shown[0].h).toBeGreaterThanOrEqual(last.h - 3);
        expect(shown[0].w).toBeGreaterThanOrEqual(last.w - 3);
    });

    test("picking an option updates the trigger, the page and returns focus", async ({ page }) => {
        await page.goto("/docs/morph-select");
        await trigger(page).click();
        await status(page).getByRole("option", { name: "Python" }).click();
        await expect(status(page).getByText("Value: python")).toBeVisible();
        await expect(trigger(page)).toHaveAccessibleName("Language Python");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await expect(trigger(page)).toBeFocused();
        await expect(status(page).locator(".__morph-select__surface")).toHaveCount(0, { timeout: 3000 });
    });

    test("the keyboard opens, skips the disabled option, picks and closes", async ({ page }) => {
        await page.goto("/docs/morph-select");
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
        // "TypeScript" is selected, "CoffeeScript" is disabled, so ArrowDown lands on "Python".
        await page.keyboard.press("ArrowDown");
        const active = await trigger(page).getAttribute("aria-activedescendant");
        await expect(page.locator(`[id="${active}"]`)).toHaveText(/Python/);
        await page.keyboard.press("Enter");
        await expect(status(page).getByText("Value: python")).toBeVisible();
        await expect(trigger(page)).toBeFocused();
    });

    test("Escape closes without picking and Tab leaves without picking", async ({ page }) => {
        await page.goto("/docs/morph-select");
        await trigger(page).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Escape");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await expect(trigger(page)).toBeFocused();
        await expect(status(page).getByText("Value: typescript")).toBeVisible();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await expect(trigger(page)).not.toBeFocused();
        await expect(status(page).getByText("Value: typescript")).toBeVisible();
    });

    test("type-ahead jumps to a matching label", async ({ page }) => {
        await page.goto("/docs/morph-select");
        await trigger(page).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.type("zi");
        const active = await trigger(page).getAttribute("aria-activedescendant");
        await expect(page.locator(`[id="${active}"]`)).toHaveText(/Zig/);
    });

    test("pressing outside closes the list", async ({ page }) => {
        await page.goto("/docs/morph-select");
        await trigger(page).click();
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
        await page.mouse.click(5, 400);
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    });

    test("search filters grouped options, matches keywords and picks the first match", async ({ page }) => {
        await page.goto("/docs/morph-select");
        const demo = page.locator("#grouped-options-with-search");
        const zones = demo.getByRole("combobox", { name: /Language/ });
        await zones.click();
        const search = demo.getByRole("combobox", { name: /Language/ });
        await expect(search).toBeFocused();
        await expect(demo.getByRole("group")).toHaveCount(3);

        await page.keyboard.type("borrow");
        await expect(demo.getByRole("option")).toHaveCount(1);
        await expect(demo.getByRole("group")).toHaveCount(1);
        await expect(demo.getByRole("status").first()).toHaveText("1 result");
        await page.keyboard.press("Enter");
        await expect(demo.getByRole("combobox", { name: /Language Rust/ })).toBeVisible();
    });

    test("says No matches when the search finds nothing", async ({ page }) => {
        await page.goto("/docs/morph-select");
        const demo = page.locator("#grouped-options-with-search");
        await demo.getByRole("combobox", { name: /Language/ }).click();
        await page.keyboard.type("zzzz");
        await expect(demo.getByRole("listbox")).toHaveCount(0);
        await expect(demo.getByText("No matches").first()).toBeVisible();
    });

    test("align end grows the surface toward the left from the right edge", async ({ page }) => {
        await page.goto("/docs/morph-select");
        const demo = page.locator("#grouped-options-with-search");
        const priority = demo.getByRole("combobox", { name: /Package manager/ });
        const closed = (await priority.boundingBox())!;
        await priority.click();
        const surface = demo.locator(".__morph-select__surface");
        await expect(surface).toHaveAttribute("data-align", "end");
        await expect.poll(async () => (await surface.boundingBox())!.width).toBeGreaterThan(closed.width + 20);
        const open = (await surface.boundingBox())!;
        expect(Math.abs(open.x + open.width - (closed.x + closed.width))).toBeLessThan(3);
        expect(open.x).toBeLessThan(closed.x);
    });

    test("grows upward when there is no room below", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 520 });
        await page.goto("/docs/morph-select");
        const demo = page.locator("#grouped-options-with-search");
        const zones = demo.getByRole("combobox", { name: /Language/ });
        await zones.evaluate((element) => element.scrollIntoView({ block: "end" }));
        // Let the scroll settle before opening: the direction is chosen from the trigger's position at that moment.
        let previous = -1;
        await expect
            .poll(async () => {
                const y = (await zones.boundingBox())!.y;
                const settled = y === previous;
                previous = y;
                return settled;
            })
            .toBe(true);
        await zones.click();
        const surface = demo.locator(".__morph-select__surface");
        await expect(surface).toHaveAttribute("data-direction", "up");
        await expect.poll(async () => (await surface.boundingBox())!.height).toBeGreaterThan(150);
        const rect = (await surface.boundingBox())!;
        expect(rect.y).toBeGreaterThanOrEqual(0);
        expect(rect.y + rect.height).toBeLessThanOrEqual(522);
    });

    test("submits the chosen value with the native form", async ({ page }) => {
        await page.goto("/docs/morph-select");
        const form = page.locator("#native-form-submission");
        await form.getByRole("combobox", { name: /Runtime/ }).click();
        await form.getByRole("option", { name: "Bun" }).click();
        await form.getByRole("button", { name: "Save" }).click();
        await expect(form.getByText("runtime = bun")).toBeVisible();
    });

    test("fits a phone width without overflowing", async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.goto("/docs/morph-select");
        const demo = page.locator("#grouped-options-with-search");
        await demo.getByRole("combobox", { name: /Language/ }).click();
        const surface = demo.locator(".__morph-select__surface");
        await expect.poll(async () => (await surface.boundingBox())!.width).toBeGreaterThan(200);
        const rect = (await surface.boundingBox())!;
        expect(rect.x + rect.width).toBeLessThanOrEqual(360 + 1);
    });
});
