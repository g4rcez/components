"use client";
import { DocsLayout } from "@/components/docs-layout";
import {
  PageCalendar,
  type CalendarEvent,
  type CalendarFilter,
} from "../../../../../lib/src";
import { useState } from "react";

const d = (daysOffset: number, hour = 10): Date => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team standup",
    date: d(0, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "2",
    title: "Design review",
    date: d(0, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "3",
    title: "Sprint planning",
    date: d(1, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "4",
    title: "1:1 with manager",
    date: d(2, 11),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "5",
    title: "Deploy to production",
    date: d(3, 15),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "6",
    title: "Retrospective",
    date: d(4, 16),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "7",
    title: "Quarterly review",
    date: d(7, 13),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "8",
    title: "Onboarding session",
    date: d(-1, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
];

const mockFilters: CalendarFilter[] = [
  { id: "meeting", label: "Meetings", theme: "info", enabled: true },
  { id: "review", label: "Reviews", theme: "secondary", enabled: true },
  { id: "deploy", label: "Deploys", theme: "warn", enabled: true },
];

export default function PageCalendarDocsPage() {
  const [filters, setFilters] = useState(mockFilters);
  return (
    <DocsLayout
      section="display"
      title="Page Calendar"
      className="flex flex-col gap-0 h-[700px]"
      description="A full-page calendar with month, week, and day views."
    >
      <PageCalendar
        filters={filters}
        events={mockEvents}
        onChangeFilters={setFilters}
        onAddEvent={() => console.log("Add event")}
        onSlotClick={(d) => console.log("Slot clicked:", d)}
        onEventClick={(e) => console.log("Event clicked:", e)}
      />
    </DocsLayout>
  );
}
