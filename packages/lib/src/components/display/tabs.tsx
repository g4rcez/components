"use client";
import React, { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { Is, Nullable } from "sidekicker";
import { useReactive } from "../../hooks/use-reactive";
import { useStableRef } from "../../hooks/use-stable-ref";
import { css } from "../../lib/dom";
import { keyboardKeys } from "../../lib/keyboard-area";
import { Label } from "../../types";
import { Polymorph } from "../core/polymorph";
import { Card, CardProps } from "./card";

export type TabsProps = Omit<CardProps<"div">, "onChange"> & {
    active: string;
    container?: string;
    className?: string;
    onChange?: (id: string) => void;
};

const Context = createContext<string>("");

const isElementDisabled = (element: HTMLElement): boolean => element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

const getNElement = (elements: HTMLElement[], currentIndex: number, direction: "backward" | "forward"): HTMLElement | null => {
    const step = direction === "forward" ? 1 : -1;
    const startIndex = currentIndex + step;
    for (let i = startIndex; i >= 0 && i < elements.length; i += step) {
        const element = elements[i];
        if (!isElementDisabled(element)) return element;
    }
    return direction === "backward" ? getNElement(elements, elements.length - 1, "backward") : getNElement(elements, -1, "forward");
};

const moveOn = (ul: HTMLUListElement, direction: "backward" | "forward") => {
    const items = Array.from(ul.querySelectorAll("li"));
    const find = items.findIndex((x) => x.dataset.active === "true");
    if (find === -1) return null;
    const item = getNElement(items, find, direction);
    if (item === null) return null;
    item.querySelector("button")?.focus({ preventScroll: false });
    return item.getAttribute("data-id") || "";
};

const moveToEdge = (ul: HTMLUListElement, edge: "first" | "last") => {
    const items = Array.from(ul.querySelectorAll("li"));
    const ordered = edge === "first" ? items : [...items].reverse();
    for (const item of ordered) {
        if (!isElementDisabled(item)) {
            item.querySelector("button")?.focus({ preventScroll: false });
            return item.getAttribute("data-id") || "";
        }
    }
    return null;
};

const actionKeys = {
    [keyboardKeys.ArrowLeft]: (_: unknown, ul: HTMLUListElement): Nullable<string> => moveOn(ul, "backward"),
    [keyboardKeys.ArrowRight]: (_: unknown, ul: HTMLUListElement): Nullable<string> => moveOn(ul, "forward"),
};

export const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const [active, setActive] = useReactive(props.active);
    const ref = useRef<HTMLUListElement | null>(null);
    const onChangeRef = useStableRef(props.onChange);

    useEffect(() => {
        const header = ref.current;
        if (header === null) return;
        let first = header.querySelector<HTMLElement>(`li[data-active=true]`);
        if (first === null) {
            first = header.querySelector<HTMLElement>(`li[data-id]`)!;
            const id = first.getAttribute("data-id") || "";
            setActive(id);
        }
    }, [props.active, setActive]);

    useEffect(() => {
        if (onChangeRef.current) onChangeRef.current(active);
    }, [onChangeRef, active]);

    const items = React.Children.toArray(props.children as React.ReactElement<TabProps>) as Array<React.ReactElement<TabProps>>;

    const onClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        const anchor = e.currentTarget;
        setActive(anchor.dataset.id || "");
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        if (ref.current === null) return;
        const k = e.key;
        if (Is.keyof(actionKeys, k)) {
            const fn = actionKeys[k];
            const result = fn(e, ref.current);
            if (result === null) return;
            setActive(result);
        } else if (k === "Home") {
            e.preventDefault();
            const result = moveToEdge(ref.current, "first");
            if (result) setActive(result);
        } else if (k === "End") {
            e.preventDefault();
            const result = moveToEdge(ref.current, "last");
            if (result) setActive(result);
        }
    };

    return (
        <Context.Provider value={active}>
            <Card
                className={props.className}
                container={css("pt-0 max-w-full w-full min-w-0", props.container)}
                header={
                    <header className="relative mb-tabs-header-mb overflow-x-auto">
                        <div className="absolute bottom-0 h-[1px] w-full bg-card-border" />
                        <nav className="min-w-0">
                            <ul role="tablist" onKeyDown={onKeyDown} ref={ref} className="flex w-0 min-w-full flex-1 justify-start overflow-x-auto">
                                {items.map((x: React.ReactElement<TabProps>) => {
                                    const inner = x.props;
                                    const current = active === inner.id;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            data-active={current}
                                            key={`tab-header-${inner.id}`}
                                            className={css(
                                                "relative w-fit border-b border-transparent transition-all",
                                                current ? "border-primary font-medium text-primary" : "",
                                                inner.disabled ? "aria-disabled:text-disabled" : ""
                                            )}
                                        >
                                            <Polymorph
                                                role="tab"
                                                as="button"
                                                type="button"
                                                data-id={inner.id}
                                                id={`${inner.id}-tab`}
                                                aria-selected={current}
                                                disabled={inner.disabled}
                                                tabIndex={current ? 0 : -1}
                                                aria-controls={`${inner.id}-panel`}
                                                onClick={inner.disabled ? undefined : onClick}
                                                className="block w-full whitespace-nowrap px-tabs-item-px py-tabs-item-py disabled:cursor-not-allowed"
                                            >
                                                {inner.title as React.ReactNode}
                                            </Polymorph>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </header>
                }
            >
                {props.children}
            </Card>
        </Context.Provider>
    );
};

const useTabs = () => useContext(Context);

type CommonTabProps = { id: string; disabled?: boolean };

export type TabProps = CommonTabProps &
    (
        | { title: string; label?: undefined }
        | {
              label: string;
              title: Omit<Label, string>;
          }
    );

export const Tab = (props: PropsWithChildren<TabProps>) => {
    const active = useTabs();
    if (props.id !== active) return null;
    return (
        <div role="tabpanel" tabIndex={0} id={`${props.id}-panel`} aria-labelledby={`${props.id}-tab`}>
            {props.children}
        </div>
    );
};
