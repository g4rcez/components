import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ActionSwap, type ActionSwapProps, type ActionSwapState } from "../src/components/core/action-swap/action-swap";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const states: ActionSwapState[] = [
    { id: "follow", label: "Follow", tone: "primary" },
    { id: "following", label: "Following", tone: "neutral" },
];

const setup = (props: Partial<ActionSwapProps> = {}) => {
    const utils = render(
        <ComponentsProvider>
            <ActionSwap states={states} {...props} />
        </ComponentsProvider>
    );
    return { ...utils, button: () => screen.getByRole("button") };
};

const flush = (ms: number) => act(async () => void (await vi.advanceTimersByTimeAsync(ms)));

describe("ActionSwap", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("shows the first state and exposes its label as the accessible name", () => {
        const { button } = setup();
        expect(button()).toHaveAccessibleName("Follow");
        expect(button()).toHaveAttribute("data-tone", "primary");
        expect(button()).toHaveAttribute("type", "button");
    });

    it("advances on every press and wraps around", () => {
        const { button } = setup();
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Following");
        expect(button()).toHaveAttribute("data-tone", "neutral");
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Follow");
    });

    it("supports three or more states in order", () => {
        const three = [...states, { id: "muted", label: "Muted" }];
        const { button } = setup({ states: three });
        fireEvent.click(button());
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Muted");
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Follow");
    });

    it("starts from defaultValue", () => {
        const { button } = setup({ defaultValue: "following" });
        expect(button()).toHaveAccessibleName("Following");
    });

    it("reports changes through onValueChange with the id and state", () => {
        const onValueChange = vi.fn();
        const { button } = setup({ onValueChange });
        fireEvent.click(button());
        expect(onValueChange).toHaveBeenCalledWith("following", states[1]);
    });

    it("is controlled when value is provided", () => {
        const onValueChange = vi.fn();
        const Controlled = () => {
            const [value, setValue] = useState("follow");
            return (
                <ActionSwap
                    states={states}
                    value={value}
                    onValueChange={(id) => {
                        onValueChange(id);
                        if (id === "following") setValue(id);
                    }}
                />
            );
        };
        render(<Controlled />);
        fireEvent.click(screen.getByRole("button"));
        expect(onValueChange).toHaveBeenCalledWith("following");
        expect(screen.getByRole("button")).toHaveAccessibleName("Following");
        fireEvent.click(screen.getByRole("button"));
        expect(onValueChange).toHaveBeenLastCalledWith("follow");
        expect(screen.getByRole("button")).toHaveAccessibleName("Following");
    });

    it("passes the state being left and the next one to onAction", () => {
        const onAction = vi.fn();
        const { button } = setup({ onAction });
        fireEvent.click(button());
        expect(onAction).toHaveBeenCalledWith(states[0], states[1]);
    });

    it("does nothing when disabled", () => {
        const onAction = vi.fn();
        const { button } = setup({ disabled: true, onAction });
        fireEvent.click(button());
        expect(onAction).not.toHaveBeenCalled();
        expect(button()).toHaveAccessibleName("Follow");
    });

    describe("async actions", () => {
        it("keeps the working phase for at least 450ms even when the promise resolves immediately", async () => {
            const { button } = setup({ onAction: () => Promise.resolve() });
            fireEvent.click(button());
            await flush(0);
            expect(button()).toHaveAttribute("aria-busy", "true");
            expect(button()).toHaveAttribute("aria-disabled", "true");

            await flush(400);
            expect(button()).toHaveAttribute("aria-busy", "true");
            expect(button()).toHaveAccessibleName("Follow");

            await flush(60);
            expect(button()).not.toHaveAttribute("aria-busy");
            expect(button()).toHaveAccessibleName("Following");
        });

        it("waits for slow promises, then swaps", async () => {
            const { button } = setup({ onAction: () => new Promise((resolve) => setTimeout(resolve, 2000)) });
            fireEvent.click(button());
            await flush(1900);
            expect(button()).toHaveAttribute("aria-busy", "true");
            await flush(200);
            expect(button()).toHaveAccessibleName("Following");
        });

        it("ignores presses while working", async () => {
            const onAction = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 600)));
            const { button } = setup({ onAction });
            fireEvent.click(button());
            fireEvent.click(button());
            fireEvent.click(button());
            await flush(700);
            expect(onAction).toHaveBeenCalledTimes(1);
            expect(button()).toHaveAccessibleName("Following");
        });

        it("shows the pending label while working", async () => {
            const { button } = setup({
                states: [
                    { id: "send", label: "Send", pendingLabel: "Sending" },
                    { id: "sent", label: "Sent" },
                ],
                onAction: () => new Promise((resolve) => setTimeout(resolve, 800)),
            });
            fireEvent.click(button());
            await flush(10);
            expect(button()).toHaveAccessibleName("Sending");
            expect(button()).not.toHaveAttribute("data-round");
            await flush(900);
            expect(button()).toHaveAccessibleName("Sent");
        });

        it("folds into a round spinner when there is no pending label, keeping the state name", async () => {
            const { button } = setup({ onAction: () => new Promise((resolve) => setTimeout(resolve, 800)) });
            fireEvent.click(button());
            await flush(10);
            expect(button()).toHaveAttribute("data-round", "true");
            expect(button()).toHaveAccessibleName("Follow");
        });

        it("keeps the state and shows the failure label for 1.8s after a rejection", async () => {
            const { button } = setup({ onAction: () => Promise.reject(new Error("offline")) });
            fireEvent.click(button());
            await flush(460);
            expect(button()).toHaveAttribute("data-phase", "failed");
            expect(button()).toHaveAccessibleName("Try again");
            expect(button()).toHaveAttribute("data-tone", "danger");
            expect(screen.getByRole("status")).toHaveTextContent("Try again");

            await flush(1700);
            expect(button()).toHaveAttribute("data-phase", "failed");
            await flush(200);
            expect(button()).toHaveAttribute("data-phase", "idle");
            expect(button()).toHaveAccessibleName("Follow");
        });

        it("uses a custom failureLabel and treats a throwing onAction as a failure", async () => {
            const { button } = setup({
                failureLabel: "Could not follow",
                onAction: () => {
                    throw new Error("sync failure");
                },
            });
            fireEvent.click(button());
            await flush(460);
            expect(button()).toHaveAccessibleName("Could not follow");
        });

        it("retries when pressed during the failure message", async () => {
            const onAction = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(undefined);
            const { button } = setup({ onAction });
            fireEvent.click(button());
            await flush(460);
            expect(button()).toHaveAttribute("data-phase", "failed");
            fireEvent.click(button());
            await flush(500);
            expect(onAction).toHaveBeenCalledTimes(2);
            expect(button()).toHaveAccessibleName("Following");
        });

        it("does not update after unmount", async () => {
            const { button, unmount } = setup({ onAction: () => new Promise((resolve) => setTimeout(resolve, 300)) });
            const error = vi.spyOn(console, "error").mockImplementation(() => {});
            fireEvent.click(button());
            unmount();
            await flush(1000);
            expect(error).not.toHaveBeenCalled();
            error.mockRestore();
        });
    });

    it("advances on its own after holdFor", async () => {
        const { button } = setup({
            states: [
                { id: "send", label: "Send" },
                { id: "sent", label: "Sent", holdFor: 1500 },
            ],
        });
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Sent");
        await flush(1400);
        expect(button()).toHaveAccessibleName("Sent");
        await flush(200);
        expect(button()).toHaveAccessibleName("Send");
    });

    it("announces label changes politely, but not on mount", () => {
        const { button } = setup();
        expect(screen.getByRole("status")).toBeEmptyDOMElement();
        fireEvent.click(button());
        expect(screen.getByRole("status")).toHaveTextContent("Following");
        expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    });

    it("keeps the live region out of the button's accessible name", () => {
        const { button } = setup();
        fireEvent.click(button());
        expect(button()).toHaveAccessibleName("Following");
    });

    it("applies the size variant and forwards className", () => {
        const { button } = setup({ size: "lg", className: "mine" });
        expect(button()).toHaveClass("__action-swap--size-lg", "mine");
    });

    it("has no axe violations", async () => {
        vi.useRealTimers();
        const { container } = setup();
        expect((await axe(container)).violations).toHaveLength(0);
    });
});
