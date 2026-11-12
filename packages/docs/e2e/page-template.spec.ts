import { expect, test } from "@playwright/test";

test.describe("component page template", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("one scrolling page with Examples, usage, API reference and accessibility", async ({ page }) => {
        await page.goto("/docs/buttons");
        await expect(page.getByRole("heading", { level: 1, name: "Buttons" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: "Examples" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 3, name: "Button Themes" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: "When to use Buttons" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: "API reference" })).toBeVisible();
        await expect(page.getByRole("heading", { level: 2, name: "Accessibility" })).toHaveCount(1);
        await expect(page.getByRole("tab")).toHaveCount(0);
    });

    test("the API reference is generated from the markdown", async ({ page }) => {
        await page.goto("/docs/buttons");
        const table = page.getByRole("table", { name: /Prop reference/ });
        await expect(table).toBeVisible();
        const theme = table.getByRole("row").filter({ has: page.getByRole("rowheader", { name: "theme" }) });
        await expect(theme).toContainText('"main"');
        await expect(theme).toContainText('"ghost-neutral"');
        // the default is its own cell, not wrapped mid-word
        await expect(theme.getByRole("cell").nth(1)).toHaveText('"main"');
    });

    test("components with several tables keep each one attributable", async ({ page }) => {
        await page.goto("/docs/select");
        await expect(page.getByRole("heading", { name: "OptionProps" })).toBeVisible();
        await expect(page.getByRole("table", { name: /OptionProps/ })).toBeVisible();
    });

    test("the import statement is shown with a copy button", async ({ page, context }) => {
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        await page.goto("/docs/morph-select");
        await expect(page.getByText("import { MorphSelect } from '@g4rcez/components'")).toBeVisible();
        await page.getByRole("button", { name: "Copy import statement" }).click();
        await expect(page.getByRole("button", { name: "Copied import statement" })).toBeVisible();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("import { MorphSelect } from '@g4rcez/components'");
    });

    test("an old ?tab= link lands on its section", async ({ page }) => {
        await page.goto("/docs/buttons?tab=usage");
        await expect(page.getByRole("heading", { name: "When to use Buttons" })).toBeInViewport();
        await expect(page).not.toHaveURL(/tab=/);
    });

    test("a section anchor still lands on its heading after the generated sections arrive", async ({ page }) => {
        await page.goto("/docs/buttons#accessibility-notes");
        await expect(page.getByRole("heading", { level: 2, name: "Accessibility" })).toBeInViewport();
    });

    test("the outline lists the generated sections", async ({ page }) => {
        await page.goto("/docs/buttons");
        const outline = page.getByRole("complementary", { name: "On this page" });
        await expect(outline.getByRole("link", { name: "Button Themes" })).toBeVisible();
        await expect(outline.getByRole("link", { name: "API reference" })).toBeVisible();
        await expect(outline.getByRole("link", { name: "Accessibility" })).toBeVisible();
    });

    test("demo source is opt-in: Show code reveals it and Hide code removes it", async ({ page }) => {
        await page.goto("/docs/buttons");
        const demo = page.getByRole("region", { name: "Button Themes" });
        await expect(demo.getByRole("region", { name: "tsx code example" })).toHaveCount(0);
        await demo.getByRole("button", { name: "Show code" }).click();
        await expect(demo.getByRole("region", { name: "tsx code example" })).toBeVisible();
        await demo.getByRole("button", { name: "Hide code" }).click();
        await expect(demo.getByRole("region", { name: "tsx code example" })).toHaveCount(0);
    });

    test("a long token table is clamped until revealed", async ({ page }) => {
        await page.goto("/docs/input");
        const more = page.getByRole("button", { name: /Show all \d+ tokens/ });
        await expect(more).toHaveAttribute("aria-expanded", "false");
        await more.click();
        await expect(page.getByRole("button", { name: "Show fewer tokens" })).toHaveAttribute("aria-expanded", "true");
    });

    test("guide pages keep a plain reading flow: no API reference", async ({ page }) => {
        await page.goto("/docs/get-started");
        await expect(page.getByRole("heading", { level: 2, name: "API reference" })).toHaveCount(0);
        await expect(page.getByRole("tab")).toHaveCount(0);
    });

    test("every page has exactly one document title that names it", async ({ page }) => {
        await page.goto("/docs/buttons");
        await expect(page).toHaveTitle("Buttons — components");
        expect(await page.locator("head > title").count()).toBe(1);
    });
});
