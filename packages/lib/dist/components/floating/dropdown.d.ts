import React, { PropsWithChildren } from "react";
type DropdownProps = {
    open?: boolean;
    arrow?: boolean;
    restoreFocus?: boolean;
    returnFocus?: boolean;
    onChange?: (nextValue: boolean) => void;
    trigger: React.ReactElement | React.ReactNode;
    title?: React.ReactNode | React.ReactElement | string;
    buttonProps?: React.ComponentProps<"button">;
};
export declare const Dropdown: (props: PropsWithChildren<DropdownProps>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=dropdown.d.ts.map