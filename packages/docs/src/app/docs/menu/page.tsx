"use client";
import { DocsLayout } from "@/components/docs-layout";
import React from "react";
import { Button, Card, Menu, MenuItem } from "../../../../../lib/src";

export default function MenuExample() {
  return (
    <DocsLayout
      title="Menu"
      section="floating"
      description="Create a menu, like right-click, but using an custom layout"
    >
      <div className="flex flex-col gap-8">
        <Card title="Simple menu" className="flex gap-8">
          <Menu label="I'm a menu">
            <MenuItem title="Menu Item X" children="Item 1" />
            <Menu label="Submenu">
              <MenuItem title="Menu Item X" children="Sub item 2" />
              <MenuItem title="Menu Item X" children="Sub item 3" />
              <Menu label="Deep menu">
                <MenuItem title="Menu Item X" children="Last node" />
              </Menu>
            </Menu>
            <MenuItem title="Menu Item X" children="Item 2" />
            <MenuItem title="Menu Item X" children="Item 3" />
          </Menu>
          <Menu label="I'm a menu without hover" hover={false}>
            <MenuItem title="Menu Item X" children="Item 1" />
            <MenuItem title="Menu Item X" children="Item 2" />
            <MenuItem title="Menu Item X" children="Item 3" />
            <Menu label="Deep menu">
              <MenuItem title="Menu Item X" children="Last node" />
            </Menu>
          </Menu>
        </Card>
        <Card title="Custom component item">
          <Menu title="I'm a menu" label={<Button>I'm a menu</Button>} asChild>
            <MenuItem
              title="OK"
              className="focus:bg-danger hover:bg-danger hover:text-danger-foreground"
            >
              Danger Custom
            </MenuItem>
            <MenuItem
              title="OK"
              className="focus:bg-success hover:bg-success hover:text-success-foreground"
            >
              Success custom
            </MenuItem>
            <MenuItem
              title="OK"
              className="focus:bg-info hover:bg-info hover:text-info-foreground"
            >
              Info custom
            </MenuItem>
          </Menu>
        </Card>
      </div>
    </DocsLayout>
  );
}

const a = <img alt="" />;
