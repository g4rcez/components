import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Menu, MenuItem, type MenuProps } from "../src/components/floating/menu/menu";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const openMenu = async (props: Pick<MenuProps, "side" | "align" | "offset"> = {}) => {
    const user = userEvent.setup();
    render(
        <Menu hover={false} label="Account" {...props}>
            <MenuItem title="Profile">Profile</MenuItem>
        </Menu>
    );
    await user.click(screen.getByRole("button", { name: "Account" }));
    return screen.findByRole("menu");
};

describe("Menu placement", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("opens below the trigger, aligned to its start, by default", async () => {
        const panel = await openMenu();
        expect(panel.style.transformOrigin).toBe("left top");
        expect(panel.style.top).toBe("4px");
    });

    it.each([
        { side: "bottom", align: "end", origin: "right top" },
        { side: "top", align: "start", origin: "left bottom" },
        { side: "right", align: "start", origin: "left top" },
        { side: "right", align: "end", origin: "left bottom" },
        { side: "left", align: "end", origin: "right bottom" },
    ] as const)("places the panel with side=$side align=$align", async ({ side, align, origin }) => {
        const panel = await openMenu({ side, align });
        expect(panel.style.transformOrigin).toBe(origin);
    });

    it("grows from the center when align is center", async () => {
        const panel = await openMenu({ side: "bottom", align: "center" });
        expect(panel.style.transformOrigin).toBe("center top");
    });

    it("sets the gap to the trigger with offset", async () => {
        const panel = await openMenu({ offset: 12 });
        expect(panel.style.top).toBe("12px");
    });

    it("does not pass side, align or offset to the trigger element", async () => {
        await openMenu({ side: "right", align: "end", offset: 8 });
        const trigger = screen.getByRole("button", { name: "Account" });
        expect(trigger).not.toHaveAttribute("side");
        expect(trigger).not.toHaveAttribute("align");
        expect(trigger).not.toHaveAttribute("offset");
    });
});
