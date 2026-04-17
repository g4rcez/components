"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
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
  // --- Same exact time: today at 10:00 (3 events to test overlap) ---
  {
    id: "overlap-1",
    title: "Architecture sync",
    date: d(0, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "overlap-2",
    title: "API design review",
    date: d(0, 10),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "overlap-3",
    title: "Hotfix deploy",
    date: d(0, 10),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "overlap-4",
    title: "Urgent interview",
    date: d(0, 10),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },

  // --- Past events (-30 to -1) ---
  {
    id: "p1",
    title: "Kickoff meeting",
    date: d(-30, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p2",
    title: "Q1 retrospective",
    date: d(-29, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p3",
    title: "Infra deploy",
    date: d(-28, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p4",
    title: "Frontend interview",
    date: d(-27, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p5",
    title: "Roadmap planning",
    date: d(-26, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p6",
    title: "UX audit",
    date: d(-25, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p7",
    title: "Database migration",
    date: d(-24, 8),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p8",
    title: "Backend interview",
    date: d(-23, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p9",
    title: "Sprint kickoff",
    date: d(-22, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p10",
    title: "Performance review",
    date: d(-21, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p11",
    title: "Staging deploy",
    date: d(-20, 17),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p12",
    title: "Product interview",
    date: d(-19, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p13",
    title: "All-hands meeting",
    date: d(-18, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p14",
    title: "Security audit",
    date: d(-17, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p15",
    title: "CDN update",
    date: d(-16, 7),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p16",
    title: "Design interview",
    date: d(-15, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p17",
    title: "1:1 with CEO",
    date: d(-14, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p18",
    title: "Accessibility review",
    date: d(-13, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p19",
    title: "Canary deploy",
    date: d(-12, 18),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p20",
    title: "Staff eng interview",
    date: d(-11, 10),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p21",
    title: "Engineering sync",
    date: d(-10, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p22",
    title: "API contract review",
    date: d(-9, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p23",
    title: "Patch release",
    date: d(-8, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p24",
    title: "Data eng interview",
    date: d(-7, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p25",
    title: "Product sync",
    date: d(-6, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p26",
    title: "Code review session",
    date: d(-5, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "p27",
    title: "Feature flag rollout",
    date: d(-4, 17),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "p28",
    title: "ML eng interview",
    date: d(-3, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "p29",
    title: "Team standup",
    date: d(-2, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "p30",
    title: "Sprint review",
    date: d(-1, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },

  // --- Today's other events ---
  {
    id: "t1",
    title: "Daily standup",
    date: d(0, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "t2",
    title: "Design review",
    date: d(0, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "t3",
    title: "Minor patch deploy",
    date: d(0, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "t4",
    title: "SRE interview",
    date: d(0, 15),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },

  // --- Future events (+1 to +70) ---
  {
    id: "f1",
    title: "Sprint planning",
    date: d(1, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f2",
    title: "Component library review",
    date: d(1, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f3",
    title: "Blue-green deploy",
    date: d(2, 17),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f4",
    title: "Platform interview",
    date: d(2, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f5",
    title: "1:1 with manager",
    date: d(3, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f6",
    title: "DB schema review",
    date: d(3, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f7",
    title: "Deploy to production",
    date: d(4, 15),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f8",
    title: "Fullstack interview",
    date: d(4, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f9",
    title: "Retrospective",
    date: d(5, 16),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f10",
    title: "Perf budget review",
    date: d(5, 10),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f11",
    title: "Auth service deploy",
    date: d(6, 8),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f12",
    title: "DevOps interview",
    date: d(6, 14),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f13",
    title: "Leadership sync",
    date: d(7, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f14",
    title: "Quarterly review",
    date: d(7, 13),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f15",
    title: "Rollback drill",
    date: d(8, 15),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f16",
    title: "Android interview",
    date: d(8, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f17",
    title: "Stakeholder meeting",
    date: d(9, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f18",
    title: "Test plan review",
    date: d(9, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f19",
    title: "K8s upgrade",
    date: d(10, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f20",
    title: "iOS interview",
    date: d(10, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f21",
    title: "Roadmap review",
    date: d(11, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f22",
    title: "Infra cost review",
    date: d(11, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f23",
    title: "Search svc deploy",
    date: d(12, 7),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f24",
    title: "QA lead interview",
    date: d(12, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f25",
    title: "Engineering all-hands",
    date: d(13, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f26",
    title: "Monitoring review",
    date: d(14, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f27",
    title: "Payment svc deploy",
    date: d(14, 18),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f28",
    title: "Cloud interview",
    date: d(15, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f29",
    title: "Design sprint",
    date: d(15, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f30",
    title: "API changelog review",
    date: d(16, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f31",
    title: "Notification svc deploy",
    date: d(17, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f32",
    title: "Security eng interview",
    date: d(17, 10),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f33",
    title: "Cross-team sync",
    date: d(18, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f34",
    title: "Privacy review",
    date: d(18, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f35",
    title: "Gateway deploy",
    date: d(19, 8),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f36",
    title: "Growth interview",
    date: d(19, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f37",
    title: "Product planning",
    date: d(20, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f38",
    title: "Dependency audit",
    date: d(21, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f39",
    title: "Messaging svc deploy",
    date: d(21, 17),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f40",
    title: "Analytics interview",
    date: d(22, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f41",
    title: "OKR check-in",
    date: d(22, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f42",
    title: "Load test review",
    date: d(23, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f43",
    title: "Storage svc deploy",
    date: d(24, 7),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f44",
    title: "Principal eng interview",
    date: d(24, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f45",
    title: "Customer success sync",
    date: d(25, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f46",
    title: "Release notes review",
    date: d(25, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f47",
    title: "Scheduler svc deploy",
    date: d(26, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f48",
    title: "Data scientist interview",
    date: d(26, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f49",
    title: "Sales engineering sync",
    date: d(27, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f50",
    title: "Changelog review",
    date: d(28, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f51",
    title: "ML pipeline deploy",
    date: d(28, 18),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f52",
    title: "DBA interview",
    date: d(29, 10),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f53",
    title: "Quarterly sync",
    date: d(30, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f54",
    title: "Incident postmortem",
    date: d(31, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f55",
    title: "Reporting svc deploy",
    date: d(32, 15),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f56",
    title: "CTO interview",
    date: d(33, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f57",
    title: "Partner sync",
    date: d(34, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f58",
    title: "E2E test review",
    date: d(35, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f59",
    title: "Billing svc deploy",
    date: d(35, 16),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f60",
    title: "VP interview",
    date: d(36, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f61",
    title: "Exec sync",
    date: d(37, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f62",
    title: "Mobile review",
    date: d(38, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f63",
    title: "Recommendation deploy",
    date: d(39, 8),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f64",
    title: "Head of design interview",
    date: d(40, 11),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f65",
    title: "Finance sync",
    date: d(41, 10),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f66",
    title: "SLA review",
    date: d(42, 14),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "f67",
    title: "ETL pipeline deploy",
    date: d(43, 17),
    filterId: "deploy",
    className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  },
  {
    id: "f68",
    title: "Staff interview",
    date: d(44, 13),
    filterId: "interview",
    className: "bg-green-500/20 text-green-700 dark:text-green-300",
  },
  {
    id: "f69",
    title: "Board prep sync",
    date: d(45, 9),
    filterId: "meeting",
    className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "f70",
    title: "Compliance review",
    date: d(46, 15),
    filterId: "review",
    className: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  },
];

const mockFilters: CalendarFilter[] = [
  { id: "meeting", label: "Meetings", theme: "info", enabled: true },
  { id: "review", label: "Reviews", theme: "secondary", enabled: true },
  { id: "deploy", label: "Deploys", theme: "warn", enabled: true },
  { id: "interview", label: "Interviews", theme: "success", enabled: true },
];

export default function PageCalendarDocsPage() {
  const [filters, setFilters] = useState(mockFilters);
  return (
    <DocsLayout
      section="display"
      title="Page Calendar"
      className="flex flex-col gap-0 h-[700px]"
      description="A full-page calendar with month, week, and day views, event filtering, and custom event rendering."
    >
      <ComponentDemo
        title="Page Calendar Demo"
        description="A full-page calendar showcasing month, week, and day views with events, filters, and interactive callbacks."
        code={`"use client";
import { useState } from "react";
import { PageCalendar, type CalendarEvent, type CalendarFilter } from "@g4rcez/components";

const d = (daysOffset: number, hour = 10): Date => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
};

// Three events at the exact same time to test overlap rendering
const mockEvents: CalendarEvent[] = [
  { id: "overlap-1", title: "Architecture sync", date: d(0, 10), filterId: "meeting" },
  { id: "overlap-2", title: "API design review", date: d(0, 10), filterId: "review" },
  { id: "overlap-3", title: "Hotfix deploy",     date: d(0, 10), filterId: "deploy" },
  { id: "overlap-4", title: "Urgent interview",  date: d(0, 10), filterId: "interview" },
  // ...100+ more events spread across -30 to +46 days
];

const mockFilters: CalendarFilter[] = [
  { id: "meeting",   label: "Meetings",   theme: "info",      enabled: true },
  { id: "review",    label: "Reviews",    theme: "secondary", enabled: true },
  { id: "deploy",    label: "Deploys",    theme: "warn",      enabled: true },
  { id: "interview", label: "Interviews", theme: "success",   enabled: true },
];

function PageCalendarDemo() {
  const [filters, setFilters] = useState(mockFilters);
  return (
    <PageCalendar
      filters={filters}
      events={mockEvents}
      onChangeFilters={setFilters}
      onAddEvent={() => console.log("Add event")}
      onSlotClick={(d) => console.log("Slot clicked:", d)}
      onEventClick={(e) => console.log("Event clicked:", e)}
    />
  );
}`}
      >
        <PageCalendar
          filters={filters}
          events={mockEvents}
          onChangeFilters={setFilters}
          onAddEvent={() => console.log("Add event")}
          onSlotClick={(d) => console.log("Slot clicked:", d)}
          onEventClick={(e) => console.log("Event clicked:", e)}
        />
      </ComponentDemo>
    </DocsLayout>
  );
}
