import React from "react";
import { POJO, SetState } from "../../types";
export type TransferListProps<T> = {
    source: T[];
    target: T[];
    Item: React.FC<{
        data: T;
    }>;
    reference: keyof T;
    setSource: SetState<T[]>;
    setTarget: SetState<T[]>;
};
export declare const TransferList: <T extends POJO, K extends keyof T>(props: TransferListProps<T>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=transfer-list.d.ts.map