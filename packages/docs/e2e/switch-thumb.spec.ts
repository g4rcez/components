import { expect, test } from "@playwright/test";

test("a checked Switch keeps its thumb inside the track, with equal insets on both ends", async ({ page }) => {
    await page.goto("/docs/switch");
    const edges = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>(".__switch__track")].slice(0, 6).map((track) => {
            const thumb = track.querySelector<HTMLElement>(".__switch__thumb")!.getBoundingClientRect();
            const box = track.getBoundingClientRect();
            return { checked: track.dataset.checked, left: Math.round(thumb.left - box.left), right: Math.round(box.right - thumb.right) };
        })
    );
    expect(edges.length).toBeGreaterThan(0);
    for (const { checked, left, right } of edges) {
        expect(left).toBeGreaterThanOrEqual(0);
        expect(right).toBeGreaterThanOrEqual(0);
        if (checked === "true") expect(right).toBe(2);
        else expect(left).toBe(2);
    }
});
