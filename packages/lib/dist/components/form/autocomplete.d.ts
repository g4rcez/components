import React from "react";
import { InputFieldProps } from "./input-field";
import { type OptionProps } from "./select";
type ItemProps = Omit<React.HTMLProps<HTMLLIElement>, "children"> & {
    selected: boolean;
    active: boolean;
    option: OptionProps;
};
export declare const Option: React.ForwardRefExoticComponent<Omit<ItemProps, "ref"> & React.RefAttributes<HTMLLIElement>>;
export type AutocompleteProps = Omit<InputFieldProps<"input">, "value"> & {
    value?: string;
    options: OptionProps[];
    dynamicOption?: boolean;
};
export declare const Autocomplete: React.ForwardRefExoticComponent<Omit<AutocompleteProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=autocomplete.d.ts.map