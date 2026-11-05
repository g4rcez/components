import type { Placement } from "@floating-ui/react";

const sideOrigin = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

/** CSS `transform-origin` that grows a floating panel from the edge facing its trigger. */
export const placementOrigin = (placement: Placement): string => {
    const [side, align] = placement.split("-") as [keyof typeof sideOrigin, "start" | "end" | undefined];
    const vertical = side === "top" || side === "bottom";
    const cross = align === "start" ? (vertical ? "left" : "top") : align === "end" ? (vertical ? "right" : "bottom") : "center";
    return vertical ? `${cross} ${sideOrigin[side]}` : `${sideOrigin[side]} ${cross}`;
};
