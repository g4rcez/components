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
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { XIcon } from "lucide-react";
import React, { Fragment, PropsWithChildren, useCallback, useId, useState } from "react";
import { Label } from "../../types";

type AnimatedItemProps = {
    title: Label;
    description: Label;
    children: Label;
    avatar?: Label;
    leading?: React.FC<{ open: () => void }>;
};

type IdAnimatedItem = AnimatedItemProps & { id: string };

type AnimatedListProps = {};

type FloatItemProps = {
    setter: () => void;
    context: FloatingContext;
    item: IdAnimatedItem | null;
    get: ReturnType<typeof useInteractions>["getFloatingProps"];
    refs: { setFloating: any };
};

const FloatItem = ({ item, context, setter, get, refs }: FloatItemProps) => {
    return (
        <FloatingPortal>
            <MotionConfig reducedMotion="user" transition={{ type: "tween", stiffness: 25, duration: 0.2 }}>
                <AnimatePresence presenceAffectsLayout>
                    <AnimatePresence>
                        {item ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="pointer-events-none fixed inset-0 top-0 z-floating h-screen w-screen bg-floating-overlay/70"
                            />
                        ) : null}
                    </AnimatePresence>
                    <AnimatePresence>
                        {item ? (
                            <FloatingOverlay lockScroll className="absolute inset-0 z-tooltip flex items-center justify-center">
                                <FloatingFocusManager visuallyHiddenDismiss modal closeOnFocusOut context={context}>
                                    <motion.div
                                        layout
                                        layoutId={`item-${item.id}`}
                                        className="relative flex h-min w-min min-w-xs flex-col gap-4 rounded-card border border-card-border bg-card-background p-6 py-4 pb-8 shadow"
                                        ref={refs.setFloating}
                                        {...get()}
                                    >
                                        <nav className="absolute right-4 top-1 lg:right-2">
                                            <button
                                                type="button"
                                                onClick={setter}
                                                className="p-1 opacity-70 transition-colors hover:text-danger hover:opacity-100 focus:text-danger"
                                            >
                                                <XIcon />
                                            </button>
                                        </nav>
                                        <header className="flex w-full flex-wrap items-center justify-between gap-2">
                                            <h3 className="min-w-full text-balance text-2xl font-medium">{item.title}</h3>
                                            <p className="text-sm leading-snug text-secondary">{item.description}</p>
                                        </header>
                                        {item.children}
                                    </motion.div>
                                </FloatingFocusManager>
                            </FloatingOverlay>
                        ) : null}
                    </AnimatePresence>
                </AnimatePresence>
            </MotionConfig>
        </FloatingPortal>
    );
};

export const AnimatedList = (props: PropsWithChildren<AnimatedListProps>) => {
    const [selected, setSelected] = useState<IdAnimatedItem | null>(null);
    const id = useId();
    const { context, refs } = useFloating({
        open: selected !== null,
        transform: true,
        onOpenChange: (open) => (open ? undefined : setSelected(null)),
    });
    const click = useClick(context);
    const role = useRole(context);
    const dismiss = useDismiss(context, { escapeKey: true, referencePress: true, outsidePress: true });
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
                    const item: AnimatedItemProps = (x as any).props;
                    const innerId = `${id}-${index}`;
                    const setter = () => setSelected({ ...item, id: innerId });
                    const Leading = item.leading;
                    return (
                        <motion.li
                            layout
                            key={innerId}
                            layoutId={`item-${innerId}`}
                            className={`border-b border-card-border py-2 last:border-transparent`}
                        >
                            <motion.div layoutId={`toast-${innerId}`} className="relative">
                                <div className="relative flex items-start space-x-3">
                                    <Fragment>
                                        {item.avatar ? (
                                            <div>
                                                <div className="relative px-1">
                                                    <button onClick={setter} className="flex size-10 items-center justify-center ring-primary">
                                                        {item.avatar}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                        <div className="min-w-0 flex-1 py-1 text-foreground">
                                            <div className="flex flex-row flex-nowrap justify-between gap-4">
                                                <button
                                                    onClick={setter}
                                                    className="ease-out cursor-pointer text-left transition-all hover:scale-105 hover:text-primary"
                                                >
                                                    <h3>{item.title}</h3>
                                                    <p className="text-sm leading-snug text-secondary">{item.description}</p>
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
