"use client";
import { autoUpdate, useFloating, useInteractions, useListNavigation } from "@floating-ui/react";
import { FilterIcon, LucideProps } from "lucide-react";
import React, { forwardRef, Fragment, useEffect, useId, useRef, useState } from "react";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { useTranslations } from "../../hooks/use-translations";
import { CombiKeys } from "../../lib/combi-keys";
import { Dict } from "../../lib/dict";
import { css, isReactFC } from "../../lib/dom";
import { fzf, MatchValue } from "../../lib/fzf";
import { Label } from "../../types";
import { Shortcut } from "../display/shortcut";
import { SkeletonCell } from "../display/skeleton";
import { Modal } from "./modal";

type ViewProps = { text: string };

type CommandItem<T extends string, P extends object> = {
    type: T;
    hint?: string | string[];
    Icon?: React.ReactElement;
    enabled?: ((props: ViewProps) => boolean) | boolean;
} & P;

type View = string | ((props: ViewProps) => string);

type CommandShortcutItem = CommandItem<
    "shortcut",
    {
        title: View;
        shortcut?: string;
        action: (args: {
            text: string;
            setOpen: (state: boolean) => void;
            event: KeyboardEvent | React.MouseEvent | React.KeyboardEvent;
        }) => void | Promise<void>;
    }
>;

type CommandGroupItem = CommandItem<"group", { title: View; items: CommandItemTypes[] }>;

export type CommandItemTypes = CommandGroupItem | CommandShortcutItem;

type ItemProps = {
    text: string;
    active: boolean;
    item: CommandItemTypes;
    onChangeVisibility: (next: boolean) => void;
};

const Group = (props: { item: CommandGroupItem; text: string }) => (
    <span className="flex h-full items-center text-left text-sm font-medium text-secondary">
        {isReactFC(props.item.title) ? <props.item.title text={props.text} /> : props.item.title}
    </span>
);

const Item = forwardRef<HTMLButtonElement, Omit<ItemProps, "onChangeVisibility">>((props, ref) => {
    const id = useId();
    const active = props.active;
    const item = props.item;
    if (item.type === "group")
        return (
            <div id={id} className="h-10 px-2 pb-1 pt-2">
                <Group text={props.text} item={item} />
            </div>
        );
    if (item.type !== "shortcut") return <Fragment />;
    return (
        <button
            {...props}
            id={id}
            ref={ref}
            role="option"
            type="button"
            aria-selected={active}
            data-component="command-palette-item"
            className={css("flex h-10 items-center justify-between rounded-lg p-2 hover:bg-floating-hover", active ? "bg-floating-hover" : "")}
        >
            <span className="flex items-center gap-2">
                {item.Icon ? item.Icon : null}
                <span>{isReactFC(item.title) ? <item.title text={props.text} /> : item.title}</span>
            </span>
            {item.shortcut ? <Shortcut value={item.shortcut} /> : null}
        </button>
    );
});

export type CommandPaletteProps = {
    bind?: string;
    open: boolean;
    loading?: boolean;
    emptyMessage?: Label;
    footer?: React.ReactElement;
    commands: CommandItemTypes[];
    onChangeText?: (text: string) => void;
    onChangeVisibility: (next: boolean) => void;
    Preview?: React.FC<{ command: CommandItemTypes; text: string }>;
    Icon?: React.FC<LucideProps & { text: string; Default: React.FC<LucideProps> }>;
};

const getFuzzyData = (commands: CommandItemTypes[], value: string) => {
    if (value.length === 0) return commands;
    const rules: MatchValue<CommandItemTypes>[] = [
        { key: "title", value },
        { key: "shortcut", value },
        { key: "hint", value },
    ];
    const normalize = commands.map((x) => ({ ...x, title: Is.function(x.title) ? x.title({ text: value }) : x.title }));
    const target = normalize.reduce<CommandItemTypes[]>((acc, x) => {
        const enabled = Is.function(x.enabled) ? x.enabled({ text: value }) : (x.enabled ?? true);
        if (enabled) acc.push({ ...x, enabled: enabled });
        return acc;
    }, []);
    const filter = fzf(target, "title", rules);
    const withEnabled = normalize.filter((x) => (Is.function(x.enabled) ? x.enabled({ text: value }) : false));
    return Dict.unique(filter.concat(withEnabled), (x) => x.title);
};

const loadingSkeleton = [0, 0, 0, 0, 0];

export const CommandPalette = (props: CommandPaletteProps) => {
    const bindKey = props.bind ?? "Mod + k";
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const translations = useTranslations();
    const [value, setValue] = useState("");
    const valueRef = useStableRef(value);
    const id = useId();
    const ref = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const floating = useFloating<HTMLInputElement>({
        open: props.open,
        strategy: "absolute",
        onOpenChange: props.onChangeVisibility,
        whileElementsMounted: autoUpdate,
    });
    const listNav = useListNavigation(floating.context, {
        listRef,
        loop: true,
        activeIndex,
        virtual: true,
        allowEscape: true,
        scrollItemIntoView: true,
        onNavigate: (n) =>
            setActiveIndex((prev) => {
                if (Is.number(n)) return n;
                return props.open ? (prev ?? 0) : null;
            }),
    });
    const { getItemProps } = useInteractions([listNav]);

    const commands = props.commands.flatMap((x) => (x.type === "group" ? [x, ...x.items] : [x]));

    const fuzzy = getFuzzyData(commands, value);

    const displayItems: CommandItemTypes[] =
        value === ""
            ? commands
            : [
                  {
                      type: "group",
                      title: "Results",
                      items: [],
                  },
                  ...fuzzy.filter((x) => x.type !== "group"),
              ];

    useEffect(() => {
        const combi = new CombiKeys();
        combi.add(bindKey, () => props.onChangeVisibility?.(true));
        commands.forEach((cmd) => {
            if (cmd.type === "group") return;
            if (cmd.type === "shortcut" && cmd.shortcut !== undefined)
                combi.add(cmd.shortcut, (event) =>
                    cmd.action({
                        event,
                        text: valueRef.current,
                        setOpen: props.onChangeVisibility,
                    })
                );
        });
        return combi.register();
    }, [bindKey]);

    const Icon = props.Icon ?? FilterIcon;

    return (
        <Fragment>
            <Modal
                ref={ref}
                animated={false}
                closable={false}
                open={props.open}
                overlayClickClose
                ariaTitle="Command palette"
                bodyClassName="px-0 py-0 pt-2"
                data-component="command-palette"
                onChange={props.onChangeVisibility}
                className="container relative py-0 md:max-w-screen-sm lg:max-w-screen-md"
            >
                <header className="sticky top-0 isolate z-floating flex h-12 w-full items-center border-b border-floating-border bg-floating-background px-4">
                    <div className="flex size-10 items-center justify-center">
                        <Icon Default={FilterIcon} text={value} size={16} />
                    </div>
                    <input
                        autoFocus
                        value={value}
                        data-combikeysbypass="true"
                        placeholder="Search for..."
                        onChange={(e) => setValue(e.target.value)}
                        className="h-12 w-full items-center bg-transparent px-2 py-2 pb-2 text-left text-lg outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                                if (activeIndex !== null) {
                                    listRef.current[activeIndex]?.scrollIntoView({
                                        block: "start",
                                        inline: "start",
                                    });
                                }
                            }
                            if (e.key === "Enter") {
                                if (activeIndex !== null && displayItems[activeIndex]) {
                                    e.preventDefault();
                                    const x = displayItems[activeIndex];
                                    const text = e.currentTarget.value;
                                    if (x.type === "shortcut")
                                        return x.action({
                                            event: e,
                                            setOpen: props.onChangeVisibility,
                                            text,
                                        });
                                }
                                if (displayItems.length === 1) {
                                    e.preventDefault();
                                    const x = displayItems[0];
                                    const text = e.currentTarget.value;
                                    if (x.type === "shortcut")
                                        return x.action({
                                            event: e,
                                            setOpen: props.onChangeVisibility,
                                            text,
                                        });
                                }
                            }
                        }}
                    />
                </header>
                {props.loading ? (
                    <ul
                        role="listbox"
                        data-component="command-palette-list"
                        className="my-2 flex max-h-96 w-full origin-[top_center] flex-col gap-1 overflow-y-auto px-2"
                    >
                        <div className="h-10 px-2 pb-1 pt-2">{translations.commandPaletteLoading}</div>
                        {loadingSkeleton.map((x, i) => (
                            <li
                                key={`${id}-${i}-skeleton-index`}
                                className={css(
                                    "flex h-10 items-center justify-between rounded-lg p-2 hover:bg-primary hover:text-primary-foreground"
                                )}
                            >
                                {SkeletonCell}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex min-w-full flex-row flex-nowrap" data-component="command-palette-container">
                        <ul
                            role="listbox"
                            data-component="command-palette-list"
                            className="my-2 flex h-fit max-h-96 w-full origin-[top_center] flex-col gap-1 overflow-y-auto px-2"
                        >
                            {displayItems.map((item, index) => (
                                <Item
                                    {...getItemProps({
                                        onMouseEnter: () => setActiveIndex(index),
                                        ref(node) {
                                            listRef.current[index] = node;
                                        },
                                        onClick(e) {
                                            e.preventDefault();
                                            props.onChangeVisibility(false);
                                            floating.refs.domReference.current?.focus();
                                            if (item.type === "shortcut")
                                                item.action({
                                                    event: e,
                                                    setOpen: props.onChangeVisibility,
                                                    text: value,
                                                });
                                        },
                                    })}
                                    item={item}
                                    text={value}
                                    active={activeIndex === index}
                                    key={`${id}-${item.type}-${index}`}
                                />
                            ))}
                            {displayItems.length === 1 ? (
                                <div className={css("flex items-center justify-between rounded-lg p-2 text-secondary")}>
                                    {translations.commandPaletteEmpty ?? props.emptyMessage}
                                </div>
                            ) : null}
                        </ul>
                        {props.Preview && Is.number(activeIndex) ? <props.Preview command={displayItems[activeIndex]} text={value} /> : null}
                    </div>
                )}
                {props.footer ? <footer className="flex h-8 items-center rounded-b-lg bg-background p-2">{props.footer}</footer> : null}
            </Modal>
        </Fragment>
    );
};
