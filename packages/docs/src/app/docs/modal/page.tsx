"use client";
import { DocsLayout } from "@/components/docs-layout";
import { BrainIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { Fragment, PropsWithChildren, useState } from "react";
import {
  Button,
  Card,
  CommandItemTypes,
  Modal,
  ModalProps,
  negate,
  Switch,
  Tooltip,
  uuid,
} from "../../../../../lib/src";
import { CommandPalette } from "../../../../../lib/src/components/floating/command-palette";

const Element = (props: PropsWithChildren<Partial<ModalProps>>) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Modal {...(props as any)} open={open} onChange={() => setOpen(negate)}>
        {props.children}
        <Tooltip title={<b>Test</b>}>
          <div className="flex flex-1 min-w-full">
            Paullum deliquit, ponderibus modulisque suis ratio utitur.
          </div>
        </Tooltip>
      </Modal>
    </Fragment>
  );
};

const Items = () => (
  <Fragment>
    {Array.from({ length: 70 }).map((x) => (
      <span key={uuid()}>
        I'm a Dialog component
        <br />
      </span>
    ))}
  </Fragment>
);

const commands: CommandItemTypes[] = [
  {
    type: "group",
    title: "Commands",
    items: [
      {
        hint: ["#", "aleatório"],
        type: "shortcut",
        title: "Random item",
        action: (e) => void (e.setOpen(false), alert(Math.random())),
      },
      {
        type: "shortcut",
        shortcut: "Mod+G",
        title: "Google",
        enabled: (props) => props.text !== "" && !props.text.startsWith("@"),
        action: (e) => void (e.setOpen(false), alert("Hello google")),
      },
      {
        type: "shortcut",
        shortcut: "Mod+A",
        Icon: <BrainIcon size={18} />,
        title: (props) => `Ask to AI: ${props.text}`,
        enabled: (props) => props.text !== "",
        action: (e) => void (e.setOpen(false), alert("A")),
      },
      {
        title: "Find",
        type: "shortcut",
        shortcut: "Mod+f",
        action: (e) => void (e.setOpen(false), alert("f")),
      },
      {
        title: "Logout",
        type: "shortcut",
        shortcut: "Mod+l",
        action: () => alert("l"),
      },
      {
        title: "Extra",
        type: "shortcut",
        shortcut: "Mod+E",
        action: () => alert("e"),
      },
      {
        title: "Go",
        type: "shortcut",
        shortcut: "Mod+E",
        action: () => alert("e"),
      },
    ],
  },
  {
    type: "group",
    title: "Pages",
    items: [
      {
        title: "Menu",
        type: "shortcut",
        shortcut: "Mod + Alt + o",
        action: () => alert("m"),
      },
      {
        title: "Button",
        type: "shortcut",
        shortcut: "Mod+b",
        action: () => alert("b"),
      },
      {
        title: "useForm",
        type: "shortcut",
        shortcut: "Mod + U",
        action: () => alert("U"),
      },
    ],
  },
];

const Preview = (props: any) => {
  if (!props.text) return null;
  if (!props.command) return null;
  return (
    <div className="w-1/2 max-w-[50%] px-4">
      <ul>
        <li>{props.command.title}</li>
        <li>{props.text}</li>
      </ul>
    </div>
  );
};

export default function ModalExamplePage() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    closable: false,
    overlayClickClose: true,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.checked;
    return setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DocsLayout
      title="Modal"
      section="floating"
      description="Dialog, Drawer or BottomSheet. This component can do with all these options. For responsive websites, BottomSheet will be used for mobile, while desktop preserve the dialog/drawer."
    >
      <div className="flex flex-col gap-6">
        <CommandPalette
          onChangeVisibility={setOpen}
          open={open}
          commands={commands}
          Preview={Preview}
        />
        <Card
          title="Global configuration"
          className="flex flex-wrap gap-8 items-center"
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
        <Card className="flex flex-row flex-wrap gap-6" title="Dialog">
          <Element
            {...state}
            asChild
            type="dialog"
            title="Dialog"
            trigger={<Button as={motion.button}>Dialog</Button>}
          >
            {Array.from({ length: 10 }).map((x) => (
              <span>
                I'm a Dialog component
                <br />
              </span>
            ))}
          </Element>
          <Element
            {...state}
            asChild
            type="dialog"
            trigger={<Button>Dialog controlled width</Button>}
            className="flex justify-center items-center lg:max-w-xs"
            overlayClassName="items-center justify-center testing"
          >
            class=max-w-x
          </Element>
          <Element
            {...state}
            asChild
            type="dialog"
            trigger={<Button>Dialog without title</Button>}
          >
            <Items />
          </Element>
        </Card>
        <Card title="Drawer">
          <p>
            Drawer element is resized by default. You can omit this behaviour
            using the property resizer=false
          </p>
          <div className="flex flex-col gap-6 mt-4 lg:flex-row">
            <Element
              {...state}
              asChild
              type="drawer"
              title="Drawer from left"
              trigger={<Button>Drawer Left</Button>}
              position="left"
            >
              I'm a Drawer component. From left to right
              <Items />
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
              <Items />
            </Element>
            <Element
              {...state}
              open
              asChild
              type="drawer"
              ariaTitle="Title"
              trigger={<Button>Drawer right without title</Button>}
              position="right"
            >
              I'm a Drawer component. From left to right
              <Items />
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
            <Items />
          </Element>
        </Card>
      </div>
      <Items />
    </DocsLayout>
  );
}
