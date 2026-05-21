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
import { CSSProperties, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Stats,
  StatsCard,
  Step,
  Steps,
  Tab,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  createCssProperties,
  defaultDarkTheme,
  defaultLightTheme,
  type DesignTokens,
} from "../../../../../lib/src";
import { Checkbox } from "../../../../../lib/src/components/form/checkbox";
import { Input } from "../../../../../lib/src/components/form/input";
import { Progress } from "../../../../../lib/src/components/display/progress";
import { Radiobox } from "../../../../../lib/src/components/form/radiobox";
import { Shortcut } from "../../../../../lib/src/components/display/shortcut";
import { Skeleton } from "../../../../../lib/src/components/display/skeleton";
import { Switch } from "../../../../../lib/src/components/form/switch";
import { CodeBlock } from "@/components/code-block";
import { DocsLayout } from "@/components/docs-layout";

type Mode = "dark" | "light";

type Path = readonly (string | number)[];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const setLeaf = <T,>(obj: T, path: Path, value: string): T => {
  if (path.length === 0) return value as unknown as T;
  const [head, ...rest] = path;
  const source = obj as unknown as Record<string | number, unknown>;
  const next: Record<string | number, unknown> = Array.isArray(obj)
    ? ([...(obj as unknown[])] as unknown as Record<string | number, unknown>)
    : { ...source };
  next[head] = setLeaf(next[head], rest, value);
  return next as unknown as T;
};

const labelize = (path: Path) => path.join(".");

const serializeTheme = (constName: string, theme: DesignTokens) =>
  `import { DesignTokens } from "@g4rcez/components";

export const ${constName}: DesignTokens = ${JSON.stringify(theme, null, 2)};
`;

const tailwindSnippet = `import type { Config } from "tailwindcss";
import { createDesignTokens, parsers } from "@g4rcez/components";
import preset from "@g4rcez/components/preset.tailwind";
import { LIGHT_THEME } from "./theme/light";

const COLORS = createDesignTokens(
  LIGHT_THEME.colors,
  parsers.formatWithVar("hsla"),
);

const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: COLORS } },
};

export default config;
`;

const providerSnippet = `// src/theme/inject.ts
import { createTheme } from "@g4rcez/components";
import { DARK_THEME } from "./dark";
import { LIGHT_THEME } from "./light";

export const themeCss = [
  createTheme(LIGHT_THEME),
  createTheme(DARK_THEME, "dark"),
].join("\\n");

// app/layout.tsx
import { themeCss } from "@/theme/inject";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style id="theme-tokens">{themeCss}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

// Toggle the "dark" class on <html> to switch themes.
`;

type LeafRow = { path: Path; value: string };

const collectLeaves = (
  obj: unknown,
  path: Path = [],
  acc: LeafRow[] = [],
): LeafRow[] => {
  if (typeof obj === "string") {
    acc.push({ path, value: obj });
    return acc;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      collectLeaves(v, [...path, k], acc);
    }
  }
  return acc;
};

type LeafEditorProps = {
  row: LeafRow;
  onChange: (path: Path, value: string) => void;
  swatch: boolean;
};

function LeafEditor({ row, onChange, swatch }: LeafEditorProps) {
  const id = labelize(row.path);
  return (
    <div className="flex flex-col gap-input-label-mb text-typography-xs">
      <label
        htmlFor={id}
        className="font-mono text-input-label-text text-muted-foreground"
      >
        {id}
      </label>
      <div className="flex items-center gap-input-slot-gap">
        {swatch && (
          <span
            aria-hidden
            className="size-input-height shrink-0 rounded-input-radius border border-card-border"
            style={{ backgroundColor: row.value }}
          />
        )}
        <input
          id={id}
          value={row.value}
          onChange={(event) => onChange(row.path, event.target.value)}
          spellCheck={false}
          className="h-input-height w-full rounded-input-radius border border-input-border bg-background px-input-padding-x py-input-padding-y font-mono text-input-text text-foreground placeholder:text-input-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

type GroupBlockProps = {
  title: string;
  rows: LeafRow[];
  swatch: boolean;
  onChange: (path: Path, value: string) => void;
};

function GroupBlock({ title, rows, swatch, onChange }: GroupBlockProps) {
  const [open, setOpen] = useState(true);
  if (rows.length === 0) return null;
  return (
    <Card>
      <header className="-mx-card-padding-x -my-card-padding-y flex items-center justify-between gap-base px-card-padding-x py-card-padding-y">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-base text-left text-foreground"
        >
          {open ? (
            <CaretDownIcon className="size-4 text-muted-foreground" />
          ) : (
            <CaretRightIcon className="size-4 text-muted-foreground" />
          )}
          <span className="font-mono text-typography-sm font-semibold">
            {title}
          </span>
        </button>
        <Tag size="tiny" theme="muted">
          {rows.length}
        </Tag>
      </header>
      {open && (
        <div className="mt-card-gap grid grid-cols-1 gap-base border-t border-card-border pt-card-gap md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <LeafEditor
              key={labelize(row.path)}
              row={row}
              swatch={swatch}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

type ThemeEditorProps = {
  theme: DesignTokens;
  onUpdate: (next: DesignTokens) => void;
};

function ColorsEditor({ theme, onUpdate }: ThemeEditorProps) {
  const onChange = (path: Path, value: string) =>
    onUpdate(setLeaf(theme, path, value));
  const groups = Object.keys(theme.colors) as (keyof DesignTokens["colors"])[];
  return (
    <div className="flex flex-col gap-base">
      {groups.map((group) => {
        const branch = theme.colors[group];
        const rows = collectLeaves(branch, ["colors", group]);
        return (
          <GroupBlock
            key={String(group)}
            title={`colors.${String(group)}`}
            rows={rows}
            swatch
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

function ShadowEditor({ theme, onUpdate }: ThemeEditorProps) {
  const onChange = (path: Path, value: string) =>
    onUpdate(setLeaf(theme, path, value));
  const rows = collectLeaves(theme.shadow, ["shadow"]);
  return (
    <GroupBlock title="shadow" rows={rows} swatch={false} onChange={onChange} />
  );
}

function DimensionsEditor({ theme, onUpdate }: ThemeEditorProps) {
  const onChange = (path: Path, value: string) =>
    onUpdate(setLeaf(theme, path, value));
  return (
    <div className="flex flex-col gap-base">
      <GroupBlock
        title="spacing"
        rows={collectLeaves(theme.spacing, ["spacing"])}
        swatch={false}
        onChange={onChange}
      />
      <GroupBlock
        title="rounded"
        rows={collectLeaves(theme.rounded, ["rounded"])}
        swatch={false}
        onChange={onChange}
      />
      <GroupBlock
        title="zIndex"
        rows={collectLeaves(theme.zIndex, ["zIndex"])}
        swatch={false}
        onChange={onChange}
      />
    </div>
  );
}

function ComponentsEditor({ theme, onUpdate }: ThemeEditorProps) {
  const onChange = (path: Path, value: string) =>
    onUpdate(setLeaf(theme, path, value));
  const groups = Object.keys(
    theme.components,
  ) as (keyof DesignTokens["components"])[];
  return (
    <div className="flex flex-col gap-base">
      {groups.map((group) => {
        const branch = theme.components[group];
        if (!branch) return null;
        const rows = collectLeaves(branch, ["components", group]);
        return (
          <GroupBlock
            key={String(group)}
            title={`components.${String(group)}`}
            rows={rows}
            swatch={false}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

const stripColorWrapper = (value: string) =>
  value.replace(/^\s*hsla?\(\s*/i, "").replace(/\s*\)\s*$/i, "");

const THEMED_VARIANTS = [
  "primary",
  "info",
  "success",
  "warn",
  "danger",
  "neutral",
  "secondary",
  "muted",
] as const;

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

function LivePreview({ theme }: { theme: DesignTokens }) {
  const style = useMemo<CSSProperties>(
    () =>
      createCssProperties(theme, {
        colors: (t) => ({ ...t, value: stripColorWrapper(t.value) }),
      }),
    [theme],
  );
  const [previewTab, setPreviewTab] = useState("overview");
  return (
    <div
      style={style}
      className="rounded-card-radius border border-card-border bg-background p-card-padding-x text-foreground shadow-shadow-card"
    >
      <div className="flex flex-col gap-base">
        <header className="flex items-center justify-between gap-base">
          <div className="flex flex-col gap-card-title-pb">
            <h4 className="text-typography-2xl font-bold">
              Preview · {theme.name}
            </h4>
            <p className="text-typography-sm text-muted-foreground">
              Live render driven by the current token state.
            </p>
          </div>
          <Tag theme="primary">{theme.name}</Tag>
        </header>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Buttons
          </h5>
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
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tags
          </h5>
          <div className="flex flex-wrap items-center gap-button-gap">
            {THEMED_VARIANTS.map((variant) => (
              <Tag key={variant} theme={variant}>
                {variant}
              </Tag>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Alerts
          </h5>
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
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Surfaces
          </h5>
          <div className="grid gap-base md:grid-cols-2">
            <Card title="Card surface">
              <p className="text-typography-sm text-muted-foreground">
                Background, border and foreground from the colors group.
              </p>
            </Card>
            <Stats title="Active users" Icon={ChartBarIcon}>
              12,480
            </Stats>
            <StatsCard
              title="Revenue"
              Icon={UsersThreeIcon}
              value="$12,480"
            />
            <Card title="Empty state">
              <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Form controls
          </h5>
          <div className="grid gap-base md:grid-cols-2">
            <Input title="Email" name="email" placeholder="you@example.com" />
            <Input
              title="With error"
              name="email-error"
              placeholder="you@example.com"
              error="This email is already in use."
            />
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
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Navigation
          </h5>
          <Tabs active={previewTab} onChange={setPreviewTab}>
            <Tab id="overview" title="Overview">
              <p className="text-typography-sm text-muted-foreground">
                The tab content surface inherits from card-background.
              </p>
            </Tab>
            <Tab id="activity" title="Activity">
              <p className="text-typography-sm text-muted-foreground">
                Activity tab content.
              </p>
            </Tab>
            <Tab id="settings" title="Settings">
              <p className="text-typography-sm text-muted-foreground">
                Settings tab content.
              </p>
            </Tab>
          </Tabs>
          <Steps steps={3} currentStep={2}>
            <Step step={1} currentStep={2} title="Plan" />
            <Step step={2} currentStep={2} title="Build" />
            <Step step={3} currentStep={2} title="Ship" />
          </Steps>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Timeline
          </h5>
          <Timeline>
            <TimelineItem>
              <TimelineItem.Icon>
                <RocketLaunchIcon size={20} />
              </TimelineItem.Icon>
              <TimelineItem.Body>
                <strong className="text-foreground">Shipped v1</strong>
                <p className="text-typography-sm text-muted-foreground">
                  Initial release rolled out to all customers.
                </p>
              </TimelineItem.Body>
            </TimelineItem>
            <TimelineItem>
              <TimelineItem.Icon>
                <UsersThreeIcon size={20} />
              </TimelineItem.Icon>
              <TimelineItem.Body>
                <strong className="text-foreground">Public beta</strong>
                <p className="text-typography-sm text-muted-foreground">
                  Opened the waitlist to the broader audience.
                </p>
              </TimelineItem.Body>
            </TimelineItem>
            <TimelineItem>
              <TimelineItem.Icon>
                <ChartBarIcon size={20} />
              </TimelineItem.Icon>
              <TimelineItem.Body>
                <strong className="text-foreground">Kickoff</strong>
                <p className="text-typography-sm text-muted-foreground">
                  Team aligned on milestones and goals.
                </p>
              </TimelineItem.Body>
            </TimelineItem>
          </Timeline>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Skeleton
          </h5>
          <div className="flex w-full flex-col gap-base">
            <Skeleton className="w-full" />
            <Skeleton className="w-8/12" />
            <Skeleton className="w-1/2" />
          </div>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <h5 className="text-typography-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Typography
          </h5>
          <div className="flex flex-col gap-card-title-pb">
            <p className="text-typography-xs text-muted-foreground">
              Caption · text-typography-xs
            </p>
            <p className="text-typography-sm">Small · text-typography-sm</p>
            <p className="text-typography-base">Body · text-typography-base</p>
            <p className="text-typography-lg">Lead · text-typography-lg</p>
            <p className="text-typography-2xl font-bold">
              Section · text-typography-2xl
            </p>
            <p className="text-typography-4xl font-extrabold">
              Display · text-typography-4xl
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-card-title-pb">
          <div className="flex items-center gap-button-gap text-muted-foreground">
            <RocketLaunchIcon className="size-4" />
            <span className="text-typography-xs">
              Every component above pulls only from the editor state — no
              prop overrides.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SetupPage() {
  const [mode, setMode] = useState<Mode>("dark");
  const [activeTab, setActiveTab] = useState<string>("colors");
  const [dark, setDark] = useState<DesignTokens>(() => clone(defaultDarkTheme));
  const [light, setLight] = useState<DesignTokens>(() =>
    clone(defaultLightTheme),
  );

  const activeTheme = mode === "dark" ? dark : light;
  const setActiveTheme = mode === "dark" ? setDark : setLight;

  const reset = () => {
    if (mode === "dark") setDark(clone(defaultDarkTheme));
    else setLight(clone(defaultLightTheme));
  };

  const darkCode = useMemo(() => serializeTheme("DARK_THEME", dark), [dark]);
  const lightCode = useMemo(
    () => serializeTheme("LIGHT_THEME", light),
    [light],
  );

  return (
    <DocsLayout
      title="Theme Setup"
      section="theming"
      description="Edit every token in both themes, preview the result live, and copy the generated dark.ts / light.ts plus the bootstrap snippets to wire the library into your project."
    >
      <div className="flex flex-col gap-base">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-base">
            <div className="flex items-center gap-base">
              <PaletteIcon className="size-5 text-muted-foreground" />
              <div className="flex flex-col gap-card-title-pb">
                <span className="text-typography-sm font-semibold">
                  Editing
                </span>
                <span className="text-typography-xs text-muted-foreground">
                  Switch which theme the editor and preview target.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-button-gap">
              <Button
                theme={mode === "light" ? "primary" : "ghost-muted"}
                size="small"
                onClick={() => setMode("light")}
              >
                Light
              </Button>
              <Button
                theme={mode === "dark" ? "primary" : "ghost-muted"}
                size="small"
                onClick={() => setMode("dark")}
              >
                Dark
              </Button>
              <Button theme="ghost-muted" size="small" onClick={reset}>
                <ArrowsClockwiseIcon className="size-4" />
                Reset {mode}
              </Button>
            </div>
          </div>
        </Card>

        <LivePreview theme={activeTheme} />

        <Tabs active={activeTab} onChange={setActiveTab}>
          <Tab id="colors" title="Colors">
            <ColorsEditor theme={activeTheme} onUpdate={setActiveTheme} />
          </Tab>
          <Tab id="shadow" title="Shadow">
            <ShadowEditor theme={activeTheme} onUpdate={setActiveTheme} />
          </Tab>
          <Tab id="dimensions" title="Spacing & Z">
            <DimensionsEditor theme={activeTheme} onUpdate={setActiveTheme} />
          </Tab>
          <Tab id="components" title="Components">
            <ComponentsEditor theme={activeTheme} onUpdate={setActiveTheme} />
          </Tab>
          <Tab id="output" title="Output">
            <OutputPane darkCode={darkCode} lightCode={lightCode} />
          </Tab>
        </Tabs>
      </div>
    </DocsLayout>
  );
}

type OutputPaneProps = {
  darkCode: string;
  lightCode: string;
};

function OutputPane({ darkCode, lightCode }: OutputPaneProps) {
  return (
    <div className="flex flex-col gap-base">
      <OutputBlock
        title="src/theme/dark.ts"
        description="Drop this file into your project. It satisfies the DesignTokens contract exported by the library."
        Icon={CodeIcon}
        code={darkCode}
      />
      <OutputBlock
        title="src/theme/light.ts"
        description="Paired light theme file. Same shape as dark.ts."
        Icon={CodeIcon}
        code={lightCode}
      />
      <OutputBlock
        title="tailwind.config.ts"
        description="Extend Tailwind with the library preset and your generated palette."
        Icon={RulerIcon}
        code={tailwindSnippet}
      />
      <OutputBlock
        title="Theme injection"
        description="Render once near the root to inject :root and html.dark CSS variables. Toggle the dark class on <html> to switch themes."
        Icon={SquaresFourIcon}
        code={providerSnippet}
      />
    </div>
  );
}

type OutputBlockProps = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  code: string;
};

function OutputBlock({ title, description, Icon, code }: OutputBlockProps) {
  return (
    <Card>
      <header className="flex items-center gap-button-gap">
        <Icon className="size-4 text-muted-foreground" />
        <h4 className="text-typography-sm font-semibold">{title}</h4>
      </header>
      <p className="mt-card-title-pb text-typography-xs text-muted-foreground">
        {description}
      </p>
      <div className="mt-card-gap">
        <CodeBlock code={code} lang="tsx" />
      </div>
    </Card>
  );
}
