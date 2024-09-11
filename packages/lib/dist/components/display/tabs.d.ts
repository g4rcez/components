import { PropsWithChildren } from "react";
import { Label } from "../../types";
export type TabsProps = {
    active: string;
    onChange?: (id: string) => void;
    useHash?: boolean;
    className?: string;
};
export declare const Tabs: (props: PropsWithChildren<TabsProps>) => import("react/jsx-runtime").JSX.Element;
export type TabProps = {
    id: string;
    title: string;
    label?: undefined;
} | {
    id: string;
    title: Omit<Label, string>;
    label: string;
};
export declare const Tab: (props: PropsWithChildren<TabProps>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tabs.d.ts.map