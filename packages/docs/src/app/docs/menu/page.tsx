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
            <MenuItem label="Item 1" />
            <Menu label="Submenu">
              <MenuItem label="Sub item 2" />
              <MenuItem label="Sub item 3" />
              <Menu label="Deep menu">
                <MenuItem label="Last node" />
              </Menu>
            </Menu>
            <MenuItem label="Item 2" />
            <MenuItem label="Item 3" />
          </Menu>
          <Menu label="I'm a menu without hover" hover={false}>
            <MenuItem label="Item 1" />
            <MenuItem label="Item 2" />
            <MenuItem label="Item 3" />
            <Menu label="Deep menu">
              <MenuItem label="Last node" />
            </Menu>
          </Menu>
        </Card>
        <Card title="Custom component item">
          <Menu title="I'm a menu" label={<Button>I'm a menu</Button>}>
            <MenuItem className="focus:bg-danger hover:bg-danger hover:text-danger-foreground" title="OK" label={<span>Danger custom</span>} />
            <MenuItem className="focus:bg-success hover:bg-success hover:text-success-foreground" title="OK" label={<span>Success custom</span>} />
            <MenuItem className="focus:bg-info hover:bg-info hover:text-info-foreground" title="OK" label={<span>Info custom</span>} />
          </Menu>
        </Card>
      </div>
    </DocsLayout>
  );
}
