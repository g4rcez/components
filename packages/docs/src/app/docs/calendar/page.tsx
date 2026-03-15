"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { add, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Calendar, Card } from "../../../../../lib/src";

const d = startOfDay(new Date(1970, 0, 1));

const today = d.toISOString();

const to = add(today, { days: 5 });

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  weekday: "short",
  month: "short",
  year: "numeric",
};

const dates = {
  [today]: ["Study Typescript", "Start to learn Elixir", "CSS new features"],
  [to.toISOString()]: ["Go to the gym", "Learn about UX/UI"],
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(d);
  const [range, setRange] = useState({
    from: d as Date | undefined,
    to: to as Date | undefined,
  });
  return (
    <DocsLayout
      title="Calendar"
      section="form"
      description="Today is the day."
      className="flex flex-col gap-8"
    >
      <ComponentDemo
        title="Basic Calendar"
        description="A basic calendar for single date selection."
        code={`"use client";
import { useState } from "react";
import { Calendar } from "@g4rcez/components";
import { startOfDay } from "date-fns";

function BasicCalendar() {
  const [date, setDate] = useState<Date | undefined>(startOfDay(new Date()));
  return (
    <Calendar date={date} changeOnlyOnClick onChange={setDate} />
  );
}`}
      >
        <Card title="Calendar">
          <Calendar date={date} changeOnlyOnClick onChange={setDate} />
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Calendar with Events (Bookmark)"
        description="A calendar displaying events (bookmarked days) with a sidebar to show event details."
        code={`"use client";
import { useState } from "react";
import { Calendar } from "@g4rcez/components";
import { add, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "motion/react";

const d = startOfDay(new Date()); // Today
const todayISO = d.toISOString();
const futureDateISO = add(d, { days: 5 }).toISOString();

const eventDates = {
  [todayISO]: ["Study Typescript", "Start to learn Elixir"],
  [futureDateISO]: ["Go to the gym", "Learn about UX/UI"],
};

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  weekday: "short",
  month: "short",
  year: "numeric",
};

function CalendarWithBookmark() {
  const [date, setDate] = useState<Date | undefined>(d);
  return (
    <Card
      title="Calendar + Bookmark"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <Calendar
        date={date}
        changeOnlyOnClick
        onChange={setDate}
        onChangeYear={(d) => console.log("Year changed:", d.getFullYear())}
        onChangeMonth={(d) => {
          console.log("Month changed:", d.getMonth() + 1);
        }}
        styles={{
          week: "border-b border-card-border",
          weekDay:
            "h-16 border-b border-l first:border-l-transparent border-t border-card-border",
          dayFrame:
            "h-16 border-card-border border-l border-r first:border-l-transparent last:border-r-transparent",
        }}
        RenderOnDay={({ date }) =>
          date.toISOString() in eventDates ? (
            <div className="absolute right-0 top-0 aspect-square size-5 text-sm rounded-full bg-warn text-warn-foreground items-center justify-center flex">
              {eventDates[date.toISOString()].length}
            </div>
          ) : null
        }
      />
      <AnimatePresence>
        {date !== undefined && date.toISOString() in eventDates ? (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <header className="text-center pb-4 font-medium text-2xl">
              {date.toLocaleDateString(undefined, options)}
            </header>
            <ul className="list-disc list-inside">
              {eventDates[date.toISOString()].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </motion.div>
        ) : date !== undefined ? (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <header className="text-center pb-4 font-medium text-2xl">
              {date.toLocaleDateString(undefined, options)}
            </header>
            <p>No events for this day.</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}`}
      >
        <Card
          title="Calendar + Bookmark"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Calendar
            date={date}
            changeOnlyOnClick
            onChange={setDate}
            onChangeYear={console.warn}
            onChangeMonth={(d) => {
              const start = startOfMonth(d);
              const end = endOfMonth(d);
              console.log({ start, end });
            }}
            styles={{
              week: "border-b border-card-border",
              weekDay:
                "h-16 border-b border-l first:border-l-transparent border-t border-card-border",
              dayFrame:
                "h-16 border-card-border border-l border-r first:border-l-transparent last:border-r-transparent",
            }}
            RenderOnDay={({ date }) =>
              date.toISOString() in dates ? (
                <div className="absolute right-0 top-0 aspect-square size-5 text-sm rounded-full bg-warn text-warn-foreground items-center justify-center flex">
                  {dates[date.toISOString()].length}
                </div>
              ) : null
            }
          />
          <AnimatePresence>
            {date !== undefined ? (
              <motion.div className="w-full h-full">
                <header className="text-center pb-4 font-medium text-2xl">
                  {date.toLocaleDateString(undefined, options)}
                </header>
                {Array.isArray(dates[date.toISOString()]) && dates[date.toISOString()].length > 0 ? (
                  <ul>
                    {dates[date.toISOString()].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No events for this day.</p>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Range Calendar"
        description="A calendar configured for selecting a date range, with custom range labels."
        code={`"use client";
import { useState } from "react";
import { Calendar } from "@g4rcez/components";
import { add, startOfDay } from "date-fns";

function RangeCalendar() {
  const d = startOfDay(new Date());
  const to = add(d, { days: 5 });
  const [range, setRange] = useState({
    from: d as Date | undefined,
    to: to as Date | undefined,
  });
  return (
    <Card title="Range calendar" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Calendar
        markRange={true} // Mark range is usually true for range calendars
        rangeMode
        range={range}
        changeOnlyOnClick
        onChange={setRange as any}
        labelRange={{ from: "Start", to: "End" }}
        styles={{
          week: "border-b border-card-border",
          weekDay: "h-16 border-b border-card-border",
          dayFrame:
            "h-16 border-card-border border-l border-r first:border-l-transparent last:border-r-transparent",
        }}
        RenderOnDay={({ date }) =>
          date.toISOString() in eventDates ? ( // Assuming eventDates is available
            <div className="absolute right-1 bottom-1 aspect-square size-5 text-sm rounded-full bg-warn text-warn-foreground items-center justify-center flex">
              {eventDates[date.toISOString()].length}
            </div>
          ) : null
        }
      />
      <div className="flex flex-col gap-2">
        <p>Selected From: {range.from?.toLocaleDateString()}</p>
        <p>Selected To: {range.to?.toLocaleDateString()}</p>
      </div>
    </Card>
  );
}`}
      >
        <Card
          title="Range calendar"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Calendar
            markRange={false}
            rangeMode
            range={range}
            changeOnlyOnClick
            onChange={setRange as any}
            labelRange={{ from: "Início", to: "Fim" }}
            styles={{
              week: "border-b border-card-border",
              weekDay: "h-16 border-b border-card-border",
              dayFrame:
                "h-16 border-card-border border-l border-r first:border-l-transparent last:border-r-transparent",
            }}
            RenderOnDay={({ date }) =>
              date.toISOString() in dates ? (
                <div className="absolute right-1 bottom-1 aspect-square size-5 text-sm rounded-full bg-warn text-warn-foreground items-center justify-center flex">
                  {dates[date.toISOString()].length}
                </div>
              ) : null
            }
          />
          <div className="flex flex-col gap-2">
            <p>Selected From: {range.from?.toLocaleDateString()}</p>
            <p>Selected To: {range.to?.toLocaleDateString()}</p>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
