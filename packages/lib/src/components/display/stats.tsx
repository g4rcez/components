import React from "react";
import { css } from "../../lib/dom";
import { Label } from "../../types";

export type StatsProps = {
    title: Label;
    iconContainer?: string;
    footer?: React.ReactElement;
    Icon: React.FC<{ className: string }>;
};

export const Stats = (props: React.PropsWithChildren<StatsProps>) => {
    return (
        <div className="divide-y divide-card-border rounded-card border border-card-border bg-card-background shadow">
            <header className="flex items-start gap-4 p-6">
                <div className={css("flex aspect-square size-10 items-center justify-center rounded-card bg-primary p-8", props.iconContainer)}>
                    <div>
                        <props.Icon className="aspect-square size-10 text-primary-foreground" />
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
