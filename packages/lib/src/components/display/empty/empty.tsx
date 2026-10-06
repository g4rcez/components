import { FileIcon, type Icon } from "@phosphor-icons/react";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { emptyStyles } from "./empty.styles";

export type EmptyProps = { Icon?: Icon; message?: string; translations?: TranslationOverrides };

export const Empty = (props: EmptyProps) => {
    const Icon = props.Icon ?? FileIcon;
    const translate = useTranslations(props.translations);
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
