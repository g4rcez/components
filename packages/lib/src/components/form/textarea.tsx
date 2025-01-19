"use client";
import React from "react";
import { createFreeText, FreeTextProps } from "./free-text";

export type TextareaProps = FreeTextProps<"textarea", {}>;

export const Textarea: React.FC<TextareaProps> = createFreeText<"textarea", HTMLTextAreaElement, {}>(
    "textarea",
    { container: "w-full" },
    (textarea: HTMLTextAreaElement) => {
        const adjustHeight = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        };
        textarea.addEventListener("input", adjustHeight);
        return () => textarea.removeEventListener("input", adjustHeight);
    }
);
