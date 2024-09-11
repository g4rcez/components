import { Col, TableOperationProps } from "./table-lib";
type TableHeaderProps<T extends {}> = {
    loading: boolean;
    headers: Col<T>[];
} & Pick<TableOperationProps<T>, "filters" | "setFilters" | "setCols" | "setSorters" | "sorters">;
export declare const TableHeader: <T extends {}>(props: TableHeaderProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=thead.d.ts.map