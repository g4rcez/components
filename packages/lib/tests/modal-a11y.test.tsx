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

const sheetRect = {
    ...modalRect,
    bottom: 500,
    height: 500,
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

        const dialog = screen.getByRole("dialog", { name: "Resizable drawer" });

        expect(resizeHandle).not.toHaveAttribute("tabindex", "-1");
        expect(resizeHandle).toHaveAccessibleDescription("Use arrow keys to resize the modal");
        expect(resizeHandle).toHaveAttribute("aria-controls", dialog.id);
        expect(resizeHandle).toHaveAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight");
        expect(resizeHandle).toHaveClass("__floating-modal__tw-9");
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

    it("uses explicit concise descriptions without describing the whole body", () => {
        render(
            <ComponentsProvider>
                <Modal open title="Described modal" ariaDescription="Concise modal summary" onChange={() => {}}>
                    <p>Long interactive content should not become the accessible description.</p>
                </Modal>
            </ComponentsProvider>
        );

        const dialog = screen.getByRole("dialog", { name: "Described modal" });

        expect(dialog).toHaveAccessibleDescription("Concise modal summary");
        expect(dialog).not.toHaveAccessibleDescription(/Long interactive content/);
    });

    it("resizes a drawer with arrow keys within modal constraints", async () => {
        const user = userEvent.setup();
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function getBoundingClientRect(this: HTMLElement) {
            if (this.dataset.component === "modal") return modalRect;
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

    it("resizes a sheet with ArrowUp to grow and ArrowDown to shrink", async () => {
        const user = userEvent.setup();
        vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function getBoundingClientRect(this: HTMLElement) {
            if (this.dataset.component === "modal") return sheetRect;
            return {
                ...sheetRect,
                bottom: 0,
                height: 0,
                right: 0,
                width: 0,
            };
        });

        render(
            <ComponentsProvider>
                <Modal open title="Resizable sheet" type="sheet" forceType onChange={() => {}}>
                    Sheet content
                </Modal>
            </ComponentsProvider>
        );

        const dialog = screen.getByRole("dialog", { name: "Resizable sheet" });
        const resizeHandle = screen.getByRole("button", { name: "Resize modal" });

        resizeHandle.focus();
        await user.keyboard("{ArrowUp}");

        await waitFor(() => expect(dialog).toHaveStyle({ height: "532px" }));

        await user.keyboard("{ArrowDown}");

        await waitFor(() => expect(dialog).toHaveStyle({ height: "500px" }));
    });
});
