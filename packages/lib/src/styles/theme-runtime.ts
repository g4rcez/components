import { z } from "zod";
import { themeTokenRegistry } from "./theme-registry.generated";

export {
  defaultDarkThemeTokens,
  defaultLightThemeTokens,
  themeTokenRegistry,
} from "./theme-registry.generated";
export {
  defaultGeometryTokens,
  defaultGeometryBases,
} from "./geometry-defaults";

export type ThemeTokenName = (typeof themeTokenRegistry.tokens)[number];
export type ThemeColorName = (typeof themeTokenRegistry.colors)[number];
export type ThemeComponentName = keyof typeof themeTokenRegistry.components;
export type ThemeComponentOverrides = {
  [Component in ThemeComponentName]?: Partial<
    Record<
      (typeof themeTokenRegistry.components)[Component][number],
      string | undefined
    >
  >;
};

type PrimitiveCssValue = string | number;

export type ThemeTokenOverrides = {
  tokens?: Partial<Record<ThemeTokenName, string>> & {
    spacing?: PrimitiveCssValue;
    rounding?: PrimitiveCssValue;
  };
  colors?: Partial<Record<ThemeColorName, string>>;
  components?: ThemeComponentOverrides;
};

export type ThemeConfiguration = ThemeTokenOverrides & {
  name: string;
  colorScheme?: "light" | "dark" | "normal";
};

export type ThemeCssProperties = Record<`--var-${string}`, string>;
export type ConfigureThemeOptions = { document?: Document; nonce?: string };

type NormalizedThemeConfiguration = {
  name: string;
  colorScheme?: ThemeConfiguration["colorScheme"];
  properties: ThemeCssProperties;
};
type ParsedOverrides = z.infer<typeof themeOverridesSchema>;
type ParsedConfiguration = z.infer<typeof themeConfigurationSchema>;
type ParsedConfigureOptions = z.infer<typeof configureOptionsSchema>;

const assertSafeCssValue = (value: string) => {
  if (value.trim() === "") throw new Error("CSS values cannot be empty.");
  if (/<\/style/i.test(value))
    throw new Error("CSS values cannot contain a closing style tag.");

  let quote = "";
  let escaped = false;
  let comment = false;
  let parentheses = 0;
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    const next = value[index + 1];
    if (comment) {
      if (character === "*" && next === "/") {
        comment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "/" && next === "*") {
      comment = true;
      index++;
      continue;
    }
    if (character === "\\") {
      if (index + 1 >= value.length)
        throw new Error("CSS value cannot end with an escape.");
      index++;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "(") {
      parentheses++;
      continue;
    }
    if (character === ")") {
      if (parentheses === 0)
        throw new Error("CSS value has an unmatched closing parenthesis.");
      parentheses--;
      continue;
    }
    if (
      parentheses === 0 &&
      character === "!" &&
      /^!\s*important\b/i.test(value.slice(index))
    )
      throw new Error("CSS values cannot set !important.");
    if (character === ";" && parentheses === 0)
      throw new Error("CSS value cannot contain multiple declarations.");
    if (character === "{" || character === "}")
      throw new Error("CSS value cannot contain rule boundaries.");
  }
  if (quote || comment || parentheses !== 0)
    throw new Error("CSS value contains an unclosed boundary.");
};

const cssValueSchema = z.string().superRefine((value, context) => {
  try {
    assertSafeCssValue(value);
  } catch (error) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: error instanceof Error ? error.message : "Invalid CSS value.",
    });
  }
});
const optionalValueSchema = z.union([
  cssValueSchema,
  z.number().finite(),
  z.undefined(),
]);
const optionalStringSchema = z.union([cssValueSchema, z.undefined()]);
const tokensSchema = z.record(optionalValueSchema).optional();
const colorsSchema = z.record(optionalStringSchema).optional();
const componentsSchema = z.record(z.record(optionalStringSchema)).optional();
const themeOverridesSchema = z
  .object({
    tokens: tokensSchema,
    colors: colorsSchema,
    components: componentsSchema,
  })
  .strict();
const themeNameSchema = z.union([
  z.literal("default"),
  z.string().regex(/^[a-z][a-z0-9_-]*$/),
]);
const colorSchemeSchema = z.enum(["light", "dark", "normal"]);
const themeConfigurationSchema = z
  .object({
    name: themeNameSchema,
    tokens: tokensSchema,
    colors: colorsSchema,
    components: componentsSchema,
    colorScheme: colorSchemeSchema.optional(),
  })
  .strict();
const configureOptionsSchema = z
  .object({
    document: z
      .custom<Document>(
        (value) =>
          typeof value === "object" &&
          value !== null &&
          "head" in value &&
          "getElementById" in value &&
          "createElement" in value &&
          "querySelectorAll" in value,
      )
      .optional(),
    nonce: z.string().optional(),
  })
  .strict();

const tokenLookup: Record<string, true> = Object.fromEntries(
  themeTokenRegistry.tokens.map((token) => [token, true]),
);
const colorLookup: Record<string, true> = Object.fromEntries(
  themeTokenRegistry.colors.map((token) => [token, true]),
);
const componentLookups: Record<
  string,
  Record<string, true>
> = Object.fromEntries(
  Object.entries(themeTokenRegistry.components).map(([component, tokens]) => [
    component,
    Object.fromEntries(tokens.map((token) => [token, true])),
  ]),
);
const componentLookup: Record<string, true> = Object.fromEntries(
  Object.keys(componentLookups).map((component) => [component, true]),
);

const assertKnown = (
  name: string,
  lookup: Record<string, true>,
  group: string,
) => {
  if (lookup[name] !== true)
    throw new TypeError(`Unknown ${group} token: ${name}.`);
};

const flattenOverrides = (
  overrides: ParsedOverrides | ParsedConfiguration,
): ThemeCssProperties => {
  const properties: Record<string, string> = {};
  for (const [token, value] of Object.entries(overrides.tokens ?? {})) {
    if (value === undefined) continue;
    const isPrimitive = token === "spacing" || token === "rounding";
    if (isPrimitive) {
      if (typeof value === "number" && !Number.isFinite(value))
        throw new TypeError(`tokens.${token} must be a finite number.`);
      if (typeof value !== "number" && typeof value !== "string")
        throw new TypeError(`tokens.${token} must be a number or CSS string.`);
    } else {
      assertKnown(token, tokenLookup, "shared");
      if (typeof value !== "string")
        throw new TypeError(`tokens.${token} must be a CSS string.`);
    }
    const property =
      token === "spacing"
        ? "--var-spacing-base"
        : token === "rounding"
          ? "--var-radius-base"
          : `--var-${token}`;
    properties[property] = typeof value === "number" ? `${value}px` : value;
  }
  for (const [token, value] of Object.entries(overrides.colors ?? {})) {
    if (value === undefined) continue;
    assertKnown(token, colorLookup, "color");
    if (typeof value !== "string")
      throw new TypeError(`colors.${token} must be a CSS string.`);
    properties[`--var-color-${token}`] = value;
  }
  for (const [component, values] of Object.entries(
    overrides.components ?? {},
  )) {
    assertKnown(component, componentLookup, "component");
    for (const [token, value] of Object.entries(values ?? {})) {
      if (value === undefined) continue;
      assertKnown(
        token,
        componentLookups[component],
        `components.${component}`,
      );
      if (typeof value !== "string")
        throw new TypeError(
          `components.${component}.${token} must be a CSS string.`,
        );
      properties[`--var-${component}-${token}`] = value;
    }
  }
  return Object.fromEntries(
    Object.entries(properties).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  ) as ThemeCssProperties;
};

export const createThemeProperties = (
  overrides: ThemeTokenOverrides = {},
): ThemeCssProperties =>
  flattenOverrides(themeOverridesSchema.parse(overrides));

const normalizeConfiguration = (
  configuration: ThemeConfiguration,
): NormalizedThemeConfiguration => {
  const parsed: ParsedConfiguration =
    themeConfigurationSchema.parse(configuration);
  return {
    name: parsed.name,
    colorScheme: parsed.colorScheme,
    properties: flattenOverrides(parsed),
  };
};

const serializeConfiguration = (
  configuration: NormalizedThemeConfiguration,
): string => {
  const selector =
    configuration.name === "default" ? ":root" : `html.${configuration.name}`;
  const declarations = Object.entries(configuration.properties).map(
    ([property, value]) => `    ${property}: ${value};`,
  );
  if (configuration.colorScheme !== undefined)
    declarations.push(`    color-scheme: ${configuration.colorScheme};`);
  return [
    "@layer var.tokens, var.theme, var.base, var.components, var.utilities;",
    "",
    "@layer var.theme {",
    `  ${selector} {`,
    ...declarations,
    "  }",
    "}",
  ].join("\n");
};

export const createThemeCss = (configuration: ThemeConfiguration): string =>
  serializeConfiguration(normalizeConfiguration(configuration));

const STYLE_OWNER_ATTRIBUTE = "data-theme-owner";
const STYLE_NAME_ATTRIBUTE = "data-theme-name";
const STYLE_OWNER_VALUE = "theme-runtime";

export const configureTheme = (
  configuration: ThemeConfiguration,
  options: ConfigureThemeOptions = {},
): string => {
  const parsedOptions: ParsedConfigureOptions =
    configureOptionsSchema.parse(options);
  const normalized = normalizeConfiguration(configuration);
  const css = serializeConfiguration(normalized);
  const doc =
    parsedOptions.document ??
    (typeof document === "undefined" ? undefined : document);
  if (!doc) return css;
  if (!doc.head)
    throw new TypeError(
      "document must have a head element to register a theme.",
    );
  const id = `g4rcez-theme-${normalized.name}`;
  const matches = doc.querySelectorAll(`#${id}`);
  if (matches.length > 1)
    throw new Error(`Multiple elements use the reserved theme style id ${id}.`);
  const existing = matches.item(0);
  if (existing) {
    if (
      existing.localName !== "style" ||
      existing.getAttribute(STYLE_OWNER_ATTRIBUTE) !== STYLE_OWNER_VALUE ||
      existing.getAttribute(STYLE_NAME_ATTRIBUTE) !== normalized.name
    ) {
      throw new Error(
        `Cannot register theme ${normalized.name}: element #${id} is not owned by the theme runtime.`,
      );
    }
    const style = existing as HTMLStyleElement;
    style.textContent = css;
    if (parsedOptions.nonce !== undefined) style.nonce = parsedOptions.nonce;
    return css;
  }

  const style = doc.createElement("style");
  style.id = id;
  style.setAttribute(STYLE_OWNER_ATTRIBUTE, STYLE_OWNER_VALUE);
  style.setAttribute(STYLE_NAME_ATTRIBUTE, normalized.name);
  if (parsedOptions.nonce !== undefined) style.nonce = parsedOptions.nonce;
  style.textContent = css;
  doc.head.appendChild(style);
  return css;
};
