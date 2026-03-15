"use client";
import { Button } from "../../../../lib/src/components/core/button";
import { Input } from "../../../../lib/src/components/form/input";
import { Checkbox } from "../../../../lib/src/components/form/checkbox";
import { Alert } from "../../../../lib/src/components/display/alert";
import { Tag } from "../../../../lib/src/components/core/tag";
import { Progress } from "../../../../lib/src";

export const HeroDemo = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Cell 1: Buttons */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Buttons
        </span>
        <div className="flex flex-col gap-2">
          <Button theme="primary" size="small">
            Primary
          </Button>
          <Button theme="danger" size="small">
            Danger
          </Button>
          <Button theme="success" size="small">
            Success
          </Button>
        </div>
      </div>

      {/* Cell 2: Alerts */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Alerts
        </span>
        <Alert theme="info" title="System Update">
          New features are available.
        </Alert>
      </div>

      {/* Cell 3: Tags */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          <Tag theme="primary">React</Tag>
          <Tag theme="info">TypeScript</Tag>
          <Tag theme="secondary">Tailwind</Tag>
        </div>
      </div>

      {/* Cell 4: Inputs */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Inputs
        </span>
        <Input placeholder="Enter email..." />
        <Input defaultValue="John Doe" />
      </div>

      {/* Cell 5: Progress */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Progress
        </span>
        <Progress max={100} percent={25} />
        <Progress max={100} percent={60} />
        <Progress max={100} percent={85} />
      </div>

      {/* Cell 6: Form */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Form
        </span>
        <div className="flex flex-col gap-2">
          <Checkbox defaultChecked>Dark mode</Checkbox>
          <Checkbox>Notifications</Checkbox>
        </div>
      </div>
    </div>
  );
};
