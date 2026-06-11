import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Input } from "../src/components/form/input";
import { Textarea } from "../src/components/form/textarea";

describe("free text focus treatment", () => {
    it("highlights the field border when Input is focused", async () => {
        const user = userEvent.setup();

        render(<Input required title="Number" name="number" />);

        const input = screen.getByRole("textbox", { name: "Number" });
        await user.click(input);

        expect(document.activeElement).toBe(input);
        expect(input).not.toHaveClass("focus:ring-2");
        expect(input.parentElement).toHaveClass("focus-within:border-primary");
    });

    it("highlights the field border when Textarea is focused", async () => {
        const user = userEvent.setup();

        render(<Textarea required title="Description" name="description" />);

        const textarea = screen.getByRole("textbox", { name: "Description" });
        await user.click(textarea);

        expect(document.activeElement).toBe(textarea);
        expect(textarea).not.toHaveClass("focus:ring-2");
        expect(textarea.parentElement).toHaveClass("focus-within:border-primary");
    });
});
