"use client";
import type React from "react";
import type { Any } from "../../types";
import { createFreeText, type FreeTextProps } from "./free-text";

export type TextareaProps = FreeTextProps<"textarea", React.ComponentProps<"textarea">>;

export const Textarea: React.FC<TextareaProps> = createFreeText<"textarea", HTMLTextAreaElement, Any>(
    "textarea",
    "textarea",
    { container: "__textarea" },
    (textarea: HTMLTextAreaElement) => {
        const hasRows = textarea.hasAttribute("rows");
        const computeMinHeight = (): number => {
            if (!hasRows) return textarea.offsetHeight;
            const s = window.getComputedStyle(textarea);
            return (
                textarea.rows * parseFloat(s.lineHeight) +
                parseFloat(s.paddingTop) +
                parseFloat(s.paddingBottom) +
                parseFloat(s.borderTopWidth) +
                parseFloat(s.borderBottomWidth)
            );
        };
        const minHeight = computeMinHeight();
        const adjustHeight = () => {
            textarea.style.height = "0px";
            textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
        };
        adjustHeight();
        textarea.addEventListener("input", adjustHeight);
        return () => {
            textarea.removeEventListener("input", adjustHeight);
            textarea.style.height = "";
        };
    }
);
