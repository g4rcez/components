import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Menu, MenuItem } from "../src/components/floating/menu/menu";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

describe("Menu returns focus to the trigger", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("after Escape closes the menu opened with Enter", async () => {
        const user = userEvent.setup();
        render(
            <Menu hover={false} label="Account">
                <MenuItem title="Profile">Profile</MenuItem>
            </Menu>
        );
        screen.getByRole("button", { name: "Account" }).focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus());

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Account" })).toHaveFocus();
    });

    it("after the user picks an item with the pointer", async () => {
        const user = userEvent.setup();
        render(
            <Menu hover={false} label="Account">
                <MenuItem title="Profile">Profile</MenuItem>
            </Menu>
        );
        await user.click(screen.getByRole("button", { name: "Account" }));
        await user.click(await screen.findByRole("menuitem", { name: "Profile" }));

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Account" })).toHaveFocus();
    });

    it("does not force focus to the trigger with restoreFocus={false}", async () => {
        const user = userEvent.setup();
        render(
            <Menu hover={false} label="Account" restoreFocus={false}>
                <MenuItem title="Profile">Profile</MenuItem>
            </Menu>
        );
        screen.getByRole("button", { name: "Account" }).focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "Profile" })).toHaveFocus());

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Account" })).not.toHaveFocus();
    });
});
