"use client";
import MaskInput, {
    AllMasks,
    CurrencyCode,
    CurrencyInputProps,
    CurrencyMaskTypes,
    Locales,
    PercentInputMask,
    PercentInputProps,
    TheMaskProps,
} from "the-mask-input";
import { createFreeText, FreeTextProps } from "./free-text";

export type * from "the-mask-input";

/**
 * Props for the Input component, extending FreeTextProps with mask functionality
 * Supports currency, percentage, and custom mask patterns
 */
export type InputProps = FreeTextProps<
    "input",
    | ({
          mask?: CurrencyMaskTypes;
          locale?: Locales;
          currency?: CurrencyCode | undefined;
      } & CurrencyInputProps)
    | ({
          mask?: PercentInputMask;
          locale?: Locales;
          currency?: undefined;
      } & PercentInputProps)
    | ({
          mask?: AllMasks | Array<string | RegExp> | ((p: string) => Array<string | RegExp> | AllMasks);
          locale?: undefined;
          currency?: undefined;
      } & TheMaskProps)
>;

/**
 * A text input component with advanced masking capabilities.
 * 
 * Supports various input masks including:
 * - Currency formatting with locale support
 * - Percentage inputs
 * - Custom regex patterns
 * - Phone numbers, dates, and other formatted inputs
 * 
 * @example
 * ```tsx
 * // Basic input
 * <Input placeholder="Enter text..." />
 * 
 * // Phone number mask
 * <Input mask="(99) 99999-9999" placeholder="Phone" />
 * 
 * // Currency input
 * <Input mask="currency" currency="USD" locale="en-US" />
 * 
 * // Percentage input
 * <Input mask="percentage" />
 * 
 * // Custom mask
 * <Input mask={["999.999.999-99"]} placeholder="CPF" />
 * ```
 * 
 * @param props - Input props including mask, validation, and styling options
 * @returns A masked input component with form integration
 */
export const Input = createFreeText<"input", HTMLInputElement, InputProps>(MaskInput, "input", {
    type: "text",
});
