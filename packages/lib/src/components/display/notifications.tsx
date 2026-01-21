"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion, TargetAndTransition } from "motion/react";
import { Toast as Base } from "@base-ui/react/toast";
import { createContext, type PropsWithChildren, useCallback, useContext, useRef } from "react";
import { useHover } from "../../hooks/use-hover";
import { Label } from "../../types";

const variants = cva(
  "relative isolate z-tooltip flex justify-between overflow-hidden whitespace-nowrap rounded-lg border text-sm shadow-shadow-notification",
  {
    variants: {
      theme: {
        default: "border-card-border bg-card-background text-foreground",
        info: "bg-alert-info-bg text-alert-info-text border-alert-info-border",
        warn: "bg-alert-warn-bg text-alert-warn-text border-alert-warn-border",
        danger: "bg-alert-danger-bg text-alert-danger-text border-alert-danger-border",
        success: "bg-alert-success-bg text-alert-success-text border-alert-success-border",
        secondary: "bg-alert-secondary-bg text-alert-secondary-text border-alert-secondary-border",
        muted: "bg-alert-muted-bg text-alert-muted-text border-alert-muted-border",
      },
    },
    defaultVariants: { theme: "default" },
  }
);

type NotificationOptions = Partial<{
  title: Label;
  timeout: number;
  closable: boolean;
  theme: VariantProps<typeof variants>["theme"];
}>;

type NotificationData = { theme?: NotificationOptions["theme"]; closable?: boolean };

type NotificationSubscriber = { close: () => void; clear: () => void };

type ContextFunction = (description: Label, args?: NotificationOptions) => NotificationSubscriber;

const NotificationContext = createContext<ContextFunction>(() => {
  throw new Error("Not implemented");
});

export const useNotification = () => useContext(NotificationContext);

type NotificationItemProps = {
  toast: Base.Root.ToastObject<NotificationData>;
  index: number;
  isLast: boolean;
  reversedIndex: number;
  hover: boolean;
};

const animatedIndex: Record<string, TargetAndTransition> = {
  0: { opacity: 1, y: [10, 15], scale: [1, 0.98] },
  1: { opacity: 1, y: [15, 20], scale: [1, 0.97] },
  2: { opacity: 1, y: [20, 25], scale: [1, 0.96] },
  default: { opacity: 1, y: [25, 30], scale: [1, 0.95] },
};

function Notification(props: NotificationItemProps) {
  const closable = props.toast.data?.closable ?? true;
  const variant = props.hover ? "hover" : props.isLast ? "isLast" : "other";
  const className = variants({ theme: props.toast.data?.theme || "default" });
  return (
    <Base.Root toast={props.toast} swipeDirection={["down", "right"]}>
      <motion.li
        layout
        layoutScroll
        animate={variant}
        data-index={props.index}
        initial={{ y: -100, zIndex: -1 }}
        className="absolute top-0 right-0 w-80 pointer-events-auto text-select"
        variants={{
          isLast: { y: 10, scale: 1, animationDuration: "300ms", opacity: 1 },
          hover: { y: 0, position: "static", scale: 1, opacity: 1 },
          other: animatedIndex[props.reversedIndex] || animatedIndex.default,
        }}
        transition={{ type: "spring", mass: 1.2, damping: 30, stiffness: 200 }}
        exit={{ opacity: [0.9, 0], transition: { opacity: { bounce: 0.25, duration: 0.3 } } }}
      >
        <Base.Content className={className}>
          <div className="flex flex-col p-4">
            {props.toast.title ? (
              <Base.Title className="text-lg font-medium leading-relaxed select-text truncate" />
            ) : null}
            <Base.Description className="select-text truncate" />
          </div>
          {closable ? (
            <Base.Close className="absolute top-2 right-2 p-1 rounded-full transition text-foreground hover:bg-danger/10 hover:text-danger-hover">
              <XIcon className="size-5" />
            </Base.Close>
          ) : null}
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
  const toasts = toastManager.toasts.slice(-max);

  return (
    <Base.Viewport
      ref={ref}
      data-items={toasts.length}
      style={{
        justifyContent: "start",
        height: `${(hover ? toasts.length : Math.min(1, toasts.length)) * 7}rem`,
      }}
      className="fixed right-4 top-10 flex w-80 list-none flex-col-reverse items-end gap-4 overflow-y-clip overflow-x-visible data-[items=true]:pb-8 max-sm:top-20"
    >
      <motion.ol className="flex flex-col gap-4">
        <AnimatePresence presenceAffectsLayout mode="popLayout">
          {toasts.reverse().map((toast, index, list) => (
            <Notification
              toast={toast}
              hover={hover}
              index={index}
              key={toast.id}
              isLast={list.length - 1 === index}
              reversedIndex={list.length - (index + 1)}
            />
          ))}
        </AnimatePresence>
      </motion.ol>
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
      const id = toastManager.add({
        description,
        title: args?.title,
        timeout: args?.timeout,
        data: { theme: args?.theme, closable: args?.closable },
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
