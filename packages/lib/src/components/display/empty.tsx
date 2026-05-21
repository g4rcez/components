import { FileIcon, type Icon } from "@phosphor-icons/react";
import React from "react";
import { useTranslations } from "../../hooks/use-translations";

export type EmptyProps = { Icon?: Icon; message?: string };

export const Empty = (props: EmptyProps) => {
    const Icon = props.Icon ?? FileIcon;
    const translate = useTranslations();
    return (
        <div className="flex w-full flex-col items-center justify-center gap-empty-gap px-empty-px py-empty-py">
            <Icon size={64} className="text-disabled" />
            <p className="text-disabled">{props.message ?? translate.emptyDataMessage}</p>
        </div>
    );
};
