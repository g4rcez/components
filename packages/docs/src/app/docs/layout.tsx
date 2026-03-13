import { PropsWithChildren, Fragment } from "react";

export default function LayoutDocs(props: PropsWithChildren) {
  return <Fragment>{props.children}</Fragment>;
}
