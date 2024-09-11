"use client";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Alert, Button, Modal } from "../../../lib/src";
import {
  AnimatedList,
  AnimatedListItem,
} from "../../../lib/src/components/display/list";

export const Showcase = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="h-full flex flex-col gap-4 p-8 w-fit">
      <h2 className="font-bold leading-loose tracking-wide text-4xl text-center">
        Our components
      </h2>
      <Alert title="Fyi!" theme="success" open>
        You can customize using design tokens from your tailwindcss config
      </Alert>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal open={open} onChange={setOpen} title="Hello">
        <div className="max-w-lg h-min">
          Open in mobile? You will see a bottom sheet. Open in desktop? A
          regular dialog. Automatically and without zero code for this. An
          enhanced usability for users in responsive websites
        </div>
      </Modal>
      <AnimatedList>
        <AnimatedListItem
          title="Animated list"
          description="Click here and open a modal"
          leading={({ open }) => (
            <Button onClick={open} theme="raw">
              <ChevronRightIcon aria-hidden />
            </Button>
          )}
        >
          Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
          tempor incidunt ut labore et dolore magna aliqua. Lorem ipsum dolor
          sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut
          labore et dolore magna aliqua.
        </AnimatedListItem>
        <AnimatedListItem
          title="Animated list"
          description="Click here and open a modal"
          leading={({ open }) => (
            <Button onClick={open} theme="raw">
              <ChevronRightIcon aria-hidden />
            </Button>
          )}
        >
          Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
          tempor incidunt ut labore et dolore magna aliqua. Lorem ipsum dolor
          sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut
          labore et dolore magna aliqua.
        </AnimatedListItem>
        <AnimatedListItem
          title="Animated list"
          description="Click here and open a modal"
          leading={({ open }) => (
            <Button onClick={open} theme="raw">
              <ChevronRightIcon aria-hidden />
            </Button>
          )}
        >
          Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
          tempor incidunt ut labore et dolore magna aliqua. Lorem ipsum dolor
          sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut
          labore et dolore magna aliqua.
        </AnimatedListItem>
      </AnimatedList>
    </div>
  );
};
