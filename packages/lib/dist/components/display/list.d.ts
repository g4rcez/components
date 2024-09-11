import React, { PropsWithChildren } from "react";
import { Label } from "../../types";
type AnimatedItemProps = {
    title: Label;
    description: Label;
    children: Label;
    avatar?: Label;
    leading?: React.FC<{
        open: () => void;
    }>;
};
type AnimatedListProps = {};
export declare const AnimatedList: (props: PropsWithChildren<AnimatedListProps>) => import("react/jsx-runtime").JSX.Element;
export declare const AnimatedListItem: (props: PropsWithChildren<AnimatedItemProps>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=list.d.ts.map