"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import React, { Fragment, useState } from "react";
import { Autocomplete, Button, DatePicker, Modal, Tooltip, uuid } from "../../../../../lib/src";

const ItemContent = () => (
  <Fragment>
    <Autocomplete title="Example Autocomplete" options={[]} placeholder="Search..." />
    <DatePicker title="Example DatePicker" placeholder="Select a date" />
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={uuid()}>
        Content line {i + 1}
        <br />
      </span>
    ))}
  </Fragment>
);

const ConfirmationDialog = () => {
  const [confirmed, setConfirmed] = useState<any>(false);
  async function onClick() {
    const result = await Modal.confirm({
      title: "Are you sure?",
      description: "This action cannot be undone. Vivamus scelerisque eros volutpat.",
      confirm: { text: "Delete", theme: "danger", value: "deleted" },
      cancel: { text: "Cancel", value: "cancel" },
    });
    setConfirmed(result);
  }
  return (
    <Button onClick={onClick}>
      Start confirmed cycle: {confirmed.toString()}
    </Button>
  );
};

const DialogDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Modal
        closable
        overlayClickClose
        type="dialog"
        title="Dialog"
        open={open}
        onChange={setOpen}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={uuid()}>
            I&apos;m a Dialog component line {i + 1}
            <br />
          </span>
        ))}
        <Tooltip title={<b>Test</b>}>
          <div className="flex flex-1 min-w-full">
            Paullum deliquit, ponderibus modulisque suis ratio utitur.
          </div>
        </Tooltip>
      </Modal>
    </div>
  );
};

const ModalConfirmDemo = () => <ConfirmationDialog />;

const DrawerLeftDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Left Drawer</Button>
      <Modal
        closable
        overlayClickClose
        type="drawer"
        position="left"
        title="Drawer from left"
        open={open}
        onChange={setOpen}
      >
        I&apos;m a Drawer component. From left to right
        <ItemContent />
      </Modal>
    </div>
  );
};

const DrawerRightDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Right Drawer</Button>
      <Modal
        closable
        overlayClickClose
        type="drawer"
        position="right"
        title="Drawer from right"
        open={open}
        onChange={setOpen}
      >
        I&apos;m a Drawer component. From right to left
        <ItemContent />
      </Modal>
    </div>
  );
};

const SheetDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <p>
        Bottom Sheet or just Sheet it&apos;s a component that opens from bottom to top. It&apos;s
        very useful for mobile apps. That&apos;s why dialog and drawer are changed to sheet on
        mobile.
      </p>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        Open Sheet
      </Button>
      <Modal
        closable
        overlayClickClose
        resizer
        type="sheet"
        title="Sheet"
        open={open}
        onChange={setOpen}
      >
        I&apos;m a sheet component
        <ItemContent />
      </Modal>
    </div>
  );
};

export default function ModalExamplePage() {
  return (
    <DocsLayout
      title="Modal"
      section="floating"
      description="Dialog, Drawer or BottomSheet. This component can do with all these options. For responsive websites, BottomSheet will be used for mobile, while desktop preserve the dialog/drawer."
    >
      <ComponentDemo
        title="Dialog"
        description="A standard dialog modal with title, closable button, and overlay-click-to-close."
        code={`"use client";
import { useState } from "react";
import { Button, Modal, Tooltip, uuid } from "@g4rcez/components";

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Modal
        closable
        overlayClickClose
        type="dialog"
        title="Dialog"
        open={open}
        onChange={setOpen}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={uuid()}>
            I'm a Dialog component line {i + 1}
            <br />
          </span>
        ))}
        <Tooltip title={<b>Test</b>}>
          <div className="flex flex-1 min-w-full">
            Paullum deliquit, ponderibus modulisque suis ratio utitur.
          </div>
        </Tooltip>
      </Modal>
    </div>
  );
}`}
      >
        <DialogDemo />
      </ComponentDemo>

      <ComponentDemo
        title="Modal Confirm"
        description="Use Modal.confirm() to show a promise-based confirmation dialog and handle the result."
        code={`"use client";
import { useState } from "react";
import { Button, Modal } from "@g4rcez/components";

function ModalConfirmDemo() {
  const [confirmed, setConfirmed] = useState(false);
  async function onClick() {
    const result = await Modal.confirm({
      title: "Are you sure?",
      description: "This action cannot be undone. Vivamus scelerisque eros volutpat.",
      confirm: { text: "Delete", theme: "danger", value: "deleted" },
      cancel: { text: "Cancel", value: "cancel" },
    });
    setConfirmed(result);
  }
  return (
    <Button onClick={onClick}>
      Start confirmed cycle: {confirmed.toString()}
    </Button>
  );
}`}
      >
        <ModalConfirmDemo />
      </ComponentDemo>

      <ComponentDemo
        title="Drawer Left"
        description="A drawer that slides in from the left side of the screen."
        code={`"use client";
import { useState, Fragment } from "react";
import { Autocomplete, Button, DatePicker, Modal, uuid } from "@g4rcez/components";

const ItemContent = () => (
  <Fragment>
    <Autocomplete title="Example Autocomplete" options={[]} placeholder="Search..." />
    <DatePicker title="Example DatePicker" placeholder="Select a date" />
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={uuid()}>
        Content line {i + 1}
        <br />
      </span>
    ))}
  </Fragment>
);

function DrawerLeftDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Left Drawer</Button>
      <Modal
        closable
        overlayClickClose
        type="drawer"
        position="left"
        title="Drawer from left"
        open={open}
        onChange={setOpen}
      >
        I'm a Drawer component. From left to right
        <ItemContent />
      </Modal>
    </div>
  );
}`}
      >
        <DrawerLeftDemo />
      </ComponentDemo>

      <ComponentDemo
        title="Drawer Right"
        description="A drawer that slides in from the right side of the screen."
        code={`"use client";
import { useState, Fragment } from "react";
import { Autocomplete, Button, DatePicker, Modal, uuid } from "@g4rcez/components";

const ItemContent = () => (
  <Fragment>
    <Autocomplete title="Example Autocomplete" options={[]} placeholder="Search..." />
    <DatePicker title="Example DatePicker" placeholder="Select a date" />
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={uuid()}>
        Content line {i + 1}
        <br />
      </span>
    ))}
  </Fragment>
);

function DrawerRightDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-6">
      <Button onClick={() => setOpen(true)}>Open Right Drawer</Button>
      <Modal
        closable
        overlayClickClose
        type="drawer"
        position="right"
        title="Drawer from right"
        open={open}
        onChange={setOpen}
      >
        I'm a Drawer component. From right to left
        <ItemContent />
      </Modal>
    </div>
  );
}`}
      >
        <DrawerRightDemo />
      </ComponentDemo>

      <ComponentDemo
        title="Sheet"
        description="A bottom sheet that slides up from the bottom, ideal for mobile. Dialogs and drawers become sheets on mobile."
        code={`"use client";
import { useState, Fragment } from "react";
import { Autocomplete, Button, DatePicker, Modal, uuid } from "@g4rcez/components";

const ItemContent = () => (
  <Fragment>
    <Autocomplete title="Example Autocomplete" options={[]} placeholder="Search..." />
    <DatePicker title="Example DatePicker" placeholder="Select a date" />
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={uuid()}>
        Content line {i + 1}
        <br />
      </span>
    ))}
  </Fragment>
);

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <p>
        Bottom Sheet or just Sheet it's a component that opens from bottom to top. It's
        very useful for mobile apps. That's why dialog and drawer are changed to sheet on
        mobile.
      </p>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        Open Sheet
      </Button>
      <Modal
        closable
        overlayClickClose
        resizer
        type="sheet"
        title="Sheet"
        open={open}
        onChange={setOpen}
      >
        I'm a sheet component
        <ItemContent />
      </Modal>
    </div>
  );
}`}
      >
        <SheetDemo />
      </ComponentDemo>
    </DocsLayout>
  );
}
