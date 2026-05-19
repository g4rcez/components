"use client";
import {
  ChartBarIcon,
  ListBulletsIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react";
import { CSSProperties, useState } from "react";
import {
  Alert,
  AnimatedList,
  AnimatedListItem,
  Empty,
  Info,
  Loading,
  PageCalendar,
  Progress,
  Spinner,
  Stats,
  StatsCard,
  Step,
  Steps,
  Tab,
  Tabs,
  Tag,
  Timeline,
  TimelineItem,
  Toolbar,
} from "../../../../../lib/src";
import { Shortcut } from "../../../../../lib/src/components/display/shortcut";
import { Checkbox } from "../../../../../lib/src/components/form/checkbox";
import { Input } from "../../../../../lib/src/components/form/input";
import { Switch } from "../../../../../lib/src/components/form/switch";
import { Skeleton } from "../../../../../lib/src/components/display/skeleton";
import { ComponentDemo } from "@/components/component-demo";
import { DocsLayout } from "@/components/docs-layout";

type TokenControl = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  value: number;
};

type TokenGroup = Record<string, TokenControl>;

const toStyle = (group: TokenGroup): CSSProperties =>
  Object.values(group).reduce<CSSProperties>((acc, c) => {
    (acc as Record<string, string>)[`--${c.key}`] = `${c.value}${c.unit}`;
    return acc;
  }, {});

const alertDefaults: TokenGroup = {
  radius: {
    key: "alert-radius",
    label: "alert-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  padding: {
    key: "alert-p",
    label: "alert-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
  gap: {
    key: "alert-gap",
    label: "alert-gap",
    min: 0,
    max: 32,
    step: 2,
    unit: "px",
    value: 8,
  },
};

const statsDefaults: TokenGroup = {
  p: {
    key: "stats-p",
    label: "stats-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
  gap: {
    key: "stats-gap",
    label: "stats-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
  iconSize: {
    key: "stats-icon-size",
    label: "stats-icon-size",
    min: 24,
    max: 80,
    step: 2,
    unit: "px",
    value: 40,
  },
  iconP: {
    key: "stats-icon-p",
    label: "stats-icon-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 32,
  },
};

const typographyDefaults: TokenGroup = {
  xs: {
    key: "typography-xs",
    label: "text-xs",
    min: 8,
    max: 24,
    step: 1,
    unit: "px",
    value: 12,
  },
  sm: {
    key: "typography-sm",
    label: "text-sm",
    min: 10,
    max: 24,
    step: 1,
    unit: "px",
    value: 14,
  },
  base: {
    key: "typography-base",
    label: "text-base",
    min: 12,
    max: 28,
    step: 1,
    unit: "px",
    value: 16,
  },
  lg: {
    key: "typography-lg",
    label: "text-lg",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 18,
  },
  "2xl": {
    key: "typography-2xl",
    label: "text-2xl",
    min: 16,
    max: 48,
    step: 1,
    unit: "px",
    value: 24,
  },
  "4xl": {
    key: "typography-4xl",
    label: "text-4xl",
    min: 24,
    max: 72,
    step: 1,
    unit: "px",
    value: 36,
  },
  "5xl": {
    key: "typography-5xl",
    label: "text-5xl",
    min: 28,
    max: 96,
    step: 1,
    unit: "px",
    value: 48,
  },
};

const inputDefaults: TokenGroup = {
  radius: {
    key: "input-radius",
    label: "input-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 6,
  },
  paddingX: {
    key: "input-padding-x",
    label: "input-padding-x",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  paddingY: {
    key: "input-padding-y",
    label: "input-padding-y",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 4,
  },
  text: {
    key: "input-text",
    label: "input-text",
    min: 10,
    max: 24,
    step: 1,
    unit: "px",
    value: 16,
  },
};

const selectionDefaults: TokenGroup = {
  checkboxSize: {
    key: "checkbox-size",
    label: "checkbox-size",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
  switchTrackW: {
    key: "switch-track-w",
    label: "switch-track-w",
    min: 24,
    max: 72,
    step: 1,
    unit: "px",
    value: 44,
  },
  switchThumbSize: {
    key: "switch-thumb-size",
    label: "switch-thumb-size",
    min: 12,
    max: 36,
    step: 1,
    unit: "px",
    value: 20,
  },
};

const skeletonDefaults: TokenGroup = {
  height: {
    key: "skeleton-height",
    label: "skeleton-height",
    min: 8,
    max: 80,
    step: 2,
    unit: "px",
    value: 32,
  },
  width: {
    key: "skeleton-width",
    label: "skeleton-width",
    min: 32,
    max: 320,
    step: 8,
    unit: "px",
    value: 128,
  },
  radius: {
    key: "skeleton-radius",
    label: "skeleton-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 4,
  },
  listGap: {
    key: "skeleton-list-gap",
    label: "skeleton-list-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
};

const progressDefaults: TokenGroup = {
  trackH: {
    key: "progress-track-h",
    label: "progress-track-h",
    min: 4,
    max: 48,
    step: 1,
    unit: "px",
    value: 24,
  },
};

const spinnerDefaults: TokenGroup = {
  size: {
    key: "spinner-size",
    label: "spinner-size",
    min: 16,
    max: 96,
    step: 2,
    unit: "px",
    value: 48,
  },
  border: {
    key: "spinner-border",
    label: "spinner-border",
    min: 1,
    max: 12,
    step: 1,
    unit: "px",
    value: 4,
  },
  containerP: {
    key: "spinner-container-p",
    label: "spinner-container-p",
    min: 0,
    max: 96,
    step: 4,
    unit: "px",
    value: 48,
  },
};

const emptyDefaults: TokenGroup = {
  gap: {
    key: "empty-gap",
    label: "empty-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
  px: {
    key: "empty-px",
    label: "empty-px",
    min: 0,
    max: 64,
    step: 2,
    unit: "px",
    value: 32,
  },
  py: {
    key: "empty-py",
    label: "empty-py",
    min: 0,
    max: 96,
    step: 2,
    unit: "px",
    value: 48,
  },
};

const listDefaults: TokenGroup = {
  cardP: {
    key: "list-card-p",
    label: "list-card-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
  cardGap: {
    key: "list-card-gap",
    label: "list-card-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
  itemPy: {
    key: "list-item-py",
    label: "list-item-py",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  itemGap: {
    key: "list-item-gap",
    label: "list-item-gap",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
};

const timelineDefaults: TokenGroup = {
  iconSize: {
    key: "timeline-icon-size",
    label: "timeline-icon-size",
    min: 24,
    max: 80,
    step: 2,
    unit: "px",
    value: 48,
  },
  connectorW: {
    key: "timeline-connector-w",
    label: "timeline-connector-w",
    min: 1,
    max: 8,
    step: 1,
    unit: "px",
    value: 2,
  },
  itemPb: {
    key: "timeline-item-pb",
    label: "timeline-item-pb",
    min: 16,
    max: 96,
    step: 4,
    unit: "px",
    value: 48,
  },
  rightGap: {
    key: "timeline-right-gap",
    label: "timeline-right-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
};

const stepDefaults: TokenGroup = {
  size: {
    key: "step-size",
    label: "step-size",
    min: 24,
    max: 72,
    step: 1,
    unit: "px",
    value: 40,
  },
  iconSize: {
    key: "step-icon-size",
    label: "step-icon-size",
    min: 12,
    max: 48,
    step: 1,
    unit: "px",
    value: 24,
  },
  gap: {
    key: "step-gap",
    label: "step-gap",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
};

const tabsDefaults: TokenGroup = {
  itemPx: {
    key: "tabs-item-px",
    label: "tabs-item-px",
    min: 0,
    max: 64,
    step: 2,
    unit: "px",
    value: 40,
  },
  itemPy: {
    key: "tabs-item-py",
    label: "tabs-item-py",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
  headerMb: {
    key: "tabs-header-mb",
    label: "tabs-header-mb",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
};

const shortcutDefaults: TokenGroup = {
  gap: {
    key: "shortcut-gap",
    label: "shortcut-gap",
    min: 0,
    max: 16,
    step: 1,
    unit: "px",
    value: 4,
  },
  text: {
    key: "shortcut-text",
    label: "shortcut-text",
    min: 10,
    max: 20,
    step: 1,
    unit: "px",
    value: 14,
  },
};

const toolbarDefaults: TokenGroup = {
  bottom: {
    key: "toolbar-bottom",
    label: "toolbar-bottom",
    min: 0,
    max: 64,
    step: 1,
    unit: "px",
    value: 16,
  },
  radius: {
    key: "toolbar-radius",
    label: "toolbar-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  p: {
    key: "toolbar-p",
    label: "toolbar-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
};

const wizardDefaults: TokenGroup = {
  w: {
    key: "wizard-w",
    label: "wizard-w",
    min: 200,
    max: 480,
    step: 8,
    unit: "px",
    value: 320,
  },
  gap: {
    key: "wizard-gap",
    label: "wizard-gap",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 12,
  },
  radius: {
    key: "wizard-radius",
    label: "wizard-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  p: {
    key: "wizard-p",
    label: "wizard-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
};

const infoDefaults: TokenGroup = {
  gap: {
    key: "info-gap",
    label: "info-gap",
    min: 0,
    max: 16,
    step: 1,
    unit: "px",
    value: 4,
  },
  labelText: {
    key: "info-label-text",
    label: "info-label-text",
    min: 10,
    max: 24,
    step: 1,
    unit: "px",
    value: 14,
  },
  valueText: {
    key: "info-value-text",
    label: "info-value-text",
    min: 12,
    max: 28,
    step: 1,
    unit: "px",
    value: 16,
  },
  secondaryText: {
    key: "info-secondary-text",
    label: "info-secondary-text",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 18,
  },
};

const pageCalendarDefaults: TokenGroup = {
  badgeSize: {
    key: "page-calendar-badge-size",
    label: "page-calendar-badge-size",
    min: 24,
    max: 80,
    step: 2,
    unit: "px",
    value: 48,
  },
  cellMinH: {
    key: "page-calendar-cell-min-h",
    label: "page-calendar-cell-min-h",
    min: 64,
    max: 240,
    step: 4,
    unit: "px",
    value: 128,
  },
  gutterW: {
    key: "page-calendar-gutter-w",
    label: "page-calendar-gutter-w",
    min: 32,
    max: 120,
    step: 2,
    unit: "px",
    value: 60,
  },
  pillRadius: {
    key: "page-calendar-pill-radius",
    label: "page-calendar-pill-radius",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 4,
  },
  weekdayText: {
    key: "page-calendar-weekday-text",
    label: "page-calendar-weekday-text",
    min: 10,
    max: 20,
    step: 1,
    unit: "px",
    value: 12,
  },
};

const cardStatsDefaults: TokenGroup = {
  iconColW: {
    key: "card-stats-icon-col-w",
    label: "card-stats-icon-col-w",
    min: 48,
    max: 160,
    step: 4,
    unit: "px",
    value: 80,
  },
  iconColP: {
    key: "card-stats-icon-col-p",
    label: "card-stats-icon-col-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 16,
  },
};

const Controls = ({
  tokens,
  onChange,
}: {
  tokens: TokenGroup;
  onChange: (next: TokenGroup) => void;
}) => (
  <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
    {Object.entries(tokens).map(([id, c]) => (
      <label key={id} aria-label={`--${c.label}`} className="flex flex-col gap-1 text-xs">
        <span className="flex justify-between font-mono text-muted-foreground">
          <span>--{c.label}</span>
          <span>
            {c.value}
            {c.unit}
          </span>
        </span>
        <input
          type="range"
          min={c.min}
          max={c.max}
          step={c.step}
          value={c.value}
          onChange={(e) =>
            onChange({
              ...tokens,
              [id]: { ...c, value: Number(e.target.value) },
            })
          }
          className="w-full"
        />
      </label>
    ))}
  </div>
);

export default function DesignTokensPage() {
  const [alertTokens, setAlertTokens] = useState(alertDefaults);
  const [statsTokens, setStatsTokens] = useState(statsDefaults);
  const [typographyTokens, setTypographyTokens] = useState(typographyDefaults);
  const [skeletonTokens, setSkeletonTokens] = useState(skeletonDefaults);
  const [inputTokens, setInputTokens] = useState(inputDefaults);
  const [selectionTokens, setSelectionTokens] = useState(selectionDefaults);
  const [progressTokens, setProgressTokens] = useState(progressDefaults);
  const [spinnerTokens, setSpinnerTokens] = useState(spinnerDefaults);
  const [emptyTokens, setEmptyTokens] = useState(emptyDefaults);
  const [listTokens, setListTokens] = useState(listDefaults);
  const [timelineTokens, setTimelineTokens] = useState(timelineDefaults);
  const [stepTokens, setStepTokens] = useState(stepDefaults);
  const [tabsTokens, setTabsTokens] = useState(tabsDefaults);
  const [shortcutTokens, setShortcutTokens] = useState(shortcutDefaults);
  const [toolbarTokens, setToolbarTokens] = useState(toolbarDefaults);
  const [wizardTokens, setWizardTokens] = useState(wizardDefaults);
  const [infoTokens, setInfoTokens] = useState(infoDefaults);
  const [pageCalendarTokens, setPageCalendarTokens] =
    useState(pageCalendarDefaults);
  const [cardStatsTokens, setCardStatsTokens] = useState(cardStatsDefaults);

  return (
    <DocsLayout
      title="Design Tokens"
      section="theming"
      description="Per-component CSS variables exposed as Tailwind utilities. Override --component-attr on any container to reskin geometry without touching markup."
    >
      <ComponentDemo
        title="Alert tokens"
        description="Padding, radius and inner gap are owned by --alert-p, --alert-radius and --alert-gap. Drag the sliders to override them on this scoped container."
        code={`<div style={{ "--alert-p": "24px", "--alert-radius": "16px", "--alert-gap": "12px" }}>
  <Alert theme="info" title="Token override">
    <p>Padding, radius and gap come from CSS variables.</p>
  </Alert>
</div>`}
      >
        <div
          style={toStyle(alertTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Alert theme="info" title="Token override">
            <p>Padding, radius and gap come from CSS variables.</p>
          </Alert>
          <Controls tokens={alertTokens} onChange={setAlertTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Stats tokens"
        description="--stats-p, --stats-gap, --stats-icon-size and --stats-icon-p drive layout independently of color tokens."
        code={`<div style={{ "--stats-p": "32px", "--stats-icon-size": "56px" }}>
  <Stats title="Revenue" Icon={ChartBarIcon}>$12,480</Stats>
</div>`}
      >
        <div
          style={toStyle(statsTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Stats
            title="Revenue"
            Icon={ChartBarIcon}
            footer={
              <span className="text-sm text-muted-foreground">
                +12.4% vs last month
              </span>
            }
          >
            $12,480
          </Stats>
          <Controls tokens={statsTokens} onChange={setStatsTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Typography tokens"
        description="text-xs, text-2xl and text-4xl previously fell back to Tailwind defaults. They now resolve to --typography-xs, --typography-2xl, --typography-4xl."
        code={`<div style={{ "--typography-2xl": "2rem", "--typography-4xl": "3rem" }}>
  <p className="text-xs">Caption</p>
  <h3 className="text-2xl">Section heading</h3>
  <h1 className="text-4xl">Display</h1>
</div>`}
      >
        <div
          style={toStyle(typographyTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Caption / text-xs</p>
            <p className="text-sm">Small / text-sm</p>
            <p className="text-base">Body / text-base</p>
            <p className="text-lg">Lead / text-lg</p>
            <h3 className="text-2xl font-bold">Section heading / text-2xl</h3>
            <h1 className="text-4xl font-extrabold">Display / text-4xl</h1>
            <h1 className="text-5xl font-extrabold">Hero / text-5xl</h1>
          </div>
          <Controls tokens={typographyTokens} onChange={setTypographyTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Skeleton tokens"
        description="Default skeleton dimensions and stack rhythm flow from --skeleton-height, --skeleton-width, --skeleton-radius and --skeleton-list-gap."
        code={`<div style={{ "--skeleton-height": "48px", "--skeleton-radius": "12px" }}>
  <Skeleton />
</div>`}
      >
        <div
          style={toStyle(skeletonTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex w-full flex-col items-center gap-skeleton-list-gap">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          <Controls tokens={skeletonTokens} onChange={setSkeletonTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Input tokens"
        description="The shared --input-* group drives geometry for every text-like field: input, textarea, select, autocomplete, multi-select and date-picker."
        code={`<div style={{ "--input-radius": "12px", "--input-padding-x": "12px" }}>
  <Input title="Email" name="email" placeholder="you@example.com" />
</div>`}
      >
        <div
          style={toStyle(inputTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Input
            title="Email"
            name="email"
            placeholder="you@example.com"
            error="Override the tokens to reshape this field."
          />
          <Controls tokens={inputTokens} onChange={setInputTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Selection tokens"
        description="Checkbox and switch geometry come from --checkbox-size, --switch-track-w and --switch-thumb-size. Slide to re-skin the controls live."
        code={`<div style={{ "--checkbox-size": "20px", "--switch-track-w": "56px" }}>
  <Checkbox>Subscribe</Checkbox>
  <Switch>Notifications</Switch>
</div>`}
      >
        <div
          style={toStyle(selectionTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <Checkbox>Subscribe to updates</Checkbox>
            <Switch>Notifications</Switch>
          </div>
          <Controls tokens={selectionTokens} onChange={setSelectionTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Progress tokens"
        description="Track height comes from --progress-track-h. Override it to reskin every Progress bar without touching markup."
        code={`<div style={{ "--progress-track-h": "2rem" }}>
  <Progress value={60} />
</div>`}
      >
        <div
          style={toStyle(progressTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Progress value={60} />
          <Controls tokens={progressTokens} onChange={setProgressTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Spinner tokens"
        description="--spinner-size, --spinner-border and --spinner-container-p drive the spinner geometry and the Loading wrapper padding."
        code={`<div style={{ "--spinner-size": "5rem", "--spinner-border": "0.5rem" }}>
  <Loading />
</div>`}
      >
        <div
          style={toStyle(spinnerTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
          <Loading />
          <Controls tokens={spinnerTokens} onChange={setSpinnerTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Empty tokens"
        description="The empty-state placeholder geometry resolves through --empty-gap, --empty-px and --empty-py."
        code={`<div style={{ "--empty-py": "4rem" }}>
  <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
</div>`}
      >
        <div
          style={toStyle(emptyTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Empty Icon={ListBulletsIcon} message="Nothing here yet" />
          <Controls tokens={emptyTokens} onChange={setEmptyTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="List tokens"
        description="AnimatedList row rhythm and the floating card padding resolve through --list-card-p, --list-card-gap, --list-item-py and --list-item-gap."
        code={`<div style={{ "--list-item-py": "1rem" }}>
  <AnimatedList>
    <AnimatedListItem title="Title" description="Description">Body</AnimatedListItem>
  </AnimatedList>
</div>`}
      >
        <div style={toStyle(listTokens)} className="flex w-full flex-col gap-6">
          <AnimatedList>
            <AnimatedListItem
              title="Quarterly review"
              description="Open the card to read the full agenda."
            >
              Body content goes here when expanded.
            </AnimatedListItem>
            <AnimatedListItem
              title="Marketing sync"
              description="Status update across the campaign workstreams."
            >
              Body content goes here when expanded.
            </AnimatedListItem>
          </AnimatedList>
          <Controls tokens={listTokens} onChange={setListTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Timeline tokens"
        description="Item rhythm, connector width and icon dimensions resolve through --timeline-item-pb, --timeline-connector-w, --timeline-icon-size and --timeline-right-gap."
        code={`<div style={{ "--timeline-icon-size": "4rem" }}>
  <Timeline>
    <TimelineItem>Event</TimelineItem>
  </Timeline>
</div>`}
      >
        <div
          style={toStyle(timelineTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Timeline>
            <TimelineItem>
              <div className="flex flex-col">
                <strong>Shipped v1</strong>
                <span className="text-typography-sm text-muted-foreground">
                  Initial release rolled out to all customers.
                </span>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div className="flex flex-col">
                <strong>Public beta</strong>
                <span className="text-typography-sm text-muted-foreground">
                  Opened the waitlist to the broader audience.
                </span>
              </div>
            </TimelineItem>
          </Timeline>
          <Controls tokens={timelineTokens} onChange={setTimelineTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Step tokens"
        description="Step indicator geometry resolves through --step-size, --step-icon-size and --step-gap (gap is owned by the Steps wrapper)."
        code={`<div style={{ "--step-size": "3rem" }}>
  <Steps steps={3} currentStep={2}>
    <Step step={1} currentStep={2} title="Plan" />
  </Steps>
</div>`}
      >
        <div style={toStyle(stepTokens)} className="flex w-full flex-col gap-6">
          <Steps steps={3} currentStep={2}>
            <Step step={1} currentStep={2} title="Plan" />
            <Step step={2} currentStep={2} title="Build" />
            <Step step={3} currentStep={2} title="Ship" />
          </Steps>
          <Controls tokens={stepTokens} onChange={setStepTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Tabs tokens"
        description="Tab header rhythm comes from --tabs-item-px, --tabs-item-py and --tabs-header-mb."
        code={`<div style={{ "--tabs-item-px": "4rem" }}>
  <Tabs active="one"><Tab id="one" title="One">Content</Tab></Tabs>
</div>`}
      >
        <div style={toStyle(tabsTokens)} className="flex w-full flex-col gap-6">
          <Tabs active="overview">
            <Tab id="overview" title="Overview">
              <p>Overview panel.</p>
            </Tab>
            <Tab id="activity" title="Activity">
              <p>Activity panel.</p>
            </Tab>
            <Tab id="settings" title="Settings">
              <p>Settings panel.</p>
            </Tab>
          </Tabs>
          <Controls tokens={tabsTokens} onChange={setTabsTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Shortcut tokens"
        description="Key separator rhythm and label size flow from --shortcut-gap and --shortcut-text."
        code={`<div style={{ "--shortcut-gap": "0.5rem" }}>
  <Shortcut value="ctrl+k" />
</div>`}
      >
        <div
          style={toStyle(shortcutTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Shortcut value="ctrl+k" />
            <Shortcut value="shift+enter" />
            <Shortcut value="cmd+shift+p" />
          </div>
          <Controls tokens={shortcutTokens} onChange={setShortcutTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Toolbar tokens"
        description="Floating toolbar offset, corner radius and padding come from --toolbar-bottom, --toolbar-radius and --toolbar-p."
        code={`<div style={{ "--toolbar-p": "1.5rem" }}>
  <Toolbar><button>Action</button></Toolbar>
</div>`}
      >
        <div
          style={toStyle(toolbarTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="relative h-48 w-full overflow-hidden rounded-md border border-card-border">
            <Toolbar>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-typography-sm text-primary-foreground"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md border border-card-border px-3 py-1.5 text-typography-sm"
              >
                Discard
              </button>
            </Toolbar>
          </div>
          <Controls tokens={toolbarTokens} onChange={setToolbarTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Wizard tokens"
        description="Wizard surface dimensions resolve through --wizard-w, --wizard-gap, --wizard-radius and --wizard-p. Demo renders a static surface using the same skin classes."
        code={`<div style={{ "--wizard-w": "24rem", "--wizard-radius": "1rem" }}>
  {/* Wizard renders its floating surface with these tokens */}
</div>`}
      >
        <div
          style={toStyle(wizardTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="flex w-wizard-w flex-col gap-wizard-gap rounded-wizard-radius border border-card-border bg-card-background p-wizard-p shadow-shadow-card">
            <RocketLaunchIcon size={28} />
            <h3 className="text-typography-lg font-semibold">
              Welcome to the workspace
            </h3>
            <p className="text-typography-sm text-muted-foreground">
              Walk through the basics in three short steps.
            </p>
            <footer className="flex items-center justify-end gap-wizard-actions-gap pt-wizard-footer-pt">
              <button
                type="button"
                className="text-wizard-label-text text-muted-foreground"
              >
                Skip
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1.5 text-typography-sm text-primary-foreground"
              >
                Next
              </button>
            </footer>
          </div>
          <Controls tokens={wizardTokens} onChange={setWizardTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Info tokens"
        description="Label/value/secondary text and inner gap resolve through --info-gap, --info-label-text, --info-value-text and --info-secondary-text."
        code={`<div style={{ "--info-label-text": "1rem" }}>
  <Info label="Name">Allan</Info>
</div>`}
      >
        <div style={toStyle(infoTokens)} className="flex w-full flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Info label="Customer">Allan Garcez</Info>
            <Info row label="Plan">
              Enterprise
            </Info>
            <Info label="Renewal date">
              <span>March 14, 2026</span>
            </Info>
            <Info row label="Status">
              Active
            </Info>
          </div>
          <Controls tokens={infoTokens} onChange={setInfoTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Page calendar tokens"
        description="Full-page calendar surface — badges, cells, gutter and pills resolve through --page-calendar-* tokens. Five most-visual sliders shown below; the full group covers ~30 keys."
        code={`<div style={{ "--page-calendar-cell-min-h": "10rem" }}>
  <PageCalendar events={events} />
</div>`}
      >
        <div
          style={toStyle(pageCalendarTokens)}
          className="flex w-full flex-col gap-6"
        >
          <PageCalendar
            events={[
              {
                id: "kickoff",
                title: "Kickoff",
                date: new Date(),
              },
              {
                id: "review",
                title: "Quarterly review",
                date: new Date(Date.now() + 24 * 60 * 60 * 1000),
              },
            ]}
          />
          <Controls
            tokens={pageCalendarTokens}
            onChange={setPageCalendarTokens}
          />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Card stats extras"
        description="StatsCard icon column width and padding resolve through --card-stats-icon-col-w and --card-stats-icon-col-p."
        code={`<div style={{ "--card-stats-icon-col-w": "8rem" }}>
  <StatsCard title="Revenue" Icon={ChartBarIcon}>$12,480</StatsCard>
</div>`}
      >
        <div
          style={toStyle(cardStatsTokens)}
          className="flex w-full flex-col gap-6"
        >
          <StatsCard title="Revenue" Icon={ChartBarIcon} value="$12,480" />
          <Controls tokens={cardStatsTokens} onChange={setCardStatsTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Tag size tokens"
        description="Tag size variants are now token-backed: --tag-height(-big/-small/-tiny) and matching padding-x/padding-y per size. Same component, same variant — different geometry by overriding a single variable."
        code={`<div style={{ "--tag-height": "3rem", "--tag-padding-x": "1.5rem" }}>
  <Tag>Default</Tag>
</div>`}
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          <Tag size="tiny">tiny</Tag>
          <Tag size="small">small</Tag>
          <Tag>default</Tag>
          <Tag size="big">big</Tag>
          <div
            style={{
              ["--tag-height" as never]: "3.5rem",
              ["--tag-padding-x" as never]: "2rem",
            }}
          >
            <Tag>overridden</Tag>
          </div>
        </div>
      </ComponentDemo>
    </DocsLayout>
  );
}
