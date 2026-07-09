import { expect, type Locator, type Page, test } from "@playwright/test";

const example = (page: Page, id: string) => page.locator(`section#${id}`);

const openDatePicker = async (page: Page, section: Locator) => {
    await section.getByRole("button", { name: /open a date picker/i }).click();
    const dialog = page.getByRole("dialog").last();
    await expect(dialog).toBeVisible();
    return dialog;
};

test.describe("DatePicker docs examples", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/docs/date-picker");
    });

    test("basic example picks today from the calendar dropdown", async ({ page }) => {
        const section = example(page, "basic-date-picker");
        const input = section.getByLabel("Birth date");
        await expect(input).toHaveValue("");

        const dialog = await openDatePicker(page, section);
        await dialog.getByRole("button", { name: "Today" }).click();

        await expect(input).not.toHaveValue("");
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
    });

    test("controlled example updates the selected date text and closes on date click", async ({ page }) => {
        const section = example(page, "controlled-value");
        const dialog = await openDatePicker(page, section);

        await dialog.locator('button[aria-current="date"]').click();

        await expect(section.getByText(/^Selected:/).first()).toBeVisible();
        await expect(page.getByRole("dialog")).toHaveCount(0);
    });

    test("range example stages a preset and applies it to the input", async ({ page }) => {
        const section = example(page, "date-range-picker");
        const input = section.getByLabel("Report period");
        const dialog = await openDatePicker(page, section);

        await dialog.getByRole("option", { name: "Last 7 days" }).click();
        await expect(dialog.getByRole("option", { name: "Last 7 days" })).toHaveAttribute("aria-selected", "true");
        await dialog.getByRole("button", { name: "Apply" }).click();

        await expect(input).toHaveValue(/.+ – .+/);
        await expect(page.getByRole("dialog")).toHaveCount(0);
    });

    test("localized range example uses localized list and action labels", async ({ page }) => {
        const section = example(page, "localized-range-picker");
        const input = section.getByLabel("Período");
        const dialog = await openDatePicker(page, section);

        await expect(dialog.getByRole("listbox", { name: "Atalhos de período" })).toBeVisible();
        await dialog.getByRole("button", { name: "Hoje" }).click();
        await dialog.getByRole("button", { name: "Aplicar" }).click();

        await expect(input).toHaveValue(/.+ – .+/);
    });

    test("custom presets example supports keyboard typeahead before applying", async ({ page }) => {
        const section = example(page, "custom-presets");
        const input = section.getByLabel("Analytics window");
        const dialog = await openDatePicker(page, section);
        const listbox = dialog.getByRole("listbox", { name: "Search period..." });
        const launchWeek = dialog.getByRole("option", { name: "Launch week" });

        await listbox.click();
        await page.keyboard.type("Lau");
        await expect(launchWeek).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(launchWeek).toHaveAttribute("aria-selected", "true");
        await dialog.getByRole("button", { name: "Apply" }).click();

        await expect(input).toHaveValue(/.+ – .+/);
    });

    test("inline example renders an always-visible calendar", async ({ page }) => {
        const section = example(page, "inline-calendar");
        const input = section.getByLabel("Check-in date");

        await expect(section.getByRole("button", { name: /open a date picker/i })).toHaveCount(0);
        await section.locator('button[aria-current="date"]').click();

        await expect(input).not.toHaveValue("");
    });
});
