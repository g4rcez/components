import React from "react";
import { css } from "../../lib/dom";

export const SkeletonCell = <div className="w-10/12 h-6 rounded animate-pulse bg-muted" />;

export const Skeleton = (props: { className?: string }) => (
  <span className={css("block rounded h-8 w-32 animate-pulse bg-muted", props.className)} />
);
