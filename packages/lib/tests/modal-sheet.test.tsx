import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "../src/components/floating/modal/modal";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

describe("Modal sheet", () => {
    it("does not dismiss when swiping inside scrollable content", async () => {
        const onChange = vi.fn();

        render(
            <ComponentsProvider>
                <Modal open title="Comments" type="sheet" forceType onChange={onChange}>
                    {Array.from({ length: 30 }, (_, index) => (
                        <p key={index}>Comment {index + 1}</p>
                    ))}
                </Modal>
            </ComponentsProvider>
        );

        const dialog = screen.getByRole("dialog", { name: "Comments" });
        const body = dialog.querySelector<HTMLElement>("[data-component='modal-body']");

        expect(body).not.toBeNull();

        fireEvent.touchStart(body!, { changedTouches: [{ pageY: 100 }] });
        fireEvent.touchMove(body!, { changedTouches: [{ pageY: 400 }] });
        fireEvent.touchEnd(body!, { changedTouches: [{ pageY: 400 }] });

        await new Promise((resolve) => setTimeout(resolve, 250));

        expect(onChange).not.toHaveBeenCalled();
        expect(dialog).toBeInTheDocument();
    });
});
