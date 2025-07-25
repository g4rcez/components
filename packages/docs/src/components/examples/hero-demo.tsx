"use client";
import { useState } from "react";
import { Button } from "../../../../lib/src/components/core/button";
import { Card } from "../../../../lib/src/components/display/card";
import { Input } from "../../../../lib/src/components/form/input";
import { Select } from "../../../../lib/src/components/form/select";
import { Checkbox } from "../../../../lib/src/components/form/checkbox";
import { Alert } from "../../../../lib/src/components/display/alert";
import { Tag } from "../../../../lib/src/components/core/tag";
import { Modal } from "../../../../lib/src/components/floating/modal";
import {
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  VolumeXIcon,
  HeartIcon,
  ShareIcon,
} from "lucide-react";
import { negate, Progress } from "../../../../lib/src";

export const HeroDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-8 mx-auto max-w-6xl lg:grid-cols-2">
      <Card>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br from-blue-400 rounded-lg to-sky-600">
              <span className="text-xl font-bold text-white">♪</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Beautiful Components
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @g4rcez/components
              </p>
            </div>
            <Button
              size="icon"
              onClick={() => setLiked(negate)}
              theme={liked ? "danger" : "ghost-primary"}
              className={liked ? "text-red-500" : ""}
            >
              <HeartIcon className={`size-6 ${liked ? "fill-current" : ""}`} />
            </Button>
          </div>
          <div className="space-y-2">
            <Progress
              max={100}
              label="1:23"
              percent={36.89}
              textClassName="text-sm text-foreground"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1:23</span>
              <span>3:45</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <Button size="icon" theme="ghost-primary">
              <SkipForwardIcon className="w-4 h-4 rotate-180" />
            </Button>
            <Button
              size="icon"
              theme="primary"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </Button>
            <Button size="icon" theme="ghost-primary">
              <SkipForwardIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <Button size="icon" theme="ghost-primary">
              <VolumeXIcon className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              <Tag size="small" theme="primary">
                React
              </Tag>
              <Tag size="small" theme="success">
                TypeScript
              </Tag>
            </div>
            <Button size="icon" theme="ghost-primary">
              <ShareIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-4" title="Analytics Dashboard">
        <Alert theme="info" title="System Update">
          New features are now available in your dashboard.
        </Alert>
        <div className="flex gap-2">
          <Button
            size="small"
            theme="primary"
            onClick={() => setShowForm(true)}
          >
            Add Widget
          </Button>
          <Button size="small" theme="success">
            Deploy
          </Button>
          <Button size="small" theme="neutral">
            Cancel
          </Button>
        </div>
      </Card>

      {/* Form Modal */}
      <Modal
        open={showForm}
        onChange={setShowForm}
        title="Add New Widget"
        type="dialog"
      >
        <div className="space-y-4">
          <Input placeholder="Widget name" />
          <Select
            options={[
              { value: "chart", label: "Chart Widget" },
              { value: "metric", label: "Metric Widget" },
              { value: "table", label: "Table Widget" },
            ]}
            placeholder="Widget type"
          />
          <div className="space-y-2">
            <Checkbox>Show in sidebar</Checkbox>
            <Checkbox>Enable real-time updates</Checkbox>
          </div>
          <div className="flex gap-2 pt-4">
            <Button theme="primary" onClick={() => setShowForm(false)}>
              Create Widget
            </Button>
            <Button theme="neutral" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
