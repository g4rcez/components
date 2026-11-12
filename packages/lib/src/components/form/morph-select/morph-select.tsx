"use client";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { useMotionPreference } from "../../../hooks/use-motion-preference";
import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type PointerEvent,
} from "react";
import { TYPEAHEAD_RESET_DELAY, VIEWPORT_PADDING } from "../../../constants";
import { useControllableState } from "../../../hooks/use-controllable-state";
import { useMorphWidth } from "../../../hooks/use-morph-width";
import { useResizeObserver } from "../../../hooks/use-resize-observer";
import { useTranslations, type TranslationOverrides } from "../../../hooks/use-translations";
import { css, mergeRefs } from "../../../lib/dom";
import { FOLD_SPRING, MORPH_SPRING } from "../../../lib/motion";
import { RollingText } from "../../core/rolling-text/rolling-text";
import { morphSelectStyles } from "./morph-select.styles";
import {
    AUTO_SEARCH_THRESHOLD,
    filterItems,
    findTypeahead,
    firstEnabled,
    flattenItems,
    isGroup,
    isPrintable,
    lastEnabled,
    moveEnabled,
    PAGE_STEP,
    type MorphSelectItem,
    type MorphSelectOption,
} from "./morph-select.utils";

export type { MorphSelectGroup, MorphSelectItem, MorphSelectOption } from "./morph-select.utils";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type MorphSelectProps = {
    /** Visible label. Also the accessible name. */
    label: string;
    /** Keeps the label for assistive technology only. */
    hideLabel?: boolean;
    /** Options or groups, in display order. */
    items: MorphSelectItem[];
    /** Controlled value. `null` is a controlled empty selection. */
    value?: string | null;
    /** Initial value when uncontrolled. */
    defaultValue?: string | null;
    onValueChange?: (value: string, option: MorphSelectOption) => void;
    /** Trigger text when nothing is selected. */
    placeholder?: string;
    /** Adds a search field while open. `"auto"` turns it on above eight options. @default "auto" */
    searchable?: boolean | "auto";
    /** Falls back to the selected label, then to "Search". */
    searchPlaceholder?: string;
    /** Width of the open surface in px. Never narrower than the trigger. @default 272 */
    panelWidth?: number;
    /** Tallest the list gets, in px, before it scrolls. @default 296 */
    maxListHeight?: number;
    /** Which trigger edge stays fixed while the surface grows. @default "start" */
    align?: "start" | "end";
    /** Adds a hidden input so the value submits with a native form. */
    name?: string;
    disabled?: boolean;
    className?: string;
    translations?: TranslationOverrides;
};

type Direction = "down" | "up";
type OpenTarget = "selected" | "first" | "last";

/** Spring for the surface growing out of the trigger. */
const OPEN_SPRING = MORPH_SPRING;

/**
 * A select whose trigger grows into the list. A single highlight glides between options, the value rolls up or
 * down depending on where the new option sits in the list, and the list supports type-ahead and optional search.
 *
 * @example
 * ```tsx
 * <MorphSelect
 *   label="Status"
 *   items={[{ value: "todo", label: "Todo" }, { value: "done", label: "Done" }]}
 *   onValueChange={(value) => save(value)}
 * />
 * ```
 */
export const MorphSelect = forwardRef<HTMLButtonElement, MorphSelectProps>(function MorphSelect(
    {
        label,
        hideLabel = false,
        items,
        value: valueProp,
        defaultValue,
        onValueChange,
        placeholder,
        searchable = "auto",
        searchPlaceholder,
        panelWidth = 272,
        maxListHeight = 296,
        align = "start",
        name,
        disabled = false,
        className,
        translations,
    },
    forwardedRef
) {
    const t = useTranslations(translations);
    const reduce = useMotionPreference();
    const base = useId();
    const labelId = `${base}-label`;
    const valueId = `${base}-value`;
    const listId = `${base}-list`;

    const [value, setValue] = useControllableState<string | null>({ value: valueProp, defaultValue: defaultValue ?? null });
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);
    const [panelW, setPanelW] = useState(0);
    const [direction, setDirection] = useState<Direction>("down");
    const [rolling, setRolling] = useState<1 | -1>(1);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [innerElement, setInnerElement] = useState<HTMLDivElement | null>(null);
    const openRef = useRef(open);
    openRef.current = open;
    const closedBox = useRef<{ w: number; h: number; r: number } | null>(null);
    const targetHeight = useRef(0);
    const running = useRef<AnimationPlaybackControls[]>([]);
    const typed = useRef({ text: "", timer: null as ReturnType<typeof setTimeout> | null });

    const width = useMotionValue(0);
    const height = useMotionValue(0);
    const radius = useMotionValue(0);
    const { width: triggerWidth, measure } = useMorphWidth(reduce);

    const flat = useMemo(() => flattenItems(items), [items]);
    const isSearchable = searchable === true || (searchable === "auto" && flat.length > AUTO_SEARCH_THRESHOLD);
    const visibleItems = useMemo(() => (isSearchable ? filterItems(items, query) : items), [isSearchable, items, query]);
    const visible = useMemo(() => flattenItems(visibleItems), [visibleItems]);
    const selected = flat.find((option) => option.value === value) ?? null;
    const active = visible[activeIndex] ?? null;
    const searching = open && isSearchable;
    const optionId = (option: MorphSelectOption) => `${base}-option-${flat.indexOf(option)}`;
    const resolvedPlaceholder = placeholder ?? t.morphSelectPlaceholder;

    useResizeObserver(innerElement, (entry) => {
        if (!openRef.current) return;
        const next = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        if (Math.abs(next - targetHeight.current) < 0.5) return;
        targetHeight.current = next;
        if (reduce) height.jump(next);
        else running.current.push(animate(height, next, OPEN_SPRING));
    });

    const stopAnimations = () => {
        running.current.forEach((controls) => controls.stop());
        running.current = [];
    };

    useIsomorphicLayoutEffect(() => {
        const inner = innerRef.current;
        const trigger = triggerRef.current;
        if (!mounted || !inner || !trigger) return;

        if (open) {
            const rect = trigger.getBoundingClientRect();
            const rawRadius = parseFloat(getComputedStyle(trigger).borderTopLeftRadius) || 0;
            const closed = { w: rect.width, h: rect.height, r: Math.min(rawRadius, rect.height / 2) };
            closedBox.current = closed;
            const naturalHeight = inner.offsetHeight;
            targetHeight.current = naturalHeight;

            const below = window.innerHeight - rect.top - 8;
            const above = rect.bottom - 8;
            setDirection(naturalHeight > below && above > below ? "up" : "down");

            stopAnimations();
            if (reduce) {
                width.jump(panelW);
                height.jump(naturalHeight);
                radius.jump(closed.r * 1.5);
                return;
            }
            // jump(), not set(): set() would hand the spring a huge velocity from the 0 to closed-size change.
            width.jump(closed.w);
            height.jump(closed.h);
            radius.jump(closed.r);
            running.current = [
                animate(width, panelW, OPEN_SPRING),
                animate(height, naturalHeight, OPEN_SPRING),
                animate(radius, closed.r * 1.5, OPEN_SPRING),
            ];
            return;
        }

        const closed = closedBox.current;
        stopAnimations();
        if (reduce || !closed) {
            setMounted(false);
            return;
        }
        let finished = false;
        const finish = () => {
            if (finished || openRef.current) return;
            finished = true;
            setMounted(false);
        };
        const folding = [animate(width, closed.w, FOLD_SPRING), animate(height, closed.h, FOLD_SPRING), animate(radius, closed.r, FOLD_SPRING)];
        running.current = folding;
        Promise.all(folding).then(finish, finish);
        const safety = setTimeout(finish, 900);
        return () => clearTimeout(safety);
    }, [open, mounted]);

    useEffect(
        () => () => {
            stopAnimations();
            if (typed.current.timer !== null) clearTimeout(typed.current.timer);
        },
        []
    );

    useEffect(() => {
        if (open && isSearchable) inputRef.current?.focus();
    }, [open, isSearchable, mounted]);

    useEffect(() => {
        if (!open || !active) return;
        document.getElementById(`${base}-option-${flat.indexOf(active)}`)?.scrollIntoView?.({ block: "nearest" });
    }, [open, active, base, flat]);

    const resetTypeahead = useCallback(() => {
        const state = typed.current;
        if (state.timer !== null) clearTimeout(state.timer);
        state.timer = null;
        state.text = "";
    }, []);

    const closeList = useCallback(
        (restoreFocus: boolean) => {
            resetTypeahead();
            setOpen(false);
            setQuery("");
            if (restoreFocus) triggerRef.current?.focus();
        },
        [resetTypeahead]
    );

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: globalThis.PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) closeList(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open, closeList]);

    const openList = (target: OpenTarget | { query: string } | { typeahead: string }) => {
        const trigger = triggerRef.current;
        if (disabled || open || !trigger) return;
        resetTypeahead();
        const rect = trigger.getBoundingClientRect();
        // The surface grows from one trigger edge, so it may only use the room on that side of the viewport.
        const room = align === "end" ? rect.right - VIEWPORT_PADDING : window.innerWidth - rect.left - VIEWPORT_PADDING;
        setPanelW(Math.max(rect.width, Math.min(panelWidth, window.innerWidth - 32, room)));

        let nextQuery = "";
        let list: MorphSelectOption[] = flat;
        let index: number;
        if (typeof target === "object" && "query" in target) {
            nextQuery = target.query;
            list = flattenItems(filterItems(items, nextQuery));
            index = firstEnabled(list);
        } else if (typeof target === "object") {
            index = findTypeahead(list, target.typeahead, -1);
        } else if (target === "first") {
            index = firstEnabled(list);
        } else if (target === "last") {
            index = lastEnabled(list);
        } else {
            const at = selected ? list.indexOf(selected) : -1;
            index = at >= 0 && !list[at].disabled ? at : firstEnabled(list);
        }
        setQuery(nextQuery);
        setActiveIndex(index);
        setMounted(true);
        setOpen(true);
    };

    const pick = (option: MorphSelectOption | null) => {
        if (!option || option.disabled) return;
        const from = selected ? flat.indexOf(selected) : -1;
        setRolling(flat.indexOf(option) >= from ? 1 : -1);
        setValue(option.value);
        onValueChange?.(option.value, option);
        closeList(true);
    };

    const typeahead = (char: string) => {
        const state = typed.current;
        if (state.timer !== null) clearTimeout(state.timer);
        state.text += char;
        state.timer = setTimeout(() => {
            state.text = "";
        }, TYPEAHEAD_RESET_DELAY);
        const index = findTypeahead(visible, state.text, activeIndex);
        if (index >= 0) setActiveIndex(index);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        const { key } = event;
        if (!open) {
            if (key === "Enter" || key === " " || key === "ArrowDown" || key === "ArrowUp") {
                event.preventDefault();
                openList("selected");
            } else if (key === "Home" || key === "End") {
                event.preventDefault();
                openList(key === "Home" ? "first" : "last");
            } else if (isPrintable(event)) {
                event.preventDefault();
                openList(isSearchable ? { query: key } : { typeahead: key });
            }
            return;
        }

        switch (key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex(moveEnabled(visible, activeIndex, 1));
                return;
            case "ArrowUp":
                event.preventDefault();
                if (event.altKey) pick(active);
                else setActiveIndex(moveEnabled(visible, activeIndex, -1));
                return;
            case "PageDown":
                event.preventDefault();
                setActiveIndex(moveEnabled(visible, activeIndex, PAGE_STEP));
                return;
            case "PageUp":
                event.preventDefault();
                setActiveIndex(moveEnabled(visible, activeIndex, -PAGE_STEP));
                return;
            case "Home":
                if (isSearchable) return;
                event.preventDefault();
                setActiveIndex(firstEnabled(visible));
                return;
            case "End":
                if (isSearchable) return;
                event.preventDefault();
                setActiveIndex(lastEnabled(visible));
                return;
            case "Enter":
                event.preventDefault();
                pick(active);
                return;
            case " ":
                if (isSearchable) return;
                event.preventDefault();
                pick(active);
                return;
            case "Escape":
                event.preventDefault();
                event.stopPropagation();
                closeList(true);
                return;
            case "Tab":
                closeList(false);
                return;
            default:
                if (!isSearchable && isPrintable(event)) {
                    event.preventDefault();
                    typeahead(key);
                }
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setQuery(next);
        setActiveIndex(firstEnabled(flattenItems(filterItems(items, next))));
    };

    const comboProps = {
        role: "combobox" as const,
        "aria-haspopup": "listbox" as const,
        "aria-expanded": open,
        "aria-controls": open && visible.length ? listId : undefined,
        "aria-activedescendant": open && active ? optionId(active) : undefined,
        onKeyDown: handleKeyDown,
    };

    const hover = (index: number) => (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse" && !visible[index].disabled) setActiveIndex(index);
    };

    const valueText = selected?.label ?? resolvedPlaceholder;
    const renderValue = (withId: boolean) => (
        <>
            {selected?.icon ? (
                <span aria-hidden className={morphSelectStyles.slots["option-icon"]}>
                    {selected.icon}
                </span>
            ) : null}
            <span id={withId ? valueId : undefined} data-placeholder={selected ? undefined : "true"} className={morphSelectStyles.slots.value}>
                <RollingText value={valueText} direction={rolling} />
            </span>
            <CaretDownIcon aria-hidden weight="bold" className={morphSelectStyles.slots.caret} />
        </>
    );

    const renderOption = (option: MorphSelectOption) => {
        const index = visible.indexOf(option);
        const isActive = index === activeIndex;
        const isSelected = option.value === value;
        return (
            <div
                key={option.value}
                id={optionId(option)}
                role="option"
                tabIndex={-1}
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                data-active={isActive ? "true" : undefined}
                className={morphSelectStyles.slots.option}
                onPointerEnter={hover(index)}
                onClick={() => pick(option)}
            >
                {isActive ? (
                    <motion.span aria-hidden layoutId={`${base}-highlight`} className={morphSelectStyles.slots.highlight} transition={MORPH_SPRING} />
                ) : null}
                {option.icon ? (
                    <span aria-hidden className={morphSelectStyles.slots["option-icon"]}>
                        {option.icon}
                    </span>
                ) : null}
                <span className={morphSelectStyles.slots["option-label"]}>{option.label}</span>
                {option.meta ? <span className={morphSelectStyles.slots["option-meta"]}>{option.meta}</span> : null}
                {isSelected ? <CheckIcon aria-hidden weight="bold" className={morphSelectStyles.slots["option-check"]} /> : null}
            </div>
        );
    };

    const status = searching && query ? (visible.length ? t.morphSelectResults(visible.length) : t.morphSelectNoMatches) : "";

    return (
        <div
            ref={rootRef}
            data-component="morph-select"
            data-open={open ? "true" : undefined}
            data-hide-label={hideLabel ? "true" : undefined}
            className={css(morphSelectStyles.className({}), className)}
            onBlur={(event) => {
                const next = event.relatedTarget as Node | null;
                if (open && next && !rootRef.current?.contains(next)) closeList(false);
            }}
        >
            <span id={labelId} className={morphSelectStyles.slots.label}>
                {label}
            </span>
            <div className={morphSelectStyles.slots.anchor}>
                <motion.button
                    {...(searching ? { "aria-hidden": true, tabIndex: -1 } : comboProps)}
                    ref={mergeRefs(triggerRef, forwardedRef)}
                    type="button"
                    disabled={disabled}
                    aria-labelledby={searching ? undefined : `${labelId} ${valueId}`}
                    data-searching={searching ? "true" : undefined}
                    className={morphSelectStyles.slots.trigger}
                    style={{ width: triggerWidth }}
                    onKeyUp={(event) => {
                        if (event.key === " ") event.preventDefault();
                    }}
                    onClick={() => (open ? closeList(true) : openList("selected"))}
                >
                    <span ref={measure} className={morphSelectStyles.slots["trigger-content"]}>
                        {renderValue(true)}
                    </span>
                </motion.button>
                {mounted ? (
                    <motion.div
                        data-align={align}
                        data-direction={direction}
                        className={morphSelectStyles.slots.surface}
                        style={{ width, height, borderRadius: radius }}
                    >
                        <div
                            ref={(element) => {
                                innerRef.current = element;
                                setInnerElement(element);
                            }}
                            className={morphSelectStyles.slots.inner}
                            style={{ width: panelW }}
                        >
                            <div
                                className={morphSelectStyles.slots.header}
                                // The plain value header is hidden from assistive technology, so its click is a pointer-only shortcut.
                                {...(isSearchable ? {} : { "aria-hidden": true, onClick: () => closeList(true) })}
                            >
                                {isSearchable ? (
                                    <input
                                        {...comboProps}
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        autoComplete="off"
                                        aria-autocomplete="list"
                                        aria-labelledby={labelId}
                                        placeholder={searchPlaceholder ?? selected?.label ?? t.morphSelectSearch}
                                        className={morphSelectStyles.slots.search}
                                        onChange={handleSearch}
                                    />
                                ) : (
                                    renderValue(false)
                                )}
                            </div>
                            {visible.length ? (
                                <div
                                    id={listId}
                                    role="listbox"
                                    tabIndex={-1}
                                    aria-labelledby={labelId}
                                    className={morphSelectStyles.slots.list}
                                    style={{ maxHeight: maxListHeight }}
                                    // Keep focus on the combobox while pressing an option.
                                    onMouseDown={(event) => event.preventDefault()}
                                >
                                    {visibleItems.map((item, groupIndex) =>
                                        isGroup(item) ? (
                                            <div key={`${item.label}-${groupIndex}`} role="group" aria-labelledby={`${base}-group-${groupIndex}`}>
                                                <div id={`${base}-group-${groupIndex}`} className={morphSelectStyles.slots["group-label"]}>
                                                    {item.label}
                                                </div>
                                                {item.options.map(renderOption)}
                                            </div>
                                        ) : (
                                            renderOption(item)
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className={morphSelectStyles.slots.empty}>{t.morphSelectNoMatches}</div>
                            )}
                        </div>
                    </motion.div>
                ) : null}
            </div>
            {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
            <span role="status" aria-live="polite" className={morphSelectStyles.slots.status}>
                {status}
            </span>
        </div>
    );
});
MorphSelect.displayName = "MorphSelect";
