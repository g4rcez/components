import { expect, test, type Locator, type Page } from "@playwright/test";

const computed = (locator: Locator, property: "transform" | "animationName" | "transformOrigin" | "opacity") =>
    locator.evaluate((element, name) => getComputedStyle(element)[name], property);

const pressAndHold = async (page: Page, locator: Locator) => {
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element has no bounds");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
};

const normalButton = (page: Page) => page.getByLabel("Button Themes", { exact: true }).getByRole("button", { name: "Normal", exact: true });

test.describe("press feedback", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("a pressed button shrinks slightly and springs back on release", async ({ page }) => {
        await page.goto("/docs/buttons");
        const button = normalButton(page);
        await pressAndHold(page, button);
        await expect.poll(() => computed(button, "transform")).toBe("matrix(0.97, 0, 0, 0.97, 0, 0)");

        await page.mouse.up();
        await expect.poll(() => computed(button, "transform")).toBe("none");
    });

    test("a pressed checkbox shrinks slightly and springs back on release", async ({ page }) => {
        await page.goto("/docs/checkbox");
        const checkbox = page.locator(".__checkbox__control-state").first();
        await pressAndHold(page, checkbox);
        await expect.poll(() => computed(checkbox, "transform")).toBe("matrix(0.95, 0, 0, 0.95, 0, 0)");

        await page.mouse.up();
        await expect.poll(() => computed(checkbox, "transform")).toBe("none");
    });
});

test.describe("floating panels", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("a dropdown opens below its trigger and grows from the trigger edge", async ({ page }) => {
        // Tall viewport: the panel has room below the trigger, so floating-ui does not flip it above.
        await page.setViewportSize({ width: 1280, height: 1800 });
        await page.goto("/docs/table");
        const trigger = page.getByRole("button", { name: "Properties", exact: true }).first();
        await trigger.click();
        const panel = page.getByRole("dialog", { name: "Columns" });
        await expect(panel).toBeVisible();

        expect(await computed(panel, "animationName")).toBe("__dropdown-in");
        // transform-origin y is 0px for a panel that sits below its trigger.
        expect((await computed(panel, "transformOrigin")).split(" ")[1]).toBe("0px");
        // top/left positioning leaves `transform` free for the enter animation.
        expect(await computed(panel, "transform")).toBe("none");

        const triggerBox = await trigger.boundingBox();
        const panelBox = await panel.boundingBox();
        if (!triggerBox || !panelBox) throw new Error("Missing bounds");
        expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height);
    });

    test("a menu opens with the enter animation and a submenu grows from its left edge", async ({ page }) => {
        await page.goto("/docs/menu");
        await page.getByRole("button", { name: "I'm a menu", exact: true }).first().click();
        const menu = page.locator(".__menu__floating").first();
        await expect(menu).toBeVisible();
        expect(await computed(menu, "animationName")).toBe("__menu-in");

        const submenuItem = page.getByRole("menuitem", { name: "Submenu" }).first();
        const itemBox = await submenuItem.boundingBox();
        if (!itemBox) throw new Error("Submenu item has no bounds");
        await page.mouse.move(itemBox.x + 10, itemBox.y + 5);
        await page.mouse.move(itemBox.x + 14, itemBox.y + 8, { steps: 4 });
        const submenu = page.locator(".__menu__floating").nth(1);
        await expect(submenu).toBeVisible();
        expect(await computed(submenu, "animationName")).toBe("__menu-in");
        expect((await computed(submenu, "transformOrigin")).split(" ")[0]).toBe("0px");
    });
});

test.describe("state changes", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("an alert that opens after load fades in, one open on load does not", async ({ page }) => {
        // Record the lowest opacity any alert collapse has, from the first frame of the page.
        await page.addInitScript(() => {
            const w = window as unknown as { __minOpacity: number };
            w.__minOpacity = 1;
            const sample = () => {
                document.querySelectorAll('[data-component="collapse"]').forEach((element) => {
                    w.__minOpacity = Math.min(w.__minOpacity, Number(getComputedStyle(element).opacity));
                });
                requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
        });
        await page.goto("/docs/alert");
        await expect(page.locator('[data-component="collapse"]').first()).toBeVisible();
        await page.waitForTimeout(500);
        expect(await page.evaluate(() => (window as unknown as { __minOpacity: number }).__minOpacity)).toBe(1);

        const toggle = page.getByRole("button", { name: "Toggle", exact: true });
        await toggle.click();
        await expect(page.locator('[data-component="collapse"]')).toHaveCount(0);

        await page.evaluate(() => ((window as unknown as { __minOpacity: number }).__minOpacity = 1));
        await toggle.click();
        await expect(page.locator('[data-component="collapse"]').first()).toBeVisible();
        await page.waitForTimeout(500);
        const reopened = await page.evaluate(() => (window as unknown as { __minOpacity: number }).__minOpacity);
        expect(reopened).toBeLessThan(1);
        await expect.poll(() => computed(page.locator('[data-component="collapse"]').first(), "opacity")).toBe("1");
    });

    test("the file upload icon pops in when a file is dragged over", async ({ page }) => {
        await page.goto("/docs/file-upload");
        const zone = page.locator(".__file-upload__dropzone").first();
        await expect(zone).toBeVisible();
        const dataTransfer = await page.evaluateHandle(() => {
            const transfer = new DataTransfer();
            transfer.items.add(new File(["hello"], "hello.txt", { type: "text/plain" }));
            return transfer;
        });
        await zone.dispatchEvent("dragenter", { dataTransfer });
        await zone.dispatchEvent("dragover", { dataTransfer });

        const icon = zone.locator('.__file-upload__idle-icon[data-dragging="true"]');
        await expect(icon).toBeVisible();
        expect(await computed(icon, "animationName")).toBe("__file-upload-icon-in");
    });
});

test.describe("reduced motion", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("a pressed button does not scale", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/buttons");
        expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
        const button = normalButton(page);
        await pressAndHold(page, button);
        await page.waitForTimeout(300);
        expect(await computed(button, "transform")).toBe("none");
        await page.mouse.up();
    });

    test("a dropdown only fades in, without scaling", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/table");
        expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
        await page.getByRole("button", { name: "Properties", exact: true }).first().click();
        const panel = page.getByRole("dialog", { name: "Columns" });
        await expect(panel).toBeVisible();
        expect(await computed(panel, "animationName")).toBe("__dropdown-fade");
    });
});
