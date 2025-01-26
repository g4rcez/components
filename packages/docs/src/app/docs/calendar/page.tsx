"use client";
import { DocsLayout } from "@/components/docs-layout";
import { add, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
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
      <Card title="Calendar">
        <Calendar date={date} changeOnlyOnClick onChange={setDate} />
      </Card>
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
              {Array.isArray(dates[date.toISOString()]) ? (
                <ul>
                  {dates[date.toISOString()].map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
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
        {JSON.stringify(range)}
      </Card>
    </DocsLayout>
  );
}
