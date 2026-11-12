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

async function renderedContrastRatio(
    locator: Locator,
    foregroundProperty: "color" | "borderTopColor" | "borderBottomColor" | "outlineColor" | "boxShadow" = "color"
): Promise<number> {
    return locator.evaluate(async (target, property) => {
        const ancestors: Element[] = [];
        for (let current: Element | null = target; current; current = current.parentElement) {
            ancestors.push(current);
        }

        const colorSnapshot = () =>
            ancestors
                .map((element) => {
                    const style = getComputedStyle(element);
                    return `${style[property]}|${style.backgroundColor}`;
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
        // A computed box-shadow reads "rgb(...) 0px 0px 0px 2px": keep only the color part.
        const colorValue = property === "boxShadow" ? (style.boxShadow.match(/rgba?\([^)]*\)/)?.[0] ?? "") : style[property];
        const foreground = composite(parseColor(colorValue), background);
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
    }, foregroundProperty);
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

test("Input border is a soft outline, between 1.4:1 and 3:1, in both themes", async ({ page }) => {
    await page.goto("/docs/input");
    await expect(page.getByRole("heading", { level: 1, name: "Input" })).toBeVisible();
    const control = page.locator(".__input-field__control").first();
    await expect(control).toBeVisible();

    for (const theme of ["light", "dark"] as const) {
        await setTheme(page, theme);
        const ratio = await renderedContrastRatio(control, "borderTopColor");
        // Deliberately soft: visible, but below the 3:1 of a high-contrast outline.
        expect(ratio, `${theme} Input border contrast (${ratio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(1.4);
        expect(ratio, `${theme} Input border contrast (${ratio.toFixed(2)}:1)`).toBeLessThan(3);
    }
});

test("Input focus ring is 2px and meets 3:1 non-text contrast without moving the layout in both themes", async ({ page }) => {
    await page.goto("/docs/input");
    await expect(page.getByRole("heading", { level: 1, name: "Input" })).toBeVisible();
    const control = page.locator(".__input-field__control").first();
    const field = control.locator("input").first();
    await expect(control).toBeVisible();

    for (const theme of ["light", "dark"] as const) {
        await setTheme(page, theme);
        await field.blur();
        const restingHeight = (await control.boundingBox())?.height;
        expect(await control.evaluate((element) => getComputedStyle(element).boxShadow), `${theme} resting Input has no ring`).toBe("none");

        await field.focus();
        await expect(field).toBeFocused();
        const ringWidth = await control.evaluate((element) => Number.parseFloat(getComputedStyle(element).boxShadow.split(" ").at(-1) ?? "0"));
        expect(ringWidth, `${theme} Input focus ring width`).toBeGreaterThanOrEqual(2);
        const ratio = await renderedContrastRatio(control, "boxShadow");
        expect(ratio, `${theme} Input focus ring contrast (${ratio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(3);
        expect((await control.boundingBox())?.height, `${theme} Input height with focus`).toBe(restingHeight);
    }
});

test("MultiSelect search border is a soft outline, between 1.4:1 and 3:1, in both themes", async ({ page }) => {
    await page.goto("/docs/multiselect");
    await expect(page.getByRole("heading", { level: 1, name: "MultiSelect" })).toBeVisible();

    for (const theme of ["light", "dark"] as const) {
        await setTheme(page, theme);
        await page.getByRole("combobox").first().click();
        const search = page.locator(".__multi-select__search").first();
        await expect(search).toBeFocused();
        // The open panel focuses the search input, which swaps the border to --primary. Measure the resting border.
        await search.evaluate((element) => (element as HTMLInputElement).blur());
        await expect(search).not.toBeFocused();
        const ratio = await renderedContrastRatio(search, "borderBottomColor");
        expect(ratio, `${theme} MultiSelect search border contrast (${ratio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(1.4);
        expect(ratio, `${theme} MultiSelect search border contrast (${ratio.toFixed(2)}:1)`).toBeLessThan(3);
        await page.keyboard.press("Escape");
        await expect(search).toBeHidden();
    }
});

test("The Menu and Dropdown surface borders stay soft hairlines in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
        await page.goto("/docs/dropdown");
        await expect(page.getByRole("heading", { level: 1, name: "Dropdown" })).toBeVisible();
        await setTheme(page, theme);
        await page.getByRole("button", { name: "Controlled", exact: true }).click();
        const dropdown = page.locator(".__dropdown").first();
        await expect(dropdown).toBeVisible();
        const dropdownRatio = await renderedContrastRatio(dropdown, "borderTopColor");
        // A deliberately soft border: the Dropdown is separated from the page by its shadow, so it is a hairline, not a 3:1 outline.
        expect(dropdownRatio, `${theme} Dropdown surface border contrast (${dropdownRatio.toFixed(2)}:1)`).toBeGreaterThan(1.05);
        expect(dropdownRatio, `${theme} Dropdown surface border contrast (${dropdownRatio.toFixed(2)}:1)`).toBeLessThan(2);

        await page.goto("/docs/menu");
        await expect(page.getByRole("heading", { level: 1, name: "Menu" })).toBeVisible();
        await setTheme(page, theme);
        await page.getByRole("button", { name: "Languages", exact: true }).first().click();
        const menu = page.locator(".__menu__floating").first();
        await expect(menu).toBeVisible();
        const menuRatio = await renderedContrastRatio(menu, "borderTopColor");
        expect(menuRatio, `${theme} Menu surface border contrast (${menuRatio.toFixed(2)}:1)`).toBeGreaterThan(1.05);
        expect(menuRatio, `${theme} Menu surface border contrast (${menuRatio.toFixed(2)}:1)`).toBeLessThan(2);
    }
});

test("active MenuItem text meets 7:1 contrast when focused or hovered in both themes", async ({ page }) => {
    for (const theme of ["light", "dark"] as const) {
        await page.goto("/docs/menu");
        await expect(page.getByRole("heading", { level: 1, name: "Menu" })).toBeVisible();
        await setTheme(page, theme);
        await page.getByRole("button", { name: "Languages", exact: true }).first().click();
        const item = page.getByRole("menuitem", { name: "Go", exact: true }).first();
        await expect(item).toBeVisible();

        await item.focus();
        await expect(item).toBeFocused();
        const focusRatio = await renderedContrastRatio(item);
        expect(focusRatio, `${theme} focused MenuItem text contrast (${focusRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(7);

        await page.getByRole("menuitem", { name: /^Rust/ }).first().focus();
        await item.hover();
        const hoverRatio = await renderedContrastRatio(item);
        expect(hoverRatio, `${theme} hovered MenuItem text contrast (${hoverRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(7);
    }
});

test("Notification close button icon and focus ring meet 3:1 non-text contrast in every theme", async ({ page }) => {
    for (const mode of ["light", "dark"] as const) {
        for (const theme of ["default", "info", "warn", "muted", "danger", "success", "secondary"] as const) {
            await page.goto("/docs/notification");
            await expect(page.getByRole("heading", { level: 1, name: "Notifications" })).toBeVisible();
            await setTheme(page, mode);
            await page
                .getByRole("button", { name: `Trigger ${theme}`, exact: true })
                .first()
                .click();

            const close = page.locator(`.__notifications--theme-${theme} .__notifications__close`).first();
            await expect(close).toBeVisible();
            // Keyboard focus, so that :focus-visible matches.
            await page.keyboard.press("Tab");
            await close.focus();
            await expect(close).toBeFocused();

            const iconRatio = await renderedContrastRatio(close, "color");
            expect(iconRatio, `${mode} ${theme} close icon contrast (${iconRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(3);
            const ringRatio = await renderedContrastRatio(close, "outlineColor");
            expect(ringRatio, `${mode} ${theme} close focus ring contrast (${ringRatio.toFixed(2)}:1)`).toBeGreaterThanOrEqual(3);
        }
    }
});
