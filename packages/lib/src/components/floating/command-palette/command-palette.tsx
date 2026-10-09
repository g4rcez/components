"use client";
import { autoUpdate, useFloating, useInteractions, useListNavigation } from "@floating-ui/react";
import { EyeIcon, EyeSlashIcon, FunnelIcon, type Icon, type IconProps } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Is } from "sidekicker";
import { useStableRef } from "../../../hooks/use-stable-ref";
import type { TranslationOverrides } from "../../../hooks/use-translations";
import { useTranslations } from "../../../hooks/use-translations";
import { CombiKeys } from "../../../lib/combi-keys";
import { Dict } from "../../../lib/dict";
import { css, isChildVisible, mergeRefs } from "../../../lib/dom";
import { fzf, type MatchValue } from "../../../lib/fzf";
import type { Label } from "../../../types";
import { Button } from "../../core/button/button";
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

type View = string | React.ReactElement | React.ComponentType<ViewProps>;

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
        {typeof props.item.title === "function" ? <props.item.title text={props.text} /> : props.item.title}
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
                    <span>{typeof item.title === "function" ? <item.title text={text} /> : item.title}</span>
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
    filters?: React.ReactNode;
    commands: CommandItemTypes[];
    onChangeText?: (text: string) => void;
    onChangeVisibility: (next: boolean) => void;
    Preview?: React.FC<{ command: CommandItemTypes; text: string }>;
    Icon?: React.FC<IconProps & { text: string; Default: Icon }>;
    translations?: TranslationOverrides;
};

const getFuzzyData = (commands: CommandItemTypes[], value: string) => {
    if (value.length === 0) return commands;
    type SearchableCommand = {
        index: number;
        title: string;
        shortcut?: string;
        hint?: string | string[];
    };
    const rules: MatchValue<SearchableCommand>[] = [
        { key: "title", value },
        { key: "shortcut", value },
        { key: "hint", value },
    ];
    const searchable: SearchableCommand[] = commands.map((command, index) => ({
        index,
        title: typeof command.title === "string" ? command.title : "",
        shortcut: command.type === "shortcut" ? command.shortcut : undefined,
        hint: command.hint,
    }));
    const filter = fzf(searchable, "index", rules);
    const withEnabled = searchable.filter(({ index }) => {
        const enabled = commands[index]!.enabled;
        return Is.function(enabled) && enabled({ text: value });
    });
    return Dict.unique([...filter, ...withEnabled], (item) => item.index).map(({ index }) => commands[index]!);
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
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const [text, setText] = useState("");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const translations = useTranslations(props.translations);
    const valueRef = useStableRef(text);
    const { onChangeText } = props;
    const changeText = useCallback(
        (nextText: string) => {
            if (nextText !== valueRef.current) setActiveIndex(null);
            setText(nextText);
            onChangeText?.(nextText);
        },
        [onChangeText, valueRef]
    );
    const callbacksRef = useStableRef({ changeText, onChangeVisibility: props.onChangeVisibility });
    const [previewVisible, setPreviewVisible] = useState(true);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const bindKey = props.bind ?? "Mod + k";
    const root = useFloating<HTMLInputElement>({
        open: props.open,
        strategy: "absolute",
        whileElementsMounted: autoUpdate,
        onOpenChange: props.onChangeVisibility,
    });

    const commands = useMemo(() => props.commands.flatMap((x) => (x.type === "group" ? [x, ...x.items] : [x])), [props.commands]);

    const fuzzy = useMemo(() => getFuzzyData(commands, text), [commands, text]);

    const displayItems = useMemo<CommandItemTypes[]>(
        () =>
            text === ""
                ? commands
                : [
                      {
                          type: "group",
                          title: translations.commandPaletteResults,
                          items: [],
                      },
                      ...fuzzy.filter((x) => x.type !== "group"),
                  ],
        [commands, fuzzy, text, translations.commandPaletteResults]
    );
    const visibleShortcutIndex = useMemo(() => displayItems.findIndex((item) => item.type === "shortcut"), [displayItems]);
    const hasVisibleShortcut = visibleShortcutIndex >= 0;
    const firstShortcutIndex = props.open && props.Preview && !props.loading ? visibleShortcutIndex : -1;
    const resolvedActiveIndex =
        props.open && !props.loading && Is.number(activeIndex) && displayItems[activeIndex]?.type === "shortcut"
            ? activeIndex
            : firstShortcutIndex >= 0
              ? firstShortcutIndex
              : null;
    const activeCommand = Is.number(resolvedActiveIndex) ? displayItems[resolvedActiveIndex] : undefined;
    const previewCommand = activeCommand?.type === "shortcut" ? activeCommand : null;

    useEffect(() => {
        listRef.current.length = displayItems.length;
    }, [displayItems.length]);

    const listboxId = `${id}-listbox`;
    const previewId = `${id}-preview`;
    const filtersId = `${id}-filters`;
    const activeOptionId =
        Is.number(resolvedActiveIndex) && displayItems[resolvedActiveIndex]?.type === "shortcut" ? `${id}-option-${resolvedActiveIndex}` : undefined;

    const listNav = useListNavigation(root.context, {
        listRef,
        loop: true,
        activeIndex: resolvedActiveIndex,
        virtual: true,
        allowEscape: false,
        focusItemOnOpen: false,
        focusItemOnHover: true,
        openOnArrowKeyDown: true,
        scrollItemIntoView: false,
        selectedIndex: resolvedActiveIndex,
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
        combi.add(bindKey, () => callbacksRef.current.onChangeVisibility(true));
        commands.forEach((cmd) => {
            if (cmd.type === "group") return;
            if (cmd.type === "shortcut" && cmd.shortcut !== undefined)
                combi.add(cmd.shortcut, (event) =>
                    cmd.action({
                        event,
                        setText: callbacksRef.current.changeText,
                        text: valueRef.current,
                        setOpen: callbacksRef.current.onChangeVisibility,
                    })
                );
        });
        return combi.register();
    }, [bindKey, commands, valueRef, callbacksRef]);

    const Icon = props.Icon ?? FunnelIcon;
    const Preview = props.Preview;
    const hasFilters = props.filters !== undefined && props.filters !== null && props.filters !== false;

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
                data-has-preview={Preview ? "true" : undefined}
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
                                const item = Is.number(resolvedActiveIndex) ? displayItems[resolvedActiveIndex] : null;
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
                                                setText: changeText,
                                            });
                                    } else {
                                        const item = findFirstClickable(fuzzy);
                                        if (item?.type === "shortcut")
                                            item.action({
                                                event: e,
                                                text: text,
                                                setOpen: props.onChangeVisibility,
                                                setText: changeText,
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
                        onChange={(e) => changeText(e.target.value)}
                        className={commandPaletteStyles.slots.input}
                    />
                    {Preview || hasFilters ? (
                        <div role="group" aria-label={translations.commandPaletteViewControls} className={commandPaletteStyles.slots.controls}>
                            {Preview ? (
                                <Button
                                    size="icon"
                                    aria-controls={previewId}
                                    aria-expanded={previewVisible}
                                    onClick={() => setPreviewVisible((visible) => !visible)}
                                    icon={previewVisible ? <EyeIcon aria-hidden="true" /> : <EyeSlashIcon aria-hidden="true" />}
                                    title={previewVisible ? translations.commandPaletteHidePreview : translations.commandPaletteShowPreview}
                                    aria-label={previewVisible ? translations.commandPaletteHidePreview : translations.commandPaletteShowPreview}
                                />
                            ) : null}
                            {hasFilters ? (
                                <Button
                                    size="icon"
                                    aria-controls={filtersId}
                                    aria-expanded={filtersVisible}
                                    icon={<FunnelIcon aria-hidden="true" />}
                                    onClick={() => setFiltersVisible((visible) => !visible)}
                                    title={filtersVisible ? translations.commandPaletteHideFilters : translations.commandPaletteShowFilters}
                                    aria-label={filtersVisible ? translations.commandPaletteHideFilters : translations.commandPaletteShowFilters}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </header>
                {hasFilters ? (
                    <div
                        id={filtersId}
                        data-component="command-palette-filters"
                        className={commandPaletteStyles.slots.filters}
                        hidden={!filtersVisible}
                    >
                        {props.filters}
                    </div>
                ) : null}
                <div
                    className={commandPaletteStyles.slots.content}
                    data-component="command-palette-container"
                    data-preview-visible={Preview && previewVisible ? "true" : "false"}
                >
                    {props.loading ? (
                        <div
                            data-component="command-palette-list"
                            className={commandPaletteStyles.slots["loading-list"]}
                            role="status"
                            aria-busy="true"
                            aria-label={translations.commandPaletteLoading}
                        >
                            <div className={commandPaletteStyles.slots["group-row"]}>{translations.commandPaletteLoading}</div>
                            {loadingSkeleton.map((_, i) => (
                                <div key={`${id}-${i}-skeleton-index`} className={commandPaletteStyles.slots["loading-row"]} aria-hidden="true">
                                    {SkeletonCell}
                                </div>
                            ))}
                        </div>
                    ) : (
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
                                                    setText: changeText,
                                                });
                                        },
                                    })}
                                    item={item}
                                    text={text}
                                    active={resolvedActiveIndex === index}
                                    key={`${id}-${item.type}-${index}`}
                                />
                            ))}
                            {text.length > 0 && !hasVisibleShortcut ? (
                                <div className={commandPaletteStyles.slots.empty}>{props.emptyMessage ?? translations.commandPaletteEmpty}</div>
                            ) : null}
                        </div>
                    )}
                    {Preview ? (
                        <section
                            id={previewId}
                            aria-label={translations.commandPalettePreviewLabel}
                            data-component="command-palette-preview"
                            className={commandPaletteStyles.slots.preview}
                            hidden={!previewVisible}
                        >
                            {!props.loading && previewCommand ? (
                                <Preview command={previewCommand} text={text} />
                            ) : (
                                <div className={commandPaletteStyles.slots["preview-empty"]}>{translations.commandPalettePreviewEmpty}</div>
                            )}
                        </section>
                    ) : null}
                </div>
                {props.footer ? <footer className={commandPaletteStyles.slots.footer}>{props.footer}</footer> : null}
            </Modal>
        </Fragment>
    );
};
