"use client";
import * as RadixToast from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, TargetAndTransition } from "framer-motion";
import { XIcon } from "lucide-react";
import {
    createContext,
    CSSProperties,
    type ElementRef,
    forwardRef,
    type MouseEvent,
    type PropsWithChildren,
    useCallback,
    useContext,
    useState,
} from "react";
import { Label } from "../../types";

const variants = cva(
  "relative isolate z-tooltip flex justify-between overflow-hidden whitespace-nowrap rounded-lg border text-sm shadow-sm supports-[backdrop-filter]:backdrop-blur-xl",
  {
      variants: {
          theme: {
              warn: "bg-warn-notification/90 text-warn-hover border-warn/50",
              info: "bg-info-notification supports-[backdrop-filter]:bg-info-notification/50 supports-[backdrop-filter]:bg-info/20 text-info border-info/50",
              danger: "bg-danger-notification supports-[backdrop-filter]:bg-danger-notification/60 text-danger border-danger/50",
              success: "bg-success-notification supports-[backdrop-filter]:bg-success-notification/50 text-success border-success/50",
              default: "border-card-border bg-card-background text-foreground",
          },
      },
      defaultVariants: { theme: "default" },
  }
);

type NotificationOptions = Partial<{
    title: Label;
    duration: number;
    closable: boolean;
    theme: VariantProps<typeof variants>["theme"];
}>;

type NotificationSubscriber = {
    close: () => void;
    clear: () => void;
};

type ContextFunction = (text: Label, args?: NotificationOptions) => NotificationSubscriber;

const NotificationContext = createContext<ContextFunction>(() => {
    throw new Error("Not implemented");
});

export const useNotification = () => useContext(NotificationContext);

type NotificationItemProps = {
    text: Label;
    index: number;
    isLast: boolean;
    onClose: () => void;
    reversedIndex: number;
    hover: boolean;
} & NotificationOptions;

const animatedIndex: Record<string, TargetAndTransition> = {
    0: { y: [10, 15], scale: [1, 0.98] },
    1: { y: [15, 20], scale: [1, 0.97] },
    2: { y: [20, 25], scale: [1, 0.96] },
    default: { y: [25, 30], scale: [1, 0.95] },
};

const Notification = forwardRef<ElementRef<typeof RadixToast.Root>, NotificationItemProps>(function Toast(props, forwardedRef) {
    const closable = props.closable ?? true;
    const duration = props.duration ?? 100000;
    const variant = props.hover ? "hover" : props.isLast ? "isLast" : "other";
    const className = variants({ theme: props.theme || "default" });
    return (
      <RadixToast.Root ref={forwardedRef} asChild forceMount onOpenChange={props.onClose} duration={duration}>
          <motion.li
            layout
            layoutScroll
            animate={variant}
            initial={{ y: -100, zIndex: -1 }}
            className="absolute right-0 top-0 w-80"
            variants={{
                isLast: { y: 10, scale: 1, animationDuration: "300ms" },
                hover: { y: Math.max(props.reversedIndex * 90 + 10, 10), scale: 1 },
                other: animatedIndex[props.reversedIndex] || animatedIndex.default,
            }}
            transition={{ type: "spring", mass: 1.2, damping: 30, stiffness: 200 }}
            exit={{ opacity: 0, zIndex: -1, transition: { opacity: { bounce: 0.25, duration: 0.2 } } }}
          >
              <div className={className}>
                  <div className="flex flex-col p-4">
                      {props.title ? (
                        <RadixToast.Title className="select-text truncate text-lg font-medium leading-relaxed">Title</RadixToast.Title>
                      ) : null}
                      <RadixToast.Description className="select-text truncate">{props.text}</RadixToast.Description>
                  </div>
                  {closable ? (
                    <RadixToast.Close className="absolute right-2 top-2 rounded-full p-1 text-foreground transition hover:bg-danger/10 hover:text-danger-hover">
                        <XIcon className="h-5 w-5" />
                    </RadixToast.Close>
                  ) : null}
              </div>
          </motion.li>
      </RadixToast.Root>
    );
});

type NotificationItem = {
    id: string;
    text: Label;
} & NotificationOptions;

export type NotificationProps = Partial<{ max: number; duration: number }>;

export function Notifications({ children, max = 5, duration = 5000 }: PropsWithChildren<NotificationProps>) {
    const [hover, setHover] = useState(false);
    const [messages, setMessages] = useState<NotificationItem[]>([]);

    const clear = useCallback(() => setMessages([]), []);

    const notify = useCallback(
      (text: Label, args?: NotificationOptions) => {
          const id = window.crypto.randomUUID();
          setMessages((prev) => {
              const newItems = [...prev, { ...args, id, text }];
              if (newItems.length > max) return newItems.slice(newItems.length - max, newItems.length + 1);
              return newItems;
          });
          const close = () => setMessages((prev) => prev.filter((x) => x.id !== id));
          return { clear, close };
      },
      [max]
    );

    const onMouseEnter = () => setHover(true);

    const onMouseLeave = (e: MouseEvent<HTMLOListElement>) => {
        const t = e.nativeEvent.relatedTarget as HTMLElement;
        const ol = e.currentTarget as HTMLOListElement;
        if (t !== null && ol.contains(t)) return;
        setHover(false);
    };

    return (
      <RadixToast.Provider duration={duration} swipeThreshold={150}>
          <NotificationContext.Provider value={notify}>{children}</NotificationContext.Provider>
          <AnimatePresence presenceAffectsLayout mode="popLayout">
              {messages.map((toast, index, list) => {
                  const close = () => setMessages((prev) => prev.filter((t) => t.id !== toast.id));
                  return (
                    <Notification
                      {...toast}
                      key={toast.id}
                      hover={hover}
                      index={index}
                      onClose={close}
                      isLast={list.length - 1 === index}
                      reversedIndex={list.length - (index + 1)}
                    />
                  );
              })}
              {/*{hover ? (*/}
              {/*    <li className="absolute right-4 top-2 flex w-80 list-none items-end justify-end">*/}
              {/*        <div className="relative isolate z-tooltip flex w-fit justify-end overflow-hidden whitespace-nowrap rounded-lg text-right text-sm text-foreground">*/}
              {/*            <Button onClick={clear} size="small">*/}
              {/*                Clear all*/}
              {/*            </Button>*/}
              {/*        </div>*/}
              {/*    </li>*/}
              {/*) : null}*/}
          </AnimatePresence>
          <RadixToast.Viewport
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            data-items={messages.length}
            style={{ "--max-notify": `${5.25 * max}rem` } as CSSProperties}
            className="fixed right-4 top-10 flex h-[var(--max-notify)] w-96 list-none flex-col-reverse items-end gap-4 overflow-y-clip overflow-x-visible data-[items=true]:pb-8 max-sm:top-20"
          />
      </RadixToast.Provider>
    );
}
