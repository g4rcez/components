"use client";
import React from "react";
import { Any } from "../../types";
import { createFreeText, FreeTextProps } from "./free-text";

export type TextareaProps = FreeTextProps<"textarea", Any>;

export const Textarea: React.FC<TextareaProps> = createFreeText<"textarea", HTMLTextAreaElement, Any>(
    "textarea",
    "textarea",
    { container: "w-full" },
    (textarea: HTMLTextAreaElement) => {
        const adjustHeight = () => {
            const lineBreakers = textarea.value.split("\n");
            textarea.style.height = "auto";
            if (lineBreakers.length > 1) return void (textarea.style.height = `${textarea.scrollHeight}px`);
        };
        textarea.addEventListener("input", adjustHeight);
        return () => textarea.removeEventListener("input", adjustHeight);
    }
);
