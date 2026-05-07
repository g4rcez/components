"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Stats } from "../../../../../lib/src";
import {
  UsersIcon,
  CurrencyDollarIcon,
  ChartLineUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";

export default function StatsPage() {
  return (
    <DocsLayout
      title="Stats"
      section="display"
      description="A metric card that displays a statistic with an icon, title, value, and optional footer."
    >
      <ComponentDemo
        title="Basic Stat Card"
        description="Renders an icon, title, and a large numeric value."
        code={`import { Stats } from "@g4rcez/components";
import { UsersIcon } from "@phosphor-icons/react";

function BasicStat() {
  return (
    <Stats title="Total Users" Icon={UsersIcon}>
      1,284
    </Stats>
  );
}`}
      >
        <Card title="Basic">
          <Stats title="Total Users" Icon={UsersIcon}>
            1,284
          </Stats>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="With Footer"
        description="The footer prop renders below a divider for trend or context information."
        code={`import { Stats } from "@g4rcez/components";
import { CurrencyDollarIcon, ArrowUpIcon } from "@phosphor-icons/react";

function StatWithFooter() {
  return (
    <Stats
      title="Monthly Revenue"
      Icon={CurrencyDollarIcon}
      footer={
        <span className="flex items-center gap-1 text-success text-sm">
          <ArrowUpIcon size={14} />
          12% from last month
        </span>
      }
    >
      $48,200
    </Stats>
  );
}`}
      >
        <Card title="With footer">
          <Stats
            title="Monthly Revenue"
            Icon={CurrencyDollarIcon}
            footer={
              <span className="flex items-center gap-1 text-success text-sm">
                <ArrowUpIcon size={14} />
                12% from last month
              </span>
            }
          >
            $48,200
          </Stats>
        </Card>
      </ComponentDemo>

      <ComponentDemo
        title="Stats Grid"
        description="Multiple stat cards in a responsive grid layout."
        code={`import { Stats } from "@g4rcez/components";
import { UsersIcon, CurrencyDollarIcon, ChartLineUpIcon, ArrowUpIcon, ArrowDownIcon } from "@phosphor-icons/react";

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Stats
        title="Total Users"
        Icon={UsersIcon}
        footer={
          <span className="flex items-center gap-1 text-success text-sm">
            <ArrowUpIcon size={14} /> +24 this week
          </span>
        }
      >
        1,284
      </Stats>
      <Stats
        title="Revenue"
        Icon={CurrencyDollarIcon}
        footer={
          <span className="flex items-center gap-1 text-danger text-sm">
            <ArrowDownIcon size={14} /> -3% vs last month
          </span>
        }
      >
        $48,200
      </Stats>
      <Stats title="Growth" Icon={ChartLineUpIcon}>
        +18%
      </Stats>
    </div>
  );
}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stats
            title="Total Users"
            Icon={UsersIcon}
            footer={
              <span className="flex items-center gap-1 text-success text-sm">
                <ArrowUpIcon size={14} /> +24 this week
              </span>
            }
          >
            1,284
          </Stats>
          <Stats
            title="Revenue"
            Icon={CurrencyDollarIcon}
            footer={
              <span className="flex items-center gap-1 text-danger text-sm">
                <ArrowDownIcon size={14} /> -3% vs last month
              </span>
            }
          >
            $48,200
          </Stats>
          <Stats title="Growth" Icon={ChartLineUpIcon}>
            +18%
          </Stats>
        </div>
      </ComponentDemo>
    </DocsLayout>
  );
}
