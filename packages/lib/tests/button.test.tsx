import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../src/components/core/button";

describe("Button", () => {
    it.each([
        ["icon", "text-button-text-icon"],
        ["big", "text-button-text-big"],
        ["default", "text-button-text"],
        ["min", "text-button-text-min"],
        ["tiny", "text-button-text-tiny"],
        ["small", "text-button-text-small"],
    ] as const)("uses the %s font-size token", (size, className) => {
        render(<Button size={size}>{size}</Button>);

        expect(screen.getByRole("button", { name: size })).toHaveClass(className);
    });
});
