"use client";
import { IconContext } from "@phosphor-icons/react";
import { type CSSProperties, type PropsWithChildren, useMemo } from "react";
import { ModalConfirmProvider } from "../components/floating/modal/modal";
import { Context, type ContextProps, type ContextType } from "../config/context";
import { defaultTranslations } from "../config/default-translations";
import { defaultTweaks } from "../config/default-tweaks";
import { components as defaultComponentTokens } from "../styles/components";
import { parsers } from "../styles/design-tokens";
import { createThemeProperties, defaultLightThemeTokens, type TokenTree } from "../styles/theme-runtime";
import { Notifications } from "../components";

export type { ContextType } from "../config/context";

type FlatToken = {
    component: string;
    attribute: string;
    value: string;
};

type NumericToken = {
    amount: number;
    unit: string;
};

type CssVariableProperties = CSSProperties & Record<`--${string}`, string>;

const isTokenRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const toTokenTree = (tokens: Record<string, unknown>): TokenTree =>
    Object.entries(tokens).reduce<TokenTree>((acc, [key, value]) => {
        if (value === undefined) return acc;
        if (typeof value === "string") return { ...acc, [key]: value };
        if (!isTokenRecord(value)) return acc;

        const child = toTokenTree(value);
        return Object.keys(child).length === 0 ? acc : { ...acc, [key]: child };
    }, {});

const mergeTokenTree = (base: TokenTree, override: Record<string, unknown> | undefined): TokenTree => {
    if (!override) {
        return base;
    }

    return Object.entries(override).reduce<TokenTree>((acc, [key, value]) => {
        if (value === undefined) return acc;
        if (typeof value === "string") return { ...acc, [key]: value };
        if (!isTokenRecord(value)) return acc;

        const existing = acc[key];
        const next = isTokenRecord(existing) ? mergeTokenTree(existing, value) : toTokenTree(value);
        return { ...acc, [key]: next };
    }, base);
};

const flattenComponentTokens = (tokens: TokenTree): FlatToken[] =>
    Object.entries(tokens).flatMap(([component, value]) => {
        if (!isTokenRecord(value)) return [];

        return Object.entries(value).flatMap(([attribute, tokenValue]) => {
            if (typeof tokenValue === "string") return [{ component, attribute, value: tokenValue }];
            if (!isTokenRecord(tokenValue)) return [];

            return Object.entries(tokenValue).flatMap(([childAttribute, childValue]) =>
                typeof childValue === "string" ? [{ component, attribute: `${attribute}-${childAttribute}`, value: childValue }] : []
            );
        });
    });

const runtimeAttributeAliases = (attribute: string) => {
    const aliases = new Set([attribute]);
    if (attribute === "rounded") aliases.add("radius");
    if (attribute === "radius") aliases.add("rounded");
    if (attribute === "px") aliases.add("padding-x");
    if (attribute === "py") aliases.add("padding-y");
    if (attribute === "font-size") aliases.add("text");
    if (attribute === "text") aliases.add("font-size");
    return [...aliases];
};

const legacyAttributeAliases = (attribute: string) => {
    const aliases = new Set([attribute]);
    if (attribute === "rounded") aliases.add("radius");
    if (attribute === "radius") aliases.add("rounded");
    if (attribute === "padding-x") aliases.add("px");
    if (attribute === "padding-y") aliases.add("py");
    if (attribute === "text") aliases.add("font-size");
    if (attribute === "font-size") aliases.add("text");
    return [...aliases];
};

const parseNumericToken = (value: string): NumericToken | undefined => {
    const match = value.match(/^(-?\d*\.?\d+)([a-z%]+)$/i);
    return match ? { amount: Number(match[1]), unit: match[2] } : undefined;
};

const calcFromDefaultDelta = (baseReference: string, baseDefault: string | undefined, targetDefault: string) => {
    if (!baseDefault) return undefined;

    const base = parseNumericToken(baseDefault);
    const target = parseNumericToken(targetDefault);
    if (!base || !target || base.unit !== target.unit) return undefined;

    const delta = Number((target.amount - base.amount).toFixed(4));
    if (delta === 0) return `var(${baseReference})`;
    return `calc(var(${baseReference}) ${delta > 0 ? "+" : "-"} ${Math.abs(delta)}${base.unit})`;
};

const runtimeAttributeName = (attribute: string) => {
    if (attribute === "rounded" || attribute === "radius") return "rounded";
    if (attribute.startsWith("radius-")) return `${attribute.slice("radius-".length)}-rounded`;
    if (attribute === "text") return "font-size";
    if (attribute.startsWith("text-")) return `${attribute.slice("text-".length)}-font-size`;
    if (attribute === "padding-x") return "px";
    if (attribute.startsWith("padding-x-")) return `${attribute.slice("padding-x-".length)}-px`;
    if (attribute === "padding-y") return "py";
    if (attribute.startsWith("padding-y-")) return `${attribute.slice("padding-y-".length)}-py`;
    if (attribute === "padding-icon") return "icon-p";
    if (attribute.startsWith("height-")) return `${attribute.slice("height-".length)}-height`;
    if (attribute === "border") return "border-width";
    return attribute;
};

const tokenPropertyNames = (component: string, attribute: string) => [
    ...legacyAttributeAliases(attribute).map((alias) => `--${component}-${alias}` as const),
    ...runtimeAttributeAliases(attribute).map((alias) => `--var-${component}-${runtimeAttributeName(alias)}` as const),
];

const baseCandidateReplacements = [
    [/-(big|small|tiny|min|default|rough|squared)$/u, ""],
    [/^(big|small|tiny|min)-/u, ""],
    [/-(top|right|bottom|left|x|y|px|py|pt|pb|mt|mb|mx|my)$/u, ""],
    [/-(text|size|radius|gap|p|px|py|w|h)$/u, ""],
] as const;

const semanticBaseCandidates = {
    "-radius": "rounded",
    "-text": "text",
    "-size": "size",
    "-gap": "gap",
    "-px": "px",
    "-py": "py",
    "-p": "p",
    "-w": "w",
    "-h": "height",
} as const;

const baseCandidatesFor = (attribute: string) => [
    ...baseCandidateReplacements.map(([pattern, replacement]) => attribute.replace(pattern, replacement)),
    ...Object.entries(semanticBaseCandidates).flatMap(([suffix, candidate]) => (attribute.endsWith(suffix) ? [candidate] : [])),
];

const baseAttributeFor = (attribute: string, defaults: Record<string, string>, overrideAttributes: Set<string>) =>
    baseCandidatesFor(attribute)
        .flatMap((candidate) => legacyAttributeAliases(candidate))
        .find((alias) => alias !== attribute && overrideAttributes.has(alias) && defaults[alias]);

const isStringEntry = (entry: [string, unknown]): entry is [string, string] => typeof entry[1] === "string";

const componentTokenProperties = (tokens: TokenTree): CSSProperties => {
    const directRuntimeProperties = createThemeProperties({ components: tokens }, { base: {} });
    const properties: CssVariableProperties = { ...directRuntimeProperties };
    const overridesByComponent = new Map<string, Map<string, string>>();
    for (const token of flattenComponentTokens(tokens)) {
        const overrides = overridesByComponent.get(token.component) ?? new Map<string, string>();
        for (const alias of legacyAttributeAliases(token.attribute)) overrides.set(alias, token.value);
        overridesByComponent.set(token.component, overrides);
        for (const propertyName of tokenPropertyNames(token.component, token.attribute)) properties[propertyName] = token.value;
    }
    for (const [component, overrides] of overridesByComponent) {
        const defaults = defaultComponentTokens[component as keyof typeof defaultComponentTokens];
        if (!isTokenRecord(defaults)) continue;

        const flatDefaults = Object.fromEntries(Object.entries(defaults).filter(isStringEntry));
        const overrideAttributes = new Set(overrides.keys());

        for (const [attribute, defaultValue] of Object.entries(flatDefaults)) {
            if (overrideAttributes.has(attribute)) continue;

            const baseAttribute = baseAttributeFor(attribute, flatDefaults, overrideAttributes);
            if (!baseAttribute) continue;

            const baseValue = overrides.get(baseAttribute);
            const baseDefault = flatDefaults[baseAttribute];
            const derivedValue =
                baseValue && baseDefault ? calcFromDefaultDelta(`--${component}-${baseAttribute}`, baseDefault, defaultValue) : undefined;
            if (!derivedValue) continue;

            for (const propertyName of tokenPropertyNames(component, attribute)) properties[propertyName] = derivedValue;
        }
    }
    return properties;
};

export const ComponentsProvider = (props: PropsWithChildren<ContextProps>) => {
    const css = useMemo(() => {
        const componentOverrides = props.injectComponentTokens ? (props.components ? toTokenTree(props.components) : {}) : {};
        const componentTokens = mergeTokenTree(mergeTokenTree(defaultLightThemeTokens.components, defaultComponentTokens), componentOverrides);
        const styles =
            componentOverrides && props.injectComponentTokens ? { display: "contents", ...componentTokenProperties(componentOverrides) } : undefined;
        return { overrides: componentOverrides, tokens: componentTokens, styles };
    }, [props.injectComponentTokens, props.components]);

    const memoMap = useMemo<ContextType>(
        () => ({
            locale: props.locale,
            components: css.tokens,
            floatingRef: props.rootFloating,
            parser: props.parser || parsers.hsla,
            map: { ...defaultTranslations, ...props.map },
            tweaks: { ...defaultTweaks, ...props.tweaks },
        }),
        [props.locale, props.rootFloating, props.tweaks, props.parser, props.map, css]
    );

    const children = css.styles ? (
        <div data-components-provider="true" style={css.styles}>
            {props.children}
        </div>
    ) : (
        props.children
    );

    return (
        <Context.Provider value={memoMap}>
            <IconContext.Provider value={{ weight: props.iconWeight ?? "regular" }}>
                <ModalConfirmProvider>
                    <Notifications {...props.notifications}>{children}</Notifications>
                </ModalConfirmProvider>
            </IconContext.Provider>
        </Context.Provider>
    );
};
