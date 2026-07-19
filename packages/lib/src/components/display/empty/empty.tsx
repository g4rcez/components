import { FileIcon, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "../../../hooks/use-translations";
import { emptyStyles } from "./empty.styles";

export type EmptyProps = { Icon?: Icon; message?: string };

export const Empty = (props: EmptyProps) => {
    const Icon = props.Icon ?? FileIcon;
    const translate = useTranslations();
    return (
        <div data-component="empty" className={emptyStyles.className({})}>
            <span data-slot="icon" className={emptyStyles.slots.icon}>
                <Icon aria-hidden="true" />
            </span>
            <p data-slot="message" className={emptyStyles.slots.message}>
                {props.message ?? translate.emptyDataMessage}
            </p>
        </div>
    );
};
