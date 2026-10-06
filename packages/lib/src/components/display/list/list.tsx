"use client";
import { motion } from "motion/react";
import type { TranslationOverrides } from "../../../hooks/use-translations";
import React, { Fragment, useCallback, useId, useState, type PropsWithChildren } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { Modal } from "../../floating/modal/modal";
import { listStyles } from "./list.styles";

type AnimatedItemProps = {
    title: Label;
    titleText?: string;
    avatar?: Label;
    children: Label;
    description: Label;
    leading?: React.FC<{ open: () => void }>;
};

type IdAnimatedItem = AnimatedItemProps & { id: string };

type AnimatedListProps = { translations?: TranslationOverrides };

type FloatItemProps = {
    setter: () => void;
    item: IdAnimatedItem | null;
    translations?: TranslationOverrides;
};

const FloatItem = ({ item, setter, translations: translationOverrides }: FloatItemProps) => {
    const translations = useTranslations(translationOverrides);
    const detailContentClassName = listStyles.slots["item-content"];
    const headerClassName = listStyles.slots.header;
    const ariaDescription = typeof item?.description === "string" ? item.description : undefined;
    const title = item ? item.title : translations.listCloseDetails;

    return (
        <Modal
            translations={translationOverrides}
            title={title}
            closeOnFocusOut
            closable={false}
            overlayClickClose
            open={item !== null}
            ariaDescription={ariaDescription}
            layoutId={item ? `item-${item.id}` : undefined}
            onChange={(open) => {
                if (!open) setter();
            }}
        >
            {item ? (
                <motion.div layout className={css(detailContentClassName, `${detailContentClassName}--column`)}>
                    <motion.header layout className={css(headerClassName, `${headerClassName}--wrap`)}>
                        <h3 className={listStyles.slots.title}>{item.title}</h3>
                        <p className={listStyles.slots.description}>{item.description}</p>
                    </motion.header>
                    <motion.div layout>{item.children}</motion.div>
                </motion.div>
            ) : null}
        </Modal>
    );
};

export const AnimatedList = (props: PropsWithChildren<AnimatedListProps>) => {
    const translations = useTranslations(props.translations);
    const [selected, setSelected] = useState<IdAnimatedItem | null>(null);
    const id = useId();
    const itemContentClassName = listStyles.slots["item-content"];

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    const items = React.Children.toArray(props.children);

    return (
        <Fragment>
            <FloatItem item={selected} setter={clear} translations={props.translations} />
            <ul role="list" className={listStyles.className({})}>
                {items.map((x, index) => {
                    const item = (x as React.ReactElement<AnimatedItemProps>).props;
                    const innerId = `${id}-${index}`;
                    const titleId = `${innerId}-title`;
                    const descriptionId = `${innerId}-description`;
                    const actionLabel = typeof item.title === "string" ? item.title : item.titleText;
                    const actionLabelProps =
                        actionLabel !== undefined
                            ? { "aria-label": translations.listOpenDetails(actionLabel) }
                            : { "aria-labelledby": titleId };
                    const setter = () => setSelected({ ...item, id: innerId });
                    const Leading = item.leading;
                    return (
                        <motion.li layout key={innerId} layoutId={`item-${innerId}`} className={listStyles.slots.item}>
                            <motion.div layoutId={`toast-${innerId}`} className={listStyles.slots["item-shell"]}>
                                <div className={listStyles.slots["item-row"]}>
                                    <Fragment>
                                        {item.avatar ? (
                                            <div>
                                                <div className={listStyles.slots["avatar-frame"]}>
                                                    <button
                                                        type="button"
                                                        onClick={setter}
                                                        {...actionLabelProps}
                                                        aria-describedby={descriptionId}
                                                        className={listStyles.slots["avatar-button"]}
                                                    >
                                                        {item.avatar}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className={listStyles.slots["item-body"]}>
                                            <div className={css(itemContentClassName, `${itemContentClassName}--row`)}>
                                                <button
                                                    type="button"
                                                    onClick={setter}
                                                    {...actionLabelProps}
                                                    aria-describedby={descriptionId}
                                                    className={listStyles.slots["item-action"]}
                                                >
                                                    <h3 id={titleId}>{item.title}</h3>
                                                    <p id={descriptionId} className={listStyles.slots.description}>
                                                        {item.description}
                                                    </p>
                                                </button>
                                                {Leading ? <Leading open={setter} /> : null}
                                            </div>
                                        </div>
                                    </Fragment>
                                </div>
                            </motion.div>
                        </motion.li>
                    );
                })}
            </ul>
        </Fragment>
    );
};

export const AnimatedListItem = (props: PropsWithChildren<AnimatedItemProps>) => <Fragment>{props.children}</Fragment>;
