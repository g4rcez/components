"use client";

import { DocsLayout } from "@/components/docs-layout";
import { PropsWithChildren, useState } from "react";
import { Button, Card, Modal, ModalProps } from "../../../../../lib/src";

const Element = (props: PropsWithChildren<Partial<ModalProps>>) => {
  const [open, setOpen] = useState(false);
  return (
    <Modal {...props} open={open} onChange={setOpen}>
      {props.children}
    </Modal>
  );
};

export default function ModalExamplePage() {
  return (
    <DocsLayout
      title="Modal"
      section="floating"
      description="Dialog, Drawer or BottomSheet. This component can do with all these options. For responsive websites, BottomSheet will be used for mobile, while desktop preserve the dialog/drawer."
    >
      <Card className="flex gap-6" title="Dialog">
        <Element
          asChild
          type="dialog"
          title="Dialog"
          trigger={<Button>Dialog</Button>}
        >
          I'm a Dialog component
        </Element>
      </Card>
      <Card title="Drawer" container="mt-6">
        <p>
          Drawer element is resized by default. You can omit this behaviour
          using the property resizer=false
        </p>
        <div className="flex gap-6 mt-4">
          <Element
            asChild
            type="drawer"
            title="Drawer from left"
            trigger={<Button>Drawer Left</Button>}
            position="left"
          >
            I'm a Drawer component. From left to right
          </Element>
          <Element
            asChild
            type="drawer"
            title="Drawer from right"
            trigger={<Button>Drawer Right</Button>}
          >
            I'm a Drawer component. From right to left
          </Element>
        </div>
      </Card>
    </DocsLayout>
  );
}
