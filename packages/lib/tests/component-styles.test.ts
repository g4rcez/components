import { describe, expect, it } from "vitest";
import { defineComponentStyles, type ComponentStyleProps } from "../src/lib/component-styles";

describe("defineComponentStyles", () => {
    const styles = defineComponentStyles({
        name: "button",
        variants: {
            size: ["default", "small"],
            theme: ["primary", "ghost-primary"],
        },
        defaults: {
            size: "default",
            theme: "primary",
        },
        slots: ["icon", "content"],
        dependencies: ["tooltip"],
        compoundVariants: [
            {
                when: { size: "small", theme: "ghost-primary" },
                className: "__button--ghost-small",
            },
        ],
    });

    it("derives base, variant, slot, and CSS import contracts", () => {
        expect(styles.base).toBe("__button");
        expect(styles.css).toBe("@g4rcez/components/button.css");
        expect(styles.classes.variants.size.small).toBe("__button--size-small");
        expect(styles.classes.variants.theme.primary).toBe("__button--theme-primary");
        expect(styles.slots.icon).toBe("__button__icon");
        expect(styles.dependencies).toStrictEqual(["tooltip"]);
    });

    it("emits default variant classes", () => {
        expect(styles.className()).toBe("__button __button--size-default __button--theme-primary");
    });

    it("emits selected and compound variant classes", () => {
        expect(styles.className({ size: "small", theme: "ghost-primary" })).toBe(
            "__button __button--size-small __button--theme-ghost-primary __button--ghost-small"
        );
    });

    it("infers component style props from variant arrays", () => {
        const props = { size: "small", theme: "primary" } satisfies ComponentStyleProps<typeof styles>;
        expect(styles.className(props)).toContain("__button--size-small");
    });
});
