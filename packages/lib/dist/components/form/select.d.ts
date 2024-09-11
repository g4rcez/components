import React from "react";
import { Override } from "../../types";
import { InputFieldProps } from "./input-field";
export type OptionProps = Override<React.ComponentProps<"option">, {
    value: string;
    "data-dynamic"?: string;
}>;
export type SelectProps = Override<InputFieldProps<"select">, {
    options: OptionProps[];
    selectContainer?: string;
}>;
export declare const Select: React.ForwardRefExoticComponent<Omit<SelectProps, "ref"> & React.RefAttributes<HTMLSelectElement>>;
//# sourceMappingURL=select.d.ts.map