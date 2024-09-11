import React, { PropsWithChildren } from "react";
import { Label } from "../../types";
export type DrawerProps = {
    title?: Label;
    open: boolean;
    footer?: Label;
    resizer?: boolean;
    asChild?: boolean;
    closable?: boolean;
    type?: "dialog" | "drawer";
    position?: "left" | "right";
    trigger?: Label | React.FC<any>;
    onChange: (nextState: boolean) => void;
};
export declare const Modal: ({ type: _type, resizer, ...props }: PropsWithChildren<DrawerProps>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=modal.d.ts.map