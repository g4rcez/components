import { LucideProps } from "lucide-react";
import React from "react";
import { Label } from "../../types";
type MenuItemProps = {
    label: string;
    disabled?: boolean;
    Right?: React.FC<LucideProps>;
};
export declare const MenuItem: React.ForwardRefExoticComponent<MenuItemProps & React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
export declare const Menu: React.ForwardRefExoticComponent<Omit<Partial<{
    isParent: boolean;
    label: Label;
    nested: boolean;
    children: React.ReactNode;
}> & React.HTMLProps<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=menu.d.ts.map