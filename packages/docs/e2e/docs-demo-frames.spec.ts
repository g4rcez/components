import { expect, test } from "@playwright/test";

const frame = (page: import("@playwright/test").Page, route: string) =>
    page.goto(route).then(() =>
        page.evaluate(() => {
            const preview = document.querySelector<HTMLElement>(".docs-example-preview")!;
            const card = preview.querySelector<HTMLElement>("[data-component='card']")!;
            const p = preview.getBoundingClientRect();
            const c = card.getBoundingClientRect();
            return {
                border: getComputedStyle(card).borderTopWidth,
                background: getComputedStyle(card).backgroundColor,
                insetX: Math.round(c.left - p.left),
                insetY: Math.round(c.top - p.top),
            };
        })
    );

test("a demo's titled Card adds no second frame inside the example panel", async ({ page }) => {
    expect(await frame(page, "/docs/buttons")).toEqual({ border: "0px", background: "rgba(0, 0, 0, 0)", insetX: 24, insetY: 24 });
});

test("pages that demonstrate Card itself keep its frame", async ({ page }) => {
    const { border } = await frame(page, "/docs/cards");
    expect(border).not.toBe("0px");
});
