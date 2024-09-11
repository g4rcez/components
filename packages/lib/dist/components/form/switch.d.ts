import React from "react";
export type SwitchProps = Omit<React.ComponentProps<"input">, "onChange"> & {
    onCheck?: (nextValue: boolean) => void;
    error?: string;
    container?: string;
};
export declare const Switch: React.ForwardRefExoticComponent<Omit<SwitchProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=switch.d.ts.map