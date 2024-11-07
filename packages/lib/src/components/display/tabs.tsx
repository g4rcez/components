"use client";
import { useMotionValue } from "framer-motion";
import React, { createContext, Fragment, PropsWithChildren, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useReactive } from "../../hooks/use-reactive";
import { useStableRef } from "../../hooks/use-stable-ref";
import { Label } from "../../types";
import { Card } from "./card";

export type TabsProps = {
    active: string;
    useHash?: boolean;
    className?: string;
    onChange?: (id: string) => void;
};

const Context = createContext<string>("");

export const Tabs = (props: PropsWithChildren<TabsProps>) => {
    const [active, setActive] = useReactive(props.active);
    const left = useMotionValue(0);
    const width = useMotionValue(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const Render = props.useHash ? "a" : "button";

    useLayoutEffect(() => {
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

    const onChangeRef = useStableRef(props.onChange);

    useEffect(() => {
        if (onChangeRef.current) onChangeRef.current(active);
    }, [onChangeRef, active]);

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
                container="pt-0 max-w-full w-full min-w-0"
                header={
                    <header ref={ref} className="relative mb-2 overflow-x-auto border-b border-card-border">
                        <nav className="min-w-0">
                            <ul className="flex w-0 min-w-full flex-1 justify-start overflow-x-auto">
                                {items.map((x: any) => {
                                    const inner = x.props as TabProps;
                                    return (
                                        <li
                                            data-id={inner.id}
                                            key={`tab-header-${inner.id}`}
                                            data-active={active === inner.id}
                                            className="w-full border-b-2 border-card-border data-[active=true]:border-primary data-[active=true]:font-bold data-[active=true]:text-primary"
                                        >
                                            <Render
                                                data-id={inner.id}
                                                onClick={onClick}
                                                aria-current="page"
                                                href={props.useHash ? `#${inner.id}` : undefined}
                                                className="block w-full whitespace-nowrap px-10 py-4"
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
