import { FileIcon, type Icon } from "@phosphor-icons/react";
import React from "react";
import { useTranslations } from "../../hooks/use-translations";

export type EmptyProps = { Icon?: Icon; message?: string };

export const Empty = (props: EmptyProps) => {
    const Icon = props.Icon ?? FileIcon;
    const translate = useTranslations();
    return (
        <div data-component="empty" className="__empty">
            <span data-slot="icon" className="__empty__icon">
                <Icon aria-hidden="true" />
            </span>
            <p data-slot="message" className="__empty__message">
                {props.message ?? translate.emptyDataMessage}
            </p>
        </div>
    );
};
