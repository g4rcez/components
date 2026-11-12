import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 320]) {
    test(`landing and documentation fit a ${width}px viewport`, async ({ page }) => {
        await page.setViewportSize({ width, height: 960 });
        for (const path of ["/", "/docs", "/docs/buttons"]) {
            await page.goto(path);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        }
    });
}

test("Ctrl+K opens the search palette from the landing page and follows a result", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    const search = dialog.getByRole("combobox", { name: "Search documentation" });
    await expect(search).toBeFocused();
    await search.fill("buttons");
    await dialog.getByRole("option", { name: "Buttons", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/buttons$/);
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Buttons" })).toBeVisible();
});

test("search matches prop names and jumps to examples", async ({ page }) => {
    await page.goto("/docs");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog");
    const search = dialog.getByRole("combobox", { name: "Search documentation" });
    await search.fill("panelWidth");
    await expect(dialog.getByRole("option", { name: "MorphSelect", exact: true })).toBeVisible();

    await search.fill("Reactions: Controlled");
    await dialog
        .getByRole("option", { name: /Reactions: Controlled/ })
        .first()
        .click();
    await expect(page).toHaveURL(/\/docs\/reactions#controlled-and-persisted-by-the-parent$/);
});

test("desktop: slash opens the palette, an unknown query says so, Escape closes it", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs");
    await page.keyboard.press("/");
    const dialog = page.getByRole("dialog");
    const search = dialog.getByRole("combobox", { name: "Search documentation" });
    await expect(search).toBeFocused();
    await search.fill("no-such-component");
    await expect(dialog.getByText("No documentation matches your search.")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(
        page.getByRole("navigation", { name: "Documentation navigation", exact: true }).getByRole("link", { name: "Introduction", exact: true })
    ).toHaveAttribute("aria-current", "page");
});

test("the header search button opens the palette", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs");
    await page.getByRole("button", { name: "Search documentation" }).click();
    await expect(page.getByRole("dialog").getByRole("combobox", { name: "Search documentation" })).toBeFocused();
});

test("mobile: the drawer lists the docs, hands off to search, and restores the trigger on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs");
    const trigger = page.getByRole("button", { name: "Open documentation navigation" });
    await trigger.click();
    const drawer = page.getByRole("dialog", { name: "Documentation" });
    await expect(drawer.getByRole("link", { name: "Buttons", exact: true })).toBeVisible();
    await expect(drawer.getByRole("button", { name: "Search documentation" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await drawer.getByRole("button", { name: "Search documentation" }).click();
    await expect(page.getByRole("combobox", { name: "Search documentation" })).toBeFocused();
});

test("theme switch and code copy work on the landing page", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    // The site follows the system preference until a choice is made, so start from a known scheme.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    // The choice is remembered: it beats the system preference after a reload.
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("button", { name: "Copy code example" }).first().click();
    await expect(page.getByRole("button", { name: "Copied code example" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @g4rcez/components");
});

test("mobile page outline expands with the keyboard and preserves section anchors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/docs");
    const outline = page.locator("details");
    const summary = outline.locator("summary");
    await expect(summary).toBeVisible();
    await expect(outline).not.toHaveAttribute("open");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(outline).toHaveAttribute("open");
    await outline.getByRole("link", { name: "Installation", exact: true }).click();
    await expect(page).toHaveURL(/#installation-title$/);
});

test("skip link reaches the main content and the page outline navigates to a section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.getByRole("navigation", { name: "Page sections" }).getByRole("link", { name: "Installation", exact: true }).click();
    await expect(page).toHaveURL(/#installation-title$/);
});
