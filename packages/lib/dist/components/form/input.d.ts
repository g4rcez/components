import React from "react";
import { TheMaskProps } from "the-mask-input";
import { Override } from "../../types";
import { FeedbackProps, InputFieldProps } from "./input-field";
export type InputProps = Override<InputFieldProps<"input">, TheMaskProps & FeedbackProps & {
    next?: string;
}>;
export declare const Input: React.FC<InputProps>;
//# sourceMappingURL=input.d.ts.map