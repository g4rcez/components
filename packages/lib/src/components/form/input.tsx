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

export const Input = createFreeText<"input", HTMLInputElement, InputProps>(MaskInput, "input", {
    type: "text",
});
