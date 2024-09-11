import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import React, { Fragment, PropsWithChildren, useCallback, useEffect, useId, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/use-click-outside";
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

const FloatItem = ({ item, setter }: { item: IdAnimatedItem | null; setter: () => void }) => {
    const ref = useRef(null);
    useOnClickOutside(ref, setter);

    useEffect(() => {
        function onKeyDown(event: any) {
            if (event.key === "Escape") setter();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <Fragment>
            <AnimatePresence>
                {item ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 z-floating h-screen w-screen bg-floating-overlay/70"
                    />
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {item ? (
                    <div className="absolute inset-0 z-tooltip flex items-center justify-center">
                        <motion.div
                            layout
                            ref={ref}
                            layoutId={`item-${item.id}`}
                            className="relative flex h-min w-min min-w-xs flex-col gap-4 rounded-card border border-card-border bg-card-background p-6 py-4 pb-8 shadow"
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
                    </div>
                ) : null}
            </AnimatePresence>
        </Fragment>
    );
};

export const AnimatedList = (props: PropsWithChildren<AnimatedListProps>) => {
    const [selected, setSelected] = useState<IdAnimatedItem | null>(null);
    const id = useId();

    const clear = useCallback(() => {
        setSelected(null);
    }, []);

    const items = React.Children.toArray(props.children);

    return (
        <Fragment>
            <FloatItem item={selected} setter={clear} />
            <ul role="list">
                {items.map((x, index) => {
                    const item: AnimatedItemProps = (x as any).props;
                    const isLast = index === items.length - 1;
                    const innerId = `${id}-${index}`;
                    const setter = () => setSelected({ ...item, id: innerId });
                    const Leading = item.leading;
                    return (
                        <motion.li
                            layout
                            layoutId={`item-${innerId}`}
                            key={innerId}
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
