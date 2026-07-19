import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Loading, Spinner } from "../src/components/display/spinner";

describe("Spinner v6 styles", () => {
    it("renders the stable spinner root class", () => {
        render(<Spinner className="custom-spinner" />);

        expect(screen.getByRole("status")).toHaveClass("__spinner", "custom-spinner");
        expect(screen.getByRole("status")).toHaveAttribute("data-component", "spinner");
    });

    it("renders the stable loading container slot", () => {
        const { container } = render(<Loading />);

        const wrapper = container.querySelector(".__spinner__container");
        expect(wrapper).toHaveAttribute("data-component", "spinner");
        expect(wrapper).toHaveAttribute("data-slot", "container");
        expect(screen.getByRole("status")).toHaveClass("__spinner");
    });
});
