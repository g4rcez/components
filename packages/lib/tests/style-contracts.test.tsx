/// <reference types="node" />

import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Alert } from "../src/components/display/alert/alert";
import { alertStyles } from "../src/components/display/alert/alert.styles";
import { Masonry } from "../src/components/display/masonry/masonry";
import { Stats } from "../src/components/display/stats/stats";
import { statsStyles } from "../src/components/display/stats/stats.styles";
import { datePickerStyles } from "../src/components/form/date-picker/date-picker.styles";
import { Toolbar } from "../src/components/floating/toolbar/toolbar";
import { toolbarStyles } from "../src/components/floating/toolbar/toolbar.styles";

const readSource = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");

const Icon = ({ className }: { className: string }) => <svg aria-hidden="true" className={className} />;

class StyleContractResizeObserver implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const originalResizeObserver = globalThis.ResizeObserver;

describe("component style contracts", () => {
    beforeEach(() => {
        globalThis.ResizeObserver = StyleContractResizeObserver;
    });

    afterEach(() => {
        globalThis.ResizeObserver = originalResizeObserver;
    });
    it("uses Alert helper variants and keeps container classes on the outer wrapper", () => {
        const { container } = render(
            <Alert container="custom-container" title="Notice" Icon={<svg data-testid="custom-icon" />}>
                Message
            </Alert>
        );

        const wrapper = container.querySelector(`.${alertStyles.slots.container}`);
        const alert = container.querySelector(`[data-theme="neutral"]`);
        expect(wrapper).toHaveClass(alertStyles.slots.container, "custom-container");
        expect(alert).toHaveClass("__alert", "__alert--theme-neutral");
        expect(alert).not.toHaveClass("custom-container");
        expect(alert?.querySelector(`.${alertStyles.slots.content}`)).toBeInTheDocument();
        expect(alert?.querySelector(`.${alertStyles.slots.header}`)).toBeInTheDocument();
        expect(alert?.querySelector(`.${alertStyles.slots.title}`)).toBeInTheDocument();
        expect(alert?.querySelector(`.${alertStyles.slots.body}`)).toBeInTheDocument();
        expect(container.querySelector(`.${alertStyles.slots.collapse}`)).toBeInTheDocument();
        expect(container.querySelector(`.${alertStyles.slots.collapse}[aria-hidden="true"]`)).not.toBeInTheDocument();
        expect(alert).toHaveAttribute("data-theme", "neutral");
        expect(screen.getByTestId("custom-icon")).toHaveClass(alertStyles.slots.icon);
    });

    it("routes Stats runtime classes through its style helper", () => {
        const source = readSource("src/components/display/stats/stats.tsx");
        const { container } = render(
            <Stats title="Revenue" Icon={Icon} iconContainer="custom-icon" footer={<span>Last month</span>}>
                $42k
            </Stats>
        );
        const root = container.querySelector("[data-component='stats']");

        expect(root).toHaveClass(statsStyles.className({}));
        expect(root?.querySelector(`.${statsStyles.slots.header}`)).toBeInTheDocument();
        expect(root?.querySelector(`.${statsStyles.slots.icon}`)).toHaveClass("custom-icon");
        expect(root?.querySelector(`.${statsStyles.slots["icon-svg"]}`)).toBeInTheDocument();
        expect(root?.querySelector(`.${statsStyles.slots.content}`)).toBeInTheDocument();
        expect(root?.querySelector(`.${statsStyles.slots.title}`)).toBeInTheDocument();
        expect(root?.querySelector(`.${statsStyles.slots.value}`)).toBeInTheDocument();
        expect(root?.querySelector(`.${statsStyles.slots.footer}`)).toBeInTheDocument();
        expect(source).toContain("statsStyles.className({})");
        expect(source).toContain("statsStyles.slots.header");
        expect(source).not.toContain('className="__stats"');
    });

    it("uses the Toolbar base helper and keeps CSS ownership on the supported root", () => {
        const source = readSource("src/components/floating/toolbar/toolbar.tsx");
        const css = readSource("src/components/floating/toolbar/toolbar.css");
        render(<Toolbar data-testid="toolbar">Tools</Toolbar>);

        const toolbar = screen.getByTestId("toolbar");
        expect(toolbar).toHaveClass(toolbarStyles.className({}));
        expect(toolbar).not.toHaveClass("__floating-toolbar__border", "__floating-toolbar__slot-1");
        expect(source).toContain("toolbarStyles.className({})");
        expect(css).toContain(".__toolbar");
        expect(css).toContain("position: sticky;");
    });

    it("applies DatePicker action and range-night slots without inventing preset controls", () => {
        const source = readSource("src/components/form/date-picker/date-picker.tsx");
        const css = readSource("src/components/form/date-picker/date-picker.css");

        expect(source).toContain('datePickerStyles.slots["range-nights"]');
        expect(source).toContain('datePickerStyles.slots["today-action"]');
        expect(source).toContain('datePickerStyles.slots["cancel-action"]');
        expect(source).toContain('datePickerStyles.slots["apply-action"]');
        expect(source).not.toContain('datePickerStyles.slots["range-summary"]');
        expect(source).not.toContain('datePickerStyles.slots["range-title"]');
        expect(source).not.toContain('datePickerStyles.slots["preset-search"]');
        expect(source).not.toContain('datePickerStyles.slots["preset-check"]');
        expect(css).toContain(".__date-picker__range-nights");
        expect(css).not.toContain(".__date-picker__range-summary");
        expect(css).not.toContain(".__date-picker__range-title");
        expect(css).not.toContain(".__date-picker__preset-search");
        expect(css).not.toContain(".__date-picker__preset-check");
        expect(datePickerStyles.slots["range-nights"]).toBe("__date-picker__range-nights");
        expect(datePickerStyles.slots).not.toHaveProperty("range-summary");
        expect(datePickerStyles.slots).not.toHaveProperty("range-title");
        expect(datePickerStyles.slots).not.toHaveProperty("preset-search");
        expect(datePickerStyles.slots).not.toHaveProperty("preset-check");
    });

    it("leaves Masonry root spacing to CSS unless the caller supplies it", () => {
        const { rerender } = render(<Masonry data-testid="masonry">Content</Masonry>);
        const root = screen.getByTestId("masonry");
        expect(root).toHaveClass("__masonry");
        expect(root.style.margin).toBe("");
        expect(root.style.padding).toBe("");

        rerender(
            <Masonry data-testid="masonry" style={{ margin: "12px", padding: "8px" }}>
                Content
            </Masonry>
        );
        expect(root).toHaveStyle({ margin: "12px", padding: "8px" });
    });
});
