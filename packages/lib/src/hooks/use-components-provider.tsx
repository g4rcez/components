"use client";
import { IconContext } from "@phosphor-icons/react";
import { type CSSProperties, type PropsWithChildren, useMemo } from "react";
import { ModalConfirmProvider } from "../components/floating/modal/modal";
import { Context, type ContextProps, type ContextType } from "../config/context";
import { defaultTranslations } from "../config/default-translations";
import { defaultTweaks } from "../config/default-tweaks";
import { parsers } from "../styles/design-tokens";
import { createThemeProperties, defaultLightThemeTokens, type ThemeComponentOverrides } from "../styles/theme-runtime";
import { defaultGeometryTokens } from "../styles/geometry-defaults";
import { themeTokenRegistry } from "../styles/theme-registry.generated";
import { Notifications } from "../components";

export type { ContextType } from "../config/context";

type NumericToken = {
    amount: number;
    unit: string;
    reference?: string;
};

type CssVariableProperties = CSSProperties & Record<`--${string}`, string>;

const parseNumericToken = (value: string): NumericToken | undefined => {
    const match = value.match(/^(-?\d*\.?\d+)([a-z%]+)$/i);
    if (match) return { amount: Number(match[1]), unit: match[2] };
    const derived = value.match(/^calc\(\s*var\((--var-(?:spacing-base|radius-base|fontsize))\)\s*([*/])\s*(-?\d*\.?\d+)\s*\)$/);
    if (!derived) return undefined;
    const operand = Number(derived[3]);
    if (derived[2] === "/" && operand === 0) return undefined;
    return { amount: derived[2] === "/" ? 1 / operand : operand, unit: "", reference: derived[1] };
};

const calcFromDefaultDelta = (baseReference: string, baseDefault: string | undefined, targetDefault: string) => {
    if (!baseDefault) return undefined;

    const base = parseNumericToken(baseDefault);
    const target = parseNumericToken(targetDefault);
    if (!base || !target || base.unit !== target.unit || base.reference !== target.reference) return undefined;

    const delta = Number((target.amount - base.amount).toFixed(6));
    if (delta === 0) return `var(${baseReference})`;
    const distance = base.reference ? `calc(var(${base.reference}) * ${Math.abs(delta)})` : `${Math.abs(delta)}${base.unit}`;
    return `calc(var(${baseReference}) ${delta > 0 ? "+" : "-"} ${distance})`;
};

const componentTokenProperties = (tokens: ThemeComponentOverrides): CSSProperties => {
    const properties: CssVariableProperties = { ...createThemeProperties({ components: tokens }) };
    const geometry: Readonly<Record<string, string>> = defaultGeometryTokens;
    const defaults: Readonly<Record<string, Readonly<Record<string, string>>>> = defaultLightThemeTokens.components;
    const registry: Readonly<Record<string, readonly string[]>> = themeTokenRegistry.components;

    for (const [component, overrides] of Object.entries(tokens)) {
        if (!overrides) continue;
        const values: Readonly<Record<string, string | undefined>> = overrides;
        for (const attribute of registry[component] ?? []) {
            const baseAttribute = attribute.replace(/^(big|small|tiny|min)-/u, "");
            if (baseAttribute === attribute || values[attribute] !== undefined) continue;
            if (values[baseAttribute] === undefined) continue;

            const baseProperty = `--var-${component}-${baseAttribute}` as const;
            const property = `--var-${component}-${attribute}` as const;
            const defaultValue = geometry[property] ?? defaults[component]?.[attribute];
            if (defaultValue === undefined) continue;
            const derivedValue = calcFromDefaultDelta(
                baseProperty,
                geometry[baseProperty] ?? defaults[component]?.[baseAttribute],
                defaultValue
            );
            if (derivedValue !== undefined) properties[property] = derivedValue;
        }
    }
    return properties;
};

export const ComponentsProvider = (props: PropsWithChildren<ContextProps>) => {
    const styles = useMemo<CSSProperties | undefined>(
        () => props.injectComponentTokens ? { display: "contents", ...componentTokenProperties(props.components ?? {}) } : undefined,
        [props.injectComponentTokens, props.components]
    );

    const memoMap = useMemo<ContextType>(
        () => ({
            locale: props.locale,
            components: props.components,
            floatingRef: props.rootFloating,
            parser: props.parser || parsers.hsla,
            map: { ...defaultTranslations, ...props.map },
            tweaks: { ...defaultTweaks, ...props.tweaks },
        }),
        [props.locale, props.rootFloating, props.tweaks, props.parser, props.map, props.components]
    );

    const children = styles ? (
        <div data-components-provider="true" style={styles}>
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
