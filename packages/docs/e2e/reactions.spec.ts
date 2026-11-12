import { expect, test, type Page } from "@playwright/test";

const demo = (page: Page) => page.locator("#uncontrolled");
const pill = (page: Page, name: string | RegExp) => demo(page).getByRole("button", { name });
const add = (page: Page) => demo(page).getByRole("button", { name: "Add reaction" });

test.describe("Reactions", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("renders the pills in order with the person's own reaction pressed", async ({ page }) => {
        await page.goto("/docs/reactions");
        const names = await demo(page)
            .getByRole("group", { name: "Reactions" })
            .getByRole("button")
            .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label")));
        expect(names).toEqual(["TypeScript, 12", "Rust, 3, you reacted", "Python, 1", "Add reaction"]);
        await expect(pill(page, "Rust, 3, you reacted")).toHaveAttribute("aria-pressed", "true");
    });

    test("toggles a reaction and the count rolls to its new value", async ({ page }) => {
        await page.goto("/docs/reactions");
        await pill(page, "TypeScript, 12").click();
        const pressed = pill(page, "TypeScript, 13, you reacted");
        await expect(pressed).toHaveAttribute("aria-pressed", "true");
        await expect(pressed.locator(".__rolling-text__label")).toHaveText("13");
        await pressed.click();
        await expect(pill(page, "TypeScript, 12")).toHaveAttribute("aria-pressed", "false");
    });

    test("the picker opens next to the button, lists every option and adds a reaction", async ({ page }) => {
        // Tall viewport: the picker has room below the button, so floating-ui does not flip it above.
        await page.setViewportSize({ width: 1280, height: 1400 });
        await page.goto("/docs/reactions");
        await add(page).click();
        const picker = page.getByRole("toolbar", { name: "Choose a reaction" });
        await expect(picker).toBeVisible();
        await expect(picker.getByRole("button")).toHaveCount(6);

        const trigger = (await add(page).boundingBox())!;
        const panel = (await picker.boundingBox())!;
        expect(panel.y).toBeGreaterThan(trigger.y);
        expect(Math.abs(panel.x - trigger.x)).toBeLessThan(80);

        await picker.getByRole("button", { name: "Ruby" }).click();
        await expect(pill(page, "Ruby, 1, you reacted")).toBeVisible();
        await expect(picker).toBeHidden();
        await expect(add(page)).toBeFocused();
    });

    test("the picker stays inside a narrow viewport", async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 700 });
        await page.goto("/docs/reactions");
        await add(page).scrollIntoViewIfNeeded();
        await add(page).click();
        const panel = (await page.getByRole("toolbar", { name: "Choose a reaction" }).boundingBox())!;
        expect(panel.x).toBeGreaterThanOrEqual(0);
        expect(panel.x + panel.width).toBeLessThanOrEqual(320);
    });

    test("moves through the picker with the arrow keys and Escape returns to the button", async ({ page }) => {
        await page.goto("/docs/reactions");
        await add(page).focus();
        await page.keyboard.press("Enter");
        const picker = page.getByRole("toolbar", { name: "Choose a reaction" });
        const options = picker.getByRole("button");
        await expect(options.first()).toBeFocused();
        await page.keyboard.press("ArrowLeft");
        await expect(options.last()).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(options.first()).toBeFocused();
        await page.keyboard.press("End");
        await expect(options.last()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(picker).toBeHidden();
        await expect(add(page)).toBeFocused();
    });

    test("a pill whose count reaches zero leaves the bar and the rest reflow", async ({ page }) => {
        await page.goto("/docs/reactions");
        await add(page).click();
        await page.getByRole("toolbar").getByRole("button", { name: "Ruby" }).click();
        const party = pill(page, "Ruby, 1, you reacted");
        const addBefore = (await add(page).boundingBox())!;
        await party.click();
        await expect(demo(page).getByRole("button", { name: /^Ruby/ })).toHaveCount(0);
        await expect.poll(async () => (await add(page).boundingBox())!.x).toBeLessThan(addBefore.x);
    });

    test("focus moves to the previous pill when the last, focused pill leaves", async ({ page }) => {
        await page.goto("/docs/reactions");
        await add(page).click();
        await page.getByRole("toolbar").getByRole("button", { name: "Ruby" }).click();
        const party = pill(page, "Ruby, 1, you reacted");
        await party.focus();
        await page.keyboard.press("Enter");
        await expect(demo(page).getByRole("button", { name: /^Ruby/ })).toHaveCount(0);
        await expect(pill(page, "Python, 1")).toBeFocused();
    });

    test("the controlled demo reports each change and persists through value", async ({ page }) => {
        await page.goto("/docs/reactions");
        const controlled = page.locator("#controlled-and-persisted-by-the-parent");
        await controlled.getByRole("button", { name: "Python, 1" }).click();
        await expect(controlled.getByText("Added “python”")).toBeVisible();
        await expect(controlled.getByRole("button", { name: "Python, 2, you reacted" })).toBeVisible();
    });

    test("announces changes through a polite status", async ({ page }) => {
        await page.goto("/docs/reactions");
        await pill(page, "TypeScript, 12").click();
        await expect(demo(page).locator("[role='status']").first()).toHaveText("TypeScript added, 13 total");
    });

    test("with reduced motion everything still works without travel", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/reactions");
        await pill(page, "TypeScript, 12").click();
        await expect(pill(page, "TypeScript, 13, you reacted")).toBeVisible();
        await add(page).click();
        await page.getByRole("toolbar").getByRole("button", { name: "Java" }).click();
        await expect(pill(page, "Java, 1, you reacted")).toBeVisible();
    });
});
