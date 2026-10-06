import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/components/core/button/button";

describe("Button disabled anchors", () => {
    it("omits href and activation when disabled", () => {
        const onClick = vi.fn();
        render(
            <Button as="a" href="/disabled" disabled onClick={onClick}>
                Disabled link
            </Button>
        );

        const anchor = screen.getByText("Disabled link");
        expect(anchor.tagName).toBe("A");
        expect(anchor).not.toHaveAttribute("href");
        expect(anchor).toHaveAttribute("aria-disabled", "true");

        fireEvent.click(anchor);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("omits href and activation while loading", () => {
        const onClick = vi.fn();
        render(
            <Button as="a" href="/loading" loading onClick={onClick}>
                Loading link
            </Button>
        );

        const anchor = screen.getByText("Loading link");
        expect(anchor.tagName).toBe("A");
        expect(anchor).not.toHaveAttribute("href");
        expect(anchor).toHaveAttribute("aria-disabled", "true");
        expect(anchor).toHaveAttribute("aria-busy", "true");

        fireEvent.click(anchor);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("preserves href and activation when enabled", () => {
        const onClick = vi.fn();
        render(
            <Button
                as="a"
                href="/enabled"
                onClick={(event) => {
                    event.preventDefault();
                    onClick();
                }}
            >
                Enabled link
            </Button>
        );

        const anchor = screen.getByRole("link", { name: "Enabled link" });
        expect(anchor).toHaveAttribute("href", "/enabled");

        fireEvent.click(anchor);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("keeps native disabled-button behavior", () => {
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                Disabled button
            </Button>
        );

        const button = screen.getByRole("button", { name: "Disabled button" });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-disabled", "true");

        fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });
});
