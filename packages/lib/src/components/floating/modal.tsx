"use client";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type ElementProps,
} from "@floating-ui/react";
import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { AnimatePresence, HTMLMotionProps, motion, MotionConfig, MotionValue, PanInfo, TargetAndTransition, useMotionValue, animate } from "motion/react";
import { Slot } from "../core/slot";
import React, { ForwardedRef, forwardRef, Fragment, PropsWithChildren, useEffect, useId, useImperativeHandle, useRef } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { css, mergeRefs } from "../../lib/dom";
import { Label, Nil, Override } from "../../types";

type AnimationLabels = "initial" | "enter" | "exit";

export type ModalType = "dialog" | "drawer" | "sheet";

export type DrawerPosition = "left" | "right";

type Animations = {
  sheet: Record<AnimationLabels, TargetAndTransition>;
  dialog: Record<AnimationLabels, TargetAndTransition>;
  drawer: (type: DrawerPosition) => Record<AnimationLabels, TargetAndTransition>;
};

const animationDuration = "500ms";

const drawerLeft: Record<string, TargetAndTransition> = {
  exit: { x: ["0%", "-30%"], opacity: 0, animationDuration },
  enter: { x: ["-30%", "0%"], opacity: 1, animationDuration },
  initial: { x: ["-30%", "0%"], opacity: 0.8, animationDuration },
};

const drawerRight: Record<string, TargetAndTransition> = {
  enter: { x: "0%", opacity: 1, animationDuration },
  exit: { x: ["0%", "30%"], opacity: 0, animationDuration },
  initial: { x: ["30%", "0%"], opacity: 0.8, animationDuration },
};

const animations: Animations = {
  drawer: (type) => (type === "left" ? drawerLeft : drawerRight),
  sheet: {
    enter: { opacity: 1, y: "0%", animationDuration, transformOrigin: "bottom" },
    exit: { opacity: 0.4, y: "10%", animationDuration, transformOrigin: "bottom" },
    initial: { opacity: 0.7, y: "10%", animationDuration, transformOrigin: "bottom" },
  },
  dialog: {
    exit: { opacity: 0, scale: 0.95, animationDuration },
    enter: { opacity: 1, scale: [1.05, 1], animationDuration },
    initial: { opacity: 0.5, scale: 0.95, animationDuration, transition: { duration: 0.5, ease: "easeInOut" } },
  },
};

const variants = cva(
  "z-floating border border-floating-border ring-0 outline-0 appearance-none flex flex-col gap-4 flex-nowrap min-w-xs bg-floating-background",
  {
    variants: {
      type: {
        drawer: "max-h-screen max-w-[90%] absolute w-fit h-screen min-h-0",
        dialog: "max-h-[calc(100lvh-10%)] relative container h-min rounded-lg py-4",
        sheet: "w-screen absolute bottom-0 max-h-[calc(100vh-15%)] max-h-[calc(100svh-5%)] h-screen pt-6 pb-4 rounded-t-lg",
      },
      position: {
        none: "",
        right: "py-4 absolute right-0 top-0 rounded-l-lg",
        left: "py-4 absolute left-0 top-0 rounded-r-lg",
      },
    },
    defaultVariants: { position: "right", type: "dialog" },
  }
);

export type ModalProps = Override<
  HTMLMotionProps<"div">,
  ({ title: Label; ariaTitle?: string } | { ariaTitle: string; title?: Label }) & {
    open: boolean;
    onChange: (nextState: boolean) => void;
  } & Partial<{
    footer: Label;
    type: ModalType;
    animated: boolean;
    asChild: boolean;
    layoutId: string;
    resizer: boolean;
    className: string;
    closable: boolean;
    forceType: boolean;
    bodyClassName: string;
    overlayClassName: string;
    position: DrawerPosition;
    overlayClickClose: boolean;
    role: "dialog";
    interactions: ElementProps[];
    trigger: Label | React.FC<any>;
  }>
>;

type DraggableProps = {
  sheet: boolean;
  position: DrawerPosition;
  parent: React.RefObject<HTMLElement>;
  onChange: (nextState: boolean) => void;
  value: MotionValue<number | undefined>;
};

const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };

const calculateClose = (n: number) => n * 0.6;

const Draggable = (props: DraggableProps) => {
  const onDrag = (e: Event, info: PanInfo) => {
    if (props.parent.current) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (props.sheet) {
        const div = props.parent.current as HTMLElement;
        const rect = div.getBoundingClientRect();
        const v = props.value.get() || rect.height;
        const result = Math.abs(v - info.delta.y);
        const max = window.outerHeight;
        const screenHeightToClose = calculateClose(max);
        if (result >= screenHeightToClose) return props.value.set(result);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement?.blur();
        }
        props.onChange(false);
        return setTimeout(() => props.value.set(undefined), 350);
      }
      const div = props.parent.current as HTMLElement;
      const v = props.value.get() || div.getBoundingClientRect().width;
      const delta = props.position === "right" ? -info.delta.x : info.delta.x;
      const value = Math.abs(v + delta);
      return props.value.set(value);
    }
  };

  return (
    <motion.button
      draggable
      dragListener
      dragMomentum
      type="button"
      animate={false}
      dragElastic={0}
      dragPropagation
      initial={false}
      onDrag={onDrag}
      dragSnapToOrigin
      dragDirectionLock
      drag={props.sheet ? "y" : "x"}
      dragConstraints={dragConstraints}
      whileDrag={{ cursor: "grabbing" }}
      className={css(
        "absolute rounded-lg isolate z-calendar",
        props.sheet ? "cursor-row-resize" : "cursor-col-resize bg-floating-border",
        props.sheet
          ? "top-1 flex h-3 w-full justify-center py-2"
          : props.position === "left"
            ? "right-5 top-1/2 h-10 w-2"
            : "left-2 top-1/2 h-10 w-2"
      )}
    >
      {props.sheet ? <div className="w-1/4 h-2 rounded-lg bg-floating-border" /> : null}
    </motion.button>
  );
};

const positions = { drawer: "right", sheet: "none", dialog: "none" } as const;

const fetchPosition = (isDesktop: Nil<boolean>, forceType: Nil<boolean>, propsType: Nil<ModalType>, propsPosition: Nil<DrawerPosition>) => {
  const type = propsType || "dialog";
  if (isDesktop) return propsType === "drawer" ? (propsPosition ?? positions.drawer) : positions[type];
  return forceType ? positions[type] : positions.sheet;
};

type ModalRef = { context: any; floating: HTMLElement | null };

const noop: any[] = [];

export const Modal = forwardRef<ModalRef, PropsWithChildren<ModalProps>>(
  (
    {
      open,
      title,
      footer,
      asChild,
      trigger,
      children,
      onChange,
      ariaTitle,
      className,
      bodyClassName,
      resizer = true,
      animated = true,
      closable = true,
      forceType = false,
      layoutId = undefined,
      overlayClassName = "",
      type: _type = "dialog",
      position: propsPosition,
      overlayClickClose = false,
      interactions: outInteractions = noop,
      ...props
    }: PropsWithChildren<ModalProps>,
    externalRef: ForwardedRef<ModalRef>
  ) => {
    const innerContent = useRef<HTMLDivElement>(null)
    const removeScrollRef = useRef<HTMLDivElement>(null);
    const headingId = useId();
    const descriptionId = useId();
    const isDesktop = useMediaQuery("(min-width: 64rem)");
    const position = fetchPosition(isDesktop, forceType, _type, propsPosition);
    const func = isDesktop ? animations[_type] : forceType ? animations[_type] : animations.sheet;
    const animation = typeof func === "function" ? func(position as DrawerPosition) : func;
    const type = isDesktop ? _type : forceType ? _type : "sheet";
    const useResizer = type !== "dialog";

    const floating = useFloating({ open, onOpenChange: onChange, strategy: "fixed" });
    const click = useClick(floating.context, {});
    const role = useRole(floating.context, { role: "dialog" });
    const dismiss = useDismiss(floating.context, {
      bubbles: true,
      escapeKey: true,
      outsidePress: overlayClickClose,
    });

    const interactions = useInteractions([click, dismiss, role].concat(outInteractions));

    const Trigger = trigger as any;

    const floatingSize = useMotionValue<number | undefined>(undefined);
    const sheetY = useMotionValue<number | undefined>(undefined);
    const isDragging = useRef(false);
    const dragStart = useRef(0);

    useEffect(() => {
      floatingSize.set(undefined);
      sheetY.set(undefined);
    }, [type, floatingSize, sheetY]);

    const onClose = () => onChange(false);

    useImperativeHandle(externalRef, () => ({ context: floating.context, floating: removeScrollRef.current }), [floating.context, removeScrollRef]);

    const onDragHeader = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const div = floating.refs.floating.current as HTMLElement;
      const rect = div.getBoundingClientRect();
      const v = floatingSize.get() || rect.height;
      const result = Math.abs(v - info.delta.y);
      const max = window.outerHeight;
      const screenHeightToClose = calculateClose(max);
      if (result >= screenHeightToClose) return floatingSize.set(result);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur();
      }
      onChange?.(false);
      return setTimeout(() => floatingSize.set(undefined), 350);
    }


    const draggableMotionProps = type === "sheet" ? {
      drag: "y",
      animate: false,
      dragElastic: 0,
      initial: false,
      dragConstraints,
      draggable: true,
      dragListener: true,
      dragMomentum: true,
      onDrag: onDragHeader,
      dragPropagation: true,
      dragSnapToOrigin: true,
      dragDirectionLock: true,
      whileDrag: { cursor: "grabbing" },
    } as const : { animate: animated, initial: false }

    const scrollInitial = useMotionValue<number | undefined>(undefined);
    const scroll = useMotionValue<number | undefined>(undefined);

    const Component = asChild ? Slot : motion.button;

    return (
      <Fragment>
        {trigger ? (
          <Component ref={floating.refs.setReference} {...interactions.getReferenceProps()} layoutId={layoutId} type="button">
            {Trigger}
          </Component>
        ) : null}
        <FloatingPortal preserveTabOrder>
          <AnimatePresence custom presenceAffectsLayout propagate mode="sync" initial={false}>
            {open ? (
              <FloatingOverlay
                lockScroll
                className={css(
                  "inset-0 flex isolate bg-floating-overlay/70 z-overlay h-[100dvh] !overflow-clip",
                  type === "drawer" ? "" : "items-start justify-center lg:p-10 pt-10",
                  overlayClassName
                )}
              >
                <MotionConfig reducedMotion={animated ? "user" : "always"}>
                  <FloatingFocusManager guards visuallyHiddenDismiss modal closeOnFocusOut context={floating.context}>
                    <motion.div
                      {...props}
                      {...(title
                        ? {
                          "aria-labelledby": headingId,
                          "aria-describedby": descriptionId,
                        }
                        : { "aria-label": ariaTitle })}
                      {...interactions.getFloatingProps({
                        "aria-modal": open,
                        ref: mergeRefs(floating.refs.setFloating, removeScrollRef) as any,
                        className: css(variants({ position, type }), className, "isolate overscroll-contain"),
                      })}
                      exit="exit"
                      layout={true}
                      animate="enter"
                      initial="initial"
                      layoutId={layoutId}
                      variants={animation}
                      data-component="modal"
                      style={type === "drawer" ? { width: floatingSize } : { height: floatingSize, y: sheetY }}
                    >
                      {useResizer && resizer ? (
                        <Draggable
                          onChange={onChange}
                          value={floatingSize}
                          sheet={type === "sheet"}
                          position={position as DrawerPosition}
                          parent={floating.refs.floating as any}
                        />
                      ) : null}
                      {title ? (
                        <motion.header {...draggableMotionProps} className="relative w-full isolate" >
                          {title ? (
                            <h2
                              id={headingId}
                              className="block px-8 pb-2 text-3xl font-medium leading-relaxed border-b select-text border-floating-border"
                            >
                              {title}
                            </h2>
                          ) : null}
                        </motion.header>
                      ) : null}
                      <motion.section
                        ref={innerContent}
                        data-component="modal-body"
                        className={css("flex-1 select-text overflow-y-auto px-8 py-1", bodyClassName)}
                        onTouchEnd={async () => {
                          scroll.set(undefined);
                          scrollInitial.set(undefined);

                          if (isDragging.current) {
                            const currentY = sheetY.get() || 0;
                            const threshold = window.innerHeight * 0.2;

                            if (currentY > threshold) {
                              await animate(sheetY as any, window.innerHeight, { duration: 0.2, ease: "easeIn" }).finished;
                              onChange(false);
                            } else {
                              animate(sheetY as any, 0, { type: "spring", bounce: 0, duration: 0.3 });
                            }
                            isDragging.current = false;
                          }
                        }}
                        onTouchStart={(e) => {
                          const touch = e.changedTouches[0];
                          scrollInitial.set(touch.pageY);
                          scroll.set(touch.pageY);
                          isDragging.current = false;
                        }}
                        onTouchMove={(e) => {
                          const touch = e.changedTouches[0];
                          const y = touch.pageY;
                          const prevY = scroll.get() || y;
                          const scrollTop = innerContent.current?.scrollTop || 0;

                          if (!isDragging.current && scrollTop <= 0 && y > prevY && type === "sheet") {
                            isDragging.current = true;
                            dragStart.current = y;
                          }

                          if (isDragging.current) {
                            const delta = y - dragStart.current;
                            if (delta < 0) {
                              sheetY.set(delta * 0.2);
                            } else {
                              sheetY.set(delta);
                            }
                          }

                          scroll.set(y);
                        }}
                      >
                        {children}
                      </motion.section>
                      {footer ? (
                        <footer className="px-8 pt-4 w-full border-t select-text border-floating-border">{footer}</footer>
                      ) : null}
                      {closable ? (
                        <nav className="absolute top-1 right-4 z-floating">
                          <button
                            type="button"
                            onClick={onClose}
                            className="p-1 opacity-70 transition-colors hover:opacity-100 hover:text-danger focus:text-danger"
                          >
                            <XIcon />
                          </button>
                        </nav>
                      ) : null}
                    </motion.div>
                  </FloatingFocusManager>
                </MotionConfig>
              </FloatingOverlay>
            ) : null}
          </AnimatePresence>
        </FloatingPortal>
      </Fragment>
    );
  }
);
