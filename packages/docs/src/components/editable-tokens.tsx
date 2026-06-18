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
} from "../../../lib/src";
import { Shortcut } from "../../../lib/src/components/display/shortcut";
import { Skeleton } from "../../../lib/src/components/display/skeleton";
import { components as componentTokens } from "../../../lib/src/styles/components";

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

const extraComponentTokens: Partial<Record<ComponentTokenName, Record<string, string>>> = {
    checkbox: {
        "control-color": "var(--primary-DEFAULT)",
        "control-background": "var(--background)",
        "control-border-color": "var(--card-border)",
        "control-mark-color": "0, 0%, 100%",
        "control-ring-color": "var(--checkbox-control-color)",
        "control-ring-offset-color": "var(--checkbox-control-background)",
        "control-border-width": "1px",
        "control-mark-width": "0.125rem",
    },
};

const runtimeTokenAliases: Partial<Record<ComponentTokenName, Record<string, CssCustomProperty[]>>> = {
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
        radius: ["--var-button-rounded"],
        text: ["--var-button-font-size"],
    },
    progress: {
        "track-h": ["--var-progress-track-h"],
        radius: ["--var-progress-rounded"],
    },
    spinner: {
        border: ["--var-spinner-border-width"],
        "container-p": ["--var-spinner-container-p"],
        size: ["--var-spinner-size"],
    },
    stats: {
        gap: ["--var-stats-gap"],
        "footer-px": ["--var-stats-footer-px"],
        "footer-py": ["--var-stats-footer-py"],
        "icon-p": ["--var-stats-icon-p"],
        "icon-size": ["--var-stats-icon-size"],
        "inner-gap": ["--var-stats-inner-gap"],
        p: ["--var-stats-p"],
        radius: ["--var-stats-rounded"],
        "title-text": ["--var-stats-title-font-size"],
        "value-text": ["--var-stats-value-font-size"],
    },
    tag: {
        gap: ["--var-tag-gap"],
        height: ["--var-tag-height"],
        "height-big": ["--var-tag-big-height"],
        "height-small": ["--var-tag-small-height"],
        "height-tiny": ["--var-tag-tiny-height"],
        "indicator-size": ["--var-tag-indicator-size"],
        "padding-icon": ["--var-tag-icon-p"],
        "padding-x": ["--var-tag-px"],
        "padding-x-big": ["--var-tag-big-px"],
        "padding-x-small": ["--var-tag-small-px"],
        "padding-x-tiny": ["--var-tag-tiny-px"],
        "padding-y": ["--var-tag-py"],
        "padding-y-big": ["--var-tag-big-py"],
        "padding-y-small": ["--var-tag-small-py"],
        "padding-y-tiny": ["--var-tag-tiny-py"],
        radius: ["--var-tag-rounded"],
        "text-small": ["--var-tag-small-font-size"],
        "text-tiny": ["--var-tag-tiny-font-size"],
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
    if (unit === "rem") return { min: 0, max: Math.max(4, Math.ceil((value || 1) * 3)), step: 0.0625 };
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
                <div className="mx-auto w-full max-w-dialog rounded-modal-radius border border-floating-border bg-floating-background px-modal-padding-x py-modal-padding-y shadow-shadow-floating">
                    <header className="text-modal-title-text pb-modal-title-pb font-semibold">Confirm deployment</header>
                    <p className="text-typography-sm py-modal-body-py text-muted-foreground">
                        This static dialog surface uses the same modal tokens.
                    </p>
                    <footer className="flex justify-end gap-modal-footer-gap pt-modal-footer-pt">
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
                <div className="mx-auto w-full max-w-xs rounded-dropdown-radius border border-floating-border bg-floating-background p-dropdown-p shadow-shadow-floating">
                    <header className="text-typography-sm mb-dropdown-header-mb font-semibold">Workspace</header>
                    <div className="flex flex-col gap-2 text-typography-sm text-muted-foreground">
                        <span>Profile</span>
                        <span>Settings</span>
                        <span>Billing</span>
                    </div>
                </div>
            );
        case "tooltip":
            return (
                <div className="mx-auto max-w-xs rounded-tooltip-radius border border-tooltip-border bg-tooltip-background p-tooltip-p text-tooltip-foreground shadow-shadow-floating">
                    <p className="text-typography-sm">Tooltip surface preview</p>
                </div>
            );
        case "menu":
            return (
                <div className="mx-auto w-full max-w-xs overflow-hidden rounded-menu-radius border border-floating-border bg-floating-background shadow-shadow-floating">
                    <div className="p-menu-item-p text-typography-sm hover:bg-floating-hover">Duplicate</div>
                    <div className="p-menu-item-p text-typography-sm hover:bg-floating-hover">Archive</div>
                    <div className="p-menu-item-p text-typography-sm text-danger hover:bg-floating-hover">Delete</div>
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
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-command-radius border border-floating-border bg-floating-background shadow-shadow-floating">
                    <div className="flex h-command-header-h items-center gap-2 px-command-input-px py-command-input-py">
                        <MagnifyingGlassIcon size={16} aria-hidden />
                        <span className="text-typography-sm text-muted-foreground">Search commands…</span>
                    </div>
                    <div className="flex flex-col gap-command-list-gap px-command-list-px py-command-list-my">
                        <div className="flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p text-typography-sm hover:bg-floating-hover">
                            Create deployment
                        </div>
                        <div className="flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p text-typography-sm hover:bg-floating-hover">
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
                <div className="flex w-full flex-col items-center gap-file-upload-gap rounded-file-upload-radius border-2 border-dashed border-input-border bg-card-background p-file-upload-p text-center">
                    <span
                        className="flex size-file-upload-thumb-size items-center justify-center bg-muted text-muted-foreground"
                        style={{ borderRadius: "var(--file-upload-thumb-radius)" }}
                    >
                        <UploadIcon className="__file-upload__thumb-icon" aria-hidden />
                    </span>
                    <strong className="text-file-upload-text-name">Drop files here</strong>
                    <span className="text-file-upload-text-size text-muted-foreground">PNG, JPG or PDF up to 10 MB</span>
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
                <div className="mx-auto flex w-wizard-w flex-col gap-wizard-gap rounded-wizard-radius border border-card-border bg-card-background p-wizard-p shadow-shadow-card">
                    <RocketLaunchIcon size={28} aria-hidden />
                    <h3 className="text-typography-lg font-semibold">Welcome to the workspace</h3>
                    <p className="text-typography-sm text-muted-foreground">Walk through the basics in three short steps.</p>
                    <footer className="flex items-center justify-end gap-wizard-actions-gap pt-wizard-footer-pt">
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
                        { id: "review", title: "Quarterly review", date: new Date(2026, 0, 16) },
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
        <section className="not-prose mb-12 rounded-2xl border border-border/50 bg-card-background p-card-padding-x shadow-shadow-card">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                    <h3 id="editable-tokens" className="scroll-mt-24 text-2xl font-bold text-foreground">
                        Editable tokens
                    </h3>
                    <p className="max-w-3xl text-typography-sm text-muted-foreground">
                        Override these CSS variables on any parent container to reshape this component without changing its markup or classes. The
                        preview and page examples update as you move each control.
                    </p>
                </div>
                {groups.length > 0 ? (
                    <Button type="button" size="small" theme="muted" onClick={() => onChange(tokenDefaultsForPath(pathname) ?? {})}>
                        Reset tokens
                    </Button>
                ) : null}
            </div>
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
        </section>
    );
};
