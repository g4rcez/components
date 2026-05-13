import { ClassValue, clsx } from "clsx";
import React, { Ref, RefCallback, RefObject } from "react";
import { Is } from "sidekicker";
import { extendTailwindMerge } from "tailwind-merge";
import { components } from "../styles/components";

const componentPrefixes = Object.keys(components);

const isFontSizeAttr = (attr: string) =>
  attr === "text" || attr.endsWith("-text") || attr.startsWith("text-");

const isBorderWidthAttr = (attr: string) =>
  attr === "border" || attr.endsWith("-border");

const isRadiusAttr = (attr: string) =>
  attr === "radius" || attr.endsWith("-radius");

const fontSizeTokens = new Set<string>();
const borderWidthTokens = new Set<string>();
const radiusTokens = new Set<string>();
const spacingTokens = new Set<string>();

for (const [component, attrs] of Object.entries(components)) {
  if (!attrs || typeof attrs !== "object") continue;
  if (component === "typography") {
    for (const attr of Object.keys(attrs)) fontSizeTokens.add(attr);
    continue;
  }
  for (const attr of Object.keys(attrs)) {
    const key = `${component}-${attr}`;
    if (isRadiusAttr(attr)) radiusTokens.add(key);
    else if (isBorderWidthAttr(attr)) {
      borderWidthTokens.add(key);
      spacingTokens.add(key);
    } else if (isFontSizeAttr(attr)) {
      fontSizeTokens.add(key);
      spacingTokens.add(key);
    } else spacingTokens.add(key);
  }
}

const isComponentToken = (value: string) =>
  componentPrefixes.some((p) => value === p || value.startsWith(`${p}-`));

const isSpacingValue = (value: string) => spacingTokens.has(value);

const isRadiusValue = (value: string) => radiusTokens.has(value);

const isFontSizeValue = (value: string) => {
  if (fontSizeTokens.has(value)) return true;
  if (value.startsWith("typography-"))
    return fontSizeTokens.has(value.slice("typography-".length));
  return false;
};

const isBorderWidthValue = (value: string) => borderWidthTokens.has(value);

const isTextColorValue = (value: string) =>
  !isFontSizeValue(value) && isComponentToken(value);

const isBorderColorValue = (value: string) =>
  !isBorderWidthValue(value) && isComponentToken(value);

const spacingGroupIds = [
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "ps",
  "pe",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "ms",
  "me",
  "gap",
  "gap-x",
  "gap-y",
  "h",
  "w",
  "size",
  "min-h",
  "min-w",
  "max-h",
  "max-w",
  "top",
  "right",
  "bottom",
  "left",
  "inset",
  "inset-x",
  "inset-y",
] as const;

const radiusGroupIds = [
  "rounded",
  "rounded-s",
  "rounded-e",
  "rounded-t",
  "rounded-r",
  "rounded-b",
  "rounded-l",
  "rounded-ss",
  "rounded-se",
  "rounded-ee",
  "rounded-es",
  "rounded-tl",
  "rounded-tr",
  "rounded-br",
  "rounded-bl",
] as const;

const wrap = (ids: readonly string[], match: (v: string) => boolean) =>
  Object.fromEntries(ids.map((id) => [id, [{ [id]: [match] }]]));

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      ...wrap(spacingGroupIds, isSpacingValue),
      ...wrap(radiusGroupIds, isRadiusValue),
      "font-size": [{ text: [isFontSizeValue] }],
      "text-color": [{ text: [isTextColorValue] }],
      "border-w": [{ border: [isBorderWidthValue] }],
      "border-color": [{ border: [isBorderColorValue] }],
    },
  },
});

export const mergeRefs =
  <T>(
    ...refs: Array<RefObject<T> | Ref<T> | undefined | null>
  ): RefCallback<T> =>
  (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null) {
        (ref as RefObject<T | null>).current = value;
      }
    });
  };

export const isReactComponent = (a: unknown): a is React.ReactElement => {
  if (typeof a !== "object" || a === null) return false;
  const elem = a as { $$typeof?: unknown };
  if (elem.$$typeof === Symbol.for("react.forward_ref")) return true;
  if (elem.$$typeof === Symbol.for("react.fragment")) return true;
  return elem.$$typeof === Symbol.for("react.element");
};

export const isReactFC = (a: unknown) => Is.function(a);

export const css = (...styles: ClassValue[]) => twMerge(clsx(styles));

export const synthesizeChangeEvent = (
  input: HTMLInputElement,
): React.ChangeEvent<HTMLInputElement> => {
  return {
    target: input,
    currentTarget: input,
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

export const dispatchInput = (input: HTMLInputElement | undefined | null) => {
  const event = new Event("input", { bubbles: true, composed: true });
  input?.dispatchEvent(event);
  return Object.assign({}, event, { target: input, currentTarget: input });
};

export const initializeInputDataset = (
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
) => {
  const focus = () => input.setAttribute("data-initialized", "true");
  input.addEventListener("focus", focus);
  return () => input.removeEventListener("focus", focus);
};

export const hasVerticalScroll = (htmlElement: HTMLElement) =>
  htmlElement.scrollHeight > htmlElement.clientHeight;

export const getRemainingSize = (element: HTMLElement, windowSize: number) => {
  if (element && element.getBoundingClientRect) {
    const rect = element.getBoundingClientRect();
    return Math.abs(windowSize - rect.bottom);
  }
  return 320;
};

export const getCoords = (elem: HTMLElement, docEl: HTMLElement) => {
  const box = elem.getBoundingClientRect();
  const parent = docEl.getBoundingClientRect();
  return {
    top: Math.round(box.top - parent.top),
    left: Math.round(box.left - parent.left),
  };
};

export const isChildVisible = (
  container: HTMLElement,
  child: HTMLElement,
  partial: boolean = true,
): boolean => {
  const containerRect = container.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const isWithinTop = childRect.top >= containerRect.top;
  const isWithinBottom = childRect.bottom <= containerRect.bottom;
  const isWithinLeft = childRect.left >= containerRect.left;
  const isWithinRight = childRect.right <= containerRect.right;
  if (partial) {
    return (
      childRect.top < containerRect.bottom &&
      childRect.bottom > containerRect.top &&
      childRect.left < containerRect.right &&
      childRect.right > containerRect.left
    );
  }
  return isWithinTop && isWithinBottom && isWithinLeft && isWithinRight;
};
