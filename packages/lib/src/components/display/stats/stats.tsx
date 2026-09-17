import type React from "react";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { statsStyles } from "./stats.styles";

export type StatsProps = {
    title: Label;
    iconContainer?: string;
    footer?: React.ReactElement;
    Icon: React.FC<{ className: string }>;
};

export const Stats = (props: React.PropsWithChildren<StatsProps>) => {
    return (
        <div data-component="stats" className={statsStyles.className({})}>
            <header data-slot="header" className={statsStyles.slots.header}>
                <div data-slot="icon" className={css(statsStyles.slots.icon, props.iconContainer)}>
                    <props.Icon className={statsStyles.slots["icon-svg"]} />
                </div>
                <div data-slot="content" className={statsStyles.slots.content}>
                    <h3 className={statsStyles.slots.title}>{props.title}</h3>
                    <p className={statsStyles.slots.value}>{props.children}</p>
                </div>
            </header>
            {props.footer ? (
                <footer data-slot="footer" className={statsStyles.slots.footer}>
                    {props.footer}
                </footer>
            ) : null}
        </div>
    );
};
