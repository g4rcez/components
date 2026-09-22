import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it } from "vitest";
import { Context } from "../src/config/context";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { defaultLightThemeTokens } from "../src/styles/theme-runtime";

type ButtonTokens = typeof defaultLightThemeTokens.components.button;

const ComponentTokensProbe = () => {
    const context = useContext(Context);
    const button = context?.components?.button as ButtonTokens | undefined;

    return (
        <output
            data-testid="component-tokens"
            data-height={button?.height}
            data-px={button?.px}
            data-secondary-background={button?.secondary.background}
            data-secondary-foreground={button?.secondary.foreground}
        />
    );
};

describe("ComponentsProvider component tokens", () => {
    it("preserves explicit variants and zero radii while deriving unspecified variants from the spacing base", () => {
        render(
            <ComponentsProvider injectComponentTokens components={{ button: { height: "40px", "height-big": "60px", rounded: "0" } }}>
                <button>Explicit geometry</button>
            </ComponentsProvider>
        );
        const style = screen.getByRole("button", { name: "Explicit geometry" }).parentElement!.style;
        expect(style.getPropertyValue("--var-button-height")).toBe("40px");
        expect(style.getPropertyValue("--var-button-big-height")).toBe("60px");
        expect(style.getPropertyValue("--var-button-rounded")).toBe("0");
        expect(style.getPropertyValue("--var-button-small-height")).toBe("calc(var(--button-height) - calc(var(--var-spacing-base) * 0.5))");
    });

    it("deeply merges a small component token set with defaults", () => {
        render(
            <ComponentsProvider components={{ button: { height: "4rem", secondary: { background: "hotpink" } } }}>
                <ComponentTokensProbe />
            </ComponentsProvider>
        );

        const probe = screen.getByTestId("component-tokens");

        expect(probe).toHaveAttribute("data-height", "4rem");
        expect(probe).toHaveAttribute("data-px", defaultLightThemeTokens.components.button.px);
        expect(probe).toHaveAttribute("data-secondary-background", "hotpink");
        expect(probe).toHaveAttribute("data-secondary-foreground", defaultLightThemeTokens.components.button.secondary.foreground);
    });

    it("does not inject component token CSS variables unless explicitly enabled", () => {
        render(
            <ComponentsProvider
                components={{ button: { height: "4rem", secondary: { background: "hotpink" } }, tag: { "default-min-block-size": "3rem" } }}
            >
                <button type="button">Preview</button>
            </ComponentsProvider>
        );

        expect(screen.queryByText("Preview")?.parentElement).not.toHaveAttribute("data-components-provider");
        expect(document.querySelector('[data-components-provider="true"]')).toBeNull();
    });

    it("scopes provided component tokens and calc-derived aliases as CSS variables when javascript injection is enabled", () => {
        render(
            <ComponentsProvider
                injectComponentTokens
                components={{ button: { height: "4rem", secondary: { background: "hotpink" } }, tag: { "default-min-block-size": "3rem" } }}
            >
                <button type="button">Preview</button>
            </ComponentsProvider>
        );

        const scope = screen.getByRole("button", { name: "Preview" }).parentElement;

        expect(scope).toHaveAttribute("data-components-provider", "true");
        expect(scope).toHaveStyle({ display: "contents" });
        expect(scope?.style.getPropertyValue("--button-height")).toBe("4rem");
        expect(scope?.style.getPropertyValue("--var-button-height")).toBe("4rem");
        expect(scope?.style.getPropertyValue("--button-height-big")).toBe("calc(var(--button-height) + calc(var(--var-spacing-base) * 0.5))");
        expect(scope?.style.getPropertyValue("--var-button-big-height")).toBe("calc(var(--button-height) + calc(var(--var-spacing-base) * 0.5))");
        expect(scope?.style.getPropertyValue("--button-secondary-background")).toBe("hotpink");
        expect(scope?.style.getPropertyValue("--var-button-secondary-background")).toBe("hotpink");
        expect(scope?.style.getPropertyValue("--tag-default-min-block-size")).toBe("3rem");
        expect(scope?.style.getPropertyValue("--var-tag-default-min-block-size")).toBe("3rem");
        expect(scope?.style.getPropertyValue("--var-button-secondary-foreground")).toBe("");
    });
});
