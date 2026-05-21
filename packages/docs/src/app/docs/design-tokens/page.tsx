"use client";
import {
  ChartBarIcon,
  CheckCircleIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  SparkleIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import { CSSProperties, useState } from "react";
import {
  Alert,
  AnimatedList,
  AnimatedListItem,
  Button,
  Calendar,
  Card,
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
import { Radiobox } from "../../../../../lib/src/components/form/radiobox";
import { Slider } from "../../../../../lib/src/components/form/slider";
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
  radius: {
    key: "stats-radius",
    label: "stats-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
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
  radius: {
    key: "progress-radius",
    label: "progress-radius",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
    value: 100,
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

const buttonDefaults: TokenGroup = {
  radius: {
    key: "button-radius",
    label: "button-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 9,
  },
  height: {
    key: "button-height",
    label: "button-height",
    min: 24,
    max: 64,
    step: 1,
    unit: "px",
    value: 40,
  },
  paddingX: {
    key: "button-padding-x",
    label: "button-padding-x",
    min: 0,
    max: 48,
    step: 1,
    unit: "px",
    value: 16,
  },
  gap: {
    key: "button-gap",
    label: "button-gap",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 6,
  },
};

const cardDefaults: TokenGroup = {
  radius: {
    key: "card-radius",
    label: "card-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
  paddingX: {
    key: "card-padding-x",
    label: "card-padding-x",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
  paddingY: {
    key: "card-padding-y",
    label: "card-padding-y",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 12,
  },
  gap: {
    key: "card-gap",
    label: "card-gap",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
};

const modalDefaults: TokenGroup = {
  radius: {
    key: "modal-radius",
    label: "modal-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  paddingX: {
    key: "modal-padding-x",
    label: "modal-padding-x",
    min: 0,
    max: 64,
    step: 2,
    unit: "px",
    value: 32,
  },
  paddingY: {
    key: "modal-padding-y",
    label: "modal-padding-y",
    min: 0,
    max: 48,
    step: 1,
    unit: "px",
    value: 16,
  },
  footerGap: {
    key: "modal-footer-gap",
    label: "modal-footer-gap",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
};

const dropdownDefaults: TokenGroup = {
  radius: {
    key: "dropdown-radius",
    label: "dropdown-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  p: {
    key: "dropdown-p",
    label: "dropdown-p",
    min: 0,
    max: 48,
    step: 1,
    unit: "px",
    value: 16,
  },
  headerMb: {
    key: "dropdown-header-mb",
    label: "dropdown-header-mb",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
};

const tooltipDefaults: TokenGroup = {
  radius: {
    key: "tooltip-radius",
    label: "tooltip-radius",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
  p: {
    key: "tooltip-p",
    label: "tooltip-p",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 12,
  },
};

const menuDefaults: TokenGroup = {
  radius: {
    key: "menu-radius",
    label: "menu-radius",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
  itemP: {
    key: "menu-item-p",
    label: "menu-item-p",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 10,
  },
};

const notificationDefaults: TokenGroup = {
  radius: {
    key: "notification-radius",
    label: "notification-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 12,
  },
  p: {
    key: "notification-p",
    label: "notification-p",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
  gap: {
    key: "notification-gap",
    label: "notification-gap",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 12,
  },
};

const commandDefaults: TokenGroup = {
  radius: {
    key: "command-radius",
    label: "command-radius",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
  itemP: {
    key: "command-item-p",
    label: "command-item-p",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
  rowH: {
    key: "command-row-h",
    label: "command-row-h",
    min: 24,
    max: 64,
    step: 1,
    unit: "px",
    value: 40,
  },
};

const calendarDefaults: TokenGroup = {
  daySize: {
    key: "calendar-day-size",
    label: "calendar-day-size",
    min: 24,
    max: 56,
    step: 1,
    unit: "px",
    value: 36,
  },
  cellP: {
    key: "calendar-cell-p",
    label: "calendar-cell-p",
    min: 0,
    max: 16,
    step: 1,
    unit: "px",
    value: 4,
  },
  weekdayPy: {
    key: "calendar-weekday-py",
    label: "calendar-weekday-py",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
};

const tableDefaults: TokenGroup = {
  radius: {
    key: "table-radius",
    label: "table-radius",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
  cellPx: {
    key: "table-cell-px",
    label: "table-cell-px",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  cellPadding: {
    key: "table-cell-padding",
    label: "table-cell-padding",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 12,
  },
  rowGap: {
    key: "table-row-gap",
    label: "table-row-gap",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 4,
  },
};

const radioboxDefaults: TokenGroup = {
  size: {
    key: "radiobox-size",
    label: "radiobox-size",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 16,
  },
  gap: {
    key: "radiobox-gap",
    label: "radiobox-gap",
    min: 0,
    max: 24,
    step: 1,
    unit: "px",
    value: 8,
  },
};

const sliderDefaults: TokenGroup = {
  controlH: {
    key: "slider-control-h",
    label: "slider-control-h",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 20,
  },
  trackH: {
    key: "slider-track-h",
    label: "slider-track-h",
    min: 2,
    max: 16,
    step: 1,
    unit: "px",
    value: 8,
  },
  thumbSize: {
    key: "slider-thumb-size",
    label: "slider-thumb-size",
    min: 12,
    max: 32,
    step: 1,
    unit: "px",
    value: 20,
  },
};

const fileUploadDefaults: TokenGroup = {
  p: {
    key: "file-upload-p",
    label: "file-upload-p",
    min: 0,
    max: 48,
    step: 2,
    unit: "px",
    value: 24,
  },
  radius: {
    key: "file-upload-radius",
    label: "file-upload-radius",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
    value: 8,
  },
  thumbSize: {
    key: "file-upload-thumb-size",
    label: "file-upload-thumb-size",
    min: 32,
    max: 96,
    step: 2,
    unit: "px",
    value: 64,
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
  const [buttonTokens, setButtonTokens] = useState(buttonDefaults);
  const [cardTokens, setCardTokens] = useState(cardDefaults);
  const [modalTokens, setModalTokens] = useState(modalDefaults);
  const [dropdownTokens, setDropdownTokens] = useState(dropdownDefaults);
  const [tooltipTokens, setTooltipTokens] = useState(tooltipDefaults);
  const [menuTokens, setMenuTokens] = useState(menuDefaults);
  const [notificationTokens, setNotificationTokens] = useState(notificationDefaults);
  const [commandTokens, setCommandTokens] = useState(commandDefaults);
  const [calendarTokens, setCalendarTokens] = useState(calendarDefaults);
  const [tableTokens, setTableTokens] = useState(tableDefaults);
  const [radioboxTokens, setRadioboxTokens] = useState(radioboxDefaults);
  const [sliderTokens, setSliderTokens] = useState(sliderDefaults);
  const [fileUploadTokens, setFileUploadTokens] = useState(fileUploadDefaults);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [sliderValue, setSliderValue] = useState(40);

  return (
    <DocsLayout
      title="Design Tokens"
      section="theming"
      description="Per-component CSS variables exposed as Tailwind utilities. Override --component-attr on any container to reskin geometry without touching markup."
    >
    <div className="flex flex-col gap-10">
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
        description="--stats-radius, --stats-p, --stats-gap, --stats-icon-size and --stats-icon-p drive layout independently of color tokens."
        code={`<div style={{ "--stats-radius": "20px", "--stats-p": "32px", "--stats-icon-size": "56px" }}>
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
        description="Track height and corner shape come from --progress-track-h and --progress-radius. Override them to reskin every Progress bar without touching markup."
        code={`<div style={{ "--progress-track-h": "2rem", "--progress-radius": "8px" }}>
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
        title="Button tokens"
        description="Button height, radius, horizontal padding and icon/text gap come from --button-height, --button-radius, --button-padding-x and --button-gap."
        code={`<div style={{ "--button-radius": "1rem", "--button-height": "3rem" }}>
  <Button theme="primary">Save changes</Button>
</div>`}
      >
        <div style={toStyle(buttonTokens)} className="flex w-full flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button theme="primary">Primary</Button>
            <Button theme="secondary">Secondary</Button>
            <Button theme="danger">Danger</Button>
            <Button theme="muted">
              <SparkleIcon size={16} aria-hidden />
              With icon
            </Button>
          </div>
          <Controls tokens={buttonTokens} onChange={setButtonTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Card tokens"
        description="Card geometry resolves through --card-radius, --card-padding-x, --card-padding-y and --card-gap."
        code={`<div style={{ "--card-radius": "1.5rem", "--card-padding-x": "2rem" }}>
  <Card title="Workspace"><p>Body</p></Card>
</div>`}
      >
        <div style={toStyle(cardTokens)} className="flex w-full flex-col gap-6">
          <Card title="Workspace">
            <p className="text-typography-sm text-muted-foreground">
              Card padding, radius and stack gap come from CSS variables.
            </p>
          </Card>
          <Controls tokens={cardTokens} onChange={setCardTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Modal tokens"
        description="Modal surface geometry resolves through --modal-radius, --modal-padding-x, --modal-padding-y and --modal-footer-gap. The demo shows a static surface using the same skin classes."
        code={`<div style={{ "--modal-radius": "1rem", "--modal-padding-x": "2.5rem" }}>
  <Modal type="dialog" trigger={<button>Open</button>}>...</Modal>
</div>`}
      >
        <div
          style={toStyle(modalTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="w-full max-w-dialog rounded-modal-radius border border-floating-border bg-floating-background px-modal-padding-x py-modal-padding-y shadow-shadow-floating">
            <header className="pb-modal-title-pb text-typography-xl font-semibold">
              Confirm deployment
            </header>
            <p className="py-modal-body-py text-typography-sm text-muted-foreground">
              Override `--modal-radius` and `--modal-padding-x` on a scoped
              container to reshape every Modal surface.
            </p>
            <footer className="flex justify-end gap-modal-footer-gap pt-modal-footer-pt">
              <button
                type="button"
                className="rounded-button-radius border border-card-border px-3 py-1.5 text-typography-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-button-radius bg-primary px-3 py-1.5 text-typography-sm text-primary-foreground"
              >
                Confirm
              </button>
            </footer>
          </div>
          <Controls tokens={modalTokens} onChange={setModalTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Dropdown tokens"
        description="Floating dropdown surface uses --dropdown-radius, --dropdown-p and --dropdown-header-mb."
        code={`<div style={{ "--dropdown-radius": "0.75rem" }}>
  <Dropdown header="Header">...</Dropdown>
</div>`}
      >
        <div
          style={toStyle(dropdownTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="w-full max-w-xs rounded-dropdown-radius border border-floating-border bg-floating-background p-dropdown-p shadow-shadow-floating">
            <header className="mb-dropdown-header-mb text-typography-sm font-semibold">
              Account
            </header>
            <ul className="flex flex-col gap-1 text-typography-sm">
              <li>Profile</li>
              <li>Workspace settings</li>
              <li className="text-danger">Sign out</li>
            </ul>
          </div>
          <Controls tokens={dropdownTokens} onChange={setDropdownTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Tooltip tokens"
        description="Tooltip surface resolves through --tooltip-radius and --tooltip-p."
        code={`<div style={{ "--tooltip-radius": "0.75rem", "--tooltip-p": "1rem" }}>
  <Tooltip title="Tip">Hover me</Tooltip>
</div>`}
      >
        <div
          style={toStyle(tooltipTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="rounded-tooltip-radius bg-tooltip-background p-tooltip-p text-tooltip-foreground shadow-shadow-floating">
            <p className="text-typography-sm">Override the tokens to reshape every tooltip.</p>
          </div>
          <Controls tokens={tooltipTokens} onChange={setTooltipTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Menu tokens"
        description="Floating Menu surface uses --menu-radius and --menu-item-p."
        code={`<div style={{ "--menu-radius": "1rem" }}>
  <Menu options={[{ label: "Item" }]}>Open</Menu>
</div>`}
      >
        <div
          style={toStyle(menuTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="w-full max-w-xs rounded-menu-radius border border-floating-border bg-floating-background shadow-shadow-floating">
            <ul className="flex flex-col">
              <li className="p-menu-item-p text-typography-sm hover:bg-floating-hover">Duplicate</li>
              <li className="p-menu-item-p text-typography-sm hover:bg-floating-hover">Archive</li>
              <li className="p-menu-item-p text-typography-sm text-danger hover:bg-floating-hover">
                Delete
              </li>
            </ul>
          </div>
          <Controls tokens={menuTokens} onChange={setMenuTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Notification tokens"
        description="Toast geometry resolves through --notification-radius, --notification-p and --notification-gap."
        code={`<div style={{ "--notification-radius": "1rem", "--notification-p": "1.25rem" }}>
  <Notifications>...</Notifications>
</div>`}
      >
        <div
          style={toStyle(notificationTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="flex w-full max-w-sm items-start gap-notification-gap rounded-notification-radius border border-success-subtle bg-success-subtle p-notification-p text-success-foreground shadow-shadow-notification">
            <CheckCircleIcon size={24} aria-hidden />
            <div className="flex flex-col gap-notification-inner-gap">
              <strong className="text-typography-sm">Deploy succeeded</strong>
              <span className="text-typography-xs">main → production · 12s ago</span>
            </div>
          </div>
          <Controls
            tokens={notificationTokens}
            onChange={setNotificationTokens}
          />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Command palette tokens"
        description="Command surface resolves through --command-radius, --command-item-p and --command-row-h."
        code={`<div style={{ "--command-radius": "1rem", "--command-row-h": "3rem" }}>
  <CommandPalette items={items} />
</div>`}
      >
        <div
          style={toStyle(commandTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="w-full max-w-md overflow-hidden rounded-command-radius border border-floating-border bg-floating-background shadow-shadow-floating">
            <div className="flex h-command-header-h items-center gap-2 px-command-input-px py-command-input-py">
              <MagnifyingGlassIcon size={16} aria-hidden />
              <span className="text-typography-sm text-muted-foreground">
                Search the workspace…
              </span>
            </div>
            <ul className="flex flex-col gap-command-list-gap px-command-list-px py-command-list-my">
              <li className="flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p text-typography-sm hover:bg-floating-hover">
                Create deployment
              </li>
              <li className="flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p text-typography-sm hover:bg-floating-hover">
                Invite teammate
              </li>
              <li className="flex h-command-row-h items-center gap-command-item-gap rounded-md p-command-item-p text-typography-sm hover:bg-floating-hover">
                Open settings
              </li>
            </ul>
          </div>
          <Controls tokens={commandTokens} onChange={setCommandTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Calendar tokens"
        description="Inline Calendar geometry uses --calendar-day-size, --calendar-cell-p and --calendar-weekday-py."
        code={`<div style={{ "--calendar-day-size": "3rem" }}>
  <Calendar date={date} onChange={setDate} />
</div>`}
      >
        <div
          style={toStyle(calendarTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <Calendar date={calendarDate} changeOnlyOnClick onChange={setCalendarDate} />
          <Controls tokens={calendarTokens} onChange={setCalendarTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Table tokens"
        description="Table geometry resolves through --table-radius, --table-cell-px, --table-cell-padding and --table-row-gap."
        code={`<div style={{ "--table-radius": "1rem" }}>
  <Table cols={cols} rows={rows} />
</div>`}
      >
        <div style={toStyle(tableTokens)} className="flex w-full flex-col gap-6">
          <div className="overflow-hidden rounded-table-radius border border-table-border bg-table-background shadow-shadow-table">
            <table className="w-full border-collapse">
              <thead className="bg-table-header">
                <tr>
                  <th className="p-table-cell-padding text-left text-typography-sm">Name</th>
                  <th className="p-table-cell-padding text-left text-typography-sm">Role</th>
                  <th className="p-table-cell-padding text-left text-typography-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-table-border">
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Allan</td>
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Owner</td>
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Active</td>
                </tr>
                <tr className="border-t border-table-border">
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Marina</td>
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Member</td>
                  <td className="px-table-cell-px p-table-cell-padding text-typography-sm">Invited</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Controls tokens={tableTokens} onChange={setTableTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Radiobox tokens"
        description="Radiobox geometry resolves through --radiobox-size and --radiobox-gap."
        code={`<div style={{ "--radiobox-size": "1.25rem" }}>
  <Radiobox name="plan" value="pro">Pro</Radiobox>
</div>`}
      >
        <div
          style={toStyle(radioboxTokens)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <Radiobox name="dt-plan" value="free" defaultChecked>
              Free
            </Radiobox>
            <Radiobox name="dt-plan" value="pro">
              Pro
            </Radiobox>
            <Radiobox name="dt-plan" value="enterprise">
              Enterprise
            </Radiobox>
          </div>
          <Controls tokens={radioboxTokens} onChange={setRadioboxTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="Slider tokens"
        description="Slider geometry resolves through --slider-control-h, --slider-track-h and --slider-thumb-size."
        code={`<div style={{ "--slider-thumb-size": "1.5rem" }}>
  <Slider value={[40]} />
</div>`}
      >
        <div
          style={toStyle(sliderTokens)}
          className="flex w-full flex-col gap-6"
        >
          <Slider
            value={[sliderValue]}
            onValueChange={(v) =>
              setSliderValue(Array.isArray(v) ? Number(v[0]) : Number(v))
            }
          />
          <Controls tokens={sliderTokens} onChange={setSliderTokens} />
        </div>
      </ComponentDemo>

      <ComponentDemo
        title="File upload tokens"
        description="Dropzone geometry resolves through --file-upload-p, --file-upload-radius, --file-upload-thumb-size and friends."
        code={`<div style={{ "--file-upload-radius": "1rem" }}>
  <FileUpload onDrop={...} />
</div>`}
      >
        <div
          style={toStyle(fileUploadTokens)}
          className="flex w-full flex-col items-center gap-6"
        >
          <div className="flex w-full flex-col items-center gap-file-upload-gap rounded-file-upload-radius border-2 border-dashed border-input-border bg-card-background p-file-upload-p text-center">
            <span className="flex size-file-upload-thumb-size items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UploadIcon size={28} aria-hidden />
            </span>
            <strong className="text-file-upload-text-name">Drop files here</strong>
            <span className="text-file-upload-text-size text-muted-foreground">
              PNG, JPG or PDF up to 10 MB
            </span>
          </div>
          <Controls
            tokens={fileUploadTokens}
            onChange={setFileUploadTokens}
          />
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
    </div>
    </DocsLayout>
  );
}
