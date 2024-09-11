import React from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";

export type StatsProps = {
    title: Label;
    Icon: React.FC<any>;
    iconContainer?: string;
    footer?: React.ReactElement;
};

export const Stats = (props: React.PropsWithChildren<StatsProps>) => {
    return (
        <div className="divide-y divide-card-border bg-card-background shadow border border-card-border rounded-card">
            <header className="p-6 items-start flex gap-4">
                <div className={css("size-10 p-8 rounded-card flex items-center justify-center aspect-square bg-primary", props.iconContainer)}>
                    <div>
                        <props.Icon className="size-10 aspect-square text-primary-foreground" />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <header>
                        <h3 className="text-base leading-none">{props.title}</h3>
                    </header>
                    <p className="text-4xl font-semibold">{props.children}</p>
                </div>
            </header>
            {props.footer ? <footer className="px-6 py-2">{props.footer}</footer> : null}
        </div>
    );
};
