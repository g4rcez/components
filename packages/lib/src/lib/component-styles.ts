import { cva } from "class-variance-authority";

type VariantValues = Record<string, readonly string[]>;
type SlotValues = readonly string[];

type VariantSelection<TVariants extends VariantValues> = {
    [K in keyof TVariants]?: TVariants[K][number] | null | undefined;
};

type VariantClassMap<TName extends string, TVariants extends VariantValues> = {
    [K in keyof TVariants]: {
        [Value in TVariants[K][number]]: `__${TName}--${K & string}-${Value & string}`;
    };
};

type SlotClassMap<TName extends string, TSlots extends SlotValues> = {
    [Slot in TSlots[number]]: `__${TName}__${Slot & string}`;
};

type CompoundVariant<TName extends string, TVariants extends VariantValues> = {
    when: {
        [K in keyof TVariants]?: TVariants[K][number] | readonly TVariants[K][number][];
    };
    className: `__${TName}--${string}`;
};

type ComponentStylesConfig<TName extends string, TVariants extends VariantValues, TSlots extends SlotValues> = {
    name: TName;
    variants: TVariants;
    defaults: {
        [K in keyof TVariants]: TVariants[K][number];
    };
    slots?: TSlots;
    dependencies?: readonly string[];
    compoundVariants?: readonly CompoundVariant<TName, TVariants>[];
};

type ComponentStyles<TName extends string, TVariants extends VariantValues, TSlots extends SlotValues> = Omit<
    ComponentStylesConfig<TName, TVariants, TSlots>,
    "slots"
> & {
    base: `__${TName}`;
    css: `@g4rcez/components/${TName}.css`;
    slotNames: TSlots;
    slots: SlotClassMap<TName, TSlots>;
    classes: {
        base: `__${TName}`;
        variants: VariantClassMap<TName, TVariants>;
        compounds: readonly `__${TName}--${string}`[];
    };
    className: (props?: VariantSelection<TVariants>) => string;
};

export type ComponentStyleProps<TStyles> = TStyles extends ComponentStyles<string, infer TVariants, SlotValues> ? VariantSelection<TVariants> : never;

const createVariantClasses = <TName extends string, TVariants extends VariantValues>(
    name: TName,
    variants: TVariants
): VariantClassMap<TName, TVariants> => {
    const entries = Object.entries(variants).map(([variant, values]) => {
        const valueEntries = values.map((value) => [value, `__${name}--${variant}-${value}`] as const);
        return [variant, Object.fromEntries(valueEntries)] as const;
    });

    return Object.fromEntries(entries) as VariantClassMap<TName, TVariants>;
};

const createSlotClasses = <TName extends string, TSlots extends SlotValues>(name: TName, slots: TSlots): SlotClassMap<TName, TSlots> => {
    const entries = slots.map((slot) => [slot, `__${name}__${slot}`] as const);
    return Object.fromEntries(entries) as SlotClassMap<TName, TSlots>;
};

const matchesCompound = <TVariants extends VariantValues>(
    when: CompoundVariant<string, TVariants>["when"],
    props: { [K in keyof TVariants]: TVariants[K][number] }
) =>
    Object.entries(when).every(([key, expected]) => {
        const current = props[key as keyof TVariants];
        return Array.isArray(expected) ? expected.includes(current) : expected === current;
    });

export const defineComponentStyles = <TName extends string, TVariants extends VariantValues, const TSlots extends SlotValues = []>(
    config: ComponentStylesConfig<TName, TVariants, TSlots>
): ComponentStyles<TName, TVariants, TSlots> => {
    const base = `__${config.name}` as const;
    const variants = createVariantClasses(config.name, config.variants);
    const slotNames = (config.slots ?? []) as TSlots;
    const slots = createSlotClasses(config.name, slotNames);
    const className = cva<Record<string, Record<string, string>>>(base, {
        variants: variants as Record<string, Record<string, string>>,
        defaultVariants: config.defaults as Record<string, string>,
    });
    const compoundVariants = config.compoundVariants ?? [];

    return {
        name: config.name,
        variants: config.variants,
        defaults: config.defaults,
        dependencies: config.dependencies,
        compoundVariants: config.compoundVariants,
        base,
        css: `@g4rcez/components/${config.name}.css`,
        slotNames,
        slots,
        classes: {
            base,
            variants,
            compounds: compoundVariants.map((compound) => compound.className),
        },
        className: (props) => {
            const resolvedProps = { ...config.defaults, ...props } as { [K in keyof TVariants]: TVariants[K][number] };
            const compounds = compoundVariants
                .filter((compound) => matchesCompound(compound.when, resolvedProps))
                .map((compound) => compound.className);
            return [className(props as Record<string, string | null | undefined>), ...compounds].filter(Boolean).join(" ");
        },
    };
};
