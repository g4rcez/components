"use client";
import React, { createContext, Fragment, PropsWithChildren, useContext, useEffect, useRef } from "react";
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
    return direction === "backward"
        ? getNElement(elements, elements.length - 1, "backward")
        : getNElement(elements, -1, "forward");
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

    const items = React.Children.toArray(props.children as React.ReactElement<TabProps>);

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
        }
    };

    return (
        <Context.Provider value={active}>
            <Card
                className={props.className}
                container={css("pt-0 max-w-full w-full min-w-0", props.container)}
                header={
                    <header className="overflow-x-auto relative mb-2">
                        <div className="absolute bottom-0 w-full h-px bg-card-border" />
                        <nav className="min-w-0">
                            <ul onKeyDown={onKeyDown} ref={ref} className="flex overflow-x-auto flex-1 justify-start w-0 min-w-full">
                                {items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    const current = active === inner.id;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            data-active={current}
                                            key={`tab-header-${inner.id}`}
                                            aria-disabled={inner.disabled}
                                            className={css(
                                                "relative w-fit border-b border-transparent transition-all",
                                                current ? "border-primary font-medium text-primary" : "",
                                                inner.disabled ? "aria-disabled:text-disabled" : ""
                                            )}
                                        >
                                            <Polymorph
                                                as="button"
                                                type="button"
                                                data-id={inner.id}
                                                aria-current="page"
                                                disabled={inner.disabled}
                                                onClick={inner.disabled ? undefined : onClick}
                                                className="block py-4 px-10 w-full whitespace-nowrap disabled:cursor-not-allowed"
                                            >
                                                {inner.title as any}
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
    return <Fragment>{props.id === active ? props.children : null}</Fragment>;
};
