import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "../src/components/floating/dropdown/dropdown";
import { Menu, MenuItem } from "../src/components/floating/menu/menu";
import { Tooltip } from "../src/components/floating/tooltip/tooltip";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const rect = (x: number, y: number, width: number, height: number) =>
    ({ x, y, width, height, left: x, top: y, right: x + width, bottom: y + height, toJSON: () => ({}) }) as DOMRect;

/** 390px phone: the trigger touches the right edge and the panel is 338px wide. Without padding the panel would end at x = 390. */
const isPanel = (element: Element) => element.matches('[role="dialog"], [role="menu"], [role="tooltip"]');

const stubViewport = () => {
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        return isPanel(this) ? 338 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
        return isPanel(this) ? 100 : 0;
    });
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(390);
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(800);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
        if (isPanel(this)) return rect(0, 0, 338, 100);
        if (this.matches('[data-trigger], [aria-haspopup="menu"]')) return rect(352, 20, 38, 30);
        return rect(0, 0, 0, 0);
    });
};

const panelLeft = (panel: HTMLElement) => {
    const x = /translate\(([-\d.]+)px/.exec(panel.style.transform)?.[1] ?? /^([-\d.]+)px$/.exec(panel.style.left)?.[1];
    return Number(x);
};

describe("Floating panels keep 8px from the viewport edge at 390px", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
        stubViewport();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Dropdown", async () => {
        render(
            <Dropdown open arrow={false} side="bottom" align="start" title="Emoji" trigger="Open" buttonProps={{ "data-trigger": "" } as never}>
                <div>Content</div>
            </Dropdown>
        );
        const panel = await screen.findByRole("dialog", { name: "Emoji" });
        expect(panelLeft(panel)).toBe(44);
    });

    it("Menu", async () => {
        const user = userEvent.setup();
        render(
            <Menu hover={false} label="Account" data-trigger="">
                <MenuItem title="Profile">Profile</MenuItem>
            </Menu>
        );
        await user.click(screen.getByRole("button", { name: "Account" }));
        const panel = await screen.findByRole("menu");
        expect(panelLeft(panel)).toBe(44);
    });

    it("Tooltip", async () => {
        const user = userEvent.setup();
        render(
            <Tooltip as="button" data-trigger="" placement="bottom-start" title="Help">
                Tooltip text
            </Tooltip>
        );
        await user.hover(screen.getByRole("button", { name: "Help" }));
        const panel = await screen.findByRole("tooltip");
        expect(panelLeft(panel)).toBe(44);
    });
});
