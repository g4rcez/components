"use client";
import { motion, useMotionValue } from "motion/react";
import React, { createContext, Fragment, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { useReactive } from "../../hooks/use-reactive";
import { useStableRef } from "../../hooks/use-stable-ref";
import { css } from "../../lib/dom";
import { Label } from "../../types";
import { Polymorph } from "../core/polymorph";
import { Card } from "./card";

export type TabsProps = {
    active: string;
    container?: string;
    className?: string;
    onChange?: (id: string) => void;
};

const Context = createContext<string>("");

export const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const [active, setActive] = useReactive(props.active);
    const ref = useRef<HTMLDivElement | null>(null);
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

    return (
        <Context.Provider value={active}>
            <Card
                className={props.className}
                container={css("pt-0 max-w-full w-full min-w-0", props.container)}
                header={
                    <header ref={ref} className="relative mb-2 overflow-x-auto">
                        <div className="absolute bottom-0 h-[1px] w-full bg-card-border" />
                        <nav className="min-w-0">
                            <ul className="flex w-0 min-w-full flex-1 justify-start overflow-x-auto">
                                {items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    const current = active === inner.id;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            data-active={current}
                                            key={`tab-header-${inner.id}`}
                                            className="relative border-b border-transparent data-[active=true]:border-primary w-fit transition-all data-[active=true]:font-medium data-[active=true]:text-primary"
                                        >
                                            <Polymorph
                                                as="button"
                                                type="button"
                                                onClick={onClick}
                                                data-id={inner.id}
                                                aria-current="page"
                                                className="block w-full whitespace-nowrap px-10 py-4"
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

export type TabProps =
    | { id: string; title: string; label?: undefined }
    | {
          id: string;
          label: string;
          title: Omit<Label, string>;
      };

export const Tab = (props: PropsWithChildren<TabProps>) => {
    const active = useTabs();
    return <Fragment>{props.id === active ? props.children : null}</Fragment>;
};
