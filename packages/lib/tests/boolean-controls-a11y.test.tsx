import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { Checkbox } from "../src/components/form/checkbox";
import { Switch } from "../src/components/form/switch";

describe("Boolean controls a11y", () => {
    it("exposes checkbox error text as an accessible description and supports Space toggling", async () => {
        const user = userEvent.setup();

        const { container } = render(<Checkbox error="You must accept terms">Accept terms</Checkbox>);

        const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

        expect(checkbox).toHaveAccessibleDescription("You must accept terms");
        expect(checkbox).toHaveAttribute("aria-invalid", "true");

        checkbox.focus();
        await user.keyboard("{Space}");

        expect(checkbox).toBeChecked();
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("preserves checkbox aria-invalid and describedby when no error is set", async () => {
        const { container } = render(
            <>
                <span id="checkbox-help">Custom checkbox help</span>
                <Checkbox aria-describedby="checkbox-help" aria-invalid="grammar">
                    Accept terms
                </Checkbox>
            </>
        );

        const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

        expect(checkbox).toHaveAccessibleDescription("Custom checkbox help");
        expect(checkbox).toHaveAttribute("aria-invalid", "grammar");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("exposes switch error text as an accessible description and supports Space toggling", async () => {
        const user = userEvent.setup();

        const { container } = render(<Switch error="Notifications unavailable">Email notifications</Switch>);

        const switchControl = screen.getByRole("switch", { name: "Email notifications" });

        expect(switchControl).toHaveAccessibleDescription("Notifications unavailable");
        expect(switchControl).toHaveAttribute("aria-invalid", "true");

        switchControl.focus();
        await user.keyboard("{Space}");

        expect(switchControl).toHaveAttribute("aria-checked", "true");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("preserves switch aria-invalid and describedby when no error is set", async () => {
        const { container } = render(
            <>
                <span id="switch-help">Custom switch help</span>
                <Switch aria-describedby="switch-help" aria-invalid="spelling">
                    Email notifications
                </Switch>
            </>
        );

        const switchControl = screen.getByRole("switch", { name: "Email notifications" });

        expect(switchControl).toHaveAccessibleDescription("Custom switch help");
        expect(switchControl).toHaveAttribute("aria-invalid", "spelling");
        expect((await axe(container)).violations).toHaveLength(0);
    });
});
