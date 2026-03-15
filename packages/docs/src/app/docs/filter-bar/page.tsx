"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import {
  Button,
  DatePicker,
  Card,
  Input,
  Tooltip,
  Tag,
} from "../../../../../lib/src";
import { FilterIcon } from "lucide-react";

export default function FilterBarPage() {
  return (
    <DocsLayout
      title="Filter Bar"
      section="display"
      description="A flexible filter bar component to refine data displays."
    >
      <ComponentDemo
        title="Interactive Filter Bar"
        description="Demonstrates a filter bar with an input search, a date picker, and a text input, each with tooltips for enhanced usability."
        code={`"use client";
import { Button, DatePicker, Input, Tooltip, Tag } from "@g4rcez/components";
import { FilterIcon } from "lucide-react";

function InteractiveFilterBar() {
  return (
    <div className="flex flex-nowrap gap-4 items-end">
      <Input
        required
        className="[--input-height:32px]"
        placeholder="Text..."
        title="Search everywhere..."
      />
      <Tooltip
        hover={false}
        placement="bottom"
        title={
          <Tag className="cursor-pointer" as="button" type="button">
            Date
          </Tag>
        }
      >
        <div className="flex flex-col gap-4">
          <DatePicker
            floating={false}
            required
            placeholder="Today"
            title="Date"
          />
        </div>
      </Tooltip>
      <Tooltip
        hover={false}
        placement="bottom"
        title={
          <Tag className="cursor-pointer" as="button" type="button">
            Text
          </Tag>
        }
      >
        <Input
          required
          placeholder="Text..."
          title="Search everywhere..."
        />
      </Tooltip>
      <Button size="small">
        <FilterIcon />
      </Button>
    </div>
  );
}`}
      >
        <Card>
          <div className="flex flex-nowrap gap-4 items-end">
            <Input
              required
              className="[--input-height:32px]"
              placeholder="Text..."
              title="Search everywhere..."
            />
            <Tooltip
              hover={false}
              placement="bottom"
              title={
                <Tag className="cursor-pointer" as="button" type="button">
                  Date
                </Tag>
              }
            >
              <div className="flex flex-col gap-4">
                <DatePicker
                  floating={false}
                  required
                  placeholder="Today"
                  title="Date"
                />
              </div>
            </Tooltip>
            <Tooltip
              hover={false}
              placement="bottom"
              title={
                <Tag className="cursor-pointer" as="button" type="button">
                  Text
                </Tag>
              }
            >
              <Input
                required
                placeholder="Text..."
                title="Search everywhere..."
              />
            </Tooltip>
            <Button size="small">
              <FilterIcon />
            </Button>
          </div>
        </Card>
      </ComponentDemo>
    </DocsLayout>
  );
}
