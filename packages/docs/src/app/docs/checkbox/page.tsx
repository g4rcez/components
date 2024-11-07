"use client";
import { DocsLayout } from "@/components/docs-layout";
import { Card, Checkbox, TaskList } from "../../../../../lib/src";

export default function CheckboxPage() {
  return (
    <DocsLayout
      title="Checkbox"
      section="form"
      description="Do you have a task list or a multiple options to fill in a form? Use this component"
    >
      <Card title="Checkbox as task item">
        <TaskList>
          <ul className="flex flex-col flex-wrap gap-2">
            <li>
              <Checkbox asTask>Task 1</Checkbox>
            </li>
            <li>
              <Checkbox asTask>Task two</Checkbox>
            </li>
            <li>
              <Checkbox asTask>Another task</Checkbox>
            </li>
            <li>
              <Checkbox asTask>Coding</Checkbox>
            </li>
            <li>
              <Checkbox asTask>Drink coffee</Checkbox>
            </li>
            <li>
              <Checkbox asTask>Finish</Checkbox>
            </li>
          </ul>
        </TaskList>
      </Card>
    </DocsLayout>
  );
}
