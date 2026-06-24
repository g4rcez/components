import {
    ArrowRightIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ListBulletsIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    RocketLaunchIcon,
    TrashIcon,
    UploadIcon,
} from "@phosphor-icons/react";
import type { CSSProperties } from "react";
import {
    Alert,
    AnimatedList,
    AnimatedListItem,
    Button,
    Calendar,
    Card,
    Checkbox,
    Empty,
    Info,
    Input,
    Loading,
    PageCalendar,
    Progress,
    Radiobox,
    Slider,
    Spinner,
    Stats,
    StatsCard,
    Step,
    Steps,
    Switch,
    Tab,
    Tabs,
    Tag,
    Textarea,
    Timeline,
    TimelineItem,
    Toolbar,
    Shortcut,
    Skeleton,
    components as componentTokens,
} from "@g4rcez/components";

type ComponentTokenName = keyof typeof componentTokens;
type CssCustomProperty = `--${string}`;

export type TokenControl = {
    key: string;
    label: string;
    value: string;
    defaultValue: string;
    kind: "range" | "text";
    cssVariables: CssCustomProperty[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    numberValue?: number;
};

export type TokenGroup = Record<string, TokenControl>;

const numericTokenPattern = /^(-?\d*\.?\d+)([a-z%]+)?$/i;

const extraComponentTokens: Partial<Record<ComponentTokenName, Record<string, string>>> = {};

const runtimeTokenAliases: Partial<Record<ComponentTokenName, Record<string, CssCustomProperty[]>>> = {
    checkbox: {
        "label-gap": ["--var-checkbox-label-gap"],
        "control-size": ["--var-checkbox-control-size"],
        "control-radius": ["--var-checkbox-control-radius"],
        "control-foreground": ["--var-checkbox-control-foreground"],
        "control-background": ["--var-checkbox-control-background"],
        "control-border": ["--var-checkbox-control-border"],
        "control-border-width": ["--var-checkbox-control-border-width"],
        "mark-foreground": ["--var-checkbox-mark-foreground"],
        "mark-stroke-width": ["--var-checkbox-mark-stroke-width"],
        "mark-inline-size": ["--var-checkbox-mark-inline-size"],
        "mark-block-size": ["--var-checkbox-mark-block-size"],
        "indeterminate-mark-inline-size": ["--var-checkbox-indeterminate-mark-inline-size"],
        "focus-ring": ["--var-checkbox-focus-ring"],
        "focus-ring-width": ["--var-checkbox-focus-ring-width"],
        "focus-ring-offset": ["--var-checkbox-focus-ring-offset"],
        "disabled-opacity": ["--var-checkbox-disabled-opacity"],
        "error-font-size": ["--var-checkbox-error-font-size"],
    },
    radiobox: {
        "label-gap": ["--var-radiobox-label-gap"],
        "control-size": ["--var-radiobox-control-size"],
        "control-foreground": ["--var-radiobox-control-foreground"],
        "control-background": ["--var-radiobox-control-background"],
        "control-border": ["--var-radiobox-control-border"],
        "control-border-width": ["--var-radiobox-control-border-width"],
        "mark-size": ["--var-radiobox-mark-size"],
        "mark-foreground": ["--var-radiobox-mark-foreground"],
        "focus-ring": ["--var-radiobox-focus-ring"],
        "focus-ring-width": ["--var-radiobox-focus-ring-width"],
        "focus-ring-offset": ["--var-radiobox-focus-ring-offset"],
        "disabled-opacity": ["--var-radiobox-disabled-opacity"],
        "transition-duration": ["--var-radiobox-transition-duration"],
        "transition-timing": ["--var-radiobox-transition-timing"],
    },
    input: {
        "field-icon-size": ["--var-input-field-icon-size"],
        "field-small-icon-size": ["--var-input-field-small-icon-size"],
        "field-label-row-gap": ["--var-input-field-label-row-gap"],
        "field-label-meta-gap": ["--var-input-field-label-meta-gap"],
        "field-tooltip-icon-size": ["--var-input-field-tooltip-icon-size"],
        "field-small-tooltip-icon-size": ["--var-input-field-small-tooltip-icon-size"],
        "field-tooltip-max-inline-size": ["--var-input-field-tooltip-max-inline-size"],
        "field-status-min-inline-size": ["--var-input-field-status-min-inline-size"],
        "field-small-status-min-inline-size": ["--var-input-field-small-status-min-inline-size"],
        "field-status-block-size": ["--var-input-field-status-block-size"],
        "field-small-status-block-size": ["--var-input-field-small-status-block-size"],
        "field-status-indicator-size": ["--var-input-field-status-indicator-size"],
        "field-small-status-indicator-size": ["--var-input-field-small-status-indicator-size"],
        "field-label-gap": ["--var-input-field-label-gap"],
        "field-label-font-size": ["--var-input-field-label-font-size"],
        "field-small-label-font-size": ["--var-input-field-small-label-font-size"],
        "field-optional-opacity": ["--var-input-field-optional-opacity"],
        "field-control-column-gap": ["--var-input-field-control-column-gap"],
        "field-small-control-column-gap": ["--var-input-field-small-control-column-gap"],
        "field-control-row-gap": ["--var-input-field-control-row-gap"],
        "field-small-control-row-gap": ["--var-input-field-small-control-row-gap"],
        "field-control-radius": ["--var-input-field-control-radius", "--var-free-text-surface-radius"],
        "field-slot-gap": ["--var-input-field-slot-gap"],
        "field-small-slot-gap": ["--var-input-field-small-slot-gap"],
        "field-slot-padding-inline-start": ["--var-input-field-slot-padding-inline-start"],
        "field-small-slot-padding-inline-start": ["--var-input-field-small-slot-padding-inline-start"],
        "field-slot-padding-inline-end": ["--var-input-field-slot-padding-inline-end"],
        "field-small-slot-padding-inline-end": ["--var-input-field-small-slot-padding-inline-end"],
        "field-hint-margin-block-start": ["--var-input-field-hint-margin-block-start"],
        "field-hint-font-size": ["--var-input-field-hint-font-size"],
        "field-small-hint-font-size": ["--var-input-field-small-hint-font-size"],
        "free-text-control-height": ["--var-free-text-control-height"],
        "free-text-small-control-height": ["--var-free-text-small-control-height"],
        "free-text-surface-radius": ["--var-free-text-surface-radius"],
        "free-text-surface-padding-inline": ["--var-free-text-surface-padding-inline"],
        "free-text-small-surface-padding-inline": ["--var-free-text-small-surface-padding-inline"],
        "free-text-surface-padding-block": ["--var-free-text-surface-padding-block"],
        "free-text-small-surface-padding-block": ["--var-free-text-small-surface-padding-block"],
        "free-text-font-size": ["--var-free-text-font-size"],
        "free-text-small-font-size": ["--var-free-text-small-font-size"],
        "free-text-outline-width": ["--var-free-text-outline-width"],
        "free-text-outline-offset": ["--var-free-text-outline-offset"],
        "free-text-placeholder-foreground": ["--var-free-text-placeholder-foreground"],
        "free-text-error-placeholder-foreground": ["--var-free-text-error-placeholder-foreground"],
    },
    "file-upload": {
        "surface-padding": ["--var-file-upload-surface-padding"],
        "surface-radius": ["--var-file-upload-surface-radius"],
        "content-gap": ["--var-file-upload-content-gap"],
        "thumb-size": ["--var-file-upload-thumb-size"],
        "thumb-radius": ["--var-file-upload-thumb-radius"],
        "thumb-icon-size": ["--var-file-upload-thumb-icon-size"],
        "file-icon-size": ["--var-file-upload-file-icon-size"],
        "remove-icon-size": ["--var-file-upload-remove-icon-size"],
        "idle-icon-size": ["--var-file-upload-idle-icon-size"],
        "preview-button-margin": ["--var-file-upload-preview-button-margin"],
        "item-border-width": ["--var-file-upload-item-border-width"],
        "actions-padding-block": ["--var-file-upload-actions-padding-block"],
        "remove-button-size": ["--var-file-upload-remove-button-size"],
        "list-gap": ["--var-file-upload-list-gap"],
        "idle-icon-gap": ["--var-file-upload-idle-icon-gap"],
        "idle-copy-margin-block": ["--var-file-upload-idle-copy-margin-block"],
        "idle-copy-gap": ["--var-file-upload-idle-copy-gap"],
        "name-font-size": ["--var-file-upload-name-font-size"],
        "size-font-size": ["--var-file-upload-size-font-size"],
        "viewer-media-max-inline-size": ["--var-file-upload-viewer-media-max-inline-size"],
    },
    button: {
        "height-big": ["--var-button-big-height"],
        "height-min": ["--var-button-min-height"],
        "height-small": ["--var-button-small-height"],
        "height-tiny": ["--var-button-tiny-height"],
        "padding-icon": ["--var-button-icon-p"],
        "padding-x": ["--var-button-px"],
        "padding-x-big": ["--var-button-big-px"],
        "padding-x-min": ["--var-button-min-px"],
        "padding-x-small": ["--var-button-small-px"],
        "padding-x-tiny": ["--var-button-tiny-px"],
        "padding-y": ["--var-button-py"],
        "padding-y-big": ["--var-button-big-py"],
        "padding-y-min": ["--var-button-min-py"],
        "padding-y-small": ["--var-button-small-py"],
        "padding-y-tiny": ["--var-button-tiny-py"],
        "radius-rough": ["--var-button-rough-rounded"],
        "radius-squared": ["--var-button-squared-rounded"],
        "text-big": ["--var-button-big-font-size"],
        "text-icon": ["--var-button-icon-font-size"],
        "text-min": ["--var-button-min-font-size"],
        "text-small": ["--var-button-small-font-size"],
        "text-tiny": ["--var-button-tiny-font-size"],
        gap: ["--var-button-gap"],
        height: ["--var-button-height"],
        rounded: ["--var-button-rounded"],
        text: ["--var-button-font-size"],
    },
    progress: {
        "track-h": ["--var-progress-track-h"],
        rounded: ["--var-progress-rounded"],
    },
    spinner: {
        "container-padding": ["--var-spinner-container-padding"],
        "indicator-border-width": ["--var-spinner-indicator-border-width"],
        "indicator-size": ["--var-spinner-indicator-size"],
        "spin-duration": ["--var-spinner-spin-duration"],
    },
    stats: {
        gap: ["--var-stats-gap"],
        "footer-px": ["--var-stats-footer-px"],
        "footer-py": ["--var-stats-footer-py"],
        "icon-p": ["--var-stats-icon-p"],
        "icon-size": ["--var-stats-icon-size"],
        "inner-gap": ["--var-stats-inner-gap"],
        p: ["--var-stats-p"],
        rounded: ["--var-stats-rounded"],
        "title-text": ["--var-stats-title-font-size"],
        "value-text": ["--var-stats-value-font-size"],
    },
    tag: {
        "big-min-block-size": ["--var-tag-big-min-block-size"],
        "big-padding-block": ["--var-tag-big-padding-block"],
        "big-padding-inline": ["--var-tag-big-padding-inline"],
        "default-min-block-size": ["--var-tag-default-min-block-size"],
        "default-padding-block": ["--var-tag-default-padding-block"],
        "default-padding-inline": ["--var-tag-default-padding-inline"],
        "icon-padding": ["--var-tag-icon-padding"],
        "indicator-size": ["--var-tag-indicator-size"],
        "small-font-size": ["--var-tag-small-font-size"],
        "small-min-block-size": ["--var-tag-small-min-block-size"],
        "small-padding-block": ["--var-tag-small-padding-block"],
        "small-padding-inline": ["--var-tag-small-padding-inline"],
        "surface-gap": ["--var-tag-surface-gap"],
        "surface-radius": ["--var-tag-surface-radius"],
        "tiny-font-size": ["--var-tag-tiny-font-size"],
        "tiny-min-block-size": ["--var-tag-tiny-min-block-size"],
        "tiny-padding-block": ["--var-tag-tiny-padding-block"],
        "tiny-padding-inline": ["--var-tag-tiny-padding-inline"],
    },
    tabs: {
        "active-divider-block-size": ["--var-tabs-active-divider-block-size"],
        "divider-block-size": ["--var-tabs-divider-block-size"],
        "header-margin-block-end": ["--var-tabs-header-margin-block-end"],
        "item-transition-duration": ["--var-tabs-item-transition-duration"],
        "tab-padding-block": ["--var-tabs-tab-padding-block"],
        "tab-padding-inline": ["--var-tabs-tab-padding-inline"],
    },
    timeline: {
        "actions-gap": ["--var-timeline-actions-gap"],
        "actions-padding-inline": ["--var-timeline-actions-padding-inline"],
        "connector-inline-size": ["--var-timeline-connector-inline-size"],
        "connector-inset-block-start": ["--var-timeline-connector-inset-block-start"],
        "connector-inset-inline-start": ["--var-timeline-connector-inset-inline-start"],
        "content-gap": ["--var-timeline-content-gap"],
        "icon-padding": ["--var-timeline-icon-padding"],
        "icon-size": ["--var-timeline-icon-size"],
        "item-padding-block-end": ["--var-timeline-item-padding-block-end"],
    },
    "page-calendar": {
        "badge-radius": ["--var-page-calendar-badge-radius"],
        "badge-size": ["--var-page-calendar-badge-size"],
        "cell-gap": ["--var-page-calendar-cell-gap"],
        "cell-gap-tight": ["--var-page-calendar-cell-gap-tight"],
        "cell-min-block-size": ["--var-page-calendar-cell-min-block-size"],
        "cell-padding": ["--var-page-calendar-cell-padding"],
        "date-gap": ["--var-page-calendar-date-gap"],
        "day-badge-size": ["--var-page-calendar-day-badge-size"],
        "day-header-gap": ["--var-page-calendar-day-header-gap"],
        "day-header-padding-block": ["--var-page-calendar-day-header-padding-block"],
        "day-header-padding-inline": ["--var-page-calendar-day-header-padding-inline"],
        "detail-gap": ["--var-page-calendar-detail-gap"],
        "detail-padding": ["--var-page-calendar-detail-padding"],
        "dot-bottom": ["--var-page-calendar-dot-bottom"],
        "dot-size": ["--var-page-calendar-dot-size"],
        "filter-font-size": ["--var-page-calendar-filter-font-size"],
        "filter-gap": ["--var-page-calendar-filter-gap"],
        "filter-label-margin-inline-end": ["--var-page-calendar-filter-label-margin-inline-end"],
        gap: ["--var-page-calendar-gap"],
        "gutter-width": ["--var-page-calendar-gutter-width"],
        "header-gap": ["--var-page-calendar-header-gap"],
        "hour-font-size": ["--var-page-calendar-hour-font-size"],
        "month-badge-font-size": ["--var-page-calendar-month-badge-font-size"],
        "month-badge-size": ["--var-page-calendar-month-badge-size"],
        "nav-button-gap": ["--var-page-calendar-nav-button-gap"],
        "nav-gap": ["--var-page-calendar-nav-gap"],
        "overflow-font-size": ["--var-page-calendar-overflow-font-size"],
        "pill-font-size": ["--var-page-calendar-pill-font-size"],
        "pill-radius": ["--var-page-calendar-pill-radius"],
        "side-padding-inline": ["--var-page-calendar-side-padding-inline"],
        "title-text": ["--var-page-calendar-title-text"],
        "today-font-size": ["--var-page-calendar-today-font-size"],
        "today-padding-block": ["--var-page-calendar-today-padding-block"],
        "today-padding-inline": ["--var-page-calendar-today-padding-inline"],
        "today-radius": ["--var-page-calendar-today-radius"],
        "view-switch-radius": ["--var-page-calendar-view-switch-radius"],
        "week-badge-font-size": ["--var-page-calendar-week-badge-font-size"],
        "week-badge-size": ["--var-page-calendar-week-badge-size"],
        "week-label-text": ["--var-page-calendar-week-label-text"],
        "weekday-font-size": ["--var-page-calendar-weekday-font-size"],
        "weekday-padding-block": ["--var-page-calendar-weekday-padding-block"],
    },
    table: {
        "cell-border": ["--var-table-cell-border"],
        "cell-padding": ["--var-table-cell-padding"],
        "cell-padding-inline": ["--var-table-cell-padding-inline"],
        "divider-width": ["--var-table-divider-width"],
        "empty-block-size": ["--var-table-empty-block-size"],
        "filter-dot-margin-inline-end": ["--var-table-filter-dot-margin-inline-end"],
        "filter-dot-size": ["--var-table-filter-dot-size"],
        "filter-gap": ["--var-table-filter-gap"],
        "filter-inline-gap": ["--var-table-filter-inline-gap"],
        "filter-inline-padding-block": ["--var-table-filter-inline-padding-block"],
        "filter-list-margin-block-start": ["--var-table-filter-list-margin-block-start"],
        "filter-row-gap": ["--var-table-filter-row-gap"],
        "groups-gap": ["--var-table-groups-gap"],
        "groups-margin-block": ["--var-table-groups-margin-block"],
        "groups-margin-block-start": ["--var-table-groups-margin-block-start"],
        "head-cell-block-size": ["--var-table-head-cell-block-size"],
        "inline-gap-tight": ["--var-table-inline-gap-tight"],
        "loading-bar-block-size": ["--var-table-loading-bar-block-size"],
        "loading-bar-radius": ["--var-table-loading-bar-radius"],
        "loading-block-size": ["--var-table-loading-block-size"],
        "metadata-gap-block": ["--var-table-metadata-gap-block"],
        "metadata-gap-inline": ["--var-table-metadata-gap-inline"],
        "metadata-margin-block-end": ["--var-table-metadata-margin-block-end"],
        "metadata-min-inline-size": ["--var-table-metadata-min-inline-size"],
        "operations-gap": ["--var-table-operations-gap"],
        "operations-padding-block": ["--var-table-operations-padding-block"],
        "pagination-gap": ["--var-table-pagination-gap"],
        "pagination-item-padding-block": ["--var-table-pagination-item-padding-block"],
        "pagination-item-padding-inline": ["--var-table-pagination-item-padding-inline"],
        "pagination-items-gap": ["--var-table-pagination-items-gap"],
        "pagination-padding": ["--var-table-pagination-padding"],
        "pill-padding-block": ["--var-table-pill-padding-block"],
        "pill-padding-inline": ["--var-table-pill-padding-inline"],
        "pill-radius": ["--var-table-pill-radius"],
        rounded: ["--var-table-rounded"],
        "row-gap": ["--var-table-row-gap"],
        "row-padding-block-end": ["--var-table-row-padding-block-end"],
    },
};

const internalTokenPattern = /(^__|__|(^|-)tw-(\d+|extra-\d+|final-\d+)(-|$))/;

const cssVariablesFor = (name: ComponentTokenName, attr: string, key: string): CssCustomProperty[] => [
    `--${key}`,
    ...(runtimeTokenAliases[name]?.[attr] ?? []),
];

const labelFor = (key: string) => key;

const idFor = (name: string, attr: string) => `${name}-${attr}`.replace(/[^a-zA-Z0-9]+/g, "_");

const featuredTokenIdsByGroup: Partial<Record<ComponentTokenName, string[]>> = {
    button: ["height", "padding-x", "padding-y", "gap", "radius", "text"].map((attr) => idFor("button", attr)),
};

const groupDescriptions: Partial<Record<ComponentTokenName, string>> = {
    button: "Buttons expose stable public CSS variables for geometry. Generated selectors such as __*__tw-* stay internal and are intentionally excluded from this view.",
};

const snippetExamplesByGroup: Partial<Record<ComponentTokenName, string>> = {
    button: `<Button theme="primary">Save changes</Button>`,
    checkbox: `<Checkbox defaultChecked>Subscribe</Checkbox>`,
    input: `<Input title="Email" placeholder="you@example.com" />`,
    radiobox: `<Radiobox defaultChecked value="pro">Pro</Radiobox>`,
    switch: `<Switch defaultChecked>Notifications</Switch>`,
    tabs: `<Tabs active="overview">...</Tabs>`,
};

const isPublicTokenAttribute = (attr: string) => !internalTokenPattern.test(attr);

const primaryCssVariable = (token: TokenControl) => token.cssVariables[0];

const componentTagNameFor = (name: ComponentTokenName) =>
    name
        .split("-")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("");

const defaultFeaturedTokenIds = (tokens: TokenGroup) => Object.keys(tokens).slice(0, 6);

const descriptionForGroup = (group: ComponentTokenName) =>
    groupDescriptions[group] ??
    `${groupTitle(group)} exposes stable public CSS variables for its token surface. Generated selectors such as __*__tw-* stay internal and are intentionally excluded from this view.`;

const snippetExampleForGroup = (group: ComponentTokenName) => snippetExamplesByGroup[group] ?? `<${componentTagNameFor(group)} />`;

const tokenOverrideSnippet = (tokens: TokenGroup, ids: string[], group: ComponentTokenName) => {
    const lines = ids.flatMap((id) => {
        const token = tokens[id];
        return token ? [`    "${primaryCssVariable(token)}": "${token.value}",`] : [];
    });

    return [`<div`, `  style={{`, ...lines, `  }}`, `>`, `  ${snippetExampleForGroup(group)}`, `</div>`].join("\n");
};

const groupTitle = (name: ComponentTokenName) =>
    name
        .split("-")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join(" ");

const rangeFor = (_key: string, value: number, unit: string | undefined): Pick<TokenControl, "min" | "max" | "step"> => {
    if (unit === "%" || unit === "vh" || unit === "dvh" || unit === "svh" || unit === "lvh") return { min: 0, max: 100, step: 1 };
    if (unit === "ch") return { min: 0, max: Math.max(16, Math.ceil(value * 3)), step: 1 };
    if (unit === "px") return { min: 0, max: Math.max(16, Math.ceil((value || 1) * 4)), step: 1 };
    if (unit === "rem")
        return {
            min: 0,
            max: Math.max(4, Math.ceil((value || 1) * 3)),
            step: 0.0625,
        };
    return { min: 0, max: Math.max(10, Math.ceil((value || 1) * 4)), step: 1 };
};

const tokenControl = (name: ComponentTokenName, attr: string, defaultValue: string): TokenControl => {
    const key = `${name}-${attr}`;
    const cssVariables = cssVariablesFor(name, attr, key);
    const parsed = defaultValue.match(numericTokenPattern);

    if (!parsed) {
        return {
            key,
            label: labelFor(key),
            value: defaultValue,
            defaultValue,
            kind: "text",
            cssVariables,
        };
    }

    const numberValue = Number(parsed[1]);
    const unit = parsed[2] ?? "";

    return {
        key,
        label: labelFor(key),
        value: defaultValue,
        defaultValue,
        kind: "range",
        cssVariables,
        numberValue,
        unit,
        ...rangeFor(key, numberValue, unit),
    };
};

export const tokenGroupDefaults = (name: ComponentTokenName): TokenGroup =>
    Object.entries({ ...componentTokens[name], ...extraComponentTokens[name] })
        .filter(([attr]) => isPublicTokenAttribute(attr))
        .reduce<TokenGroup>((acc, [attr, value]) => {
            acc[idFor(name, attr)] = tokenControl(name, attr, `${value}`);
            return acc;
        }, {});

export const pickTokenDefaults = (name: ComponentTokenName, attrs: string[]): TokenGroup => {
    const group = tokenGroupDefaults(name);
    const wanted = new Set(attrs.map((attr) => idFor(name, attr)));

    return Object.fromEntries(Object.entries(group).filter(([id]) => wanted.has(id)));
};

export const mergeTokenDefaults = (...names: ComponentTokenName[]): TokenGroup =>
    names.reduce<TokenGroup>((acc, name) => ({ ...acc, ...tokenGroupDefaults(name) }), {});

const scopedTokenGroup = (name: ComponentTokenName, tokens: TokenGroup): TokenGroup => {
    const defaults = tokenGroupDefaults(name);

    return Object.fromEntries(Object.keys(defaults).map((id) => [id, tokens[id] ?? defaults[id]]));
};

export const tokensToStyle = (group: TokenGroup): CSSProperties =>
    Object.values(group).reduce<CSSProperties>((acc, token) => {
        for (const variable of token.cssVariables) (acc as Record<string, string>)[variable] = token.value;
        return acc;
    }, {});

export const TokenControls = ({ tokens, onChange }: { tokens: TokenGroup; onChange: (next: TokenGroup) => void }) => (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        {Object.entries(tokens).map(([id, token]) => (
            <label key={id} aria-label={`--${token.label}`} className="flex flex-col gap-1 text-xs">
                <span className="flex justify-between gap-3 font-mono text-muted-foreground">
                    <span>--{token.label}</span>
                    <span>{token.value}</span>
                </span>
                {token.kind === "range" ? (
                    <input
                        type="range"
                        min={token.min}
                        max={token.max}
                        step={token.step}
                        value={token.numberValue}
                        onChange={(event) => {
                            const numberValue = Number(event.target.value);
                            onChange({
                                ...tokens,
                                [id]: {
                                    ...token,
                                    numberValue,
                                    value: `${numberValue}${token.unit ?? ""}`,
                                },
                            });
                        }}
                        className="w-full"
                    />
                ) : (
                    <input
                        type="text"
                        value={token.value}
                        onChange={(event) => {
                            onChange({
                                ...tokens,
                                [id]: {
                                    ...token,
                                    value: event.target.value,
                                },
                            });
                        }}
                        className="rounded-input-radius border border-input-border bg-background px-input-padding-x py-input-padding-y font-mono text-typography-xs text-foreground"
                    />
                )}
            </label>
        ))}
    </div>
);

const formFieldTokenGroup = "input" satisfies ComponentTokenName;

const previewDate = new Date(2026, 0, 15);

const TokenPreview = ({ group }: { group: ComponentTokenName }) => {
    switch (group) {
        case "alert":
            return (
                <Alert theme="info" title="Token preview">
                    <p>Padding, radius and gap update as you edit the tokens.</p>
                </Alert>
            );
        case "button":
            return (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button theme="primary">Primary</Button>
                        <Button theme="secondary">Secondary</Button>
                        <Button theme="muted">Muted</Button>
                        <Button theme="outlined">Outlined</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button size="big">Big</Button>
                        <Button>Default</Button>
                        <Button size="small">Small</Button>
                        <Button size="min">Min</Button>
                        <Button size="tiny">Tiny</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button icon={<PlusIcon aria-hidden />}>Create</Button>
                        <Button theme="success" icon={<CheckCircleIcon aria-hidden />}>
                            Approve
                        </Button>
                        <Button theme="danger" icon={<TrashIcon aria-hidden />}>
                            Delete
                        </Button>
                        <Button theme="outlined" icon={<ArrowRightIcon aria-hidden />}>
                            Continue
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button rounded="rough">Rough</Button>
                        <Button rounded="default">Rounded</Button>
                        <Button rounded="squared">Squared</Button>
                        <Button size="icon" icon={<RocketLaunchIcon aria-hidden />} aria-label="Launch" />
                    </div>
                </div>
            );
        case "card":
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <Card title="Card preview">
                        <p className="text-typography-sm text-muted-foreground">Card padding, title spacing and radius all respond to token edits.</p>
                    </Card>
                    <StatsCard title="Revenue" Icon={ChartBarIcon} value="$12,480" />
                </div>
            );
        case "modal":
            return (
                <div className="mx-auto w-full max-w-dialog rounded-modal-surface-radius border border-floating-border bg-floating-background px-modal-content-padding-inline py-modal-surface-padding-block shadow-shadow-floating">
                    <header className="pb-modal-title-padding-block-end text-modal-title-font-size font-semibold">Confirm deployment</header>
                    <p className="text-typography-sm py-modal-body-padding-block text-muted-foreground">
                        This static dialog surface uses the same modal tokens.
                    </p>
                    <footer className="flex justify-end gap-modal-confirm-actions-gap pt-modal-footer-padding-block-start">
                        <Button theme="muted" size="small">
                            Cancel
                        </Button>
                        <Button theme="primary" size="small">
                            Confirm
                        </Button>
                    </footer>
                </div>
            );
        case "dropdown":
            return (
                <div className="mx-auto w-full max-w-xs rounded-dropdown-surface-radius border border-dropdown-surface-border bg-dropdown-surface-background p-dropdown-surface-padding text-dropdown-surface-foreground shadow-shadow-floating">
                    <header className="text-typography-sm mb-dropdown-header-margin-block-end font-semibold">Workspace</header>
                    <div className="flex flex-col gap-2 text-typography-sm text-muted-foreground">
                        <span>Profile</span>
                        <span>Settings</span>
                        <span>Billing</span>
                    </div>
                </div>
            );
        case "tooltip":
            return (
                <div className="mx-auto max-w-xs rounded-tooltip-surface-radius border border-tooltip-surface-border bg-tooltip-surface-background p-tooltip-surface-padding text-tooltip-surface-foreground shadow-shadow-floating">
                    <p className="text-typography-sm">Tooltip surface preview</p>
                </div>
            );
        case "menu":
            return (
                <div className="mx-auto w-full max-w-xs overflow-hidden rounded-menu-surface-radius border border-menu-surface-border bg-menu-surface-background text-menu-surface-foreground shadow-shadow-floating">
                    <div className="p-menu-item-padding text-typography-sm hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                        Duplicate
                    </div>
                    <div className="p-menu-item-padding text-typography-sm hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                        Archive
                    </div>
                    <div className="p-menu-item-padding text-typography-sm text-danger hover:bg-menu-item-active-background hover:text-menu-item-active-foreground">
                        Delete
                    </div>
                </div>
            );
        case "stats":
            return (
                <Stats
                    title="Revenue"
                    Icon={ChartBarIcon}
                    footer={<span className="text-typography-xs text-muted-foreground">+12.4% vs last month</span>}
                >
                    $12,480
                </Stats>
            );
        case "notification":
            return (
                <div className="flex max-w-sm items-start gap-notification-gap rounded-notification-radius border border-success-subtle bg-success-subtle p-notification-p text-success-foreground shadow-shadow-notification">
                    <CheckCircleIcon size={24} aria-hidden />
                    <div className="flex flex-col gap-notification-inner-gap">
                        <strong className="text-typography-sm">Deploy succeeded</strong>
                        <span className="text-notification-badge-text">main → production · 12s ago</span>
                    </div>
                </div>
            );
        case "command":
            return (
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-command-item-radius border border-command-surface-border bg-command-surface-background text-command-surface-foreground shadow-shadow-floating">
                    <div className="flex h-command-header-block-size items-center gap-2 px-command-input-padding-inline py-command-input-padding-block">
                        <MagnifyingGlassIcon size={16} aria-hidden />
                        <span className="text-typography-sm text-muted-foreground">Search commands…</span>
                    </div>
                    <div className="flex flex-col gap-command-list-gap px-command-list-padding-inline py-command-list-margin-block">
                        <div className="flex h-command-row-block-size items-center gap-command-item-content-gap rounded-command-item-radius p-command-item-padding text-typography-sm hover:bg-command-item-background-hover">
                            Create deployment
                        </div>
                        <div className="flex h-command-row-block-size items-center gap-command-item-content-gap rounded-command-item-radius p-command-item-padding text-typography-sm hover:bg-command-item-background-hover">
                            Invite teammate
                        </div>
                    </div>
                </div>
            );
        case "tag":
            return (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Tag size="tiny">tiny</Tag>
                        <Tag size="small">small</Tag>
                        <Tag>default</Tag>
                        <Tag size="big">big</Tag>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Tag theme="neutral" indicator>
                            Default indicator
                        </Tag>
                        <Tag size="small" theme="neutral" indicator="success">
                            Success
                        </Tag>
                        <Tag size="tiny" theme="neutral" indicator="danger">
                            Danger
                        </Tag>
                    </div>
                </div>
            );
        case "calendar":
            return <Calendar date={previewDate} changeOnlyOnClick />;
        case "table":
            return (
                <div className="overflow-hidden rounded-table-radius border border-table-border bg-table-background shadow-shadow-table">
                    <table className="w-full border-collapse">
                        <thead className="bg-table-header">
                            <tr>
                                <th className="p-table-cell-padding text-left text-typography-sm">Name</th>
                                <th className="p-table-cell-padding text-left text-typography-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-table-border">
                                <td className="p-table-cell-padding px-table-cell-px text-typography-sm">Fulano</td>
                                <td className="p-table-cell-padding px-table-cell-px text-typography-sm">Active</td>
                            </tr>
                            <tr className="border-t border-table-border">
                                <td className="p-table-cell-padding px-table-cell-px text-typography-sm">Ciclano</td>
                                <td className="p-table-cell-padding px-table-cell-px text-typography-sm">Invited</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        case "skeleton":
            return (
                <div className="flex flex-col items-center gap-skeleton-list-gap">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            );
        case "typography":
            return (
                <div className="flex flex-col gap-2">
                    <p className="text-typography-xs text-muted-foreground">Caption / typography-xs</p>
                    <p className="text-typography-base">Body / typography-base</p>
                    <h3 className="text-typography-2xl font-bold">Section heading / typography-2xl</h3>
                    <h2 className="text-typography-4xl font-extrabold">Display / typography-4xl</h2>
                </div>
            );
        case "input":
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <Input title="Email" name="token-preview-email" placeholder="you@example.com" />
                    <Textarea title="Notes" name="token-preview-notes" placeholder="Tokenized textarea" />
                </div>
            );
        case "checkbox":
            return (
                <div className="flex flex-col gap-3">
                    <Checkbox defaultChecked>Primary checkbox</Checkbox>
                    <Checkbox asTask defaultChecked>
                        Task item
                    </Checkbox>
                </div>
            );
        case "radiobox":
            return (
                <div className="flex flex-col gap-2">
                    <Radiobox name="token-preview-plan" value="free" defaultChecked>
                        Free
                    </Radiobox>
                    <Radiobox name="token-preview-plan" value="pro">
                        Pro
                    </Radiobox>
                </div>
            );
        case "switch":
            return (
                <div className="flex flex-col gap-3">
                    <Switch defaultChecked>Notifications</Switch>
                    <Switch>Marketing updates</Switch>
                </div>
            );
        case "slider":
            return <Slider value={[40]} onValueChange={() => {}} />;
        case "file-upload":
            return (
                <div className="flex w-full flex-col items-center gap-file-upload-content-gap rounded-file-upload-surface-radius border-2 border-dashed border-input-border bg-card-background p-file-upload-surface-padding text-center">
                    <span className="flex size-file-upload-thumb-size items-center justify-center rounded-file-upload-thumb-radius bg-muted text-muted-foreground">
                        <UploadIcon className="size-file-upload-thumb-icon-size" aria-hidden />
                    </span>
                    <strong className="text-file-upload-name-font-size">Drop files here</strong>
                    <span className="text-file-upload-size-font-size text-muted-foreground">PNG, JPG or PDF up to 10 MB</span>
                </div>
            );
        case "progress":
            return <Progress value={62} />;
        case "spinner":
            return (
                <div className="flex flex-col items-center gap-4">
                    <Spinner />
                    <Loading />
                </div>
            );
        case "empty":
            return <Empty Icon={ListBulletsIcon} message="Nothing here yet" />;
        case "list":
            return (
                <AnimatedList>
                    <AnimatedListItem title="Quarterly review" description="Open the card to read the full agenda.">
                        Body content goes here when expanded.
                    </AnimatedListItem>
                    <AnimatedListItem title="Marketing sync" description="Status update across campaign workstreams.">
                        Body content goes here when expanded.
                    </AnimatedListItem>
                </AnimatedList>
            );
        case "timeline":
            return (
                <Timeline>
                    <TimelineItem>
                        <strong>Shipped v1</strong>
                    </TimelineItem>
                    <TimelineItem>
                        <strong>Public beta</strong>
                    </TimelineItem>
                </Timeline>
            );
        case "step":
            return (
                <Steps steps={3} currentStep={2}>
                    <Step step={1} currentStep={2} title="Plan" />
                    <Step step={2} currentStep={2} title="Build" />
                    <Step step={3} currentStep={2} title="Ship" />
                </Steps>
            );
        case "tabs":
            return (
                <Tabs active="overview">
                    <Tab id="overview" title="Overview">
                        <p>Overview panel.</p>
                    </Tab>
                    <Tab id="activity" title="Activity">
                        <p>Activity panel.</p>
                    </Tab>
                </Tabs>
            );
        case "shortcut":
            return (
                <div className="flex flex-wrap items-center gap-4">
                    <Shortcut value="ctrl+k" />
                    <Shortcut value="shift+enter" />
                    <Shortcut value="cmd+shift+p" />
                </div>
            );
        case "toolbar":
            return (
                <div className="relative h-40 overflow-hidden rounded-md border border-card-border">
                    <Toolbar>
                        <Button theme="primary" size="small">
                            Save
                        </Button>
                        <Button theme="muted" size="small">
                            Discard
                        </Button>
                    </Toolbar>
                </div>
            );
        case "wizard":
            return (
                <div className="mx-auto flex w-wizard-surface-inline-size flex-col gap-wizard-surface-gap rounded-wizard-surface-radius border border-wizard-surface-border bg-wizard-surface-background p-wizard-surface-padding text-wizard-surface-foreground shadow-shadow-card">
                    <RocketLaunchIcon size={28} aria-hidden />
                    <h3 className="text-typography-lg font-semibold">Welcome to the workspace</h3>
                    <p className="text-typography-sm text-muted-foreground">Walk through the basics in three short steps.</p>
                    <footer className="flex items-center justify-end gap-wizard-actions-gap pt-wizard-footer-padding-block-start">
                        <Button theme="primary" size="small">
                            Next
                        </Button>
                    </footer>
                </div>
            );
        case "info":
            return (
                <div className="grid gap-4 md:grid-cols-2">
                    <Info label="Customer">Fulano</Info>
                    <Info row label="Plan">
                        Enterprise
                    </Info>
                </div>
            );
        case "page-calendar":
            return (
                <PageCalendar
                    events={[
                        { id: "kickoff", title: "Kickoff", date: previewDate },
                        {
                            id: "review",
                            title: "Quarterly review",
                            date: new Date(2026, 0, 16),
                        },
                    ]}
                />
            );
        default:
            return null;
    }
};

const docsTokenGroupsByPath: Partial<Record<string, ComponentTokenName[]>> = {
    "/docs/alert": ["alert"],
    "/docs/heading": [],
    "/docs/autocomplete": [formFieldTokenGroup],
    "/docs/autocomplete/async": [formFieldTokenGroup],
    "/docs/autocomplete/hidden": [formFieldTokenGroup],
    "/docs/button-group": ["button"],
    "/docs/buttons": ["button"],
    "/docs/calendar": ["calendar"],
    "/docs/cards": ["card"],
    "/docs/checkbox": ["checkbox"],
    "/docs/commander": ["command"],
    "/docs/date-picker": [formFieldTokenGroup, "calendar"],
    "/docs/dropdown": ["dropdown"],
    "/docs/empty": ["empty"],
    "/docs/expand": [],
    "/docs/file-upload": ["file-upload"],
    "/docs/filter-bar": [formFieldTokenGroup, "button"],
    "/docs/free-text": [formFieldTokenGroup],
    "/docs/form": [formFieldTokenGroup, "checkbox", "radiobox", "switch", "slider"],
    "/docs/form-reset": [formFieldTokenGroup, "button"],
    "/docs/input": [formFieldTokenGroup],
    "/docs/input-field": [formFieldTokenGroup],
    "/docs/list": ["list"],
    "/docs/masonry": [],
    "/docs/menu": ["menu"],
    "/docs/modal": ["modal"],
    "/docs/multiselect": [formFieldTokenGroup, "checkbox"],
    "/docs/notification": ["notification"],
    "/docs/page-calendar": ["page-calendar"],
    "/docs/polymorph": [],
    "/docs/progress": ["progress"],
    "/docs/radiobox": ["radiobox"],
    "/docs/render-on-view": [],
    "/docs/resizable": [],
    "/docs/select": [formFieldTokenGroup],
    "/docs/shortcut": ["shortcut"],
    "/docs/skeleton": ["skeleton"],
    "/docs/slot": [],
    "/docs/slider": ["slider"],
    "/docs/spinner": ["spinner"],
    "/docs/stats": ["stats"],
    "/docs/step": ["step"],
    "/docs/switch": ["switch"],
    "/docs/table": ["table"],
    "/docs/tabs": ["tabs"],
    "/docs/tags": ["tag"],
    "/docs/task-list": ["checkbox"],
    "/docs/textarea": [formFieldTokenGroup],
    "/docs/timeline": ["timeline"],
    "/docs/toolbar": ["toolbar"],
    "/docs/tooltip": ["tooltip"],
    "/docs/typography": ["typography"],
    "/docs/wizard": ["wizard"],
};

export const tokenGroupsForPath = (pathname: string) => docsTokenGroupsByPath[pathname];

export const tokenDefaultsForPath = (pathname: string): TokenGroup | undefined => {
    const groups = tokenGroupsForPath(pathname);
    if (!groups) return undefined;

    return mergeTokenDefaults(...groups);
};

export const EditableTokensSection = ({
    pathname,
    tokens,
    onChange,
}: {
    pathname: string;
    tokens: TokenGroup;
    onChange: (next: TokenGroup) => void;
}) => {
    const groups = tokenGroupsForPath(pathname);
    if (!groups) return null;

    return (
        <Card title="Editable tokens" className="flex flex-col gap-4" container="mb-4">
            <p className="max-w-3xl text-typography-sm text-muted-foreground">
                Override these CSS variables on any parent container to reshape this component without changing its markup or classes. The preview and
                page examples update as you move each control.
            </p>
            {groups.length > 0 ? (
                <Button type="button" size="small" theme="muted" onClick={() => onChange(tokenDefaultsForPath(pathname) ?? {})}>
                    Reset tokens
                </Button>
            ) : null}
            {groups.length === 0 ? (
                <div className="rounded-xl border border-border/40 bg-background/40 p-4 text-typography-sm text-muted-foreground">
                    This component does not expose component-specific editable CSS variables yet.
                </div>
            ) : (
                <div className="grid gap-6">
                    {groups.map((group) => {
                        const groupTokens = scopedTokenGroup(group, tokens);
                        const featuredTokenIds = featuredTokenIdsByGroup[group] ?? defaultFeaturedTokenIds(groupTokens);
                        const featuredTokens = featuredTokenIds.flatMap((id) => {
                            const token = groupTokens[id];
                            return token ? [token] : [];
                        });
                        const groupDescription = descriptionForGroup(group);
                        const overrideSnippet = tokenOverrideSnippet(groupTokens, featuredTokenIds, group);

                        return (
                            <div key={group} className="rounded-xl border border-border/40 bg-background/40 p-4">
                                <h4 className="mb-3 text-typography-sm font-semibold text-foreground">{groupTitle(group)}</h4>
                                {groupDescription || featuredTokens.length > 0 ? (
                                    <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
                                        <div className="rounded-xl border border-border/40 bg-background/70 p-4">
                                            {groupDescription ? <p className="text-typography-sm text-muted-foreground">{groupDescription}</p> : null}
                                            {featuredTokens.length > 0 ? (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {featuredTokens.map((token) => (
                                                        <span
                                                            key={token.key}
                                                            className="rounded-full border border-border/40 bg-card-background px-3 py-1 font-mono text-[11px] text-foreground"
                                                        >
                                                            {primaryCssVariable(token)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                        {overrideSnippet ? (
                                            <div className="overflow-hidden rounded-xl border border-border/40 bg-zinc-950">
                                                <div className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                                                    Stable override snippet
                                                </div>
                                                <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-zinc-100">
                                                    <code>{overrideSnippet}</code>
                                                </pre>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}
                                <div className="mb-5 rounded-xl border border-border/40 bg-background/70 p-4">
                                    <TokenPreview group={group} />
                                </div>
                                <TokenControls tokens={groupTokens} onChange={(nextGroup) => onChange({ ...tokens, ...nextGroup })} />
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};
