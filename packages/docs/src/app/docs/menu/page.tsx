"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React from "react";
import { Button, Card, Menu, MenuItem } from "../../../../../lib/src";

export default function MenuPage() {
  return (
    <DocsLayout
      title="Menu"
      section="floating"
      description="Create context menus, dropdowns, and nested navigation with ease."
    >
      <ComponentDemo
        title="Simple and Nested Menus"
        description="Demonstrates basic menu functionality, including nesting and a menu that doesn't open on hover."
        code={`"use client";
import { Button, Card, Menu, MenuItem } from "@g4rcez/components";

function SimpleNestedMenu() {
  return (
    <div className="flex flex-wrap gap-8">
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
        <MenuItem title="Menu Item X" children="Item 4" />
        <MenuItem title="Menu Item X" children="Item 5" />
        <MenuItem title="Menu Item X" children="Item 6" />
        <MenuItem title="Menu Item X" children="Item 7" />
        <MenuItem title="Menu Item X" children="Item 8" />
        <MenuItem title="Menu Item X" children="Item 9" />
        <MenuItem title="Menu Item X" children="Item 10" />
      </Menu>
      <Menu label="I'm a menu without hover" hover={false}>
        <MenuItem title="Menu Item X" children="Item 1" />
        <MenuItem title="Menu Item X" children="Item 2" />
        <MenuItem title="Menu Item X" children="Item 3" />
        <Menu label="Deep menu">
          <MenuItem title="Menu Item X" children="Last node" />
        </Menu>
      </Menu>
    </div>
  );
}`}
      >
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
            <MenuItem title="Menu Item X" children="Item 4" />
            <MenuItem title="Menu Item X" children="Item 5" />
            <MenuItem title="Menu Item X" children="Item 6" />
            <MenuItem title="Menu Item X" children="Item 7" />
            <MenuItem title="Menu Item X" children="Item 8" />
            <MenuItem title="Menu Item X" children="Item 9" />
            <MenuItem title="Menu Item X" children="Item 10" />
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
      </ComponentDemo>
      <ComponentDemo
        title="Custom Trigger and Item Styling"
        description="Illustrates how to use a custom component as the menu trigger and apply custom styling to individual menu items."
        code={`"use client";
import { Button, Menu, MenuItem } from "@g4rcez/components";

function CustomMenuStyling() {
  return (
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
  );
}`}
      >
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
      </ComponentDemo>
    </DocsLayout>
  );
}
