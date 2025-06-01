import { PropsWithChildren } from "react";
import { Polymorph } from "./polymorph";

export const Heading = (props: PropsWithChildren) => {
    return <Polymorph as="h2">{props.children}</Polymorph>;
};
