import React, { HTMLAttributes } from "react";
import { OptionProps } from "../form/select";
import { FilterConfig } from "./filter";
import { GroupItem } from "./group";
import { Sorter } from "./sort";
import { Col, TableOperationProps } from "./table-lib";
type InnerTableProps<T extends {}> = HTMLAttributes<HTMLTableElement> & TableOperationProps<T> & {
    border?: boolean;
    useControl?: boolean;
    loading?: boolean;
    group?: GroupItem<T>;
    groups?: GroupItem<T>[];
    optionCols: OptionProps[];
    index: number;
    rows: T[];
    cols: Col<T>[];
    sorters?: Sorter<T>[];
    showMetadata?: boolean;
    filters?: FilterConfig<T>[];
    setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
    onScrollEnd?: () => void;
    loadingMore?: boolean;
};
export type TableProps<T extends {}> = Pick<InnerTableProps<T>, "cols" | "rows" | "loadingMore" | "border"> & {
    useControl?: boolean;
    name: string;
    operations?: boolean;
    onScrollEnd?: () => void;
} & Partial<TableOperationProps<T> & {
    reference: keyof T;
    loading: boolean;
}>;
export declare const Table: <T extends {}>(props: TableProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map