import { render, screen } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it } from "vitest";
import { Context } from "../src/config/context";
import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Input } from "../src/components/form/input/input";

const ComponentTokensProbe = () => {
    const context = useContext(Context);

    return (
        <output
            data-testid="component-tokens"
            data-height={context?.components?.button?.height}
            data-px={context?.components?.button?.px}
            data-secondary-background={context?.components?.button?.["secondary-background"]}
            data-secondary-foreground={context?.components?.button?.["secondary-foreground"]}
        />
    );
};

describe("ComponentsProvider component tokens", () => {
    it("preserves explicit variants and zero radii while deriving unspecified variants from the spacing base", () => {
        render(
            <ComponentsProvider injectComponentTokens components={{ button: { height: "40px", "big-height": "60px", rounded: "0" } }}>
                <button>Explicit geometry</button>
            </ComponentsProvider>
        );
        const style = screen.getByRole("button", { name: "Explicit geometry" }).parentElement!.style;
        expect(style.getPropertyValue("--var-button-height")).toBe("40px");
        expect(style.getPropertyValue("--var-button-big-height")).toBe("60px");
        expect(style.getPropertyValue("--var-button-rounded")).toBe("0");
        expect(style.getPropertyValue("--var-button-small-height")).toBe("calc(var(--var-button-height) - calc(var(--var-spacing-base) * 0.5))");
    });

    it("exposes sparse canonical overrides without materializing theme defaults", () => {
        render(
            <ComponentsProvider components={{ button: { height: "4rem", "secondary-background": "hotpink" } }}>
                <ComponentTokensProbe />
            </ComponentsProvider>
        );

        const probe = screen.getByTestId("component-tokens");

        expect(probe).toHaveAttribute("data-height", "4rem");
        expect(probe).not.toHaveAttribute("data-px");
        expect(probe).toHaveAttribute("data-secondary-background", "hotpink");
        expect(probe).not.toHaveAttribute("data-secondary-foreground");
    });

    it("does not inject component token CSS variables unless explicitly enabled", () => {
        render(
            <ComponentsProvider
                components={{ button: { height: "4rem", "secondary-background": "hotpink" }, tag: { "default-min-block-size": "3rem" } }}
            >
                <button type="button">Preview</button>
            </ComponentsProvider>
        );

        expect(screen.queryByText("Preview")?.parentElement).not.toHaveAttribute("data-components-provider");
        expect(document.querySelector('[data-components-provider="true"]')).toBeNull();
    });

    it("scopes sparse overrides and dependent size variants to the opt-in wrapper", () => {
        render(
            <ComponentsProvider
                injectComponentTokens
                components={{ button: { height: "4rem", "secondary-background": "hotpink" }, tag: { "default-min-block-size": "3rem" } }}
            >
                <button type="button">Preview</button>
            </ComponentsProvider>
        );

        const scope = screen.getByRole("button", { name: "Preview" }).parentElement;

        expect(scope).toHaveAttribute("data-components-provider", "true");
        expect(scope).toHaveStyle({ display: "contents" });
        expect(scope?.style.getPropertyValue("--var-button-height")).toBe("4rem");
        expect(scope?.style.getPropertyValue("--var-button-big-height")).toBe("calc(var(--var-button-height) + calc(var(--var-spacing-base) * 0.5))");
        expect(scope?.style.getPropertyValue("--var-button-secondary-background")).toBe("hotpink");
        expect(scope?.style.getPropertyValue("--var-tag-default-min-block-size")).toBe("3rem");
        expect(scope?.style.getPropertyValue("--var-button-secondary-foreground")).toBe("");
    });

    it.each(["0", "12px", "calc(2rem + 1px)"])("preserves an explicit small size of %s", (height) => {
        render(
            <ComponentsProvider injectComponentTokens components={{ button: { height: "4rem", "small-height": height } }}>
                <button>Explicit size</button>
            </ComponentsProvider>
        );

        const style = screen.getByRole("button", { name: "Explicit size" }).parentElement!.style;
        expect(style.getPropertyValue("--var-button-small-height")).toBe(height);
    });

    it("removes scoped overrides when the configuration changes", () => {
        const { rerender } = render(
            <ComponentsProvider injectComponentTokens components={{ button: { height: "4rem", "secondary-background": "hotpink" } }}>
                <button>Updated scope</button>
            </ComponentsProvider>
        );
        rerender(
            <ComponentsProvider injectComponentTokens components={{}}>
                <button>Updated scope</button>
            </ComponentsProvider>
        );

        const style = screen.getByRole("button", { name: "Updated scope" }).parentElement!.style;
        expect(style.getPropertyValue("--var-button-height")).toBe("");
        expect(style.getPropertyValue("--var-button-big-height")).toBe("");
        expect(style.getPropertyValue("--var-button-secondary-background")).toBe("");
        expect(style.display).toBe("contents");
    });

    it("uses default input behavior outside the provider", () => {
        render(<Input name="email" title="Email" placeholder="you@example.com" />);
        expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    });

});
