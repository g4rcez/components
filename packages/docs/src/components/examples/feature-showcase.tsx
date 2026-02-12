"use client";
import { useState } from "react";
import { Button } from "../../../../lib/src/components/core/button";
import { Card } from "../../../../lib/src/components/display/card";
import { Input } from "../../../../lib/src/components/form/input";
import { Checkbox } from "../../../../lib/src/components/form/checkbox";
import { Tag } from "../../../../lib/src/components/core/tag";
import { Alert } from "../../../../lib/src/components/display/alert";
import { CheckIcon, StarIcon } from "lucide-react";
import { TaskList } from "../../../../lib/src";

export const FeatureShowcase = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Design system setup", completed: true },
    { id: 2, text: "Component documentation", completed: true },
    { id: 3, text: "Accessibility testing", completed: false },
    { id: 4, text: "Performance optimization", completed: false },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Deployment successful",
      message: "Your changes are now live",
      time: "2m ago",
    },
    {
      id: 2,
      type: "warn",
      title: "High memory usage",
      message: "Consider optimizing your queries",
      time: "5m ago",
    },
    {
      id: 3,
      type: "info",
      title: "New team member",
      message: "Sarah joined your workspace",
      time: "1h ago",
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card title="Task Management">
        <TaskList>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex gap-3 items-center p-2 rounded-lg transition-colors hover:bg-primary/10"
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                asTask
              >
                <span
                  className={
                    task.completed ? "decoration-muted text-muted" : ""
                  }
                >
                  {task.text}
                </span>
              </Checkbox>
            </div>
          ))}
        </TaskList>
        <div className="pt-3 border-t border-card-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">
              {tasks.filter((t) => t.completed).length}/{tasks.length}
            </span>
          </div>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-300"
              style={{
                width: `${(tasks.filter((t) => t.completed).length / tasks.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              theme={notification.type as any}
              title={notification.title}
              onClose={() => dismissNotification(notification.id)}
              className="text-sm"
            >
              <div className="flex justify-between items-center">
                <span>{notification.message}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {notification.time}
                </span>
              </div>
            </Alert>
          ))}
          {notifications.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <CheckIcon className="mx-auto mb-2 w-8 h-8 text-green-500" />
              <p>All caught up!</p>
            </div>
          )}
        </div>
      </Card>
      <Card title="User Profile" className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex justify-center items-center w-12 h-12 font-semibold text-white bg-linear-to-br from-blue-500 to-purple-500 rounded-full">
              JD
            </div>
            <div>
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Frontend Developer
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Input placeholder="Update status..." />
            <div className="flex flex-wrap gap-2">
              <Tag theme="primary" size="small">
                React
              </Tag>
              <Tag theme="success" size="small">
                TypeScript
              </Tag>
              <Tag theme="info" size="small">
                Design
              </Tag>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border">
            <div className="text-center">
              <div className="text-xl font-bold">127</div>
              <div className="text-xs">Commits</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">23</div>
              <div className="text-xs">PRs</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="small" theme="primary" className="flex-1">
              <StarIcon className="mr-1 w-4 h-4" />
              Follow
            </Button>
            <Button size="small" theme="neutral" className="flex-1">
              Message
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
