import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HoldToConfirm } from "../src/components/core/hold-to-confirm/hold-to-confirm";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const setup = (props: Partial<React.ComponentProps<typeof HoldToConfirm>> = {}) => {
    const onConfirm = vi.fn();
    const onHoldChange = vi.fn();
    const utils = render(
        <ComponentsProvider>
            <HoldToConfirm label="Hold to delete project" onConfirm={onConfirm} onHoldChange={onHoldChange} {...props} />
        </ComponentsProvider>
    );
    const button = screen.getByRole("button", { name: /Hold to delete project|Done/ });
    return { ...utils, button, onConfirm, onHoldChange };
};

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

describe("HoldToConfirm", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders the instruction as the accessible name and describes the hold", () => {
        const { button } = setup();
        expect(button).toHaveAccessibleName("Hold to delete project");
        expect(button).toHaveAccessibleDescription(/Press and hold for 1.2 seconds/);
        expect(button).toHaveAttribute("type", "button");
        expect(button).not.toHaveAttribute("aria-disabled");
    });

    it("confirms once after the full duration of a pointer hold", () => {
        const { button, onConfirm, onHoldChange } = setup({ duration: 1000 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "mouse", button: 0 });
        expect(onHoldChange).toHaveBeenLastCalledWith(true);
        expect(button).toHaveAttribute("data-holding", "true");

        advance(999);
        expect(onConfirm).not.toHaveBeenCalled();
        advance(2);
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onHoldChange).toHaveBeenLastCalledWith(false);
        expect(button).toHaveAttribute("aria-disabled", "true");
        expect(button).toHaveAttribute("data-confirmed", "true");

        fireEvent.pointerUp(button, { pointerId: 1 });
        advance(2000);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("announces the confirmed label and swaps the visible label", () => {
        const { button } = setup({ duration: 500, confirmedLabel: "Project deleted" });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(500);
        expect(screen.getByRole("status")).toHaveTextContent("Project deleted");
        expect(button).toHaveAccessibleName("Project deleted");
    });

    it("does not confirm when released early", () => {
        const { button, onConfirm, onHoldChange } = setup({ duration: 1000 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "mouse", button: 0 });
        advance(600);
        fireEvent.pointerUp(button, { pointerId: 1 });
        advance(2000);
        expect(onConfirm).not.toHaveBeenCalled();
        expect(onHoldChange).toHaveBeenNthCalledWith(1, true);
        expect(onHoldChange).toHaveBeenNthCalledWith(2, false);
        expect(button).not.toHaveAttribute("data-holding");
    });

    it("cancels when the pointer slides well off the button", () => {
        const { button, onConfirm } = setup({ duration: 1000 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "mouse", button: 0, clientX: 0, clientY: 0 });
        advance(400);
        fireEvent.pointerMove(button, { pointerId: 1, clientX: 400, clientY: 400 });
        advance(2000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("ignores non-primary mouse buttons", () => {
        const { button, onConfirm } = setup({ duration: 300 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "mouse", button: 2 });
        advance(1000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("holds with Space and Enter, and ignores key repeat", () => {
        const { button, onConfirm } = setup({ duration: 800 });
        fireEvent.keyDown(button, { key: " " });
        advance(400);
        fireEvent.keyDown(button, { key: " ", repeat: true });
        advance(399);
        expect(onConfirm).not.toHaveBeenCalled();
        advance(2);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("cancels a keyboard hold on key up and on blur", () => {
        const { button, onConfirm } = setup({ duration: 800 });
        fireEvent.keyDown(button, { key: "Enter" });
        advance(300);
        fireEvent.keyUp(button, { key: "Enter" });
        advance(1000);
        expect(onConfirm).not.toHaveBeenCalled();

        fireEvent.keyDown(button, { key: " " });
        advance(300);
        fireEvent.blur(button);
        advance(1000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("does not activate through a plain click", () => {
        const { button, onConfirm } = setup();
        fireEvent.click(button);
        advance(3000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("prevents the native key activation so the button is not clicked on release", () => {
        const { button } = setup();
        const down = fireEvent.keyDown(button, { key: " " });
        const up = fireEvent.keyUp(button, { key: " " });
        expect(down).toBe(false);
        expect(up).toBe(false);
    });

    it("never starts when disabled", () => {
        const { button, onConfirm } = setup({ disabled: true, duration: 100 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        fireEvent.keyDown(button, { key: " " });
        advance(1000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("ignores new holds after it is confirmed", () => {
        const { button, onConfirm } = setup({ duration: 200 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(200);
        fireEvent.pointerUp(button, { pointerId: 1 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(1000);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("resets to idle when the confirmed prop goes back to false", () => {
        const onConfirm = vi.fn();
        const view = render(<HoldToConfirm label="Hold to delete" onConfirm={onConfirm} confirmed duration={300} />);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-disabled", "true");

        view.rerender(<HoldToConfirm label="Hold to delete" onConfirm={onConfirm} confirmed={false} duration={300} />);
        expect(button).not.toHaveAttribute("aria-disabled");
        expect(button).toHaveAccessibleName("Hold to delete");

        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(300);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("stays unconfirmed under a controlled confirmed={false}, so the parent decides", () => {
        const { button, onConfirm } = setup({ confirmed: false, duration: 200 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(200);
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(button).not.toHaveAttribute("aria-disabled");
        expect(button).not.toHaveAttribute("data-holding");
    });

    it("keeps caller handlers and attributes", () => {
        const onPointerDown = vi.fn();
        const { button } = setup({ onPointerDown, className: "mine", "data-testid": "danger" } as never);
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        expect(onPointerDown).toHaveBeenCalledTimes(1);
        expect(button).toHaveClass("mine", "__hold-to-confirm", "__hold-to-confirm--tone-danger");
        expect(button).toHaveAttribute("data-testid", "danger");
    });

    it("supports the neutral tone", () => {
        const { button } = setup({ tone: "neutral" });
        expect(button).toHaveClass("__hold-to-confirm--tone-neutral");
    });

    it("clears its timer on unmount so a pending hold cannot confirm", () => {
        const { button, onConfirm, unmount } = setup({ duration: 500 });
        fireEvent.pointerDown(button, { pointerId: 1, pointerType: "touch" });
        advance(200);
        unmount();
        advance(1000);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("has no axe violations", async () => {
        vi.useRealTimers();
        const { container } = setup();
        expect((await axe(container)).violations).toHaveLength(0);
    });
});
