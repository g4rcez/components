import { CaretDownIcon } from "@phosphor-icons/react";
import { Fragment } from "react";
import type { OptionProps } from "../form/select/select";
import { tableMetadataStyles } from "./metadata.styles";

export const toolbarTriggerProps = { className: tableMetadataStyles.slots.trigger };

type ToolbarTriggerProps = {
    label: string;
    none: string;
    ids: string[];
    options: OptionProps[];
};

/** Renders "Label: Value ▾". The value is the first column label, "+N" for the other columns, or `none`. */
export const ToolbarTrigger = (props: ToolbarTriggerProps) => {
    const [first] = props.ids;
    const firstLabel = first === undefined ? props.none : (props.options.find((option) => option.value === first)?.label ?? first);
    const more = props.ids.length > 1 ? ` +${props.ids.length - 1}` : "";
    return (
        <Fragment>
            <span className={tableMetadataStyles.slots["trigger-label"]}>{props.label}:</span>{" "}
            <span className={tableMetadataStyles.slots["trigger-value"]}>
                {firstLabel}
                {more}
            </span>
            <CaretDownIcon aria-hidden="true" className={tableMetadataStyles.slots["trigger-icon"]} />
        </Fragment>
    );
};
