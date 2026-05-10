"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { Card, TaskList } from "../../../../../lib/src";

export default function TaskListPage() {
    return (
        <DocsLayout
            title="TaskList"
            section="form"
            description="A fieldset wrapper for checkbox task items that animates all sibling checkboxes when every task is completed."
        >
            <ComponentDemo
                title="Basic Task List"
                description="Wrap checkboxes with data-task inside TaskList to enable the completion animation."
                code={`import { TaskList } from "@g4rcez/components";

function BasicTaskList() {
  return (
    <TaskList className="flex flex-col gap-3">
      <label className="flex items-center gap-2">
        <input type="checkbox" data-task={true} className="rounded" />
        Write unit tests
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" data-task={true} className="rounded" />
        Review pull request
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" data-task={true} className="rounded" />
        Deploy to staging
      </label>
    </TaskList>
  );
}`}
            >
                <Card title="Basic">
                    <TaskList className="flex flex-col gap-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" data-task={true} className="rounded" />
                            Write unit tests
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" data-task={true} className="rounded" />
                            Review pull request
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" data-task={true} className="rounded" />
                            Deploy to staging
                        </label>
                    </TaskList>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Sprint Checklist"
                description="Complete all tasks to trigger the celebration animation on every checkbox."
                code={`import { TaskList } from "@g4rcez/components";

function SprintChecklist() {
  const tasks = [
    "Define acceptance criteria",
    "Implement feature",
    "Write Playwright tests",
    "Open pull request",
    "Get approval",
    "Merge to main",
  ];
  return (
    <TaskList className="flex flex-col gap-2">
      <legend className="text-sm font-semibold mb-2">Sprint tasks</legend>
      {tasks.map((task) => (
        <label key={task} className="flex items-center gap-2 text-sm">
          <input type="checkbox" data-task={true} />
          {task}
        </label>
      ))}
    </TaskList>
  );
}`}
            >
                <Card title="Sprint checklist">
                    <TaskList className="flex flex-col gap-2">
                        <legend className="mb-2 text-sm font-semibold">Sprint tasks</legend>
                        {[
                            "Define acceptance criteria",
                            "Implement feature",
                            "Write Playwright tests",
                            "Open pull request",
                            "Get approval",
                            "Merge to main",
                        ].map((task) => (
                            <label key={task} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" data-task={true} />
                                {task}
                            </label>
                        ))}
                    </TaskList>
                </Card>
            </ComponentDemo>

            <ComponentDemo
                title="Pre-checked Items"
                description="Mix checked and unchecked tasks. The animation fires only when ALL data-task items become checked."
                code={`import { TaskList } from "@g4rcez/components";

function MixedTasks() {
  return (
    <TaskList className="flex flex-col gap-3">
      <label className="flex items-center gap-2">
        <input type="checkbox" data-task={true} defaultChecked />
        <span className="line-through text-secondary">Completed task</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" data-task={true} />
        Pending task
      </label>
    </TaskList>
  );
}`}
            >
                <Card title="Mixed state">
                    <TaskList className="flex flex-col gap-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" data-task={true} defaultChecked />
                            <span className="text-secondary line-through">Completed task</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" data-task={true} />
                            Pending task
                        </label>
                    </TaskList>
                </Card>
            </ComponentDemo>
        </DocsLayout>
    );
}
