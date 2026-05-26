import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "../src/components/floating/modal";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const modalRect = {
    bottom: 400,
    height: 400,
    left: 0,
    right: 320,
    top: 0,
    width: 320,
    x: 0,
    y: 0,
    toJSON: () => ({}),
};

describe("Modal resize a11y", () => {
    it("exposes a named, described, keyboard-focusable resize handle", async () => {
        const { container } = render(
            <ComponentsProvider>
                <Modal open title="Resizable drawer" type="drawer" forceType onChange={() => {}}>
                    Drawer content
                </Modal>
            </ComponentsProvider>
        );

        const resizeHandle = screen.getByRole("button", { name: "Resize modal" });

        expect(resizeHandle).not.toHaveAttribute("tabindex", "-1");
        expect(resizeHandle).toHaveAccessibleDescription("Use arrow keys to resize the modal");
        expect(resizeHandle).toHaveClass("cursor-col-resize");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("uses provider map labels for the resize handle", () => {
        render(
            <ComponentsProvider
                map={{
                    dialogResizeInstructions: "Use arrow keys to resize this panel",
                    dialogResizeLabel: "Resize panel",
                }}
            >
                <Modal open title="Resizable drawer" type="drawer" forceType onChange={() => {}}>
                    Drawer content
                </Modal>
            </ComponentsProvider>
        );

        const resizeHandle = screen.getByRole("button", { name: "Resize panel" });

        expect(resizeHandle).toHaveAccessibleDescription("Use arrow keys to resize this panel");
    });

    it("resizes a drawer with arrow keys within modal constraints", async () => {
        const user = userEvent.setup();
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function getBoundingClientRect() {
            if ((this as HTMLElement).dataset.component === "modal") return modalRect;
            return {
                ...modalRect,
                bottom: 0,
                height: 0,
                right: 0,
                width: 0,
            };
        });

        render(
            <ComponentsProvider>
                <Modal open title="Resizable drawer" type="drawer" forceType onChange={() => {}}>
                    Drawer content
                </Modal>
            </ComponentsProvider>
        );

        const dialog = screen.getByRole("dialog", { name: "Resizable drawer" });
        const resizeHandle = screen.getByRole("button", { name: "Resize modal" });

        resizeHandle.focus();
        await user.keyboard("{ArrowRight}");

        await waitFor(() => expect(dialog).toHaveStyle({ width: "352px" }));

        await user.keyboard("{ArrowLeft}");

        await waitFor(() => expect(dialog).toHaveStyle({ width: "320px" }));
    });
});
