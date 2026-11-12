import { expect, test, type Locator, type Page } from "@playwright/test";

/** Samples the width on every frame for `ms`, so a spring and an instant jump can be told apart. */
const sampleWidths = (locator: Locator, ms: number) =>
    locator.evaluate(
        (element, duration) =>
            new Promise<number[]>((resolve) => {
                const widths: number[] = [];
                const start = performance.now();
                const tick = () => {
                    widths.push(Math.round(element.getBoundingClientRect().width * 10) / 10);
                    if (performance.now() - start < duration) requestAnimationFrame(tick);
                    else resolve(widths);
                };
                tick();
            }),
        ms
    );

const mediumFollow = (page: Page) =>
    page
        .locator("#pin-a-language")
        .getByRole("button", { name: /^Pin(ned)?$/ })
        .nth(1);

test.describe("ActionSwap", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("cycles between states on every press and wraps", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const button = mediumFollow(page);
        await expect(button).toHaveAccessibleName("Pin");
        await expect(button).toHaveAttribute("data-tone", "primary");
        await button.click();
        await expect(button).toHaveAccessibleName("Pinned");
        await expect(button).toHaveAttribute("data-tone", "neutral");
        await button.click();
        await expect(button).toHaveAccessibleName("Pin");
    });

    test("the width springs to the new label instead of jumping", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const button = mediumFollow(page);
        const before = (await button.boundingBox())!.width;
        const sampling = sampleWidths(button, 700);
        await button.click();
        const widths = await sampling;
        const settled = widths[widths.length - 1];
        expect(settled).toBeGreaterThan(before + 8);
        expect(new Set(widths).size).toBeGreaterThan(4);
    });

    test("with reduced motion the width changes at once", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/action-swap");
        const button = mediumFollow(page);
        const sampling = sampleWidths(button, 600);
        await button.click();
        const widths = await sampling;
        expect(new Set(widths).size).toBeLessThanOrEqual(3);
        await expect(button).toHaveAccessibleName("Pinned");
    });

    test("Enter and Space advance the state from the keyboard", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const button = mediumFollow(page);
        await button.focus();
        await page.keyboard.press("Enter");
        await expect(button).toHaveAccessibleName("Pinned");
        await page.keyboard.press("Space");
        await expect(button).toHaveAccessibleName("Pin");
    });

    test("an async action shows the working phase, fails once, then retries and confirms", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const section = page.locator("#async-action-with-a-confirmation");
        const send = section.getByRole("button", { name: /^(Compile|Compiling|Compiled|Build failed)$/ });

        await send.click();
        await expect(send).toHaveAttribute("aria-busy", "true");
        await expect(send).toHaveAccessibleName("Compiling");
        await expect(send).toHaveAttribute("data-phase", "failed", { timeout: 4000 });
        await expect(send).toHaveAccessibleName("Build failed");

        await send.click();
        await expect(send).toHaveAccessibleName("Compiling");
        await expect(send).toHaveAccessibleName("Compiled", { timeout: 4000 });
        await expect(send).toHaveAttribute("data-tone", "success");
        // holdFor sends it back on its own.
        await expect(send).toHaveAccessibleName("Compile", { timeout: 4000 });
    });

    test("ignores presses while working", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const send = page.locator("#async-action-with-a-confirmation").getByRole("button", { name: /^(Compile|Compiling|Compiled|Build failed)$/ });
        await send.click();
        await send.click({ force: true });
        await send.click({ force: true });
        await expect(send).toHaveAttribute("data-phase", "failed", { timeout: 4000 });
    });

    test("a controlled three-state button reports its value", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const section = page.locator("#controlled-with-three-states");
        const button = section.getByRole("button", { name: /Dynamic|Gradual|Static/ });
        await expect(section.getByText("Current value: dynamic")).toBeVisible();
        await button.click();
        await expect(button).toHaveAccessibleName("Gradual");
        await expect(section.getByText("Current value: gradual")).toBeVisible();
        await button.click();
        await expect(button).toHaveAccessibleName("Static");
        await button.click();
        await expect(button).toHaveAccessibleName("Dynamic");
    });

    test("announces each new label to assistive technology", async ({ page }) => {
        await page.goto("/docs/action-swap");
        const button = mediumFollow(page);
        await button.click();
        await expect(page.locator("#pin-a-language [role='status']").nth(1)).toHaveText("Pinned");
    });
});
