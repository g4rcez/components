import { expect, test, type Locator, type Page } from "@playwright/test";

const expectContinuousMotion = async (locator: Locator, shouldRun: boolean) => {
    await expect
        .poll(() =>
            locator.evaluate((element) =>
                element
                    .getAnimations()
                    .some((animation) => animation.playState === "running" && animation.effect?.getComputedTiming().iterations === Infinity)
            )
        )
        .toBe(shouldRun);
};

const preserveComponentMotionRules = async (page: Page) => {
    // Keep the docs shell's global timing clamp from masking component reduced-motion rules.
    await page.addStyleTag({
        content: `
            @media (prefers-reduced-motion: reduce) {
                .docs-shell .__button[data-loading="true"],
                .docs-shell .__button--theme-loading,
                .docs-shell .__tag[data-loading="true"],
                .docs-shell .__tag--theme-loading,
                .docs-shell .__skeleton,
                .docs-shell .__spinner {
                    animation-duration: 2s !important;
                    animation-iteration-count: infinite !important;
                }
            }
        `,
    });
};

const expectTransformMotion = async (locator: Locator, shouldRun: boolean) => {
    const transformsChanged = await locator.evaluate(async (element) => {
        const transforms = new Set<string>();
        const startedAt = performance.now();

        while (performance.now() - startedAt < 750) {
            transforms.add(getComputedStyle(element).transform);
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        }

        return transforms.size > 1;
    });

    expect(transformsChanged).toBe(shouldRun);
};

for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`loading and task states honor ${reducedMotion} motion preference`, async ({ page }) => {
        const shouldAnimate = reducedMotion === "no-preference";
        await page.emulateMedia({ reducedMotion });

        await page.goto("/docs/buttons");
        await preserveComponentMotionRules(page);
        const button = page.locator('[data-component="button"][data-loading="true"]').first();
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute("aria-busy", "true");
        await expect(button).toHaveText("Loading");
        await expectContinuousMotion(button, shouldAnimate);

        await page.goto("/docs/tags");
        await preserveComponentMotionRules(page);
        const tag = page.locator('[data-component="tag"][data-loading="true"]').first();
        await expect(tag).toBeVisible();
        await expect(tag).toHaveText("Loading");
        await expectContinuousMotion(tag, shouldAnimate);

        await page.goto("/docs/skeleton");
        await preserveComponentMotionRules(page);
        const skeleton = page.locator(".__skeleton").first();
        await expect(skeleton).toBeVisible();
        await expect(skeleton).toHaveAttribute("aria-busy", "true");
        await expectContinuousMotion(skeleton, shouldAnimate);

        await page.goto("/docs/spinner");
        await preserveComponentMotionRules(page);
        const spinner = page.locator('[data-component="spinner"][role="status"]').first();
        await expect(spinner).toBeVisible();
        await expect(spinner).toHaveAttribute("aria-live", "polite");
        await expectContinuousMotion(spinner, shouldAnimate);

        await page.goto("/docs/task-list");
        const taskList = page.locator('[data-component="task-list"]').first();
        const tasks = taskList.locator('input[data-task="true"]');
        await expect(tasks).toHaveCount(3);
        for (let index = 0; index < 3; index += 1) {
            await tasks.nth(index).check();
        }
        const lastTask = tasks.nth(2);
        await expect(lastTask).toBeChecked();
        await expectTransformMotion(lastTask, shouldAnimate);
    });
}

