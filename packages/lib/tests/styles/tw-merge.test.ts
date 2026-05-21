import { describe, expect, it } from "vitest";
import { css } from "../../src/lib/dom";

describe("css() recognises component tokens", () => {
  it("dedupes padding tokens against built-in padding utilities", () => {
    expect(css("p-4", "p-stats-icon-p")).toBe("p-stats-icon-p");
    expect(css("p-stats-icon-p", "p-4")).toBe("p-4");
  });

  it("dedupes axis-specific padding tokens", () => {
    expect(css("px-2", "px-table-cell-px")).toBe("px-table-cell-px");
    expect(css("py-1", "py-modal-body-py")).toBe("py-modal-body-py");
  });

  it("dedupes gap tokens", () => {
    expect(css("gap-2", "gap-stats-gap")).toBe("gap-stats-gap");
  });

  it("dedupes size tokens", () => {
    expect(css("size-10", "size-stats-icon-size")).toBe("size-stats-icon-size");
    expect(css("h-8", "h-skeleton-height")).toBe("h-skeleton-height");
    expect(css("w-32", "w-skeleton-width")).toBe("w-skeleton-width");
  });

  it("dedupes rounded tokens", () => {
    expect(css("rounded-lg", "rounded-card-radius")).toBe(
      "rounded-card-radius",
    );
    expect(css("rounded-t-lg", "rounded-t-modal-radius")).toBe(
      "rounded-t-modal-radius",
    );
  });

  it("dedupes typography tokens against built-in text-size utilities", () => {
    expect(css("text-xs", "text-2xl")).toBe("text-2xl");
  });

  it("keeps unrelated utilities untouched", () => {
    expect(css("flex p-stats-icon-p text-foreground")).toBe(
      "flex p-stats-icon-p text-foreground",
    );
  });

  it("dedupes form input spacing and radius tokens", () => {
    expect(css("p-2", "p-input-padding-x")).toBe("p-input-padding-x");
    expect(css("rounded-md", "rounded-input-radius")).toBe(
      "rounded-input-radius",
    );
    expect(css("text-base", "text-input-text")).toBe("text-input-text");
  });

  it("dedupes selection control tokens", () => {
    expect(css("size-4", "size-checkbox-size")).toBe("size-checkbox-size");
    expect(css("h-6", "h-switch-track-h")).toBe("h-switch-track-h");
    expect(css("text-sm", "text-switch-label-text")).toBe(
      "text-switch-label-text",
    );
  });

  it("dedupes slider thumb and file-upload tokens", () => {
    expect(css("size-5", "size-slider-thumb-size")).toBe(
      "size-slider-thumb-size",
    );
    expect(css("p-6", "p-file-upload-p")).toBe("p-file-upload-p");
  });

  it("dedupes new component token group spacings", () => {
    expect(css("p-4", "p-spinner-container-p")).toBe("p-spinner-container-p");
    expect(css("size-12", "size-spinner-size")).toBe("size-spinner-size");
    expect(css("gap-4", "gap-list-card-gap")).toBe("gap-list-card-gap");
    expect(css("size-10", "size-step-size")).toBe("size-step-size");
    expect(css("px-10", "px-tabs-item-px")).toBe("px-tabs-item-px");
    expect(css("bottom-4", "bottom-toolbar-bottom")).toBe(
      "bottom-toolbar-bottom",
    );
    expect(css("w-80", "w-wizard-w")).toBe("w-wizard-w");
    expect(css("min-h-32", "min-h-page-calendar-cell-min-h")).toBe(
      "min-h-page-calendar-cell-min-h",
    );
  });

  it("dedupes typography fillers against tailwind defaults", () => {
    expect(css("text-sm", "text-typography-sm")).toBe("text-typography-sm");
    expect(css("text-base", "text-typography-base")).toBe(
      "text-typography-base",
    );
    expect(css("text-lg", "text-typography-lg")).toBe("text-typography-lg");
    expect(css("text-[10px]", "text-page-calendar-hour-text")).toBe(
      "text-page-calendar-hour-text",
    );
  });

  it("dedupes table rounded corner tokens", () => {
    expect(css("rounded-tl-lg", "rounded-tl-table-radius")).toBe(
      "rounded-tl-table-radius",
    );
  });

  it("dedupes spinner border-width token", () => {
    expect(css("border-4", "border-spinner-border")).toBe(
      "border-spinner-border",
    );
  });

  it("dedupes compound -radius tokens (modal resizer, sheet pill, notification close)", () => {
    expect(css("rounded-lg", "rounded-modal-resizer-radius")).toBe(
      "rounded-modal-resizer-radius",
    );
    expect(css("rounded-lg", "rounded-modal-sheet-pill-radius")).toBe(
      "rounded-modal-sheet-pill-radius",
    );
    expect(css("rounded-full", "rounded-notification-close-radius")).toBe(
      "rounded-notification-close-radius",
    );
  });
});
