"use client";
import { DocsLayout } from "@/components/docs-layout";
import React, { PropsWithChildren, useState } from "react";
import {
  Button,
  Card,
  Modal,
  ModalProps,
  Switch,
} from "../../../../../lib/src";

const Element = (props: PropsWithChildren<Partial<ModalProps>>) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal {...props} open={open} onChange={setOpen}>
      {props.children}
    </Modal>
  );
};

export default function ModalExamplePage() {
  const [state, setState] = useState({
    overlayClickClose: false,
    closable: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.checked;
    return setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DocsLayout
      title="Modal"
      section="floating"
      description="Dialog, Drawer or BottomSheet. This component can do with all these options. For responsive websites, BottomSheet will be used for mobile, while desktop preserve the dialog/drawer."
    >
      <div className="flex flex-col gap-6">
        <Card
          title="Global configuration"
          className="flex gap-8 items-center flex-wrap"
        >
          <Switch
            name="overlayClickClose"
            onChange={onChange}
            checked={state.overlayClickClose}
          >
            Close on overlay
          </Switch>
          <Switch name="closable" onChange={onChange} checked={state.closable}>
            Close on X
          </Switch>
        </Card>
        <Card className="flex gap-6" title="Dialog">
          <Element
            {...state}
            asChild
            type="dialog"
            title="Dialog"
            trigger={<Button>Dialog</Button>}
          >
            I'm a Dialog component
          </Element>
          <Element
            {...state}
            asChild
            type="dialog"
            trigger={<Button>Dialog without title</Button>}
          >
            I'm a Dialog component
          </Element>
        </Card>
        <Card title="Drawer">
          <p>
            Drawer element is resized by default. You can omit this behaviour
            using the property resizer=false
          </p>
          <div className="flex gap-6 mt-4">
            <Element
              {...state}
              asChild
              type="drawer"
              title="Drawer from left"
              trigger={<Button>Drawer Left</Button>}
              position="left"
            >
              I'm a Drawer component. From left to right
            </Element>
            <Element
              {...state}
              asChild
              type="drawer"
              title="Drawer from right"
              position="right"
              trigger={<Button>Drawer Right</Button>}
            >
              I'm a Drawer component. From right to left
            </Element>
            <Element
              {...state}
              asChild
              type="drawer"
              trigger={<Button>Drawer right without title</Button>}
              position="right"
            >
              I'm a Drawer component. From left to right
            </Element>
          </div>
        </Card>
        <Card className="flex flex-col gap-6" title="Sheet">
          <p>
            Bottom Sheet or just Sheet it's a component that open from bottom to
            top. It's very useful for mobile apps. That's why dialog and drawer
            are changed to sheet in mobile.
          </p>
          <Element
            {...state}
            asChild
            resizer
            type="sheet"
            title="Sheet"
            trigger={<Button className="w-fit">Open sheet</Button>}
          >
            I'm a sheet component
          </Element>
        </Card>
      </div>
    </DocsLayout>
  );
}
