"use client";
import MaskInput, { TheMaskProps } from "the-mask-input";
import { createFreeText, FreeTextProps } from "./free-text";

export type InputProps = FreeTextProps<"input", TheMaskProps>; //Override<InputFieldProps<"input">, TheMaskProps & FeedbackProps & { next?: string }>;

export const Input = createFreeText<"input", HTMLInputElement, TheMaskProps>(MaskInput, { type: "text" });
