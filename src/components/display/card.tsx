import React, { PropsWithChildren } from "react";
import { Polymorph } from "~/components/core/polymorph";
import { css } from "~/lib/dom";

export type CardProps = React.ComponentProps<"div">
export const Card = (props: PropsWithChildren<CardProps>) => {
  return <Polymorph {...props} as="div"
                    className={css("rounded-lg bg-card-background p-8 border-card-border border shadow", props.className)}/>;
};