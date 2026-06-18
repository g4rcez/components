"use client";
import { Toast as Base } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon, CheckCircleIcon, WarningIcon, InfoIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, type PropsWithChildren, useCallback, useContext, useRef } from "react";
import { useHover } from "../../hooks/use-hover";
import { css } from "../../lib/dom";
import type { Label } from "../../types";

const variants = cva("__display-notifications__border __display-notifications__tw-1 __display-notifications__tw-extra-1", {
    variants: {
        theme: {
            default: "__display-notifications__tw-2",
            info: "__display-notifications__tw-3",
            warn: "__display-notifications__tw-4",
            muted: "__display-notifications__tw-5",
            danger: "__display-notifications__tw-6",
            success: "__display-notifications__tw-7",
            secondary: "__display-notifications__tw-8",
        },
    },
    defaultVariants: { theme: "default" },
});

const themeIcons = {
    default: InfoIcon,
    info: InfoIcon,
    warn: WarningIcon,
    muted: InfoIcon,
    danger: WarningIcon,
    success: CheckCircleIcon,
    secondary: InfoIcon,
};

type NotificationOptions = Partial<{
    id: string;
    title: Label;
    timeout: number;
    closable: boolean;
    loading: boolean;
    theme: VariantProps<typeof variants>["theme"];
}>;

type NotificationData = {
    theme?: NotificationOptions["theme"];
    closable?: boolean;
    loading?: boolean;
};

type NotificationSubscriber = { close: () => void; clear: () => void };

type ContextFunction = (description: Label, args?: NotificationOptions) => NotificationSubscriber;

const NotificationContext = createContext<ContextFunction>(() => {
    throw new Error("Not implemented");
});

export const useNotification = () => useContext(NotificationContext);

type NotificationItemProps = {
    toast: Base.Root.ToastObject<NotificationData>;
};

function Notification(props: NotificationItemProps) {
    const closable = props.toast.data?.closable ?? true;
    const loading = props.toast.data?.loading ?? false;
    const theme = props.toast.data?.theme || "default";
    const className = variants({ theme });
    const Icon = loading ? CircleNotchIcon : themeIcons[theme] || InfoIcon;

    return (
        <Base.Root toast={props.toast} swipeDirection="right">
            <motion.li
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                }}
                className="__display-notifications__tw-9"
            >
                <Base.Content className={className}>
                    <div className="__display-notifications__tw-10">
                        <div className={css("__display-notifications__tw-11", loading && "__display-notifications__tw-12")}>
                            <Icon aria-hidden="true" />
                        </div>

                        <div className="__display-notifications__tw-13 __display-notifications__tw-extra-1">
                            {props.toast.title ? <Base.Title className="__display-notifications__tw-14" /> : null}
                            <Base.Description className="line-clamp-2 __display-notifications__tw-15" />
                        </div>

                        {closable && !loading ? (
                            <Base.Close className="__notifications__close __display-notifications__tw-16">
                                <span className="__display-notifications__tw-17">
                                    <XIcon aria-hidden="true" />
                                </span>
                            </Base.Close>
                        ) : null}
                    </div>
                </Base.Content>
            </motion.li>
        </Base.Root>
    );
}

export type NotificationProps = Partial<{ max: number; timeout: number }>;

function NotificationsViewport({ max = 5 }: NotificationProps) {
    const ref = useRef<HTMLDivElement>(null!);
    const hover = useHover(ref);
    const toastManager = Base.useToastManager();
    const allToasts = max ? toastManager.toasts.slice(0, max) : toastManager.toasts;
    const visibleToasts = hover ? allToasts : allToasts.slice(0, 3);
    const hiddenCount = allToasts.length - visibleToasts.length;

    return (
        <Base.Viewport ref={ref} className="__display-notifications__tw-18 __display-notifications__tw-extra-1">
            <AnimatePresence mode="popLayout" initial={false}>
                {visibleToasts.map((toast) => (
                    <Notification key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>

            {!hover && hiddenCount > 0 && (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="__display-notifications__border __display-notifications__tw-19"
                >
                    +{hiddenCount} more
                </motion.div>
            )}
        </Base.Viewport>
    );
}

function NotificationsInner({ children, max = 5 }: PropsWithChildren<NotificationProps>) {
    const toastManager = Base.useToastManager();

    const clear = useCallback(() => {
        toastManager.toasts.forEach((t) => toastManager.close(t.id));
    }, [toastManager]);

    const notify = useCallback(
        (description: Label, args?: NotificationOptions) => {
            const data = {
                theme: args?.theme,
                closable: args?.closable,
                loading: args?.loading,
            };

            if (args?.id) {
                const existing = toastManager.toasts.find((t) => t.id === args.id);
                if (existing) {
                    toastManager.update(args.id, {
                        description,
                        title: args.title,
                        timeout: args.timeout,
                        data,
                    });
                    return { close: () => toastManager.close(args.id!), clear };
                }
            }

            const id = toastManager.add({
                description,
                id: args?.id,
                title: args?.title,
                timeout: args?.timeout,
                data,
            });

            return {
                close: () => toastManager.close(id),
                clear,
            };
        },
        [toastManager, clear]
    );

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            <Base.Portal>
                <NotificationsViewport max={max} />
            </Base.Portal>
        </NotificationContext.Provider>
    );
}

export function Notifications({ children, max = 5, timeout = 5000 }: PropsWithChildren<NotificationProps>) {
    return (
        <Base.Provider limit={max} timeout={timeout}>
            <NotificationsInner max={max}>{children}</NotificationsInner>
        </Base.Provider>
    );
}
