import { type LucideProps, FileIcon } from "lucide-react";
import React from "react";
import { useTranslations } from "../../hooks/use-translations";

export type EmptyProps = { Icon?: React.FC<LucideProps>; message?: string };

export const Empty = (props: EmptyProps) => {
    const Icon = props.Icon ?? FileIcon;
    const translate = useTranslations();
    return (
        <div className="flex flex-col gap-4 justify-center items-center py-12 px-8 w-full">
            <Icon size={64} className="text-disabled" />
            <p className="text-disabled">{props.message ?? translate.emptyDataMessage}</p>
        </div>
    );
};
