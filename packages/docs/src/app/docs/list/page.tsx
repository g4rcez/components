"use client";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";
import { ChevronRightIcon } from "lucide-react";
import {
  Button,
  Card,
  AnimatedList,
  AnimatedListItem,
} from "../../../../../lib/src";

export default function ListPage() {
  return (
    <DocsLayout title="AnimatedList" section="display" description="A list component with smooth item animations and detail modals.">
      <ComponentDemo
        title="Basic AnimatedList Usage"
        description="Demonstrates a list of animated items that reveal additional content in a modal when clicked."
        code={`"use client";
import { ChevronRightIcon } from "lucide-react";
import { Button, AnimatedList, AnimatedListItem } from "@g4rcez/components";
import Link from "next/link"; // Assuming Link is available or adjust based on project context

function BasicAnimatedList() {
  return (
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
        tempor incidunt ut labore et dolore magna aliqua.
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
        title="Another Animated list"
        description="Click here and open a modal"
        leading={({ open }) => (
          <Button onClick={open} theme="raw">
            <ChevronRightIcon aria-hidden />
          </Button>
        )}
      >
        Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod
        tempor incidunt ut labore et dolore magna aliqua.
      </AnimatedListItem>
    </AnimatedList>
  );
}`}
      >
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
      </ComponentDemo>
    </DocsLayout>
  );
}
