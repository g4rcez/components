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

test("the preview triggers read as buttons and are tall enough to tap", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Click", "Menu"]) {
        const trigger = page.locator(".landing-demo-controls").getByRole("button", { name, exact: true });
        const style = await trigger.evaluate((el) => ({ border: getComputedStyle(el).borderTopWidth, height: el.getBoundingClientRect().height }));
        expect(style.border).not.toBe("0px");
        expect(style.height).toBeGreaterThanOrEqual(32);
    }
});

test("the window switches between the live preview and its source", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: /Small pieces/ })).toBeVisible();

    await page.getByRole("tab", { name: "Code" }).click();
    await expect(page.getByRole("region", { name: "tsx code example" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Small pieces/ })).toHaveCount(0);
});

test("the live composition sits beside the demo from 1024px and stacks below it", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/");
    const stacked = { demo: await box(page.locator(".landing-demo")), side: await box(page.locator(".landing-stage-side")) };
    expect(stacked.side.y).toBeGreaterThanOrEqual(stacked.demo.y + stacked.demo.height - 1);

    await page.setViewportSize({ width: 1280, height: 900 });
    const wide = { demo: await box(page.locator(".landing-demo")), side: await box(page.locator(".landing-stage-side")) };
    expect(wide.side.x).toBeGreaterThanOrEqual(wide.demo.x + wide.demo.width - 1);
});

test("the landing page has no floating quick-links button over the content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open quick links" })).toHaveCount(0);
});
