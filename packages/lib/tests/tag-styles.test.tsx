import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tag } from "../src/components/core/tag";

describe("Tag v6 styles", () => {
    it("renders stable root size and theme classes", () => {
        render(<Tag size="small">Queued</Tag>);

        expect(screen.getByText("Queued")).toHaveClass("__tag", "__tag--size-small", "__tag--theme-primary");
    });

    it("renders stable loading and indicator slot classes", () => {
        render(
            <Tag indicator loading>
                Syncing
            </Tag>
        );

        const tag = screen.getByText("Syncing");
        const indicator = tag.querySelector(".__tag__indicator");

        expect(tag).toHaveClass("__tag--theme-loading");
        expect(tag).toHaveAttribute("data-loading", "true");
        expect(indicator).toHaveClass("__tag__indicator", "__tag__indicator--theme-primary");
    });

    it("preserves consumer className overrides", () => {
        render(<Tag className="custom-class">Custom</Tag>);

        expect(screen.getByText("Custom")).toHaveClass("__tag", "custom-class");
    });
});
