import React from "react";
import { Label } from "../../types";
import { Col, TableConfiguration, TableOperationProps } from "./table-lib";
type Keyof<T extends {}> = keyof T extends infer R extends string ? R : never;
declare enum Order {
    Asc = "asc",
    Desc = "desc",
    Undefined = "undefined"
}
export type Sorter<T extends {}> = {
    value: Keyof<T>;
    type: Order;
    label: Label;
    id: string;
};
export declare const multiSort: <T extends {}>(array: T[], fields: Sorter<T>[]) => T[];
type Props<T extends {}> = TableConfiguration<T, {
    cols: Col<T>[];
    sorters: Sorter<T>[];
    set: React.Dispatch<React.SetStateAction<Sorter<T>[]>>;
}>;
export declare const Sort: <T extends {}>(props: Props<T>) => import("react/jsx-runtime").JSX.Element;
type SorterHeadProps<T extends {}> = Pick<TableOperationProps<T>, "sorters" | "setSorters"> & {
    col: Col<T>;
};
export declare const SorterHead: <T extends {}>(props: SorterHeadProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=sort.d.ts.map