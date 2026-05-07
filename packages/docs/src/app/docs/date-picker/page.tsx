"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { useState } from "react";
import { Card, DatePicker } from "../../../../../lib/src";

export default function DatePickerPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

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
          <DatePicker
            name="birth-date"
            title="Birth date"
            placeholder="Select a date"
            required
          />
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
          <DatePicker
            name="check-in"
            title="Check-in date"
            floating={false}
            required
          />
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
