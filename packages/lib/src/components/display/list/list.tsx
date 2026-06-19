"use client";
import {
    FloatingContext,
    FloatingFocusManager,
    FloatingOverlay,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
} from "@floating-ui/react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { XIcon } from "@phosphor-icons/react";
import React, { Fragment, PropsWithChildren, useCallback, useId, useState } from "react";
import { useTranslations } from "../../../hooks/use-translations";
import { Label } from "../../../types";

type AnimatedItemProps = {
    title: Label;
    description: Label;
    children: Label;
    avatar?: Label;
    leading?: React.FC<{ open: () => void }>;
};

type IdAnimatedItem = AnimatedItemProps & { id: string };

type AnimatedListProps = object;

type FloatItemProps = {
    setter: () => void;
    context: FloatingContext;
    item: IdAnimatedItem | null;
    refs: { setFloating: (node: HTMLElement | null) => void };
    get: ReturnType<typeof useInteractions>["getFloatingProps"];
};

const FloatItem = ({ item, context, setter, get, refs }: FloatItemProps) => {
    const translations = useTranslations();

    return (
        <FloatingPortal>
            <MotionConfig reducedMotion="user" transition={{ type: "spring", damping: 30, stiffness: 350 }}>
                <AnimatePresence mode="wait" presenceAffectsLayout>
                    {item ? (
                        <motion.div
                            key="overlay"
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
                            className="__display-list__slot-1"
                        />
                    ) : null}
                    {item ? (
                        <FloatingOverlay key="card" lockScroll className="__display-list__slot-2">
                            <FloatingFocusManager visuallyHiddenDismiss modal closeOnFocusOut context={context}>
                                <motion.div
                                    layout
                                    layoutId={`item-${item.id}`}
                                    initial={{ opacity: 0.6, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="__display-list__border __display-list__slot-3 __display-list__slot-extra-1"
                                    ref={refs.setFloating}
                                    {...get()}
                                >
                                    <nav className="__display-list__slot-4">
                                        <button
                                            type="button"
                                            onClick={setter}
                                            aria-label={translations.listCloseDetails}
                                            className="__display-list__slot-5"
                                        >
                                            <XIcon />
                                        </button>
                                    </nav>
                                    <motion.header layout className="__display-list__slot-6 __display-list__slot-extra-2">
                                        <h3 className="__display-list__slot-7">{item.title}</h3>
                                        <p className="__display-list__slot-8">{item.description}</p>
                                    </motion.header>
                                    <motion.div layout>{item.children}</motion.div>
                                </motion.div>
                            </FloatingFocusManager>
                        </FloatingOverlay>
                    ) : null}
                </AnimatePresence>
            </MotionConfig>
        </FloatingPortal>
    );
};

export const AnimatedList = (props: PropsWithChildren<AnimatedListProps>) => {
    const translations = useTranslations();
    const [selected, setSelected] = useState<IdAnimatedItem | null>(null);
    const id = useId();
    const { context, refs } = useFloating({
        open: selected !== null,
        transform: true,
        onOpenChange: (open) => (open ? undefined : setSelected(null)),
    });
    const click = useClick(context);
    const role = useRole(context, { role: "dialog" });
    const dismiss = useDismiss(context, {
        escapeKey: true,
        referencePress: true,
        outsidePress: true,
    });
    const { getFloatingProps } = useInteractions([click, role, dismiss]);

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    const items = React.Children.toArray(props.children);

    return (
        <Fragment>
            <FloatItem refs={refs} context={context} get={getFloatingProps} item={selected} setter={clear} />
            <ul role="list">
                {items.map((x, index) => {
                    const item = (x as React.ReactElement<AnimatedItemProps>).props;
                    const innerId = `${id}-${index}`;
                    const setter = () => setSelected({ ...item, id: innerId });
                    const Leading = item.leading;
                    return (
                        <motion.li layout key={innerId} layoutId={`item-${innerId}`} className={`__display-list__slot-9`}>
                            <motion.div layoutId={`toast-${innerId}`} className="__display-list__slot-10">
                                <div className="__display-list__slot-11">
                                    <Fragment>
                                        {item.avatar ? (
                                            <div>
                                                <div className="__display-list__slot-12">
                                                    <button
                                                        type="button"
                                                        onClick={setter}
                                                        aria-label={translations.listOpenDetails(String(item.title))}
                                                        className="__display-list__slot-13"
                                                    >
                                                        {item.avatar}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="__display-list__slot-14">
                                            <div className="__display-list__slot-15 __display-list__slot-extra-3">
                                                <button
                                                    type="button"
                                                    onClick={setter}
                                                    aria-label={translations.listOpenDetails(String(item.title))}
                                                    className="__display-list__slot-16"
                                                >
                                                    <h3>{item.title}</h3>
                                                    <p className="__display-list__slot-8">{item.description}</p>
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
