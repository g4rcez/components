import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 320, height: 960 } });

const pageOverflow = (page: import("@playwright/test").Page) =>
    page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

const clippedButtons = (page: import("@playwright/test").Page) =>
    page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>(".docs-example-preview button")]
            .filter(
                (button) =>
                    button.getBoundingClientRect().width > 0 &&
                    getComputedStyle(button).overflowX === "hidden" &&
                    button.scrollWidth > button.clientWidth + 1
            )
            .map((button) => button.textContent?.trim())
    );

test("the setup token editor stays inside a 320px viewport", async ({ page }) => {
    await page.goto("/docs/setup");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
});

for (const route of ["wizard", "dropdown", "input"]) {
    test(`buttons on /docs/${route} show their full label at 320px`, async ({ page }) => {
        await page.goto(`/docs/${route}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(await clippedButtons(page)).toEqual([]);
        expect(await pageOverflow(page)).toBeLessThanOrEqual(0);
    });
}

for (const route of ["masonry", "shortcut"]) {
    test(`/docs/${route} hydrates without errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message.slice(0, 160)));
        page.on("console", (message) => message.type() === "error" && errors.push(message.text().slice(0, 160)));
        await page.goto(`/docs/${route}`);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await page.waitForTimeout(1000);
        expect(errors).toEqual([]);
    });
}

test("the InputField info button has a touch-sized hit area around its 12px icon", async ({ page }) => {
    await page.goto("/docs/input-field");
    const info = page.getByRole("button", { name: "Generate a key from your account settings." });
    await info.scrollIntoViewIfNeeded();
    const box = (await info.boundingBox())!;
    const hits = await info.evaluate(
        (button, { x, y }) =>
            [x - 9, x + 9]
                .map((px) => document.elementFromPoint(px, y)?.closest("button") === button)
                .concat([y - 9, y + 9].map((py) => document.elementFromPoint(x, py)?.closest("button") === button)),
        {
            x: box.x + box.width / 2,
            y: box.y + box.height / 2,
        }
    );
    expect(hits).toEqual([true, true, true, true]);
});
