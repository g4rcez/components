import { DesignTokens, ZIndex } from "./theme.types";

export const rounded = {
  button: "0.55rem",
  pill: "2rem",
  card: "0.75rem",
  full: "9999px",
} as const;

export const spacing: DesignTokens["spacing"] = {
  base: "1rem",
  hairline: "0.0625rem",
  lg: "1.125rem",
  sm: "0.75rem",
  dialog: "20rem",
  "field-height": "1.5rem",
  "field-label": "0.875rem",
  "input-height": "2.5rem",
  "input-x": "0.5rem",
  "input-y": "0.25rem",
  "input-inline": "0.25rem",
  "input-gap": "0.3rem",
} as const;

export const zIndex: ZIndex = {
  wizard: "50",
  normal: "1",
  navbar: "22",
  calendar: "2",
  overlay: "21",
  tooltip: "20",
  floating: "22",
} as const;
