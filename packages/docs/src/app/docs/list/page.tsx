"use client";
import { ChevronRightIcon } from "lucide-react";
import {
  Button,
  Card,
  AnimatedList,
  AnimatedListItem,
} from "../../../../../lib/src";

export default function ListPage() {
  return (
    <Card>
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
            <li>ok</li>
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
    </Card>
  );
}
