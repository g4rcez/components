"use client";
import { autoUpdate, useFloating, useInteractions, useListNavigation, useRole } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import React, { forwardRef, Fragment, useEffect, useId, useRef, useState } from "react";
import { useStableRef } from "../../hooks/use-stable-ref";
import { useTranslations } from "../../hooks/use-translations";
import { CombiKeys } from "../../lib/combi-keys";
import { css, isReactFC } from "../../lib/dom";
import { fzf, MatchValue } from "../../lib/fzf";
import { Label } from "../../types";
import { Shortcut } from "../display/shortcut";
import { Modal } from "./modal";

type ViewProps = { text: string };

type CommandItem<T extends string, P extends object> = {
    type: T;
    hint?: string;
    enabled?: (props: ViewProps) => boolean;
} & P;

type View = Label | React.FC<ViewProps>;

type CommandShortcutItem = CommandItem<
    "shortcut",
    {
        title: View;
        shortcut?: string;
        action: (args: { text: string; setOpen: (state: boolean) => void; event: KeyboardEvent | React.MouseEvent | React.KeyboardEvent }) => void;
    }
>;

type CommandGroupItem = CommandItem<
    "group",
    {
        title: View;
        items: CommandItemTypes[];
    }
>;

export type CommandItemTypes = CommandGroupItem | CommandShortcutItem;

type ItemProps = {
    text: string;
    active: boolean;
    item: CommandItemTypes;
    onChange: (next: boolean) => void;
};

const Group = (props: { item: CommandGroupItem; text: string }) => (
    <span className="flex h-full items-center text-left text-sm font-medium text-secondary">
        {isReactFC(props.item.title) ? <props.item.title text={props.text} /> : props.item.title}
    </span>
);

const Item = forwardRef<HTMLButtonElement, ItemProps>((props, ref) => {
    const id = useId();
    const active = props.active;
    const classNameBase = "h-10";
    const item = props.item;
    if (item.type === "group") {
        return (
            <motion.div id={id} className="h-10 px-2 pb-1 pt-2">
                <Group text={props.text} item={item} />
            </motion.div>
        );
    }
    if (item.type === "shortcut") {
        return (
            <motion.button
                id={id}
                ref={ref}
                role="option"
                aria-selected={active}
                data-component="command-palette-item"
                onClick={(event) => item.action({ event, setOpen: props.onChange, text: props.text })}
                className={css(
                    classNameBase,
                    "flex items-center justify-between rounded-lg p-2 hover:bg-primary hover:text-primary-foreground",
                    active ? "bg-primary text-primary-foreground" : ""
                )}
            >
                <span>{isReactFC(item.title) ? <item.title text={props.text} /> : item.title}</span>
                {item.shortcut ? <Shortcut value={item.shortcut} /> : null}
            </motion.button>
        );
    }
    return <Fragment />;
});

export type CommandPaletteProps = {
    open: boolean;
    bind?: string;
    emptyMessage?: Label;
    footer?: React.ReactElement;
    commands: CommandItemTypes[];
    onChange: (next: boolean) => void;
};

export const CommandPalette = (props: CommandPaletteProps) => {
    const translations = useTranslations();
    const [value, setValue] = useState("");
    const valueRef = useStableRef(value);
    const bindKey = props.bind ?? "Mod + k";
    const [combi] = useState(new CombiKeys());
    const id = useId();
    const ref = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const floating = useFloating<HTMLInputElement>({
        open: props.open,
        onOpenChange: props.onChange,
        whileElementsMounted: autoUpdate,
    });
    const listRef = useRef<Array<HTMLElement | null>>([]);
    const listNav = useListNavigation(floating.context, {
        listRef,
        loop: true,
        activeIndex,
        virtual: true,
        allowEscape: true,
        onNavigate: setActiveIndex,
        scrollItemIntoView: true,
    });
    const role = useRole(floating.context, { role: "listbox" });
    const { getItemProps } = useInteractions([role, listNav]);

    const commands = props.commands.flatMap((x) =>
        x.type !== "group"
            ? x.enabled
                ? x.enabled({ text: value })
                    ? [x]
                    : []
                : [x]
            : [x, ...x.items].filter((x) => (x.enabled === undefined ? true : x.enabled({ text: value })))
    );

    const fuzzy =
        commands.length === 0
            ? commands
            : fzf(commands, "title", [
                  { key: "title", value },
                  { key: "shortcut", value },
                  { key: "hint", value },
                  ...commands.reduce<MatchValue<CommandItemTypes>[]>((acc, el) => {
                      if (!el.hint) return acc;
                      return [...acc, { key: "hint", value: el.hint }];
                  }, []),
              ]);

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
        combi.add(bindKey, () => props.onChange?.(true));
        commands.forEach((cmd) => {
            if (cmd.type === "group") return;
            if (cmd.type === "shortcut" && cmd.shortcut !== undefined)
                combi.add(cmd.shortcut, (event) =>
                    cmd.action({
                        event,
                        text: valueRef.current,
                        setOpen: props.onChange,
                    })
                );
        });
        return combi.register();
    }, [combi, bindKey]);

    return (
        <Fragment>
            <Modal
                ref={ref}
                closable={false}
                open={props.open}
                overlayClickClose
                interactions={[listNav]}
                onChange={props.onChange}
                ariaTitle="Command palette"
                bodyClassName="px-0 py-0 pt-2"
                className="container relative py-0 md:max-w-screen-sm lg:max-w-screen-md"
            >
                <header className="h-12 isolate z-floating bg-floating-background w-full sticky top-0 border-b border-floating-border px-4">
                    <input
                        autoFocus
                        value={value}
                        data-combikeysbypass="true"
                        placeholder="Search for..."
                        onChange={(e) => setValue(e.target.value)}
                        className="h-12 w-full bg-transparent pb-2 outline-none"
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                                if (activeIndex !== null)
                                    listRef.current[activeIndex]?.scrollIntoView({
                                        block: "start",
                                        inline: "start",
                                    });
                            }
                            if (e.key === "Enter") {
                                if (activeIndex !== null && displayItems[activeIndex]) {
                                    e.preventDefault();
                                    const x = displayItems[activeIndex];
                                    const text = e.currentTarget.value;
                                    if (x.type === "shortcut")
                                        return x.action({
                                            event: e,
                                            setOpen: props.onChange,
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
                                            setOpen: props.onChange,
                                            text,
                                        });
                                }
                            }
                        }}
                    />
                </header>
                <motion.ul
                    initial={{ transform: "scaleY(0)", opacity: 0.3 }}
                    animate={{ transform: "scaleY(1)", opacity: 1 }}
                    className="my-2 flex h-fit max-h-96 origin-[top_center] flex-col gap-1 px-2"
                >
                    <AnimatePresence>
                        {displayItems.map((item, index) => (
                            <Item
                                {...getItemProps({
                                    ref(node) {
                                        listRef.current[index] = node;
                                    },
                                    onClick(e) {
                                        e.preventDefault();
                                        props.onChange(false);
                                        floating.refs.domReference.current?.focus();
                                    },
                                })}
                                item={item}
                                text={value}
                                onChange={props.onChange}
                                active={activeIndex === index}
                                key={`${id}-${item.type}-${index}`}
                            />
                        ))}
                        {displayItems.length === 1 ? (
                            <motion.div className={css("flex items-center justify-between rounded-lg p-2 text-secondary")}>
                                {translations.commandPaletteEmpty ?? props.emptyMessage}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </motion.ul>
                {props.footer ? <footer className="flex h-8 items-center rounded-b-lg bg-background p-2">{props.footer}</footer> : null}
            </Modal>
        </Fragment>
    );
};
