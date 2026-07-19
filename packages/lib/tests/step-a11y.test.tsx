import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { Step, Steps } from "../src/components/display/step/step";

describe("Step a11y", () => {
    it("marks only the current step and hides decorative status icons", async () => {
        const { container } = render(
            <Steps currentStep={2} steps={3}>
                <Step step={1} currentStep={2} title="Account" />
                <Step step={2} currentStep={2} title="Profile" />
                <Step step={3} currentStep={2} title="Done" />
            </Steps>
        );

        const accountStep = screen.getByRole("button", { name: /Account/ });
        const profileStep = screen.getByRole("button", { name: /Profile/ });
        const doneStep = screen.getByRole("button", { name: /Done/ });

        expect(accountStep).not.toHaveAttribute("aria-current");
        expect(profileStep).toHaveAttribute("aria-current", "step");
        expect(doneStep).not.toHaveAttribute("aria-current");

        expect(accountStep.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
        expect(accountStep.querySelector("svg")).toHaveAttribute("focusable", "false");
        expect(within(profileStep).queryByRole("img")).not.toBeInTheDocument();
        expect(within(doneStep).queryByRole("img")).not.toBeInTheDocument();

        expect(profileStep.querySelector("svg")).not.toBeInTheDocument();
        expect(doneStep.querySelector("svg")).not.toBeInTheDocument();

        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("keeps decorative status icons hidden for completed and error steps", async () => {
        const { container: completedContainer } = render(
            <Steps currentStep={3} steps={3}>
                <Step step={1} currentStep={3} title="Account" />
                <Step step={2} currentStep={3} title="Profile" />
                <Step step={3} currentStep={3} title="Done" />
            </Steps>
        );

        const completedStep = screen.getByRole("button", { name: /Account/ });
        const completedSvg = completedStep.querySelector("svg");

        expect(completedSvg).toHaveAttribute("aria-hidden", "true");
        expect(completedSvg).toHaveAttribute("focusable", "false");
        expect((await axe(completedContainer)).violations).toHaveLength(0);
    });

    it("keeps error status icons hidden from the accessible tree", async () => {
        const { container } = render(<Step step={1} currentStep={2} status="error" title="Account" />);

        const errorStep = screen.getByRole("button", { name: "Account" });
        const errorSvg = errorStep.querySelector("svg");

        expect(errorSvg).toHaveAttribute("aria-hidden", "true");
        expect(errorSvg).toHaveAttribute("focusable", "false");
        expect((await axe(container)).violations).toHaveLength(0);
    });
});
