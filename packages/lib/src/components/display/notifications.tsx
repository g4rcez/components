"use client";
import { Toast as Base } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  XIcon,
  CheckCircleIcon,
  TriangleAlertIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, type PropsWithChildren, useCallback, useContext, useRef } from "react";
import { useHover } from "../../hooks/use-hover";
import { css } from "../../lib/dom";
import { Label } from "../../types";

const variants = cva(
  "relative isolate z-tooltip flex w-full flex-col overflow-hidden rounded-xl border bg-card-background backdrop-blur-md text-sm shadow-notification transition-all duration-300",
  {
    variants: {
      theme: {
        default: "border-card-border text-foreground shadow-black/5",
        info: "bg-alert-info-bg text-alert-info-text border-alert-info-border",
        warn: "bg-alert-warn-bg text-alert-warn-text border-alert-warn-border",
        muted: "bg-alert-muted-bg text-alert-muted-text border-alert-muted-border",
        danger: "bg-alert-danger-bg text-alert-danger-text border-alert-danger-border",
        success: "bg-alert-success-bg text-alert-success-text border-alert-success-border",
        secondary: "bg-alert-secondary-bg text-alert-secondary-text border-alert-secondary-border",
      },
    },
    defaultVariants: { theme: "default" },
  }
);

const themeIcons = {
  default: InfoIcon,
  info: InfoIcon,
  warn: TriangleAlertIcon,
  muted: InfoIcon,
  danger: TriangleAlertIcon,
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
  const Icon = loading ? Loader2Icon : (themeIcons[theme] || InfoIcon);

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
        className="pointer-events-auto list-none w-full"
      >
        <Base.Content className={css(className, "shadow-lg")}>
          <div className="flex items-start gap-3 p-4">
            <div className={css("mt-0.5 shrink-0 opacity-80", loading && "animate-spin")}>
              <Icon className="size-4" />
            </div>
            
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
              {props.toast.title ? (
                <Base.Title className="truncate font-semibold leading-tight tracking-tight select-text" />
              ) : null}
              <Base.Description className="text-xs font-medium opacity-90 select-text leading-relaxed line-clamp-2" />
            </div>

            {closable && !loading ? (
              <Base.Close className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg text-foreground/40 transition hover:bg-foreground/10 hover:text-foreground">
                <XIcon className="size-3.5" />
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
  
  // Show the most recent notifications at the top
  const allToasts = [...toastManager.toasts].slice(0, max);
  
  const visibleToasts = hover ? allToasts : allToasts.slice(0, 3);
  const hiddenCount = allToasts.length - visibleToasts.length;

  return (
    <Base.Viewport
      ref={ref}
      className="fixed left-1/2 top-6 z-[100] flex w-full max-w-[380px] -translate-x-1/2 flex-col gap-3 outline-none pointer-events-none overflow-visible"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleToasts.map((toast) => (
          <Notification
            key={toast.id}
            toast={toast}
          />
        ))}
      </AnimatePresence>
      
      {!hover && hiddenCount > 0 && (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="self-center px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-card-background/80 backdrop-blur shadow-sm border border-card-border rounded-full text-foreground/50 pointer-events-auto cursor-default transition-all hover:bg-card-background hover:text-foreground/80"
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
      const data = { theme: args?.theme, closable: args?.closable, loading: args?.loading };

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
