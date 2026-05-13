"use client";
import { autoUpdate, useFloating, useInteractions, useListNavigation } from "@floating-ui/react";
import { FunnelIcon, type Icon, type IconProps } from "@phosphor-icons/react";
import React, { forwardRef, Fragment, useEffect, useId, useRef, useState } from "react";
import { Is } from "sidekicker";
import { useStableRef } from "../../hooks/use-stable-ref";
import { useTranslations } from "../../hooks/use-translations";
import { CombiKeys } from "../../lib/combi-keys";
import { Dict } from "../../lib/dict";
import { css, isChildVisible, isReactFC } from "../../lib/dom";
import { fzf, MatchValue } from "../../lib/fzf";
import { Label } from "../../types";
import { Shortcut } from "../display/shortcut";
import { SkeletonCell } from "../display/skeleton";
import { Modal } from "./modal";

type ViewProps = { text: string };

type CommandItem<T extends string, P extends object> = P & {
    type: T;
    hint?: string | string[];
    Icon?: React.ReactElement;
    enabled?: ((props: ViewProps) => boolean) | boolean;
};

type View = string | ((props: ViewProps) => string);

type CommandShortcutItem = CommandItem<
    "shortcut",
    {
        title: View;
        shortcut?: string;
        action: (args: {
            text: string;
            setText: (state: string) => void;
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
    <span className="text-typography-sm flex h-full items-center text-left font-medium text-secondary">
        {isReactFC(props.item.title) ? <props.item.title text={props.text} /> : props.item.title}
    </span>
);

const Item = forwardRef<HTMLButtonElement, Omit<ItemProps, "onChangeVisibility">>((props, ref) => {
    const id = useId();
    const active = props.active;
    const item = props.item;
    if (item.type === "group")
        return (
            <div id={id} className="h-command-row-h px-command-group-px pb-command-group-pb pt-command-group-pt">
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
            className={css(
                "flex h-command-row-h items-center justify-between rounded-command-radius p-command-item-p hover:bg-floating-hover",
                active ? "bg-floating-hover" : ""
            )}
        >
            <span className="flex items-center gap-command-item-gap">
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
    Icon?: React.FC<IconProps & { text: string; Default: Icon }>;
};

const getFuzzyData = (commands: CommandItemTypes[], value: string) => {
    if (value.length === 0) return commands;
    const rules: MatchValue<CommandItemTypes>[] = [
        { key: "title", value },
        { key: "shortcut", value },
        { key: "hint", value },
    ];
    const normalize = commands.map((x) => ({
        ...x,
        title: Is.function(x.title) ? x.title({ text: value }) : x.title,
    }));
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

const findFirstClickable = (items: CommandItemTypes[]): CommandItemTypes | null => {
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element.type === "shortcut") return element;
        const recursive = findFirstClickable(element.items);
        if (recursive) return recursive;
    }
    return null;
};

export const CommandPalette = (props: CommandPaletteProps) => {
    const id = useId();
    const scrollContainerRef = useRef<HTMLUListElement | null>(null);
    const [text, setText] = useState("");
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const translations = useTranslations();
    const valueRef = useStableRef(text);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    useEffect(() => {
        setActiveIndex(null);
    }, [text]);
    const bindKey = props.bind ?? "Mod + k";
    const root = useFloating<HTMLInputElement>({
        open: props.open,
        strategy: "absolute",
        whileElementsMounted: autoUpdate,
        onOpenChange: props.onChangeVisibility,
    });

    const commands = props.commands.flatMap((x) => (x.type === "group" ? [x, ...x.items] : [x]));

    const fuzzy = getFuzzyData(commands, text);

    const displayItems: CommandItemTypes[] =
        text === ""
            ? commands
            : [
                  {
                      type: "group",
                      title: "Results",
                      items: [],
                  },
                  ...fuzzy.filter((x) => x.type !== "group"),
              ];

    const listNav = useListNavigation(root.context, {
        listRef,
        loop: true,
        activeIndex,
        virtual: true,
        allowEscape: false,
        focusItemOnOpen: true,
        focusItemOnHover: true,
        openOnArrowKeyDown: true,
        scrollItemIntoView: false,
        selectedIndex: activeIndex,
        disabledIndices: (n) => {
            const item = displayItems[n];
            if (item) return item.type === "group";
            return false;
        },
        onNavigate: (n) => {
            if (Is.number(n)) {
                if (!isChildVisible(scrollContainerRef.current!, listRef.current[n]!))
                    listRef.current[n]?.scrollIntoView({
                        block: "start",
                        inline: "start",
                    });
            }
            setActiveIndex((prev) => {
                if (Is.number(n)) return n;
                return props.open ? (prev ?? 0) : null;
            });
        },
    });
    const { getItemProps, getReferenceProps, getFloatingProps } = useInteractions([listNav]);

    useEffect(() => {
        const combi = new CombiKeys();
        combi.add(bindKey, () => props.onChangeVisibility?.(true));
        commands.forEach((cmd) => {
            if (cmd.type === "group") return;
            if (cmd.type === "shortcut" && cmd.shortcut !== undefined)
                combi.add(cmd.shortcut, (event) =>
                    cmd.action({
                        event,
                        setText,
                        text: valueRef.current,
                        setOpen: props.onChangeVisibility,
                    })
                );
        });
        return combi.register();
    }, [bindKey, commands, props, valueRef]);

    const Icon = props.Icon ?? FunnelIcon;

    return (
        <Fragment>
            <Modal
                {...getFloatingProps()}
                animated={false}
                closable={false}
                open={props.open}
                overlayClickClose
                ariaTitle="Command palette"
                bodyClassName="px-0 py-0 pt-0"
                data-component="command-palette"
                onChange={props.onChangeVisibility}
                className="container relative overflow-clip py-0 md:max-w-screen-sm lg:max-w-screen-md"
            >
                <header className="sticky top-0 isolate z-floating flex h-command-header-h w-full items-center overflow-clip border-b border-floating-border bg-floating-background">
                    <div className="flex size-command-icon-size items-center justify-center">
                        {props.Icon ? <Icon Default={FunnelIcon} text={text} size={16} /> : <FunnelIcon size={16} />}
                    </div>
                    <input
                        {...(getReferenceProps({
                            ref: root.refs.setReference,
                            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                const item = Is.number(activeIndex) ? displayItems[activeIndex] : null;
                                const key = e.key;
                                if (key === "Enter") {
                                    if (item) {
                                        if (item.type === "shortcut")
                                            item.action({
                                                event: e,
                                                text: text,
                                                setOpen: props.onChangeVisibility,
                                                setText,
                                            });
                                    } else {
                                        const item = findFirstClickable(fuzzy);
                                        if (item?.type === "shortcut")
                                            item.action({
                                                event: e,
                                                text: text,
                                                setOpen: props.onChangeVisibility,
                                                setText,
                                            });
                                    }
                                }
                            },
                        } as unknown as React.HTMLProps<Element>) as React.InputHTMLAttributes<HTMLInputElement>)}
                        autoFocus
                        value={text}
                        data-combikeysbypass="true"
                        placeholder="Search for..."
                        onChange={(e) => setText(e.target.value)}
                        className="text-typography-lg h-command-header-h w-full items-center bg-transparent px-command-input-px py-command-input-py pb-command-input-py text-left outline-none"
                    />
                </header>
                {props.loading ? (
                    <ul
                        role="listbox"
                        data-component="command-palette-list"
                        className="my-command-list-my flex max-h-command-list-max-h w-full origin-[top_center] flex-col gap-command-list-gap overflow-y-auto px-command-group-px"
                    >
                        <div className="h-command-row-h px-command-group-px pb-command-group-pb pt-command-group-pt">
                            {translations.commandPaletteLoading}
                        </div>
                        {loadingSkeleton.map((_, i) => (
                            <li
                                key={`${id}-${i}-skeleton-index`}
                                className={css(
                                    "flex h-command-row-h items-center justify-between rounded-command-radius p-command-item-p hover:bg-primary hover:text-primary-foreground"
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
                            ref={scrollContainerRef}
                            data-component="command-palette-list"
                            className="my-command-list-my flex h-fit max-h-command-list-max-h w-full origin-[top_center] flex-col gap-command-list-gap overflow-y-auto px-2"
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
                                            if (item.type === "shortcut")
                                                item.action({
                                                    event: e,
                                                    text: text,
                                                    setOpen: props.onChangeVisibility,
                                                    setText,
                                                });
                                        },
                                    })}
                                    item={item}
                                    text={text}
                                    active={activeIndex === index}
                                    key={`${id}-${item.type}-${index}`}
                                />
                            ))}
                            {displayItems.length === 1 ? (
                                <div className={css("flex items-center justify-between rounded-command-radius p-command-item-p text-secondary")}>
                                    {translations.commandPaletteEmpty ?? props.emptyMessage}
                                </div>
                            ) : null}
                        </ul>
                        {props.Preview && Is.number(activeIndex) ? <props.Preview command={displayItems[activeIndex]} text={text} /> : null}
                    </div>
                )}
                {props.footer ? (
                    <footer className="flex h-command-footer-h items-center rounded-b-command-radius border-t border-floating-border p-command-footer-p">
                        {props.footer}
                    </footer>
                ) : null}
            </Modal>
        </Fragment>
    );
};
