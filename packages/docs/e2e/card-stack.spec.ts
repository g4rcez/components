import { expect, test, type Locator, type Page } from "@playwright/test";

const demo = (page: Page) => page.locator("#language-shortlist");
const stack = (page: Page) => demo(page).getByRole("group", { name: "Cards" });
const topCard = (page: Page, name: string | RegExp) => demo(page).getByRole("group", { name });
const status = (page: Page) => demo(page).locator("p[role='status']");

const centerOf = async (locator: Locator) => {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) throw new Error("Element has no bounds");
    return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
};

const drag = async (page: Page, locator: Locator, dx: number, options: { steps?: number; pause?: number } = {}) => {
    const { x, y } = await centerOf(locator);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx / 2, y, { steps: options.steps ?? 8 });
    if (options.pause) await page.waitForTimeout(options.pause);
    await page.mouse.move(x + dx, y, { steps: options.steps ?? 8 });
    if (options.pause) await page.waitForTimeout(options.pause);
    await page.mouse.up();
};

const translateX = (locator: Locator) => locator.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).e);

test.describe("CardStack", () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test("renders four cards deep and exposes only the top one", async ({ page }) => {
        await page.goto("/docs/card-stack");
        await expect(demo(page).locator("[data-depth]")).toHaveCount(4);
        await expect(topCard(page, "Rust, 1 of 4")).toBeVisible();
        await expect(demo(page).locator("[data-top='false']")).toHaveCount(3);
        for (const hidden of await demo(page).locator("[data-top='false']").all()) await expect(hidden).toHaveAttribute("aria-hidden", "true");
    });

    test("a far drag throws the card off and the next one rises into place", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        await drag(page, card, 260, { pause: 60 });
        await expect(status(page)).toHaveText("Rust queued");
        await expect(topCard(page, "Go, 2 of 4")).toBeVisible();
        await expect(demo(page).getByRole("group", { name: "Rust, 1 of 4" })).toHaveCount(0, { timeout: 3000 });
        await expect.poll(() => centerOf(topCard(page, "Go, 2 of 4")).then((rect) => Math.round(rect.box.y)), { timeout: 2000 }).toBeGreaterThan(0);
    });

    test("dragging left skips", async ({ page }) => {
        await page.goto("/docs/card-stack");
        await drag(page, topCard(page, "Rust, 1 of 4"), -260, { pause: 60 });
        await expect(status(page)).toHaveText("Rust skipped");
    });

    test("a short, slow drag snaps back without deciding", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        await drag(page, card, 40, { steps: 4, pause: 180 });
        await expect.poll(() => translateX(card), { timeout: 2500 }).toBeCloseTo(0, 0);
        await expect(card).toBeVisible();
        await expect(status(page)).toHaveText("Decide a card to see it here.");
    });

    test("a quick flick decides even after a short move", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        // A flick is recognised by speed, and speed depends on real frame timing, so a loaded machine can
        // legitimately produce a slow one. Allow a few attempts: each one is a short move well under the
        // distance threshold, so only a fast release can decide the card.
        let decided = false;
        for (let attempt = 0; attempt < 3 && !decided; attempt++) {
            const { x, y } = await centerOf(card);
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(x + 36, y);
            await page.waitForTimeout(16);
            await page.mouse.move(x + 72, y);
            await page.mouse.up();
            decided = await expect(status(page))
                .toHaveText("Rust queued", { timeout: 1500 })
                .then(
                    () => true,
                    () => false
                );
            if (!decided)
                await expect
                    .poll(() => card.evaluate((element) => Math.round(new DOMMatrix(getComputedStyle(element).transform).e)), { timeout: 3000 })
                    .toBe(0);
        }
        expect(decided).toBe(true);
    });

    test("the card tilts and shows its stamp while it is dragged", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        const { x, y } = await centerOf(card);
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 150, y, { steps: 10 });
        const matrix = await card.evaluate((element) => getComputedStyle(element).transform);
        expect(matrix).not.toBe("none");
        const stamp = demo(page).locator(".__card-stack__stamp-right");
        await expect.poll(() => stamp.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.8);
        await expect(demo(page).locator(".__card-stack__stamp-left")).toHaveCSS("opacity", "0");
        await page.mouse.up();
    });

    test("buttons decide and undo returns the card", async ({ page }) => {
        await page.goto("/docs/card-stack");
        await demo(page).getByRole("button", { name: "Skip" }).click();
        await expect(status(page)).toHaveText("Rust skipped");
        await expect(topCard(page, "Go, 2 of 4")).toBeVisible();
        await demo(page).getByRole("button", { name: "Undo" }).click();
        await expect(status(page)).toHaveText("Rust is back on top");
        await expect(topCard(page, "Rust, 1 of 4")).toBeVisible();
        await expect(demo(page).getByRole("button", { name: "Undo" })).toBeDisabled();
    });

    test("the keyboard decides with the arrows and undoes with Backspace", async ({ page }) => {
        await page.goto("/docs/card-stack");
        await stack(page).focus();
        await page.keyboard.press("ArrowRight");
        await expect(status(page)).toHaveText("Rust queued");
        await page.keyboard.press("ArrowLeft");
        await expect(status(page)).toHaveText("Go skipped");
        await page.keyboard.press("Backspace");
        await expect(status(page)).toHaveText("Go is back on top");
        await expect(topCard(page, "Go, 2 of 4")).toBeVisible();
    });

    test("an exhausted deck offers Start over, which brings every card back", async ({ page }) => {
        await page.goto("/docs/card-stack");
        for (let index = 0; index < 4; index++) await demo(page).getByRole("button", { name: "Learn" }).click();
        const startOver = demo(page).getByRole("button", { name: "Start over" });
        await expect(startOver).toBeVisible();
        await expect(demo(page).getByRole("button", { name: "Learn" })).toBeDisabled();
        await startOver.click();
        await expect(status(page)).toHaveText("Deck restarted");
        await expect(topCard(page, "Rust, 1 of 4")).toBeVisible();
    });

    test.describe("touch", () => {
        test.use({ hasTouch: true, viewport: { width: 390, height: 700 } });

        test("swipes decide and the card leaves vertical scrolling to the page", async ({ page }) => {
            await page.goto("/docs/card-stack");
            const card = topCard(page, "Rust, 1 of 4");
            await card.scrollIntoViewIfNeeded();
            await expect(card).toHaveCSS("touch-action", "pan-y");
            const client = await page.context().newCDPSession(page);
            const { x, y } = await centerOf(card);
            await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
            for (let step = 1; step <= 8; step++)
                await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + step * 25, y }] });
            await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await expect(status(page)).toHaveText("Rust queued");
        });
    });

    test("cards get shorter and Undo becomes icon-only in narrow containers", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const wideStage = (await demo(page).locator(".__card-stack__stage").boundingBox())!;
        expect(wideStage.height / wideStage.width).toBeGreaterThan(1.2);
        await expect(demo(page).locator(".__card-stack__undo-label")).toHaveCSS("position", "static");

        await page.setViewportSize({ width: 340, height: 800 });
        const narrowStage = (await demo(page).locator(".__card-stack__stage").boundingBox())!;
        expect(narrowStage.height / narrowStage.width).toBeLessThan(1.1);
        const label = demo(page).locator(".__card-stack__undo-label");
        await expect(label).toHaveCSS("position", "absolute");
        await expect(demo(page).getByRole("button", { name: "Undo" })).toBeVisible();
    });

    test("with reduced motion a decided card fades in place instead of travelling", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        const samples = card.evaluate(
            (element) =>
                new Promise<number[]>((resolve) => {
                    const xs: number[] = [];
                    const start = performance.now();
                    const tick = () => {
                        xs.push(Math.round(new DOMMatrix(getComputedStyle(element).transform).e));
                        if (performance.now() - start < 500) requestAnimationFrame(tick);
                        else resolve(xs);
                    };
                    tick();
                })
        );
        await demo(page).getByRole("button", { name: "Learn" }).click();
        const xs = await samples;
        expect(Math.max(...xs.map(Math.abs))).toBeLessThan(2);
        await expect(status(page)).toHaveText("Rust queued");
    });

    test("a travelling throw moves the card well off its home position", async ({ page }) => {
        await page.goto("/docs/card-stack");
        const card = topCard(page, "Rust, 1 of 4");
        const samples = card.evaluate(
            (element) =>
                new Promise<number[]>((resolve) => {
                    const xs: number[] = [];
                    const start = performance.now();
                    const tick = () => {
                        xs.push(Math.round(new DOMMatrix(getComputedStyle(element).transform).e));
                        if (performance.now() - start < 500) requestAnimationFrame(tick);
                        else resolve(xs);
                    };
                    tick();
                })
        );
        await demo(page).getByRole("button", { name: "Learn" }).click();
        expect(Math.max(...(await samples).map(Math.abs))).toBeGreaterThan(150);
    });
});
