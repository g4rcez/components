import type React from "react";
import { css } from "../../lib/dom";
import type { Label } from "../../types";

export type StatsProps = {
    title: Label;
    iconContainer?: string;
    footer?: React.ReactElement;
    Icon: React.FC<{ className: string }>;
};

export const Stats = (props: React.PropsWithChildren<StatsProps>) => {
    return (
        <div data-component="stats" className="__stats">
            <header data-slot="header" className="__stats__header">
                <div data-slot="icon" className={css("__stats__icon", props.iconContainer)}>
                    <props.Icon className="__stats__icon-svg" />
                </div>
                <div data-slot="content" className="__stats__content">
                    <h3 className="__stats__title">{props.title}</h3>
                    <p className="__stats__value">{props.children}</p>
                </div>
            </header>
            {props.footer ? (
                <footer data-slot="footer" className="__stats__footer">
                    {props.footer}
                </footer>
            ) : null}
        </div>
    );
};
