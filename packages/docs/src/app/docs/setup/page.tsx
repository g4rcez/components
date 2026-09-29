"use client";
import {
    ArrowsClockwiseIcon,
    CaretDownIcon,
    CaretRightIcon,
    ChartBarIcon,
    CodeIcon,
    ListBulletsIcon,
    PaletteIcon,
    RocketLaunchIcon,
    RulerIcon,
    SquaresFourIcon,
    UsersThreeIcon,
} from "@phosphor-icons/react";
import { type CSSProperties, useId, useMemo, useState } from "react";
import { Alert, Button, Card, Empty, Stats, StatsCard, Step, Steps, Tab, Tabs, Tag, Timeline, TimelineItem } from "@g4rcez/components";
import {
    type ThemeConfiguration,
    type ThemeTokenOverrides,
    createThemeProperties,
    defaultDarkThemeTokens,
    defaultLightThemeTokens,
    themeTokenRegistry,
    Checkbox,
    Input,
    Progress,
    Radiobox,
    Shortcut,
    Skeleton,
    Switch,
} from "@g4rcez/components";
import { DocsLayout } from "@/components/docs-layout";
import { CodeBlock } from "@/components/code-block";

type Mode = "dark" | "light";

type Path = readonly string[];
type Drafts = Record<string, string>;
type LeafRow = { path: Path; value: string };

const labelize = (path: Path) => path.join(".");

const getLeaf = (source: unknown, path: Path): string | undefined => {
    let value = source;
    for (const key of path) {
        if (!value || typeof value !== "object" || !(key in value)) return undefined;
        value = (value as Record<string, unknown>)[key];
    }
    return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
};

// Paths come only from the public registry, never from free-form input.
const setLeaf = (source: ThemeTokenOverrides, path: Path, value: string): ThemeTokenOverrides => {
    const [group, key, token] = path;
    if (group === "tokens") return { ...source, tokens: { ...source.tokens, [key]: value } };
    if (group === "colors") return { ...source, colors: { ...source.colors, [key]: value } };
    const component = key as keyof NonNullable<ThemeTokenOverrides["components"]>;
    return {
        ...source,
        components: {
            ...source.components,
            [component]: { ...source.components?.[component], [token]: value },
        },
    };
};

const tokenRows: LeafRow[] = [
    ...["spacing", "rounding", ...themeTokenRegistry.tokens].map((key) => ({
        path: ["tokens", key],
        value: getLeaf(defaultLightThemeTokens, ["tokens", key]) ?? "",
    })),
    ...themeTokenRegistry.colors.map((key) => ({
        path: ["colors", key],
        value: getLeaf(defaultLightThemeTokens, ["colors", key]) ?? "",
    })),
    ...Object.entries(themeTokenRegistry.components).flatMap(([component, keys]) =>
        keys.map((key) => ({
            path: ["components", component, key],
            value: getLeaf(defaultLightThemeTokens, ["components", component, key]) ?? "",
        }))
    ),
];
// The dark inspection projection is color-only, including component colors.
const colorRows = tokenRows.filter((row) => getLeaf(defaultDarkThemeTokens, row.path) !== undefined);
const sharedRows = tokenRows.filter((row) => getLeaf(defaultDarkThemeTokens, row.path) === undefined);
const lightPalette = colorRows.reduce((result, row) => setLeaf(result, row.path, row.value), {} as ThemeTokenOverrides);

const compileDrafts = (drafts: Drafts) => {
    let overrides: ThemeTokenOverrides = {};
    const errors: Record<string, string> = {};
    for (const row of tokenRows) {
        const key = labelize(row.path);
        const value = drafts[key];
        if (value === undefined || value.trim() === "") continue;
        const leaf = setLeaf({}, row.path, value);
        try {
            createThemeProperties(leaf);
            overrides = setLeaf(overrides, row.path, value);
        } catch {
            errors[key] = "Enter one complete CSS value, without a declaration or rule. Clear to inherit.";
        }
    }
    return { overrides, errors };
};

const serializeTheme = (constName: string, theme: ThemeConfiguration) =>
    `import type { ThemeConfiguration } from "@g4rcez/components";

export const ${constName} = ${JSON.stringify(theme, null, 2)} satisfies ThemeConfiguration;
`;

const runtimeSnippet = `import { configureTheme } from "@g4rcez/components";
import { DEFAULT_THEME } from "./light";
import { DARK_THEME } from "./dark";

configureTheme(DEFAULT_THEME);
configureTheme(DARK_THEME);

// Activation belongs to the app; registration never changes classes.
document.documentElement.classList.toggle("dark", true);

// Replace only dark overrides, exposing shared overrides and built-in colors.
// configureTheme({ name: "dark" });
`;

const cssSnippet = `import { createThemeCss } from "@g4rcez/components";
import { DEFAULT_THEME } from "./light";
import { DARK_THEME } from "./dark";

// Pure output: emit into an application stylesheet or server-rendered <head>.
export const themeCss = [
  createThemeCss(DEFAULT_THEME),
  createThemeCss(DARK_THEME),
].join("\\n");

// Import foundation.css and the component CSS separately.
// Activate dark mode with <html class="dark">; no provider is required.
// For runtime hydration, give each style its ownership metadata:
// id="g4rcez-theme-default" data-theme-owner="theme-runtime"
// data-theme-name="default" (and the equivalent for "dark").
`;

type LeafEditorProps = {
    row: LeafRow;
    value: string;
    error?: string;
    onChange: (path: Path, value: string) => void;
    swatch: boolean;
};

function LeafEditor({ row, value, error, onChange, swatch }: LeafEditorProps) {
    const id = useId();
    return (
        <div className="text-typography-xs flex min-w-0 flex-col gap-input-label-mb">
            <div className="flex items-center gap-input-slot-gap">
                {swatch && (
                    <span
                        aria-hidden
                        className="size-input-height shrink-0 rounded-input-radius border border-card-border"
                        style={{ backgroundColor: error ? row.value : value || row.value }}
                    />
                )}
                <Input
                    id={id}
                    title={labelize(row.path)}
                    value={value}
                    placeholder={row.value || "Library fallback"}
                    error={error}
                    feedback={value ? "Override" : "Inherited — not exported"}
                    onChange={(event) => onChange(row.path, event.target.value)}
                    spellCheck={false}
                    container="min-w-0 flex-1"
                    className="font-mono"
                />
            </div>
        </div>
    );
}

type GroupBlockProps = {
    title: string;
    rows: LeafRow[];
    drafts: Drafts;
    errors: Record<string, string>;
    swatch: boolean;
    onChange: (path: Path, value: string) => void;
};

function GroupBlock({ title, rows, drafts, errors, swatch, onChange }: GroupBlockProps) {
    const [open, setOpen] = useState(true);
    const id = useId();
    return (
        <Card>
            <header className="-mx-card-padding-x -my-card-padding-y flex items-center justify-between gap-base px-card-padding-x py-card-padding-y">
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls={id}
                    className="flex min-w-0 flex-1 items-center gap-base text-left text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    {open ? <CaretDownIcon aria-hidden className="size-4 text-muted-foreground" /> : <CaretRightIcon aria-hidden className="size-4 text-muted-foreground" />}
                    <span className="text-typography-sm break-all font-mono font-semibold">{title}</span>
                </button>
                <Tag size="tiny" theme="muted">{rows.length}</Tag>
            </header>
            <div id={id} hidden={!open}>
                {open && (
                    <div className="mt-card-gap grid grid-cols-1 gap-base border-t border-card-border pt-card-gap md:grid-cols-2">
                        {rows.map((row) => (
                            <LeafEditor key={labelize(row.path)} row={row} value={drafts[labelize(row.path)] ?? ""}
                                error={errors[labelize(row.path)]} swatch={swatch} onChange={onChange} />
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

function TokenEditor({ rows, ...props }: Omit<GroupBlockProps, "title">) {
    const groups = new Map<string, LeafRow[]>();
    for (const row of rows) {
        const group = row.path.slice(0, -1).join(".");
        const leaves = groups.get(group) ?? [];
        leaves.push(row);
        groups.set(group, leaves);
    }
    return (
        <div className="flex flex-col gap-base">
            {Array.from(groups, ([title, leaves]) => <GroupBlock key={title} title={title} rows={leaves} {...props} />)}
        </div>
    );
}

const THEMED_VARIANTS = ["primary", "info", "success", "warn", "danger", "neutral", "secondary", "muted"] as const;

const BUTTON_GHOSTS = [
    "ghost-primary",
    "ghost-info",
    "ghost-success",
    "ghost-warn",
    "ghost-danger",
    "ghost-secondary",
    "ghost-muted",
    "ghost-neutral",
] as const;

function LivePreview({ style, mode }: { style: CSSProperties; mode: Mode }) {
    const [previewTab, setPreviewTab] = useState("overview");
    return (
        <div style={style} className="rounded-card-radius border border-card-border bg-background p-card-padding-x text-foreground">
            <div className="flex flex-col gap-base">
                <header className="flex items-center justify-between gap-base">
                    <div className="flex flex-col gap-card-title-pb">
                        <h4 className="text-typography-2xl font-bold">Preview · {mode}</h4>
                        <p className="text-typography-sm text-muted-foreground">Built-in palette with your shared and theme overrides.</p>
                    </div>
                    <Tag theme="primary">{mode}</Tag>
                </header>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Buttons</h5>
                    <div className="flex flex-wrap items-center gap-button-gap">
                        <Button theme="primary">Primary</Button>
                        <Button theme="info">Info</Button>
                        <Button theme="success">Success</Button>
                        <Button theme="warn">Warn</Button>
                        <Button theme="danger">Danger</Button>
                        <Button theme="secondary">Secondary</Button>
                        <Button theme="muted">Muted</Button>
                        <Button theme="neutral">Neutral</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-button-gap">
                        {BUTTON_GHOSTS.map((variant) => (
                            <Button key={variant} theme={variant}>
                                {variant.replace("ghost-", "")}
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-button-gap">
                        <Button theme="primary" size="big">
                            Big
                        </Button>
                        <Button theme="primary">Default</Button>
                        <Button theme="primary" size="small">
                            Small
                        </Button>
                        <Button theme="primary" size="min">
                            Min
                        </Button>
                        <Button theme="primary" size="tiny">
                            Tiny
                        </Button>
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Tags</h5>
                    <div className="flex flex-wrap items-center gap-button-gap">
                        {THEMED_VARIANTS.map((variant) => (
                            <Tag key={variant} theme={variant}>
                                {variant}
                            </Tag>
                        ))}
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Alerts</h5>
                    <div className="grid gap-base md:grid-cols-2">
                        <Alert theme="primary" title="Primary">
                            <p>Primary alert surface.</p>
                        </Alert>
                        <Alert theme="info" title="Info">
                            <p>Informational alert.</p>
                        </Alert>
                        <Alert theme="success" title="Success">
                            <p>All systems nominal.</p>
                        </Alert>
                        <Alert theme="warn" title="Warn">
                            <p>Action required soon.</p>
                        </Alert>
                        <Alert theme="danger" title="Danger">
                            <p>Something failed.</p>
                        </Alert>
                        <Alert theme="neutral" title="Neutral">
                            <p>Default neutral surface.</p>
                        </Alert>
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Surfaces</h5>
                    <div className="grid gap-base md:grid-cols-2">
                        <Card title="Card surface">
                            <p className="text-typography-sm text-muted-foreground">Surface colors can be edited independently in components.card.</p>
                        </Card>
                        <Stats title="Active users" Icon={ChartBarIcon}>
                            12,480
                        </Stats>
                        <StatsCard title="Revenue" Icon={UsersThreeIcon} value="$12,480" />
                        <Card title="Empty state">
                            <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
                        </Card>
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Form controls</h5>
                    <div className="grid gap-base md:grid-cols-2">
                        <Input title="Email" name="email" placeholder="you@example.com" />
                        <Input title="With error" name="email-error" placeholder="you@example.com" error="This email is already in use." />
                        <div className="flex flex-col gap-base">
                            <Checkbox>Subscribe to updates</Checkbox>
                            <Radiobox name="plan" value="basic">
                                Basic plan
                            </Radiobox>
                            <Radiobox name="plan" value="pro" defaultChecked>
                                Pro plan
                            </Radiobox>
                            <Switch>Enable notifications</Switch>
                        </div>
                        <div className="flex flex-col gap-base">
                            <Progress value={42} label="Upload" />
                            <Progress value={78} label="Render" />
                            <div className="flex flex-wrap items-center gap-button-gap">
                                <Shortcut value="ctrl+k" />
                                <Shortcut value="shift+enter" />
                                <Shortcut value="cmd+shift+p" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Navigation</h5>
                    <Tabs active={previewTab} onChange={setPreviewTab}>
                        <Tab id="overview" title="Overview">
                            <p className="text-typography-sm text-muted-foreground">The tab content surface inherits from card-background.</p>
                        </Tab>
                        <Tab id="activity" title="Activity">
                            <p className="text-typography-sm text-muted-foreground">Activity tab content.</p>
                        </Tab>
                        <Tab id="settings" title="Settings">
                            <p className="text-typography-sm text-muted-foreground">Settings tab content.</p>
                        </Tab>
                    </Tabs>
                    <Steps steps={3} currentStep={2}>
                        <Step step={1} currentStep={2} title="Plan" />
                        <Step step={2} currentStep={2} title="Build" />
                        <Step step={3} currentStep={2} title="Ship" />
                    </Steps>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Timeline</h5>
                    <Timeline>
                        <TimelineItem>
                            <TimelineItem.Icon>
                                <RocketLaunchIcon size={20} />
                            </TimelineItem.Icon>
                            <TimelineItem.Body>
                                <strong className="text-foreground">Shipped v1</strong>
                                <p className="text-typography-sm text-muted-foreground">Initial release rolled out to all customers.</p>
                            </TimelineItem.Body>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineItem.Icon>
                                <UsersThreeIcon size={20} />
                            </TimelineItem.Icon>
                            <TimelineItem.Body>
                                <strong className="text-foreground">Public beta</strong>
                                <p className="text-typography-sm text-muted-foreground">Opened the waitlist to the broader audience.</p>
                            </TimelineItem.Body>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineItem.Icon>
                                <ChartBarIcon size={20} />
                            </TimelineItem.Icon>
                            <TimelineItem.Body>
                                <strong className="text-foreground">Kickoff</strong>
                                <p className="text-typography-sm text-muted-foreground">Team aligned on milestones and goals.</p>
                            </TimelineItem.Body>
                        </TimelineItem>
                    </Timeline>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Skeleton</h5>
                    <div className="flex w-full flex-col gap-base">
                        <Skeleton className="w-full" />
                        <Skeleton className="w-8/12" />
                        <Skeleton className="w-1/2" />
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">Typography</h5>
                    <div className="flex flex-col gap-card-title-pb">
                        <p className="text-typography-xs text-muted-foreground">Caption · text-typography-xs</p>
                        <p className="text-typography-sm">Small · text-typography-sm</p>
                        <p className="text-typography-base">Body · text-typography-base</p>
                        <p className="text-typography-lg">Lead · text-typography-lg</p>
                        <p className="text-typography-2xl font-bold">Section · text-typography-2xl</p>
                        <p className="text-typography-4xl font-extrabold">Display · text-typography-4xl</p>
                    </div>
                </section>

                <section className="flex flex-col gap-card-title-pb">
                    <div className="flex items-center gap-button-gap text-muted-foreground">
                        <RocketLaunchIcon className="size-4" />
                        <span className="text-typography-xs">Scoped preview: overlays portaled outside this panel inherit the site theme, not these local overrides.</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function SetupPage() {
    const [mode, setMode] = useState<Mode>("dark");
    const [activeTab, setActiveTab] = useState("colors");
    const [shared, setShared] = useState<Drafts>({});
    const [light, setLight] = useState<Drafts>({});
    const [dark, setDark] = useState<Drafts>({});
    const [status, setStatus] = useState("");
    const sharedResult = useMemo(() => compileDrafts(shared), [shared]);
    const lightResult = useMemo(() => compileDrafts(light), [light]);
    const darkResult = useMemo(() => compileDrafts(dark), [dark]);
    const defaultResult = useMemo(() => compileDrafts({ ...shared, ...light }), [shared, light]);
    const active = mode === "dark" ? dark : light;
    const activeResult = mode === "dark" ? darkResult : lightResult;
    const update = (scope: "shared" | Mode) => (path: Path, value: string) => {
        const setter = scope === "shared" ? setShared : scope === "dark" ? setDark : setLight;
        setter((previous) => {
            const next = { ...previous };
            if (value.trim() === "") delete next[labelize(path)];
            else next[labelize(path)] = value;
            return next;
        });
        setStatus("");
    };
    const reset = () => {
        if (mode === "dark") setDark({});
        else {
            setLight({});
            setShared({});
        }
        setStatus(mode === "dark" ? "Dark overrides cleared. Shared overrides are unchanged." : "Default overrides cleared, including shared tokens. Dark overrides are unchanged.");
    };
    const defaultConfig: ThemeConfiguration = { name: "default", ...defaultResult.overrides };
    const darkConfig: ThemeConfiguration = { name: "dark", ...darkResult.overrides };
    const hasErrors = [sharedResult, lightResult, darkResult].some((result) => Object.keys(result.errors).length > 0);
    const previewStyle: CSSProperties = {
        ...createThemeProperties({ tokens: {
            spacing: defaultLightThemeTokens.tokens.spacing,
            rounding: defaultLightThemeTokens.tokens.rounding,
        } }),
        ...createThemeProperties(mode === "dark" ? defaultDarkThemeTokens : lightPalette),
        ...createThemeProperties(defaultResult.overrides),
        ...(mode === "dark" ? createThemeProperties(darkResult.overrides) : {}),
        colorScheme: mode,
    };
    const paletteRows = colorRows.map((row) => ({
        ...row,
        value: (mode === "dark" ? light[labelize(row.path)] : undefined)
            ?? getLeaf(mode === "dark" ? defaultDarkThemeTokens : defaultLightThemeTokens, row.path)
            ?? row.value,
    }));

    return (
        <DocsLayout title="Theme Setup" section="theming"
            description="Edit shared tokens once, customize light and dark palettes, and export only your intentional overrides. Empty fields inherit library defaults.">
            <div className="flex flex-col gap-base">
                <Card>
                    <div className="flex flex-wrap items-center justify-between gap-base">
                        <div className="flex items-center gap-base">
                            <PaletteIcon aria-hidden className="size-5 text-muted-foreground" />
                            <div className="flex flex-col gap-card-title-pb">
                                <span className="text-typography-sm font-semibold">Editing</span>
                                <span className="text-typography-xs text-muted-foreground">Light uses :root (default); dark uses html.dark.</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-button-gap">
                            <Button theme={mode === "light" ? "primary" : "ghost-muted"} size="small"
                                aria-pressed={mode === "light"} onClick={() => setMode("light")}>Light / default</Button>
                            <Button theme={mode === "dark" ? "primary" : "ghost-muted"} size="small"
                                aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>Dark</Button>
                            <Button theme="ghost-muted" size="small" onClick={reset}>
                                <ArrowsClockwiseIcon aria-hidden className="size-4" />
                                Reset {mode === "light" ? "default + shared" : "dark"}
                            </Button>
                        </div>
                    </div>
                    <p className="text-typography-xs mt-card-gap text-muted-foreground">
                        Shared tokens belong to default and apply in both modes. Default color overrides also apply in dark unless you override them there.
                        Component palettes are independent; changing primary does not recolor every component.
                    </p>
                    <p role="status" className="text-typography-xs">{status}</p>
                </Card>
                {hasErrors && <Alert theme="warn" title="Some edits are incomplete">
                    Fix the marked values or clear them to inherit. The preview skips invalid values; export is unavailable until they are resolved.
                </Alert>}
                <LivePreview style={previewStyle} mode={mode} />
                <Tabs active={activeTab} onChange={(tab) => {
                    setActiveTab(tab);
                    if (tab === "named") setMode("dark");
                }}>
                    <Tab id="colors" title="Theme colors">
                        <TokenEditor rows={paletteRows} drafts={active} errors={activeResult.errors} swatch onChange={update(mode)} />
                    </Tab>
                    <Tab id="shared" title="Shared tokens">
                        <div className="flex flex-col gap-base">
                            <p className="text-typography-sm text-muted-foreground">
                                Spacing, rounding, typography, shadows and component geometry are shared. Enter CSS values such as 16px or 0; clear a field to remove its override.
                            </p>
                            <Button theme="ghost-muted" size="small" onClick={() => {
                                setShared({});
                                setStatus("Shared overrides cleared. Theme colors and dark overrides are unchanged.");
                            }}>Reset shared tokens</Button>
                            <TokenEditor rows={sharedRows} drafts={shared} errors={sharedResult.errors} swatch={false} onChange={update("shared")} />
                        </div>
                    </Tab>
                    <Tab id="named" title="Dark token overrides">
                        <div className="flex flex-col gap-base">
                            <p className="text-typography-sm text-muted-foreground">
                                Optional non-color overrides for the named dark theme, such as denser spacing. Empty fields inherit shared tokens.
                                These edits affect the dark preview only.
                            </p>
                            <TokenEditor rows={sharedRows.map((row) => ({ ...row, value: shared[labelize(row.path)] ?? row.value }))}
                                drafts={dark} errors={darkResult.errors} swatch={false} onChange={update("dark")} />
                        </div>
                    </Tab>
                    <Tab id="output" title="Output">
                        {hasErrors ? <p role="status">Resolve incomplete values before copying the configuration.</p> :
                            <OutputPane darkCode={serializeTheme("DARK_THEME", darkConfig)} lightCode={serializeTheme("DEFAULT_THEME", defaultConfig)} />}
                    </Tab>
                </Tabs>
            </div>
        </DocsLayout>
    );
}

type OutputPaneProps = { darkCode: string; lightCode: string };

function OutputPane({ darkCode, lightCode }: OutputPaneProps) {
    return (
        <div className="flex flex-col gap-base">
            <OutputBlock title="src/theme/light.ts" description="Sparse default configuration: shared tokens and intentional light colors only. No complete defaults are pinned."
                Icon={CodeIcon} code={lightCode} />
            <OutputBlock title="src/theme/dark.ts" description="Sparse dark colors and optional dark-only tokens. An empty configuration restores the built-in palette."
                Icon={CodeIcon} code={darkCode} />
            <OutputBlock title="Runtime registration" description="Each call replaces that name's override set. Registration and activation are separate."
                Icon={SquaresFourIcon} code={runtimeSnippet} />
            <OutputBlock title="Static or server-rendered CSS" description="Pure CSS generation uses the same sparse configurations. Load foundation and component CSS before your application overrides."
                Icon={RulerIcon} code={cssSnippet} />
        </div>
    );
}

type OutputBlockProps = {
    code: string;
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
};

function OutputBlock({ title, description, Icon, code }: OutputBlockProps) {
    return (
        <Card>
            <header className="flex items-center gap-button-gap">
                <Icon className="size-4 text-muted-foreground" />
                <h4 className="text-typography-sm font-semibold">{title}</h4>
            </header>
            <p className="text-typography-xs mt-card-title-pb text-muted-foreground">{description}</p>
            <div className="mt-card-gap">
                <CodeBlock code={code} lang="tsx" />
            </div>
        </Card>
    );
}
