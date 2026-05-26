import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

import { Select } from "../src/components/form/select";

describe("Select a11y", () => {
    const options = [{ label: "United States", value: "us" }];

    it("exposes the label and help text in the accessible description", async () => {
        const { container } = render(
            <Select title="Choose country" name="country" feedback="Helpful country hint" options={options} placeholder="Choose country" />
        );

        const select = screen.getByRole("combobox", { name: "Choose country" });

        expect(select).toHaveAccessibleDescription("Helpful country hint");
        expect((await axe(container)).violations).toHaveLength(0);
    });

    it("marks invalid state and exposes the error in the accessible description", async () => {
        const { container } = render(
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
        const { container } = render(
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
});
