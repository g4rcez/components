"use client";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
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
    open: boolean;
    setter: () => void;
    item: IdAnimatedItem | null;
    translations?: TranslationOverrides;
};

const FloatItem = ({ item, open, setter, translations: translationOverrides }: FloatItemProps) => {
    const translations = useTranslations(translationOverrides);
    const detailContentClassName = listStyles.slots["item-content"];
    const headerClassName = listStyles.slots.header;
    const ariaDescription = typeof item?.description === "string" ? item.description : undefined;
    const title = item ? (
        <motion.span layout="position" layoutId={`title-${item.id}`} style={{ display: "block" }}>
            {item.title}
        </motion.span>
    ) : (
        translations.listCloseDetails
    );

    return (
        <Modal
            translations={translationOverrides}
            title={title}
            closeOnFocusOut
            closable
            overlayClickClose
            open={open}
            ariaDescription={ariaDescription}
            layoutId={item ? `item-${item.id}` : undefined}
            transition={{ layout: { type: "spring", duration: 0.3, bounce: 0 } }}
            onChange={(open) => {
                if (!open) setter();
            }}
        >
            {item ? (
                <motion.div layout className={css(detailContentClassName, `${detailContentClassName}--column`)}>
                    <motion.header layout="position" className={css(headerClassName, `${headerClassName}--wrap`)}>
                        {item.avatar ? <motion.div layoutId={`avatar-${item.id}`}>{item.avatar}</motion.div> : null}
                        <motion.p layout="position" layoutId={`description-${item.id}`} className={listStyles.slots.description}>
                            {item.description}
                        </motion.p>
                    </motion.header>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
                        {item.children}
                    </motion.div>
                </motion.div>
            ) : null}
        </Modal>
    );
};

export const AnimatedList = (props: PropsWithChildren<AnimatedListProps>) => {
    const translations = useTranslations(props.translations);
    const [selected, setSelected] = useState<IdAnimatedItem | null>(null);
    const [open, setOpen] = useState(false);
    const id = useId();
    const itemContentClassName = listStyles.slots["item-content"];

    const clear = useCallback(() => {
        setOpen(false);
    }, []);

    const items = React.Children.toArray(props.children);

    return (
        <MotionConfig reducedMotion="user" transition={{ layout: { type: "spring", duration: 0.3, bounce: 0 } }}>
            <LayoutGroup id={id}>
                <FloatItem item={selected} open={open} setter={clear} translations={props.translations} />
                <ul role="list" className={listStyles.className({})}>
                    {items.map((x, index) => {
                        const item = (x as React.ReactElement<AnimatedItemProps>).props;
                        const innerId = `${id}-${index}`;
                        const titleId = `${innerId}-title`;
                        const descriptionId = `${innerId}-description`;
                        const actionLabel = typeof item.title === "string" ? item.title : item.titleText;
                        const actionLabelProps =
                            actionLabel !== undefined ? { "aria-label": translations.listOpenDetails(actionLabel) } : { "aria-labelledby": titleId };
                        const setter = () => {
                            setSelected({ ...item, id: innerId });
                            setOpen(true);
                        };
                        const Leading = item.leading;
                        return (
                            <motion.li layout key={innerId} layoutId={`item-${innerId}`} className={listStyles.slots.item}>
                                <motion.div className={listStyles.slots["item-shell"]}>
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
                                                            <motion.div layoutId={`avatar-${innerId}`}>{item.avatar}</motion.div>
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
                                                        <motion.h3 layout="position" layoutId={`title-${innerId}`} id={titleId}>
                                                            {item.title}
                                                        </motion.h3>
                                                        <motion.p
                                                            layout="position"
                                                            layoutId={`description-${innerId}`}
                                                            id={descriptionId}
                                                            className={listStyles.slots.description}
                                                        >
                                                            {item.description}
                                                        </motion.p>
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
            </LayoutGroup>
        </MotionConfig>
    );
};

export const AnimatedListItem = (props: PropsWithChildren<AnimatedItemProps>) => <Fragment>{props.children}</Fragment>;
