import { expect, test, type Locator, type Page } from "@playwright/test";

const computed = (locator: Locator, property: "transform" | "scale") =>
    locator.evaluate((element, name) => getComputedStyle(element)[name], property);

/** scaleX of the fill, read from its computed matrix. */
const fillProgress = (page: Page) =>
    page.locator("#delete-a-branch .__hold-to-confirm__fill").evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);

const deleteButton = (page: Page) => page.locator("#delete-a-branch").getByRole("button", { name: /Hold to delete branch|Branch deleted/ });

const center = async (locator: Locator) => {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element has no bounds");
    return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
};

const press = async (page: Page, locator: Locator) => {
    const { x, y } = await center(locator);
    await page.mouse.move(x, y);
    await page.mouse.down();
};

test.describe("HoldToConfirm", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("fills while held and rewinds when released early, without confirming", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        await press(page, button);
        await expect(button).toHaveAttribute("data-holding", "true");

        await page.waitForTimeout(500);
        const partway = await fillProgress(page);
        expect(partway).toBeGreaterThan(0.2);
        expect(partway).toBeLessThan(0.75);

        await page.mouse.up();
        await expect.poll(() => fillProgress(page)).toBeLessThan(0.02);
        await expect(button).not.toHaveAttribute("data-holding");
        await expect(button).not.toHaveAttribute("data-confirmed");
        await expect(page.getByText("Nothing deleted yet.")).toBeVisible();
    });

    test("confirms once after the full hold and shows the confirmed state", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        await press(page, button);
        await page.waitForTimeout(1500);
        await page.mouse.up();

        await expect(button).toHaveAttribute("data-confirmed", "true");
        await expect(button).toHaveAccessibleName("Branch deleted");
        await expect(button).toHaveAttribute("aria-disabled", "true");
        await expect(page.getByText("The branch was deleted.")).toBeVisible();
        expect(await fillProgress(page)).toBeGreaterThan(0.99);
    });

    test("presses down to 0.97 while held and springs back on release", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        await press(page, button);
        await expect.poll(() => computed(button, "transform")).toBe("matrix(0.97, 0, 0, 0.97, 0, 0)");
        await page.mouse.up();
        await expect.poll(() => computed(button, "transform")).toBe("none");
    });

    test("cancels when the pointer slides well off the button", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        const { x, y } = await center(button);
        await press(page, button);
        await page.waitForTimeout(300);
        await page.mouse.move(x + 400, y + 200, { steps: 8 });
        await expect(button).not.toHaveAttribute("data-holding");
        await page.waitForTimeout(1500);
        await expect(button).not.toHaveAttribute("data-confirmed");
        await page.mouse.up();
    });

    test("holds with Space and Enter, and an early key release cancels", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        await button.focus();
        await page.keyboard.down("Space");
        await expect(button).toHaveAttribute("data-holding", "true");
        await page.waitForTimeout(400);
        await page.keyboard.up("Space");
        await page.waitForTimeout(1400);
        await expect(button).not.toHaveAttribute("data-confirmed");

        await page.keyboard.down("Enter");
        await page.waitForTimeout(1500);
        await page.keyboard.up("Enter");
        await expect(button).toHaveAttribute("data-confirmed", "true");
    });

    test.describe("touch", () => {
        test.use({ hasTouch: true, viewport: { width: 390, height: 800 } });

        test("works with a touch hold", async ({ page }) => {
            await page.goto("/docs/hold-to-confirm");
            const button = deleteButton(page);
            await button.scrollIntoViewIfNeeded();
            const client = await page.context().newCDPSession(page);
            const { x, y } = await center(button);
            await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
            await page.waitForTimeout(1500);
            await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await expect(button).toHaveAttribute("data-confirmed", "true");
        });
    });

    test("with reduced motion the press scale is gone and the fill still tracks the hold", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/hold-to-confirm");
        const button = deleteButton(page);
        await press(page, button);
        await page.waitForTimeout(500);
        expect(await computed(button, "transform")).toBe("none");
        expect(await fillProgress(page)).toBeGreaterThan(0.2);
        await page.mouse.up();
        await expect.poll(() => fillProgress(page), { timeout: 1000 }).toBeLessThan(0.01);
    });

    test("the neutral, two second demo needs the longer hold", async ({ page }) => {
        await page.goto("/docs/hold-to-confirm");
        const merge = page.locator("#neutral-tone-and-custom-duration").getByRole("button", { name: /Hold to merge|Merged/ });
        await press(page, merge);
        await expect(page.locator("#neutral-tone-and-custom-duration p[aria-live='polite']")).toHaveText("Keep holding to merge into main.");
        await page.waitForTimeout(1400);
        await expect(merge).not.toHaveAttribute("data-confirmed");
        await page.waitForTimeout(900);
        await expect(merge).toHaveAttribute("data-confirmed", "true");
        await page.mouse.up();
    });
});
