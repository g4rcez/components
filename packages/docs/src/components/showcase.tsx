"use client";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Modal } from "../../../lib/src";
import {
  AnimatedList,
  AnimatedListItem,
} from "../../../lib/src/components/display/list";

type State = {
  type: "drawer" | "dialog";
};

export const Showcase = () => {
  const [state, setState] = useState<State | null>(null);
  return (
    <div className="h-full flex flex-col gap-4 p-8 w-fit">
      <h2 className="font-bold leading-loose tracking-wide text-4xl text-center">
        Our components
      </h2>
      <div className="flex justify-center w-full gap-4">
        <Button onClick={() => setState({ type: "dialog" })}>
          Dialog
        </Button>
        <Button onClick={() => setState({ type: "drawer" })}>
          Drawer
        </Button>
      </div>
      <Modal
        type={state?.type}
        open={state !== null}
        title={state?.type ?? ""}
        onChange={() => setState(null)}
      >
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
          title="Form"
          description="All elements that you need"
          leading={({ open }) => (
            <Button onClick={open} theme="raw">
              <ChevronRightIcon aria-hidden />
            </Button>
          )}
        >
          <ul className="space-y-4">
            <li>Input with mask</li>
            <li>Select</li>
            <li>Autocomplete</li>
            <li>DatePicker</li>
            <li>
              <Link
                href="/docs/form"
                className="hover:underline hover:text-primary transition-all ease-normal"
              >
                useForm
              </Link>
            </li>
          </ul>
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
