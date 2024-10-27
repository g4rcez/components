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
        <TaskList className="flex flex-row flex-wrap gap-8">
          <Checkbox asTask>Task 1</Checkbox>
          <Checkbox asTask>Task two</Checkbox>
          <Checkbox asTask>Another task</Checkbox>
          <Checkbox asTask>Coding</Checkbox>
          <Checkbox asTask>Drink coffee</Checkbox>
          <Checkbox asTask>Finish</Checkbox>
        </TaskList>
      </Card>
    </DocsLayout>
  );
}
