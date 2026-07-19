import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ComponentsProvider } from "../src/hooks/use-components-provider";
import { Input } from "../src/components/form/input/input";
import { freeTextStyles } from "../src/components/form/input/free-text.styles";
import { Textarea } from "../src/components/form/input/textarea";

describe("free text focus treatment", () => {
    it("highlights the field border when Input is focused", async () => {
        const user = userEvent.setup();

        render(
            <ComponentsProvider>
                <Input required title="Number" name="number" />
            </ComponentsProvider>
        );

        const input = screen.getByRole("textbox", { name: "Number" });
        await user.click(input);

        expect(document.activeElement).toBe(input);
        expect(input.parentElement).toHaveClass(freeTextStyles.slots["field-state"]);
    });

    it("highlights the field border when Textarea is focused", async () => {
        const user = userEvent.setup();

        render(
            <ComponentsProvider>
                <Textarea required title="Description" name="description" />
            </ComponentsProvider>
        );

        const textarea = screen.getByRole("textbox", { name: "Description" });
        await user.click(textarea);

        expect(document.activeElement).toBe(textarea);
        expect(textarea.parentElement).toHaveClass(freeTextStyles.slots["field-state"]);
    });
});
