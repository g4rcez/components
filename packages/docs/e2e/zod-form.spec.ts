import { expect, test, type Page } from "@playwright/test";

const form = (page: Page) => page.locator("form#zod-demo");

const parsed = async (page: Page) => JSON.parse((await page.locator('pre[aria-live="polite"]').first().textContent()) ?? "{}");

test.describe("Zod Form", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("shows the schema that the form runs", async ({ page }) => {
        await page.goto("/docs/zod-form");
        await expect(page.getByRole("heading", { level: 1, name: "Zod Form" })).toBeVisible();
        await expect(page.getByText("The schema behind this form")).toBeVisible();
        await expect(page.getByText("export const demoSchema")).toBeVisible();
    });

    test("renders every library control from the schema", async ({ page }) => {
        await page.goto("/docs/zod-form");
        const demo = form(page);
        await expect(demo.locator('input[name="name"]')).toBeVisible();
        await expect(demo.locator('input[name="email"]')).toHaveAttribute("type", "email");
        await expect(demo.locator('input[name="age"]')).toHaveAttribute("type", "number");
        await expect(demo.locator('textarea[name="bio"]')).toBeVisible();
        await expect(demo.locator('select[name="role"]')).toHaveValue("editor");
        await expect(demo.getByRole("radiogroup", { name: "Plan" })).toBeVisible();
        await expect(demo.getByRole("switch", { name: "Send me the newsletter" })).toHaveAttribute("aria-checked", "true");
        await expect(demo.getByRole("slider", { name: "Years of experience" })).toBeVisible();
        await expect(demo.getByRole("group", { name: "Address" })).toBeVisible();
        await expect(demo.getByRole("group", { name: "Contacts" })).toBeVisible();
    });

    test("an empty submit shows the schema messages and stays on the page", async ({ page }) => {
        await page.goto("/docs/zod-form");
        await form(page).getByRole("button", { name: "Create profile" }).click();
        await expect(page.locator("#name-error")).toHaveText("Use at least 2 characters");
        await expect(page.locator("#email-error")).toHaveText("Enter a valid email");
        await expect(page.locator("#age-error")).toHaveText("Enter your age");
        await expect(page.getByText("Submit the form to see what the schema returns.")).toBeVisible();
    });

    test("applies the masks from .meta() while typing", async ({ page }) => {
        await page.goto("/docs/zod-form");
        const demo = form(page);
        await demo.locator('input[name="document"]').pressSequentially("12345678901");
        await expect(demo.locator('input[name="document"]')).toHaveValue("123.456.789-01");
        await demo.locator('input[name="contacts[0].phone"]').pressSequentially("81987654321");
        await expect(demo.locator('input[name="contacts[0].phone"]')).toHaveValue("(81) 98765-4321");
    });

    test("clears an error as soon as the field becomes valid", async ({ page }) => {
        await page.goto("/docs/zod-form");
        const demo = form(page);
        await demo.getByRole("button", { name: "Create profile" }).click();
        await expect(page.locator("#terms-error")).toHaveText("You must accept the terms");
        await demo.locator('input[name="terms"]').click({ force: true });
        await expect(page.locator("#terms-error")).toHaveCount(0);
    });

    test("adds and removes contact rows", async ({ page }) => {
        await page.goto("/docs/zod-form");
        const demo = form(page);
        await demo.getByRole("button", { name: "Add Contacts" }).click();
        await expect(demo.locator('input[name="contacts[1].label"]')).toBeVisible();
        await demo.getByRole("button", { name: "Remove Contacts 2" }).click();
        await expect(demo.locator('input[name="contacts[1].label"]')).toHaveCount(0);
    });

    test("a filled form returns typed data", async ({ page }) => {
        await page.goto("/docs/zod-form");
        const demo = form(page);
        await demo.locator('input[name="name"]').fill("Ada Lovelace");
        await demo.locator('input[name="email"]').fill("ada@example.com");
        await demo.locator('input[name="document"]').pressSequentially("12345678901");
        await demo.locator('input[name="phone"]').pressSequentially("81912345678");
        await demo.locator('input[name="salary"]').click();
        await page.keyboard.press("End");
        await page.keyboard.type("250000");
        await demo.locator('input[name="age"]').fill("36");
        await demo.locator('input[name="address.street"]').fill("Rua A");
        await demo.locator('input[name="contacts[0].label"]').fill("Home");
        await demo.locator('input[name="contacts[0].phone"]').pressSequentially("81987654321");
        await demo.locator('input[name="terms"]').click({ force: true });
        await demo.locator('input[name="language-shadow"]').click();
        await page.getByRole("option", { name: "TypeScript" }).click();
        await demo.locator('input[data-target="birthday"]').pressSequentially("03021990");
        await demo
            .getByRole("button", { name: /open a date picker/i })
            .nth(1)
            .click();
        await page.getByRole("button", { name: /^\w+, \w+ 20, \d{4}$/ }).click();
        await page.getByLabel(/^Time/).first().fill("10:30");
        await page.keyboard.press("Escape");

        await demo.getByRole("button", { name: "Create profile" }).click();

        await expect(page.getByText("Parsed data")).toBeVisible();
        const data = await parsed(page);
        expect(data).toMatchObject({
            name: "Ada Lovelace",
            document: "123.456.789-01",
            salary: 2500,
            age: 36,
            role: "editor",
            language: "ts",
            plan: "free",
            skills: ["react"],
            newsletter: true,
            terms: true,
            experience: 5,
            status: "todo",
            address: { street: "Rua A", city: "Recife" },
            contacts: [{ label: "Home", phone: "(81) 98765-4321" }],
        });
        expect(typeof data.birthday).toBe("string");
        expect(data.avatar).toBeUndefined();
    });
});
