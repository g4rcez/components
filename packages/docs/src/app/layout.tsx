import { RootLayout } from "@/components/root-layout";
import { PropsWithChildren } from "react";
import "./index.css";

export default function Layout(props: PropsWithChildren) {
  return <RootLayout>{props.children}</RootLayout>;
}
