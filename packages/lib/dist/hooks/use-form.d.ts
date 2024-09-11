import React from "react";
import { AllPaths } from "sidekicker";
import { z } from "zod";
import { AutocompleteProps } from "../components/form/autocomplete";
import { CheckboxProps } from "../components/form/checkbox";
import { InputProps } from "../components/form/input";
import { SelectProps } from "../components/form/select";
import { SwitchProps } from "../components/form/switch";
export declare const formToJson: (form: HTMLFormElement) => any;
export declare const convertPath: (path: string) => string[];
export declare const getSchemaShape: <T extends z.ZodObject<any>>(name: string, schema: T) => T;
type CustomOnInvalid = (args: {
    form: HTMLFormElement;
    errors: Record<string, string>;
}) => any;
export type UseFormSubmitParams<T> = {
    success: boolean;
    errors: Array<{
        message: string;
        path: string[];
    }>;
    json: any;
    data: T;
    form: HTMLFormElement;
    reset: () => void;
    event: React.FormEvent<HTMLFormElement>;
};
type UseFormSubmit<T> = (args: UseFormSubmitParams<T>) => any;
export declare const useForm: <T extends z.ZodObject<any>>(schema: T) => {
    input: <Props extends InputProps>(name: AllPaths<z.infer<T>>, props?: Props) => Props;
    checkbox: <Props extends CheckboxProps | SwitchProps>(name: AllPaths<z.infer<T>>, props?: Props) => Props;
    select: <Props extends SelectProps | AutocompleteProps>(name: AllPaths<z.infer<T>>, props?: Props) => Props;
    onSubmit: (exec: UseFormSubmit<z.infer<T>>) => (event: React.FormEvent<HTMLFormElement>) => any;
    errors: Record<string, string | undefined> | null;
    onInvalid: (exec?: CustomOnInvalid) => (event: React.FormEvent<HTMLFormElement>) => void;
    disabled: boolean;
};
export {};
//# sourceMappingURL=use-form.d.ts.map