import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Wizard } from "../src/components/floating/wizard/wizard";
import { ComponentsProvider } from "../src/hooks/use-components-provider";

const renderWizard = (props: Partial<React.ComponentProps<typeof Wizard>> = {}) =>
    render(
        <ComponentsProvider>
            <Wizard
                active
                steps={[
                    { element: "#missing-first", title: "First step" },
                    { element: "#missing-second", title: "Second step" },
                ]}
                {...props}
            />
        </ComponentsProvider>
    );

describe("Wizard", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("centers a missing target and focuses the next action", async () => {
        renderWizard();

        const dialog = await screen.findByRole("dialog");
        const next = screen.getByRole("button", { name: "Next" });

        expect(dialog).toHaveStyle({ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" });
        await waitFor(() => expect(next).toHaveFocus());
    });

    it("keeps the spotlight aligned through resize, ancestor scroll, and target changes", async () => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        vi.stubGlobal(
            "IntersectionObserver",
            class IntersectionObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        const ancestor = document.createElement("div");
        const first = document.createElement("button");
        const second = document.createElement("button");
        ancestor.append(first, second);
        document.body.append(ancestor);
        let firstRect = new DOMRect(20, 40, 100, 30);
        let secondRect = new DOMRect(300, 200, 80, 40);
        const firstMeasure = vi.spyOn(first, "getBoundingClientRect").mockImplementation(() => firstRect);
        const secondMeasure = vi.spyOn(second, "getBoundingClientRect").mockImplementation(() => secondRect);
        const { unmount } = renderWizard({
            steps: [
                { element: first, title: "First target" },
                { element: second, title: "Second target" },
            ],
        });
        const expectSpotlight = async (rect: DOMRect) => {
            await waitFor(
                () => {
                    const spotlight = document.querySelector("#driver-mask rect[fill='black']");
                    expect(Number.parseFloat(spotlight?.getAttribute("width") ?? "")).toBe(rect.width + 10);
                    expect(Number.parseFloat(spotlight?.getAttribute("height") ?? "")).toBe(rect.height + 10);
                    expect(spotlight).toHaveStyle({
                        transform: `translateX(${rect.left - 5}px) translateY(${rect.top - 5}px)`,
                    });
                },
                { timeout: 3000 }
            );
        };

        try {
            await expectSpotlight(firstRect);
            firstRect = new DOMRect(50, 60, 140, 50);
            fireEvent.resize(window);
            await expectSpotlight(firstRect);

            firstRect = new DOMRect(50, 10, 140, 50);
            fireEvent.scroll(ancestor);
            await expectSpotlight(firstRect);

            fireEvent.keyDown(document, { key: "ArrowRight" });
            await expectSpotlight(secondRect);
            secondRect = new DOMRect(310, 120, 90, 60);
            fireEvent.scroll(ancestor);
            await expectSpotlight(secondRect);

            unmount();
            firstMeasure.mockClear();
            secondMeasure.mockClear();
            fireEvent.resize(window);
            fireEvent.scroll(ancestor);
            expect(document.querySelector("#driver-mask")).not.toBeInTheDocument();
            expect(firstMeasure).not.toHaveBeenCalled();
            expect(secondMeasure).not.toHaveBeenCalled();
        } finally {
            unmount();
            firstMeasure.mockRestore();
            secondMeasure.mockRestore();
            ancestor.remove();
        }
    });

    it("scrolls a target that is outside the viewport into view, and leaves a visible one alone", async () => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        const visible = document.createElement("button");
        const below = document.createElement("button");
        document.body.append(visible, below);
        vi.spyOn(visible, "getBoundingClientRect").mockImplementation(() => new DOMRect(100, 100, 120, 40));
        vi.spyOn(below, "getBoundingClientRect").mockImplementation(() => new DOMRect(100, window.innerHeight + 900, 120, 40));
        const scrollVisible = vi.fn();
        const scrollBelow = vi.fn();
        visible.scrollIntoView = scrollVisible;
        below.scrollIntoView = scrollBelow;

        const { unmount } = renderWizard({
            steps: [
                { element: visible, title: "Visible target" },
                { element: below, title: "Far target" },
            ],
        });
        try {
            await screen.findByText("Visible target");
            expect(scrollVisible).not.toHaveBeenCalled();

            fireEvent.keyDown(document, { key: "ArrowRight" });
            await screen.findByText("Far target");
            await waitFor(() => expect(scrollBelow).toHaveBeenCalledTimes(1));
            expect(scrollBelow).toHaveBeenCalledWith({ block: "center", inline: "nearest", behavior: "smooth" });
        } finally {
            unmount();
            visible.remove();
            below.remove();
        }
    });

    it("runs onEnter before looking up the target, so a step can open what it points at", async () => {
        vi.stubGlobal(
            "ResizeObserver",
            class ResizeObserver {
                observe() {}
                unobserve() {}
                disconnect() {}
            }
        );
        const panel = document.createElement("button");
        panel.id = "opened-by-step";
        vi.spyOn(panel, "getBoundingClientRect").mockImplementation(() => new DOMRect(120, 140, 100, 32));
        const onEnter = vi.fn(() => {
            // The target mounts a moment after the step starts, like a modal that animates in.
            window.setTimeout(() => document.body.append(panel), 250);
        });
        const { unmount } = renderWizard({
            steps: [
                { element: "#before", title: "Plain step" },
                { element: "#opened-by-step", title: "Opens a panel", onEnter },
            ],
        });
        try {
            await screen.findByText("Plain step");
            expect(onEnter).not.toHaveBeenCalled();

            fireEvent.keyDown(document, { key: "ArrowRight" });
            await screen.findByText("Opens a panel");
            expect(onEnter).toHaveBeenCalledTimes(1);

            // Found after it mounted, so the card is anchored to the target and not centered on the screen.
            await waitFor(() => expect(screen.getByRole("dialog")).not.toHaveStyle({ top: "50%", left: "50%" }), { timeout: 3000 });
        } finally {
            unmount();
            panel.remove();
        }
    });

    it("navigates with horizontal arrow keys", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        renderWizard({ onChange });

        await screen.findByText("First step");
        await user.keyboard("[ArrowRight]");
        expect(await screen.findByText("Second step")).toBeInTheDocument();
        expect(onChange).toHaveBeenLastCalledWith(1);

        await user.keyboard("[ArrowLeft]");
        expect(await screen.findByText("First step")).toBeInTheDocument();
        expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it("ignores repeated navigation while a step transition is pending", async () => {
        const onChange = vi.fn();
        renderWizard({ onChange });

        await screen.findByText("First step");
        fireEvent.keyDown(document, { key: "ArrowRight" });
        fireEvent.keyDown(document, { key: "ArrowRight" });

        expect(await screen.findByText("Second step")).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it("does not intercept arrow keys from editable controls", async () => {
        const user = userEvent.setup();
        render(
            <ComponentsProvider>
                <input aria-label="Tour notes" />
                <Wizard
                    active
                    steps={[
                        { element: "#missing-first", title: "First step" },
                        { element: "#missing-second", title: "Second step" },
                    ]}
                />
            </ComponentsProvider>
        );

        const input = screen.getByRole("textbox", { name: "Tour notes" });
        input.focus();
        await user.keyboard("[ArrowRight]");

        expect(screen.getByText("First step")).toBeInTheDocument();
    });
});
