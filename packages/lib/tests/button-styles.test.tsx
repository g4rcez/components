import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/core/button";

describe("Button style contract", () => {
    it("renders stable default style classes", () => {
        render(<Button>Save</Button>);

        expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
            "__button",
            "__button--size-default",
            "__button--theme-main",
            "__button--rounded-default"
        );
    });

    it("renders variant and slot classes", () => {
        render(
            <Button icon={<span aria-hidden="true">+</span>} size="small" theme="ghost-primary" rounded="rough">
                Add
            </Button>
        );

        const button = screen.getByRole("button", { name: "Add" });
        expect(button).toHaveClass("__button--size-small", "__button--theme-ghost-primary", "__button--rounded-rough");
        expect(button.querySelector(".__button__icon")).toBeInTheDocument();
    });

    it("renders the outlined theme class", () => {
        render(<Button theme="outlined">Details</Button>);

        expect(screen.getByRole("button", { name: "Details" })).toHaveClass("__button--theme-outlined");
    });

    it("keeps loading as a state data attribute", () => {
        render(<Button loading>Saving</Button>);

        expect(screen.getByRole("button", { name: "Saving" })).toHaveAttribute("data-loading", "true");
    });
});
