import { expect, test } from "@playwright/test";

test("Button keyboard focus remains visible in forced-colors mode", async ({ page }) => {
    await page.goto("/docs/buttons");
    await expect(page.getByRole("heading", { level: 1, name: "Buttons" })).toBeVisible();

    const startingButton = page.getByRole("button", { name: "Normal", exact: true }).first();
    await startingButton.focus();
    await page.keyboard.press("Tab");

    const focusedButton = page.locator(".__button:focus-visible");
    await expect(focusedButton).toBeVisible();
    const normalFocusShadow = await focusedButton.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(normalFocusShadow).not.toBe("none");

    await page.emulateMedia({ forcedColors: "active" });
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);

    const focusStyle = await focusedButton.evaluate((element) => {
        const style = getComputedStyle(element);
        const probe = document.createElement("span");
        probe.style.color = "ButtonText";
        document.body.append(probe);
        const systemButtonText = getComputedStyle(probe).color;
        probe.remove();
        return {
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
            outlineColor: style.outlineColor,
            systemButtonText,
            boxShadow: style.boxShadow,
        };
    });

    expect(focusStyle.outlineStyle).toBe("solid");
    expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
    expect(focusStyle.outlineColor).toBe(focusStyle.systemButtonText);
    expect(focusStyle.boxShadow).toBe("none");
});
