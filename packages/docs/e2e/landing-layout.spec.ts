import { expect, test } from "@playwright/test";

const box = async (locator: import("@playwright/test").Locator) => (await locator.boundingBox())!;

for (const width of [320, 768, 1440]) {
    test(`the footer GitHub button stays icon-sized at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        const github = page.locator(".site-footer").getByRole("link", { name: "View components on GitHub" });
        await github.scrollIntoViewIfNeeded();
        const { width: w, height: h } = await box(github);
        expect(w).toBeLessThanOrEqual(48);
        expect(h).toBeLessThanOrEqual(48);
    });
}

test("the hero states what the library is, with two ways in", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("React components");
    const hero = page.locator(".landing-hero");
    await expect(hero.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "/docs/get-started");
    await expect(hero.getByRole("link", { name: "Browse components" })).toHaveAttribute("href", "/docs");
    await expect(page).toHaveTitle(/components/);
    expect(await page.locator("head > title").count()).toBe(1);
});

test("the install snippet has package manager tabs and copies the command", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Package manager" });
    await expect(tabs.getByRole("tab", { name: "pnpm" })).toHaveAttribute("aria-selected", "true");
    await tabs.getByRole("tab", { name: "yarn" }).click();
    await page.getByRole("button", { name: "Copy code example" }).first().click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("yarn add @g4rcez/components");
});

test("the showcase is a grid of live compositions, each labelled and linked to its docs", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator(".landing-tile");
    expect(await tiles.count()).toBeGreaterThanOrEqual(12);
    for (const tile of await tiles.all()) {
        await expect(tile.locator(".landing-tile-head").getByRole("heading", { level: 3 })).toBeVisible();
        await expect(tile.getByRole("link", { name: /read the docs$/ })).toHaveAttribute("href", /^\/docs\//);
    }
    for (const id of ["showcase-settings", "showcase-cards", "showcase-reactions", "showcase-deploy", "showcase-danger", "showcase-slider"]) {
        await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
});

test("the showcase compositions are the real, working components", async ({ page }) => {
    await page.goto("/");
    const settings = page.locator("#showcase-settings");
    await settings.scrollIntoViewIfNeeded();
    await settings.getByRole("combobox", { name: /Language/ }).click();
    await page.getByRole("option", { name: /Español/ }).click();
    await expect(settings.getByRole("combobox", { name: /Language/ })).toHaveAccessibleName(/Español/);

    const reactions = page.locator("#showcase-reactions");
    await reactions.getByRole("button", { name: /^Thumbs up, 24/ }).click();
    await expect(reactions.getByRole("button", { name: /^Thumbs up, 25, you reacted/ })).toBeVisible();

    const cards = page.locator("#showcase-cards");
    await cards.scrollIntoViewIfNeeded();
    await expect(cards.getByRole("group", { name: /Lisbon, 1 of 4/ })).toBeVisible();
    await cards.getByRole("button", { name: "Keep" }).click();
    await expect(cards.getByRole("group", { name: /Copenhagen, 2 of 4/ })).toBeVisible();
});

test("the search tile opens the real documentation search", async ({ page }) => {
    await page.goto("/");
    await page.locator("#showcase-search").getByRole("button", { name: "Open search" }).click();
    await expect(page.getByRole("dialog").getByRole("combobox", { name: "Search documentation" })).toBeFocused();
});

for (const { width, columns } of [
    { width: 1440, columns: 3 },
    { width: 768, columns: 2 },
    { width: 390, columns: 1 },
]) {
    test(`the showcase uses ${columns} column(s) at ${width}px without sideways scroll`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        const used = await page.evaluate(() => {
            const lefts = new Set(
                [...document.querySelectorAll<HTMLElement>(".landing-tile")].map((tile) => Math.round(tile.getBoundingClientRect().left))
            );
            return { columns: lefts.size, fits: document.documentElement.scrollWidth <= window.innerWidth };
        });
        expect(used.fits).toBe(true);
        expect(used.columns).toBe(columns);
    });
}

test("the landing page has no floating quick-links button over the content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open quick links" })).toHaveCount(0);
});
