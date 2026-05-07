import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React, { useState } from "react";
import { Modal } from "../src/components/floating/modal";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("Modal focus management", () => {
    const ControlledModal = ({ initialOpen = true }: { initialOpen?: boolean }) => {
        const [open, setOpen] = useState(initialOpen);
        return (
            <ComponentsProvider>
                <button data-testid="trigger" onClick={() => setOpen(true)}>
                    Open
                </button>
                <Modal open={open} title="Focus Test" onChange={setOpen} closable>
                    <button data-testid="inner-button">Action</button>
                </Modal>
            </ComponentsProvider>
        );
    };

    it("close button is present and accessible when modal is open", async () => {
        render(<ControlledModal initialOpen={true} />);

        const closeButton = await screen.findByRole("button", { name: /close/i });
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).not.toHaveAttribute("tabindex", "-1");
    });

    it("close button click calls onChange with false", async () => {
        render(<ControlledModal initialOpen={true} />);

        const closeButton = await screen.findByRole("button", { name: /close/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Focus Test")).not.toBeInTheDocument();
        });
    });

    it("focus moves inside modal on open", async () => {
        render(<ControlledModal initialOpen={false} />);

        expect(screen.queryByText("Focus Test")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("trigger"));

        await waitFor(() => {
            expect(screen.getByText("Focus Test")).toBeInTheDocument();
        });

        await waitFor(() => {
            const modal = document.querySelector("[data-component='modal']");
            expect(modal).toBeInTheDocument();
            expect(modal!.contains(document.activeElement)).toBe(true);
        });
    });

    it("Escape key closes the modal", async () => {
        render(<ControlledModal initialOpen={true} />);

        await screen.findByText("Focus Test");

        fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

        await waitFor(() => {
            expect(screen.queryByText("Focus Test")).not.toBeInTheDocument();
        });
    });
});
