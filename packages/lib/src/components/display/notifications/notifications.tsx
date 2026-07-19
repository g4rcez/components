"use client";
import { Toast as Base } from "@base-ui/react/toast";
import { CheckCircleIcon, CircleNotchIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, type PropsWithChildren, useCallback, useContext, useRef } from "react";
import { useHover } from "../../../hooks/use-hover";
import type { ComponentStyleProps } from "../../../lib/component-styles";
import { css } from "../../../lib/dom";
import type { Label } from "../../../types";
import { notificationsStyles } from "./notifications.styles";

type NotificationStyleProps = ComponentStyleProps<typeof notificationsStyles>;

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
    theme: NotificationStyleProps["theme"];
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
    const className = notificationsStyles.className({ theme });
    const iconClassName = notificationsStyles.slots.icon;
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
                className={notificationsStyles.slots.item}
            >
                <Base.Content className={className}>
                    <div className={notificationsStyles.slots.content}>
                        <div className={css(iconClassName, loading && `${iconClassName}--loading`)}>
                            <Icon aria-hidden="true" />
                        </div>

                        <div className={notificationsStyles.slots.text}>
                            {props.toast.title ? <Base.Title className={notificationsStyles.slots.title} /> : null}
                            <Base.Description className={css("line-clamp-2", notificationsStyles.slots.description)} />
                        </div>

                        {closable && !loading ? (
                            <Base.Close className={notificationsStyles.slots.close}>
                                <span className={notificationsStyles.slots["close-icon"]}>
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
        <Base.Viewport ref={ref} className={notificationsStyles.slots.viewport}>
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
                    className={notificationsStyles.slots.badge}
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
