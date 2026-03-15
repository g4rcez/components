"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, Checkbox, TaskList } from "../../../../../lib/src";

export default function CheckboxPage() {
  return (
    <DocsLayout
      title="Checkbox"
      section="form"
      description="Use this component for task lists or multiple options in a form."
    >
      <ComponentDemo
        title="Checkbox as Task Item"
        description="Demonstrates a task list where checkboxes have a strikethrough effect when checked."
        code={`"use client";
import { Checkbox, TaskList } from "@g4rcez/components";

function TaskCheckboxes() {
  return (
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
  );
}`}
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
      </ComponentDemo>
    </DocsLayout>
  );
}
