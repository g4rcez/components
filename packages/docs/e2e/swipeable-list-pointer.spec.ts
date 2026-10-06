import { expect, test } from "@playwright/test";

test("SwipeableList reveals and activates both action rails by pointer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto("/docs/swippeable-list");

    const title = page.getByText("Review pull request", { exact: true }).first();
    const surface = title.locator("xpath=../../..");
    const row = surface.locator("xpath=..");
    await expect(surface).toBeVisible();

    const swipe = async (distance: number) => {
        const box = await surface.boundingBox();
        if (!box) {
            throw new Error("SwipeableList row surface is not rendered");
        }

        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + distance, y, { steps: 8 });
        await page.mouse.up();
    };

    await swipe(80);
    const complete = row.getByRole("button", { name: "Complete", exact: true });
    await expect(complete).toBeInViewport();
    await complete.click();
    await expect(page.getByText("complete action selected from the left side.", { exact: true })).toBeVisible();

    await swipe(-80);
    const archive = row.getByRole("button", { name: "Archive", exact: true });
    const remove = row.getByRole("button", { name: "Delete", exact: true });
    await expect(archive).toBeInViewport();
    await expect(remove).toBeInViewport();
    await remove.click();
    await expect(page.getByText("delete action selected from the right side.", { exact: true })).toBeVisible();
});
