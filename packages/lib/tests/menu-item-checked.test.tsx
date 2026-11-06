import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Menu, MenuItem } from "../src/components/floating/menu/menu";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const renderMenu = (onSelect = vi.fn()) =>
    render(
        <Menu hover={false} label="Theme">
            <MenuItem title="Light" role="menuitemradio" checked onClick={() => onSelect("light")}>
                Light
            </MenuItem>
            <MenuItem title="Dark" role="menuitemradio" checked={false} onClick={() => onSelect("dark")}>
                Dark
            </MenuItem>
            <MenuItem title="Compact" role="menuitemcheckbox" checked>
                Compact
            </MenuItem>
            <MenuItem title="Profile">Profile</MenuItem>
        </Menu>
    );

describe("MenuItem selection state", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("exposes radio and checkbox roles with their checked state", async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole("button", { name: "Theme" }));

        expect(await screen.findByRole("menuitemradio", { name: "Light" })).toBeChecked();
        expect(screen.getByRole("menuitemradio", { name: "Dark" })).not.toBeChecked();
        expect(screen.getByRole("menuitemcheckbox", { name: "Compact" })).toBeChecked();
    });

    it("keeps a plain item as menuitem without aria-checked", async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole("button", { name: "Theme" }));

        const item = await screen.findByRole("menuitem", { name: "Profile" });
        expect(item).not.toHaveAttribute("aria-checked");
    });

    it("draws the check only on the checked item and keeps the same label offset", async () => {
        const user = userEvent.setup();
        renderMenu();
        await user.click(screen.getByRole("button", { name: "Theme" }));

        const checked = await screen.findByRole("menuitemradio", { name: "Light" });
        const unchecked = screen.getByRole("menuitemradio", { name: "Dark" });
        const plain = screen.getByRole("menuitem", { name: "Profile" });
        expect(checked.querySelector("svg")).not.toBeNull();
        expect(unchecked.querySelector("svg")).toBeNull();
        expect(plain.querySelector("svg")).toBeNull();
        expect(unchecked.querySelector("[data-menu-item-indicator]")).not.toBeNull();
        expect(plain.querySelector("[data-menu-item-indicator]")).not.toBeNull();
    });

    it("calls onClick and closes the menu when the user picks an item", async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        renderMenu(onSelect);
        await user.click(screen.getByRole("button", { name: "Theme" }));
        await user.click(await screen.findByRole("menuitemradio", { name: "Dark" }));

        expect(onSelect).toHaveBeenCalledWith("dark");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    });
});
