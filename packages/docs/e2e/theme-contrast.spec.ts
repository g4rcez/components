import { expect, test, type Locator, type Page } from "@playwright/test";

type Theme = "light" | "dark";

async function setTheme(page: Page, theme: Theme): Promise<void> {
    const root = page.locator("html");
    const currentlyDark = await root.evaluate((element) => element.classList.contains("dark"));
    const shouldBeDark = theme === "dark";

    if (currentlyDark !== shouldBeDark) {
        await page.getByRole("button", { name: `Switch to ${theme} mode` }).click();
        await expect.poll(() => root.evaluate((element) => element.classList.contains("dark"))).toBe(shouldBeDark);
    }
}

async function renderedContrastRatio(locator: Locator): Promise<number> {
    return locator.evaluate(async (target) => {
        const ancestors: Element[] = [];
        for (let current: Element | null = target; current; current = current.parentElement) {
            ancestors.push(current);
        }

        const colorSnapshot = () =>
            ancestors
                .map((element) => {
                    const style = getComputedStyle(element);
                    return `${style.color}|${style.backgroundColor}`;
                })
                .join("|");

        let previous = colorSnapshot();
        let stableFrames = 0;
        for (let frame = 0; frame < 120 && stableFrames < 3; frame++) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            const current = colorSnapshot();
            stableFrames = current === previous ? stableFrames + 1 : 0;
            previous = current;
        }
        if (stableFrames < 3) throw new Error("Rendered colors did not settle before contrast measurement.");

        type Color = { red: number; green: number; blue: number; alpha: number };
        const parseColor = (value: string): Color => {
            const channels = value.match(/[\d.]+/g)?.map(Number);
            if (!channels || channels.length < 3) throw new Error(`Unsupported computed color: ${value}`);
            return {
                red: channels[0],
                green: channels[1],
                blue: channels[2],
                alpha: channels[3] ?? 1,
            };
        };
        const composite = (source: Color, destination: Color): Color => {
            const alpha = source.alpha + destination.alpha * (1 - source.alpha);
            if (alpha === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
            return {
                red: (source.red * source.alpha + destination.red * destination.alpha * (1 - source.alpha)) / alpha,
                green: (source.green * source.alpha + destination.green * destination.alpha * (1 - source.alpha)) / alpha,
                blue: (source.blue * source.alpha + destination.blue * destination.alpha * (1 - source.alpha)) / alpha,
                alpha,
            };
        };
        const style = getComputedStyle(target);
        let background = { red: 255, green: 255, blue: 255, alpha: 1 };
        for (const ancestor of ancestors) {
            const layer = parseColor(getComputedStyle(ancestor).backgroundColor);
            background = composite(layer, background);
            if (layer.alpha === 1) break;
        }
        const foreground = composite(parseColor(style.color), background);
        const luminance = ({ red, green, blue }: Color): number => {
            const linearize = (channel: number) => {
                const normalized = channel / 255;
                return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
            };
            return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
        };
        const foregroundLuminance = luminance(foreground);
        const backgroundLuminance = luminance(background);
        const [lighter, darker] = [foregroundLuminance, backgroundLuminance].sort((a, b) => b - a);
        return (lighter + 0.05) / (darker + 0.05);
    });
}

function expectNormalTextContrast(ratio: number, state: string): void {
    const description = `${state} rendered contrast (${ratio.toFixed(2)}:1)`;
    expect(ratio, description).toBeGreaterThanOrEqual(4.5);
}

test("warning Button text remains legible in both themes", async ({ page }) => {
    await page.goto("/docs/buttons");
    await expect(page.getByRole("heading", { level: 1, name: "Buttons" })).toBeVisible();

    const warningButton = page.locator(".__button--theme-warn").first();
    const ghostWarningButton = page.locator(".__button--theme-ghost-warn").first();
    await expect(warningButton).toBeVisible();
    await expect(ghostWarningButton).toBeVisible();

    for (const theme of ["light", "dark"] as const) {
        await setTheme(page, theme);
        expectNormalTextContrast(await renderedContrastRatio(warningButton), `${theme} solid warning Button`);
        expectNormalTextContrast(await renderedContrastRatio(ghostWarningButton), `${theme} ghost warning Button`);
    }
});

test("secondary Alert and Notification text remains legible in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
        await page.goto("/docs/alert");
        await expect(page.getByRole("heading", { level: 1, name: "Alert" })).toBeVisible();
        await setTheme(page, theme);

        const alertText = page.locator(".__alert--theme-secondary .__alert__body p");
        await expect(alertText).toBeVisible();
        expectNormalTextContrast(await renderedContrastRatio(alertText), `${theme} secondary Alert`);

        await page.goto("/docs/notification");
        await expect(page.getByRole("heading", { level: 1, name: "Notifications" })).toBeVisible();
        await setTheme(page, theme);
        await page.getByRole("button", { name: "Trigger secondary", exact: true }).click();

        const notificationText = page.locator(".__notifications--theme-secondary .__notifications__description");
        await expect(notificationText).toBeVisible();
        expectNormalTextContrast(await renderedContrastRatio(notificationText), `${theme} secondary Notification`);
    }
});

test("active Autocomplete option text remains legible in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
        await page.goto("/docs/autocomplete");
        await expect(page.getByRole("heading", { level: 1, name: "Autocomplete" })).toBeVisible();
        await setTheme(page, theme);

        const fieldSizes = page.getByRole("region", { name: /Field Sizes/ });
        const autocomplete = fieldSizes.getByRole("combobox", { name: "Normal autocomplete" });
        await autocomplete.click();
        await page.getByRole("option", { name: "JavaScript", exact: true }).click();
        await autocomplete.click();
        await autocomplete.fill("Java");

        const activeOption = page.getByRole("option", { name: "JavaScript", exact: true });
        await expect(activeOption).toBeVisible();
        await expect(activeOption).toHaveAttribute("aria-selected", "true");
        await expect(activeOption).toHaveClass(/__autocomplete__option--active/);
        await expect(activeOption).not.toHaveClass(/__autocomplete__option--selected/);
        expectNormalTextContrast(await renderedContrastRatio(activeOption), `${theme} active Autocomplete option`);
    }
});
