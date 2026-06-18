import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stats } from "../src/components/display/stats";

const Icon = ({ className }: { className: string }) => <svg aria-hidden="true" className={className} />;

describe("Stats v6 styles", () => {
    it("renders stable root and slot classes", () => {
        const { container } = render(
            <Stats title="Revenue" Icon={Icon} iconContainer="custom-icon" footer={<span>Last month</span>}>
                $42k
            </Stats>
        );

        const root = container.querySelector(".__stats");
        expect(root).toHaveAttribute("data-component", "stats");
        expect(root?.querySelector(".__stats__header")).toHaveAttribute("data-slot", "header");
        expect(root?.querySelector(".__stats__icon")).toHaveClass("__stats__icon", "custom-icon");
        expect(root?.querySelector(".__stats__icon-svg")).toBeInTheDocument();
        expect(screen.getByText("Revenue")).toHaveClass("__stats__title");
        expect(screen.getByText("$42k")).toHaveClass("__stats__value");
        expect(screen.getByText("Last month").parentElement).toHaveClass("__stats__footer");
    });
});
