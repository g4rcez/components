"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card, DatePicker, type DateRangeValue } from "@g4rcez/components";
import { endOfWeek, startOfWeek } from "date-fns";

const subDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() - days);
    return next;
};

export default function DatePickerPage() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [range, setRange] = useState<DateRangeValue | null>(null);
    const [customRange, setCustomRange] = useState<DateRangeValue | null>(null);

    return (
        <DocsLayout
            title="Date Picker"
            section="form"
            description="A locale-aware date input with an optional floating calendar, mask input, and native date form value."
        >
            <ComponentDemo
                title="Basic Date Picker"
                description="Renders a masked text input with a calendar dropdown trigger. Submits a hidden ISO date value."
                code={`"use client";
import { DatePicker } from "@g4rcez/components";

function BasicDatePicker() {
  return (
    <DatePicker
      name="birth-date"
      title="Birth date"
      placeholder="Select a date"
      required
    />
  );
}`}
            >
                <Card title="Basic">
                    <DatePicker name="birth-date" title="Birth date" placeholder="Select a date" required />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Controlled Value"
                description="Pass date and onChange to control the selected date externally."
                code={`"use client";
import { useState } from "react";
import { DatePicker } from "@g4rcez/components";

function ControlledDatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        name="event-date"
        title="Event date"
        date={date}
        onChange={setDate}
        clickToClose
        required
      />
      {date && (
        <p className="text-sm text-secondary">
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}`}
            >
                <Card title="Controlled">
                    <div className="flex flex-col gap-2">
                        <DatePicker name="event-date" title="Event date" date={date} onChange={setDate} clickToClose required />
                        {date && <p className="text-sm text-secondary">Selected: {date.toLocaleDateString()}</p>}
                    </div>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Date Range Picker"
                description="Pass range to enable range mode with the preset menu, staged calendar selection, and Apply/Cancel actions."
                code={`"use client";
import { useState } from "react";
import { DatePicker, type DateRangeValue } from "@g4rcez/components";

function RangeDatePicker() {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <DatePicker
      name="report-period"
      title="Report period"
      range={range}
      onChange={(next) => setRange(next as DateRangeValue)}
    />
  );
}`}
            >
                <Card title="Range">
                    <DatePicker
                        range={range}
                        name="report-period"
                        title="Report period"
                        onChange={(next: Date | DateRangeValue | undefined) => setRange(next as DateRangeValue)}
                    />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Localized Range Picker"
                description="Override rangeLabels for non-English preset-list, action, and Today labels."
                code={`"use client";
import { DatePicker } from "@g4rcez/components";

function LocalizedDatePicker() {
  return (
    <DatePicker
      name="periodo"
      title="Período"
      range={{}}
      rangeLabels={{
        searchPlaceholder: "Atalhos de período",
        today: "Hoje",
        cancel: "Cancelar",
        apply: "Aplicar",
      }}
    />
  );
}`}
            >
                <Card title="Localized">
                    <DatePicker
                        name="periodo"
                        title="Período"
                        range={{}}
                        rangeLabels={{
                            searchPlaceholder: "Atalhos de período",
                            today: "Hoje",
                            cancel: "Cancelar",
                            apply: "Aplicar",
                        }}
                    />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Custom Presets"
                description="Provide rangePresets to replace the default menu with product-specific date shortcuts."
                code={`"use client";
import { useState } from "react";
import { DatePicker, type DateRangeValue } from "@g4rcez/components";

const subDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return next;
};

function CustomPresetDatePicker() {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <DatePicker
      name="analytics-window"
      title="Analytics window"
      range={range}
      onChange={(next) => setRange(next as DateRangeValue)}
      rangePresets={[
        { label: "Last 14 days", range: (today) => ({ from: subDays(today, 13), to: today }) },
        { label: "Last 90 days", range: (today) => ({ from: subDays(today, 89), to: today }) },
        { label: "Launch week", range: { from: new Date(2026, 6, 1), to: new Date(2026, 6, 7) } },
      ]}
    />
  );
}`}
            >
                <Card title="Custom presets">
                    <DatePicker
                        name="analytics-window"
                        title="Analytics window"
                        range={customRange}
                        onChange={(next: Date | DateRangeValue | undefined) => setCustomRange(next as DateRangeValue)}
                        rangePresets={[
                            { label: "Last 14 days", range: (today) => ({ from: subDays(today, 13), to: today }) },
                            { label: "Last 90 days", range: (today) => ({ from: subDays(today, 89), to: today }) },
                            { label: "Launch week", range: (today) => ({ from: startOfWeek(today), to: endOfWeek(today) }) },
                        ]}
                    />
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Inline Calendar"
                description="Set floating=false to render the calendar inline instead of in a dropdown."
                code={`"use client";
import { DatePicker } from "@g4rcez/components";

function InlineDatePicker() {
  return (
    <DatePicker
      name="check-in"
      title="Check-in date"
      floating={false}
      required
    />
  );
}`}
            >
                <Card title="Inline">
                    <DatePicker name="check-in" title="Check-in date" floating={false} required />
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
