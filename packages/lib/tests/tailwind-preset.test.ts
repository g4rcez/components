import postcss from "postcss";
import tailwindcss from "tailwindcss";
import type { Config } from "tailwindcss";
import { describe, expect, it } from "vitest";

import preset from "../preset.tailwind";

const compileUtilities = async (classes: string) => {
    const config = {
        ...preset,
        content: [{ raw: `<div class="${classes}"></div>`, extension: "html" }],
    } as Config;

    return postcss([tailwindcss(config)]).process("@tailwind utilities;", { from: undefined });
};

describe("Tailwind preset", () => {
    it.each([
        ["card", "bg-card bg-card-background", "--var-card-background"],
        ["table", "bg-table bg-table-background", "--var-table-background"],
    ])("maps %s background utilities to their component token", async (_, classes, token) => {
        const result = await compileUtilities(classes);
        const [defaultClass, backgroundClass] = classes.split(" ");

        expect(result.css).toContain(`.${defaultClass} {`);
        expect(result.css).toContain(`.${backgroundClass} {`);
        expect(result.css.match(new RegExp(`var\\(${token}\\)`, "g"))).toHaveLength(2);
        expect(result.css).not.toContain("var(--var-color-background)");
    });

    it("keeps card and table utility aliases independently themeable", async () => {
        const result = await compileUtilities("border-card-border bg-card-muted border-table-border");

        expect(result.css).toContain("var(--var-card-border)");
        expect(result.css).toContain("var(--var-card-muted)");
        expect(result.css).toContain("var(--var-table-border)");
        expect(result.css).not.toContain("var(--var-color-border)");
        expect(result.css).not.toContain("var(--var-color-muted)");
    });
});
