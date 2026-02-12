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
  <span className="flex items-center h-full text-sm font-medium text-left text-secondary">
    {isReactFC(props.item.title) ? <props.item.title text={props.text} /> : props.item.title}
  </span>
);

const Item = forwardRef<HTMLButtonElement, Omit<ItemProps, "onChangeVisibility">>((props, ref) => {
  const id = useId();
  const active = props.active;
  const item = props.item;
  if (item.type === "group")
    return (
      <div id={id} className="px-2 pt-2 pb-1 h-10">
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
      <span className="flex gap-2 items-center">
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
  const root = useFloating<HTMLInputElement>({
    open: props.open,
    strategy: "absolute",
    whileElementsMounted: autoUpdate,
    onOpenChange: props.onChangeVisibility,
  });
  const listNav = useListNavigation(root.context, {
    cols: 0,
    listRef,
    loop: true,
    activeIndex,
    virtual: true,
    allowEscape: true,
    focusItemOnHover: false,
    focusItemOnOpen: "auto",
    openOnArrowKeyDown: true,
    scrollItemIntoView: false,
    selectedIndex: activeIndex,
    onNavigate: (n) => {
      if (Is.number(n)) {
        listRef.current[n]?.scrollIntoView({ block: "start", inline: "start" });
      }
      setActiveIndex((prev) => {
        if (Is.number(n)) return n;
        return props.open ? (prev ?? 0) : null;
      })
    }
  });
  const { getItemProps, getReferenceProps } = useInteractions([listNav]);

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
  }, [bindKey, commands, props, valueRef]);


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
        bodyClassName="px-0 py-0 pt-0"
        data-component="command-palette"
        onChange={props.onChangeVisibility}
        className="container relative py-0 md:max-w-screen-sm lg:max-w-screen-md overflow-clip"
      >
        <header className="flex sticky top-0 items-center w-full h-12 border-b overflow-clip isolate z-floating border-floating-border bg-floating-background">
          <div className="flex justify-center items-center size-10">
            {props.Icon ? <Icon Default={FilterIcon} text={value} size={16} /> : <FilterIcon size={16} />}

          </div>
          <input
            {...getReferenceProps({
              ref: root.refs.setReference,
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                const item = Is.number(activeIndex) ? displayItems[activeIndex] : null;
                if (item) {
                  const key = e.key
                  if (key === "Enter") {
                    if (item.type === "shortcut") item.action({ event: e, text: value, setOpen: props.onChangeVisibility, });
                  }
                }
              }
            } as any) as any}
            autoFocus
            value={value}
            data-combikeysbypass="true"
            placeholder="Search for..."
            onChange={(e) => setValue(e.target.value)}
            className="items-center py-2 px-2 pb-2 w-full h-12 text-lg text-left bg-transparent outline-none"
          />
        </header>
        {props.loading ? (
          <ul
            role="listbox"
            data-component="command-palette-list"
            className="flex overflow-y-auto flex-col gap-1 px-2 my-2 w-full max-h-96 origin-[top_center]"
          >
            <div className="px-2 pt-2 pb-1 h-10">{translations.commandPaletteLoading}</div>
            {loadingSkeleton.map((_, i) => (
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
          <div className="flex flex-row flex-nowrap min-w-full" data-component="command-palette-container">
            <ul
              role="listbox"
              data-component="command-palette-list"
              className="flex overflow-y-auto flex-col gap-1 px-2 my-2 w-full max-h-96 h-fit origin-[top_center]"
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
                        item.action({ event: e, text: value, setOpen: props.onChangeVisibility, });
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
        {props.footer ? <footer className="flex items-center p-2 h-8 rounded-b-lg bg-background">{props.footer}</footer> : null}
      </Modal>
    </Fragment>
  );
};
