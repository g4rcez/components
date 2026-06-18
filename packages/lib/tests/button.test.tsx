import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../src/components/core/button";

describe("Button", () => {
    it.each(["icon", "big", "default", "min", "tiny", "small"] as const)("uses the stable %s size class", (size) => {
        render(<Button size={size}>{size}</Button>);

        expect(screen.getByRole("button", { name: size })).toHaveClass("__button", `__button--size-${size}`);
    });
});
