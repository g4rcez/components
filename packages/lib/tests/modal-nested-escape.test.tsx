import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Dropdown } from "../src/components/floating/dropdown/dropdown";
import { Menu, MenuItem } from "../src/components/floating/menu/menu";
import { Modal } from "../src/components/floating/modal/modal";
import { Tooltip } from "../src/components/floating/tooltip/tooltip";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const InModal = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(true);
    return (
        <ComponentsProvider>
            <output data-testid="modal-state">{open ? "open" : "closed"}</output>
            <Modal open={open} title="Navigation" onChange={setOpen} closable>
                {children}
            </Modal>
        </ComponentsProvider>
    );
};

describe("Escape inside a Modal closes only the topmost popup", () => {
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    });

    it("Menu: first Escape closes the menu, focus returns to the trigger, second Escape closes the modal", async () => {
        const user = userEvent.setup();
        render(
            <InModal>
                <Menu hover={false} label="Account" restoreFocus>
                    <MenuItem title="Profile">Profile</MenuItem>
                </Menu>
            </InModal>
        );
        const trigger = screen.getByRole("button", { name: "Account" });
        await user.click(trigger);
        await screen.findByRole("menu");

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByTestId("modal-state")).toHaveTextContent("open");
        expect(trigger).toHaveFocus();

        await user.keyboard("{Escape}");

        expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");
    });

    it("Dropdown: first Escape closes the dropdown and keeps the modal", async () => {
        const user = userEvent.setup();
        render(
            <InModal>
                <Dropdown title="Filters" trigger="Open filters">
                    <div>Filter content</div>
                </Dropdown>
            </InModal>
        );
        await user.click(screen.getByRole("button", { name: "Open filters" }));
        await screen.findByRole("dialog", { name: "Filters" });

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
        expect(screen.getByTestId("modal-state")).toHaveTextContent("open");

        await user.keyboard("{Escape}");

        expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");
    });

    it("Tooltip: first Escape closes the tooltip and keeps the modal", async () => {
        const user = userEvent.setup();
        render(
            <InModal>
                <Tooltip as="button" title="Help">
                    Tooltip text
                </Tooltip>
            </InModal>
        );
        await user.hover(screen.getByRole("button", { name: "Help" }));
        await screen.findByRole("tooltip");

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        expect(screen.getByTestId("modal-state")).toHaveTextContent("open");

        await user.keyboard("{Escape}");

        expect(screen.getByTestId("modal-state")).toHaveTextContent("closed");
    });
});
