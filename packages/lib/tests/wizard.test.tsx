import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
    it("centers a missing target and focuses the next action", async () => {
        renderWizard();

        const dialog = await screen.findByRole("dialog");
        const next = screen.getByRole("button", { name: "Next" });

        expect(dialog).toHaveStyle({ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" });
        await waitFor(() => expect(next).toHaveFocus());
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
