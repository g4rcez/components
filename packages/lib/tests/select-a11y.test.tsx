import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Select } from "../src/components/form/select/select";
import { selectStyles } from "../src/components/form/select/select.styles";

describe("Select a11y", () => {
    const options = [{ label: "United States", value: "us" }];
    const renderWithProvider = (ui: React.ReactElement) => render(<ComponentsProvider>{ui}</ComponentsProvider>);

    it("exposes the label and help text in the accessible description", async () => {
        const { container } = renderWithProvider(
            <Select title="Choose country" name="country" feedback="Helpful country hint" options={options} placeholder="Choose country" />
        );

        const select = screen.getByRole("combobox", { name: "Choose country" });

        expect(select).toHaveAccessibleDescription("Helpful country hint");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("marks invalid state and exposes the error in the accessible description", async () => {
        const { container } = renderWithProvider(
            <Select
                title="Choose country"
                name="country"
                feedback="Helpful country hint"
                error="Invalid country"
                options={options}
                placeholder="Choose country"
            />
        );

        const select = screen.getByRole("combobox", { name: "Choose country" });

        expect(select).toHaveAttribute("aria-invalid", "true");
        expect(select).toHaveAccessibleDescription(expect.stringContaining("Invalid country"));
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("preserves consumer aria props while appending generated ids", async () => {
        const { container } = renderWithProvider(
            <Select
                title="Choose country"
                name="country"
                feedback="Helpful country hint"
                error="Invalid country"
                options={options}
                placeholder="Choose country"
                aria-describedby="custom-description"
                aria-invalid={false}
            />
        );

        const select = screen.getByRole("combobox", { name: "Choose country" });

        expect(select).toHaveAttribute("aria-invalid", "true");
        expect(select).toHaveAttribute("aria-describedby", expect.stringContaining("custom-description"));
        expect(select).toHaveAttribute("aria-describedby", expect.stringContaining("country-feedback"));
        expect(select).toHaveAttribute("aria-describedby", expect.stringContaining("country-error"));
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("keeps a single field-level focus treatment after selecting an option", async () => {
        const user = userEvent.setup();

        renderWithProvider(<Select title="Choose country" name="country" options={options} placeholder="Choose country" />);

        const select = screen.getByRole("combobox", { name: "Choose country" });
        await user.selectOptions(select, "us");

        expect(document.activeElement).toBe(select);
        expect(select).not.toHaveClass("focus:ring-2");
        expect(select).not.toHaveClass("focus:ring-inset");
        expect(select).not.toHaveClass("focus:ring-primary");
        expect(select.parentElement).toHaveClass(selectStyles.slots.field);
    });

    it("disables select interactions and uses not-allowed affordances", () => {
        renderWithProvider(<Select disabled title="Choose country" name="country" options={options} placeholder="Choose country" />);

        const select = screen.getByRole("combobox", { name: "Choose country" });
        const caretButton = screen.getByRole("button");

        expect(select).toBeDisabled();
        expect(select).toHaveClass(selectStyles.slots.control);
        expect(caretButton).toBeDisabled();
        expect(caretButton).toHaveClass(selectStyles.slots.trigger);
        expect(select.parentElement).toHaveClass(selectStyles.slots.field);
    });
});
