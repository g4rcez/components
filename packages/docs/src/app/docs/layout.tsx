import { PropsWithChildren } from "react";

export default function LayoutDocs(props: PropsWithChildren) {
  return <div className="p-6">{props.children}</div>;
}
