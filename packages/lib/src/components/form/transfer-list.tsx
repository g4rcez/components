"use client";
import { ChevronRightIcon } from "lucide-react";
import React, { forwardRef, Fragment, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { useParentHeight } from "../../hooks/use-parent";
import { POJO, SetState } from "../../types";
import { Button } from "../core/button";
import { Checkbox } from "../form/checkbox";
import { Input } from "./input";

export type TransferListProps<T> = {
    source: T[];
    target: T[];
    Item: React.FC<{ data: T }>;
    reference: keyof T;
    setSource: SetState<T[]>;
    setTarget: SetState<T[]>;
};

const components = {
    Item: forwardRef(function InnerList(props: any, ref) {
        return <li {...props} ref={ref} className="flex items-center justify-between gap-1" />;
    }),
    List: forwardRef(function InnerList(props: any, ref) {
        return <ul {...props} ref={ref} className="space-y-3" />;
    }),
};

export const TransferList = <T extends POJO, K extends keyof T>(props: TransferListProps<T>) => {
    const ref = useRef<HTMLDivElement>(null!);
    const h = useParentHeight(ref);
    return (
        <div className="flex flex-row gap-4" ref={ref}>
            <div className="flex w-fit min-w-64 flex-col space-y-4 whitespace-nowrap rounded-lg border border-card-border py-8">
                <header className="border-b border-card-border pb-2"></header>
                <div className="space-y-2 px-8">
                    <Input rightLabel="" title="Search" placeholder="Looking for..." />
                    <Virtuoso
                        height={h}
                        useWindowScroll
                        data={props.source}
                        components={components as any}
                        itemContent={(_, row) => (
                            <Fragment>
                                <Checkbox>
                                    <props.Item data={row} />
                                </Checkbox>
                            </Fragment>
                        )}
                    />
                </div>
            </div>
            <div>
                <Button>
                    <ChevronRightIcon />
                </Button>
            </div>
            <div></div>
        </div>
    );
};
