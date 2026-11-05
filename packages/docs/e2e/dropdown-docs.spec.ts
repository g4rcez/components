import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 800 } });

test("the Dropdown docs page renders without hydration errors or nested buttons", async ({ page }) => {
    const problems: string[] = [];
    page.on("pageerror", (error) => problems.push(error.message));
    page.on("console", (message) => {
        if (message.type() === "error") problems.push(message.text());
    });

    await page.goto("/docs/dropdown", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Dropdown", level: 1 })).toBeVisible();

    expect(await page.locator("button button").count()).toBe(0);
    expect(problems.filter((problem) => /hydrat|descendant|nested/i.test(problem))).toEqual([]);
});

test("a Button trigger opens its Dropdown panel and reports its state", async ({ page }) => {
    await page.goto("/docs/dropdown", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Controlled", exact: true });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Controlled panel" })).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Controlled panel" })).toBeHidden();
});
