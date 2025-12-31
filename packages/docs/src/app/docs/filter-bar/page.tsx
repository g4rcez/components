"use client";
import { DocsLayout } from "@/components/docs-layout";
import {
  Button,
  DatePicker,
  Card,
  Input,
  Tooltip,
  Tag,
} from "../../../../../lib/src";
import { FilterIcon } from "lucide-react";

export default function Buttons() {
  return (
    <DocsLayout
      title="Buttons"
      section="display"
      description="The way to user interact with your actions"
    >
      <div className="flex flex-col gap-8">
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
      </div>
    </DocsLayout>
  );
}
