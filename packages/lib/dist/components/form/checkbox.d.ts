import React from "react";
import { Override } from "../../types";
export type CheckboxProps = Override<React.PropsWithChildren<React.ComponentProps<"input">>, {
    size?: "medium" | "large";
    error?: string;
    container?: string;
}>;
export declare const Checkbox: React.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=checkbox.d.ts.map