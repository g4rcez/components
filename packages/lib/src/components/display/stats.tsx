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
        <div className="divide-y divide-card-border overflow-hidden rounded-stats-radius border border-card-border bg-card-background shadow-shadow-card">
            <header className="flex items-stretch gap-stats-gap">
                <div className={css("flex shrink-0 items-center justify-center bg-primary p-stats-icon-p", props.iconContainer)}>
                    <props.Icon className="aspect-square size-stats-icon-size text-primary-foreground" />
                </div>
                <div className="flex flex-col justify-center gap-stats-inner-gap py-stats-p pr-stats-p">
                    <h3 className="text-typography-base leading-none">{props.title}</h3>
                    <p className="text-4xl font-semibold">{props.children}</p>
                </div>
            </header>
            {props.footer ? <footer className="px-stats-footer-px py-stats-footer-py">{props.footer}</footer> : null}
        </div>
    );
};
