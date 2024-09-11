import React from "react";
import { Col, TableConfiguration } from "./table-lib";
export type GroupItem<T extends {}> = Col<T> & {
    rows: T[];
    index: number;
    groupId: string;
    groupName: string;
    groupKey: keyof T;
};
type Props<T extends {}> = TableConfiguration<T, {
    rows: T[];
    groups: GroupItem<T>[];
    setGroups: React.Dispatch<React.SetStateAction<GroupItem<T>[]>>;
}>;
export declare const Group: <T extends {}>(props: Props<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=group.d.ts.map