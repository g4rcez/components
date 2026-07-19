"use client";
import { autoUpdate, useFloating, useInteractions, useListNavigation } from "@floating-ui/react";
import { FunnelIcon, type Icon, type IconProps } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, Fragment, useEffect, useId, useRef, useState } from "react";
import { Is } from "sidekicker";
import { useStableRef } from "../../../hooks/use-stable-ref";
import { useTranslations } from "../../../hooks/use-translations";
import { CombiKeys } from "../../../lib/combi-keys";
import { Dict } from "../../../lib/dict";
import { css, isChildVisible, isReactFC, mergeRefs } from "../../../lib/dom";
import { fzf, type MatchValue } from "../../../lib/fzf";
import type { Label } from "../../../types";
import { Shortcut } from "../../display/shortcut/shortcut";
import { SkeletonCell } from "../../display/skeleton/skeleton";
import { Modal } from "../modal/modal";
import { commandPaletteStyles } from "./command-palette.styles";

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
    id: string;
    text: string;
    active: boolean;
    item: CommandItemTypes;
    onChangeVisibility: (next: boolean) => void;
};

const commandPaletteItemActiveClassName = `${commandPaletteStyles.slots.item}--active`;

const Group = (props: { item: CommandGroupItem; text: string }) => (
    <span className={commandPaletteStyles.slots["group-label"]}>
        {isReactFC(props.item.title) ? <props.item.title text={props.text} /> : props.item.title}
    </span>
);

const Item = forwardRef<HTMLDivElement, Omit<ItemProps, "onChangeVisibility"> & React.HTMLAttributes<HTMLDivElement>>(
    ({ active, id, item, text, ...props }, ref) => {
        if (item.type === "group")
            return (
                <div id={id} role="presentation" className={commandPaletteStyles.slots["group-row"]}>
                    <Group text={text} item={item} />
                </div>
            );
        if (item.type !== "shortcut") return <Fragment />;
        return (
            <div
                {...props}
                id={id}
                ref={ref}
                role="option"
                tabIndex={-1}
                aria-selected={active}
                data-component="command-palette-item"
                onMouseDown={(event) => {
                    props.onMouseDown?.(event);
                    if (!event.defaultPrevented) event.preventDefault();
                }}
                className={css(commandPaletteStyles.slots.item, active ? commandPaletteItemActiveClassName : undefined)}
            >
                <span className={commandPaletteStyles.slots["item-content"]}>
                    {item.Icon ? item.Icon : null}
                    <span>{isReactFC(item.title) ? <item.title text={text} /> : item.title}</span>
                </span>
                {item.shortcut ? <Shortcut value={item.shortcut} /> : null}
            </div>
        );
    }
);

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
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
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
                      title: translations.commandPaletteResults,
                      items: [],
                  },
                  ...fuzzy.filter((x) => x.type !== "group"),
              ];

    useEffect(() => {
        listRef.current.length = displayItems.length;
    }, [displayItems.length]);

    const listboxId = `${id}-listbox`;
    const activeOptionId = Is.number(activeIndex) && displayItems[activeIndex]?.type === "shortcut" ? `${id}-option-${activeIndex}` : undefined;

    const listNav = useListNavigation(root.context, {
        listRef,
        loop: true,
        activeIndex,
        virtual: true,
        allowEscape: false,
        focusItemOnOpen: false,
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
                initialFocus={searchInputRef}
                ariaTitle={translations.commandPaletteTitle}
                bodyClassName={commandPaletteStyles.slots.body}
                data-component="command-palette"
                onChange={props.onChangeVisibility}
                className={commandPaletteStyles.className({})}
            >
                <header className={commandPaletteStyles.slots.header}>
                    <div className={commandPaletteStyles.slots["search-icon-frame"]}>
                        {props.Icon ? (
                            <Icon Default={FunnelIcon} text={text} className={commandPaletteStyles.slots["search-icon"]} />
                        ) : (
                            <FunnelIcon className={commandPaletteStyles.slots["search-icon"]} />
                        )}
                    </div>
                    <input
                        {...(getReferenceProps({
                            ref: mergeRefs(root.refs.setReference, searchInputRef),
                            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                                const item = Is.number(activeIndex) ? displayItems[activeIndex] : null;
                                const key = e.key;
                                if (key === "Escape") {
                                    e.preventDefault();
                                    props.onChangeVisibility(false);
                                    return;
                                }
                                if (key === "Enter") {
                                    e.preventDefault();
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
                        } as Parameters<typeof getReferenceProps>[0]) as React.InputHTMLAttributes<HTMLInputElement>)}
                        value={text}
                        role="combobox"
                        aria-label={translations.commandPaletteSearchLabel}
                        aria-autocomplete="list"
                        aria-expanded={props.open}
                        aria-haspopup="listbox"
                        aria-controls={listboxId}
                        aria-activedescendant={activeOptionId}
                        data-combikeysbypass="true"
                        placeholder={translations.commandPaletteSearchPlaceholder}
                        onChange={(e) => setText(e.target.value)}
                        className={commandPaletteStyles.slots.input}
                    />
                </header>
                {props.loading ? (
                    <div data-component="command-palette-list" className={commandPaletteStyles.slots["loading-list"]}>
                        <div className={commandPaletteStyles.slots["group-row"]}>{translations.commandPaletteLoading}</div>
                        {loadingSkeleton.map((_, i) => (
                            <div key={`${id}-${i}-skeleton-index`} className={commandPaletteStyles.slots["loading-row"]}>
                                {SkeletonCell}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={commandPaletteStyles.slots.content} data-component="command-palette-container">
                        <div
                            role="listbox"
                            id={listboxId}
                            ref={scrollContainerRef}
                            data-component="command-palette-list"
                            className={commandPaletteStyles.slots.list}
                        >
                            {displayItems.map((item, index) => (
                                <Item
                                    id={`${id}-option-${index}`}
                                    {...getItemProps({
                                        onMouseEnter: () => setActiveIndex(index),
                                        ref(node: HTMLElement | null) {
                                            listRef.current[index] = node;
                                        },
                                        onClick(e: React.MouseEvent<HTMLDivElement>) {
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
                                <div className={commandPaletteStyles.slots.empty}>{translations.commandPaletteEmpty ?? props.emptyMessage}</div>
                            ) : null}
                        </div>
                        {props.Preview && Is.number(activeIndex) ? <props.Preview command={displayItems[activeIndex]} text={text} /> : null}
                    </div>
                )}
                {props.footer ? <footer className={commandPaletteStyles.slots.footer}>{props.footer}</footer> : null}
            </Modal>
        </Fragment>
    );
};
