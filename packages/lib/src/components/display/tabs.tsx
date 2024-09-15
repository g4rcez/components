"use client";
import { motion, useMotionValue } from "framer-motion";
import React, { createContext, Fragment, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { useReactive } from "../../hooks/use-reactive";
import { Label, SetState } from "../../types";
import { Button } from "../core/button";
import { Modal } from "../floating/modal";
import { Card } from "./card";

export type TabsProps = {
    active: string;
    onChange?: (id: string) => void;
    useHash?: boolean;
    className?: string;
};

const Context = createContext<string>("");

const SelectTab = (props: { items: any[]; active: string; setActive: SetState<string> }) => {
    const [view, setView] = useState(false);
    const title = props.items.find((x) => {
        const inner = x.props as TabProps;
        return inner.id === props.active;
    });
    return (
        <div className="my-4 px-8 flex min-w-full text-center lg:hidden">
            <Button className="min-w-full" onClick={() => setView(true)}>{title?.props?.title}</Button>
            <Modal closable forceType onChange={setView} open={view} type="dialog">
                <ul className="mt-4 space-y-4">
                    {props.items.map((x: any) => {
                        const inner = x.props as TabProps;
                        const onClick = () => {
                            props.setActive(inner.id);
                            setView(false);
                        };
                        return (
                            <li key={inner.id} className="min-w-full">
                                <Button className="w-full" onClick={onClick} theme={inner.id === props.active ? "primary" : "secondary"}>
                                    {inner.title as any}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            </Modal>
        </div>
    );
};

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
                container="pt-0"
                className={props.className}
                header={
                    <header ref={ref} className="relative mb-2 border-b border-card-border">
                        <motion.div
                            layout
                            initial={false}
                            aria-hidden="true"
                            style={{ left, width }}
                            transition={{ type: "tween", left, width }}
                            className="duration-300 absolute bottom-0 hidden h-0.5 w-28 bg-primary transition-all lg:block"
                        />
                        <nav>
                            <SelectTab setActive={setActive} items={items} active={active} />
                            <ul className="hidden justify-between divide-x divide-card-border overflow-x-auto md:justify-start lg:flex">
                                {items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            key={`tab-header-${inner.id}`}
                                            data-active={active === inner.id}
                                            className="w-full data-[active=true]:text-primary md:w-auto"
                                        >
                                            <Render
                                                data-id={inner.id}
                                                onClick={onClick}
                                                aria-current="page"
                                                className="block w-full whitespace-nowrap px-10 py-4 font-medium"
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

export type TabProps =
    | { id: string; title: string; label?: undefined }
    | {
          id: string;
          title: Omit<Label, string>;
          label: string;
      };

export const Tab = (props: PropsWithChildren<TabProps>) => {
    const active = useTabs();
    return <Fragment>{props.id === active ? props.children : null}</Fragment>;
};
