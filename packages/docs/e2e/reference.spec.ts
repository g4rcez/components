import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const dir = join(__dirname, "../src/generated/reference");
const pages = readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
        const data = JSON.parse(readFileSync(join(dir, name), "utf8")) as { props: { k: string }[]; attributes: { k: string }[]; tokens: unknown[] };
        const api = [...data.props, ...data.attributes];
        return {
            slug: name.replace(/\.json$/, ""),
            api: api.length > 0,
            table: api.some((block) => block.k === "table"),
            tokens: data.tokens.length > 0,
        };
    });

/**
 * Console noise that comes from a page's own demos, not from the generated sections: on /docs/form a `loading` attribute reaches
 * the DOM, and its masked date Input renders a different initial value on the server and the client.
 */
const demoNoise: Record<string, RegExp> = { form: /non-boolean attribute|does not recognize the|tree hydrated/ };

test.describe("generated reference", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("there is a reference for the documented components", () => {
        expect(pages.length).toBeGreaterThan(50);
    });

    for (const { slug, api, table, tokens } of pages) {
        test(`/docs/${slug} renders its generated sections without errors`, async ({ page }) => {
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("console", (message) => message.type() === "error" && errors.push(message.text()));

            await page.goto(`/docs/${slug}`);
            await expect(page.locator("#docs-page-title")).toBeVisible();
            if (api) {
                await expect(page.getByRole("heading", { level: 2, name: "API reference" })).toBeVisible();
                if (table) await expect(page.locator(".docs-reference table").first()).toBeVisible();
            }
            if (tokens) await expect(page.getByRole("heading", { level: 2, name: "Design tokens" })).toBeVisible();
            // The page's own demos may add another "Accessibility" heading (drawing-editor does), so require at least ours.
            await expect(page.locator("#accessibility-notes-title")).toHaveCount(1);
            expect(errors.filter((message) => !demoNoise[slug]?.test(message))).toEqual([]);
        });
    }
});
