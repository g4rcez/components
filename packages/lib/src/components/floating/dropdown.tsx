"use client";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import React, { Fragment, PropsWithChildren, useEffect, useId, useMemo, useRef, useState } from "react";

type DropdownProps = {
  open?: boolean;
  arrow?: boolean;
  returnFocus?: boolean;
  restoreFocus?: boolean;
  buttonProps?: React.HTMLProps<"button">;
  onChange?: (nextValue: boolean) => void;
  trigger: React.ReactElement | React.ReactNode;
  title?: React.ReactNode | React.ReactElement | string;
};

export const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
  const headingId = useId();
  const [open, setOpen] = useState(props.open);
  useEffect(() => setOpen(props.open), [props.open]);
  const arrowRef = useRef(null);
  const middleware = useMemo(
    () => [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
      arrow({
        padding: 5,
        element: arrowRef,
      }),
    ],
    [props.arrow]
  );
  const { refs, floatingStyles, context } = useFloating({
    open,
    middleware,
    transform: true,
    whileElementsMounted: autoUpdate,
    onOpenChange: (nextValue, event) => {
      const element = (event as any)?.relatedTarget as HTMLElement;
      if (element) {
        if (element.dataset.floating === "true" && !nextValue) return;
      }
      setOpen(nextValue);
      props.onChange?.(nextValue);
    },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <Fragment>
      <button ref={refs.setReference} {...getReferenceProps(props.buttonProps as any) as any} type="button">
        {props.trigger}
      </button>
      {open && (
        <FloatingPortal preserveTabOrder id={`${headingId}-portal`}>
          <FloatingFocusManager guards restoreFocus={true} returnFocus={true} visuallyHiddenDismiss context={context} modal={false}>
            <div
              className="relative p-4 rounded-lg border isolate z-floating min-w-96 border-floating-border bg-floating-background shadow-shadow-floating"
              ref={refs.setFloating}
              aria-labelledby={headingId}
              style={floatingStyles as unknown as React.CSSProperties}
              {...getFloatingProps()}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                strokeWidth={0.1}
                className="fill-floating-background stroke-floating-border"
              />
              <header className="mb-2">
                <h3 className="text-2xl font-medium tracking-wide leading-snug text-left">{props.title}</h3>
              </header>
              {props.children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </Fragment>
  );
};
