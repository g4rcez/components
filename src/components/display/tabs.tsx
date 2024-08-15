"use client";
import { motion, useMotionValue } from "framer-motion";
import React, { createContext, Fragment, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { useReactive } from "../../hooks/use-reactive";
import { Label } from "../../types";
import { Card } from "./card";
import { Autocomplete } from "../form/autocomplete";
import { Select } from "../form/select";

export type TabsProps = {
    active: string;
    onChange?: (id: string) => void;
    useHash?: boolean;
    className?: string;
};

const Context = createContext<string>("");

export const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const [active, setActive] = useReactive(props.active);
    const left = useMotionValue(0);
    const width = useMotionValue(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const Render = props.useHash ? "a" : "button";

    useEffect(() => {
        const header = ref.current;
        if (header === null) return;
        const resize = (element?: HTMLElement | null) => {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            width.set(rect.width);
            left.set(element.offsetLeft);
        };
        const listener = () => {
            const element = header.querySelector<HTMLElement>(`li[data-active=true]`);
            return void resize(element);
        };
        window.addEventListener("resize", listener);
        let first = header.querySelector<HTMLElement>(`li[data-active=true]`);
        const hash = window.location.hash.replace(/^#/, "");
        if (props.active === "" && hash !== "") {
            first = header.querySelector<HTMLElement>(`li[data-id=${hash}]`);
            setActive(hash);
        }
        if (first === null) {
            first = header.querySelector<HTMLElement>(`li[data-id]`)!;
            const id = first.getAttribute("data-id") || "";
            setActive(id);
        }
        resize(first);
        return () => window.removeEventListener("resize", listener);
    }, []);

    useEffect(() => {
        if (props.onChange) props.onChange(active);
    }, [props.onChange, active]);

    const items = React.Children.toArray(props.children as React.ReactElement<TabProps>);

    const onClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        const anchor = e.currentTarget;
        const rect = anchor.getBoundingClientRect();
        width.set(rect.width);
        left.set(anchor.offsetLeft);
        setActive(anchor.dataset.id || "");
    };

    return (
        <Context.Provider value={active}>
            <Card
                className={props.className}
                container="pt-0"
                header={
                    <header ref={ref} className="border-b border-card-border relative mb-2">
                        <motion.div
                            layout
                            initial={false}
                            aria-hidden="true"
                            style={{ left, width }}
                            transition={{ type: "tween", left, width }}
                            className="w-28 h-0.5 bg-primary absolute bottom-0 duration-300 transition-all hidden lg:block"
                        />
                        <nav>
                            <Select
                                onChange={(e) => setActive(e.target.value)}
                                value={active}
                                hideLeft
                                container="container rounded mt-4 lg:mt-0 min-w-full lg:hidden inline-flex px-6 w-full mx-auto"
                                labelClassName="border-transparent rounded-none"
                                rightLabel={null}
                                options={items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    return { value: inner.id, label: inner.label ?? inner.title };
                                })}
                            />
                            <ul className="hidden lg:flex divide-x divide-card-border overflow-x-auto justify-between md:justify-start">
                                {items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            key={`tab-header-${inner.id}`}
                                            data-active={active === inner.id}
                                            className="data-[active=true]:text-primary w-full md:w-auto"
                                        >
                                            <Render
                                                data-id={inner.id}
                                                onClick={onClick}
                                                aria-current="page"
                                                className="px-10 py-4 block font-medium w-full whitespace-nowrap"
                                                href={props.useHash ? `#${inner.id}` : undefined}
                                            >
                                                {inner.title as any}
                                            </Render>
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

export type TabProps = { id: string; title: string; label?: undefined } | { id: string; title: Omit<Label, string>; label: string };

export const Tab = (props: PropsWithChildren<TabProps>) => {
    const active = useTabs();
    return <Fragment>{props.id === active ? props.children : null}</Fragment>;
};
