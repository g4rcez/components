---
name: design-tokens-rules
description: >
    ALWAYS use this skill when creating, editing, migrating, reviewing, or auditing
    design tokens or component CSS in this repository. Use for any task touching
    `packages/lib/src/styles/tokens.css`, `packages/lib/src/components/**/*.css`,
    component theme variants, CSS variable naming, `DESIGN_TOKEN_MIGRATIONS.md`,
    or requests about token hierarchy. Enforces the project token model: prefer
    existing `--var-*` tokens from `tokens.css`, create new semantic DOM-role
    tokens there only when necessary, derive sizes with `calc()` from base tokens,
    avoid deep CSS variable chains, never use `color-mix()`, and use broadly
    supported `hsla(...)` color tokens.
---

# Design Tokens Rules

Use this skill to keep component CSS and token migrations consistent with this project's design-system contract.

## Source files to inspect first

Before changing tokenized component CSS, read the relevant files:

1. `packages/lib/src/styles/tokens.css` — primary CSS variable source of truth.
2. Component CSS, e.g. `packages/lib/src/components/display/alert/alert.css`.
3. Component TSX/styles sidecar, e.g. `alert.tsx` and `alert.styles.ts`, to understand DOM slots and stable class names.
4. `packages/lib/src/components/core/button/button.css` for variant/theme class structure and button token examples.
5. `packages/lib/src/components/display/alert/alert.css` for the current simplified component token model.
6. `DESIGN_TOKEN_MIGRATIONS.md` when migrating a component.

## Token hierarchy

Keep CSS variable usage shallow and predictable:

- Component CSS should usually read one semantic variable per declaration:
    ```css
    .__alert {
        padding: var(--var-alert-surface-padding);
        border-color: var(--var-alert-danger-border);
    }
    ```
- Prefer an existing global token directly when it already has the correct semantic meaning:
    ```css
    border-width: var(--var-border-hairline);
    color: var(--var-color-foreground);
    transition-duration: var(--var-motion-duration-normal);
    ```
- Create component tokens in `tokens.css` only when the value represents a real component/DOM role or needs independent customization.
- Avoid deep variable chains. The target shape is at most:
    - component CSS → semantic `--var-*` token
    - semantic `--var-*` token → base token via `calc(...)` when deriving geometry
- Do not introduce token aliases whose only job is forwarding another token:
    ```css
    /* Wrong */
    --var-card-border-color: var(--var-card-border, var(--var-color-border));
    --var-input-padding: var(--var-input-spacing, var(--var-spacing));
    ```
    If global border or spacing is the real semantic value, read it directly in component CSS.

## Naming rules

Name tokens and classes by semantic DOM role, not source order, generated names, or visual coincidence.

Good token names:

- `--var-alert-surface-padding`
- `--var-alert-close-inset-inline-end`
- `--var-alert-title-font-size`
- `--var-card-stats-icon-column-width`
- `--var-input-field-padding-inline`

Avoid vague names:

- `--var-alert-p`
- `--var-card-border-color` when it only aliases global border
- `--var-input-spacing`
- `--var-component-value`

CSS selectors must be stable and semantic:

- Base: `__alert`, `__button`
- Variant: `__alert--theme-danger`, `__button--size-small`
- Slot: `__alert__content`, `__alert__close-button`, `__button__icon`

Component TSX must import and use its own `*.styles.ts` utility instead of hardcoding stable selector strings:

- Base/variants: `buttonStyles.className({ size, theme })`, `cardStyles.className({})`
- Slots: `buttonStyles.slots.icon`, `cardStyles.slots["stats-panel"]`
- Slot modifiers may be derived from the slot constant when the style utility cannot generate them yet, e.g. `cardStyles.slots["stats-panel"] + "--interactive"`.

Do not add or preserve generated selectors such as `__display-alert__slot-1`, `__component__tw-17`, `tw-extra-*`, or numbered slot names. Rename them by reading the TSX and identifying the actual DOM role.

## Color rules

Color defaults must be broadly supported and easy to theme.

- Never use `color-mix()` in `tokens.css` or component CSS.
- Avoid modern color syntax for defaults (`oklch()`, `lab()`, relative color syntax).
- Define color tokens as explicit `hsla(...)` values in `tokens.css` or theme files.
- Component CSS should consume semantic color tokens directly:
    ```css
    .__alert--theme-danger {
        color: var(--var-alert-danger-foreground);
        border-color: var(--var-alert-danger-border);
        background-color: var(--var-alert-danger-background);
    }
    ```
- For shared meanings, use global tokens directly: `--var-color-foreground`, `--var-color-border`, `--var-color-muted`, `--var-color-primary`.
- For component-specific theme surfaces, create semantic tokens such as `--var-alert-danger-background: hsla(...)`.

## Geometry and typography rules

- Derive component geometry from base tokens with `calc()`:
    ```css
    --var-alert-content-gap: calc(var(--var-spacing-base) / 2);
    --var-card-surface-padding-block: calc(var(--var-spacing-base) * 0.75);
    ```
- Prefer base tokens that already exist: `--var-spacing-base`, `--var-radius`, `--var-fontsize`, `--var-border-hairline`, `--var-motion-duration-normal`.
- Add a base token in `tokens.css` only when the concept is broadly reusable across components.
- Do not hardcode one-off sizes in component CSS unless they are CSS primitives or structural constants (`0`, `1`, `100%`, `transparent`, `inherit`, etc.).

## Migration workflow

When migrating a component:

1. Read component TSX to identify semantic slots and variants.
2. Rename generated or numbered CSS classes to semantic selectors in CSS and TSX.
3. Move component-specific token defaults into `packages/lib/src/styles/tokens.css`.
4. Prefer existing global `--var-*` tokens before adding new tokens.
5. Replace legacy nested fallbacks with shallow semantic token usage.
6. Replace `color-mix()` or modern color syntax with explicit `hsla(...)` semantic color tokens.
7. Update sidecar/manifest slots if class contracts changed.
8. Update component TSX to compose classes from the component's own `*.styles.ts` utility (`className`, `slots`, and generated variant maps) instead of hardcoded selector strings.
9. Add the component to `DESIGN_TOKEN_MIGRATIONS.md` as a checklist item:
    ```md
    - [x] Alert
    ```
10. Update tests that assert selector or token strings.
11. Run the smallest relevant tests/build checks and report exact commands.

## Validation checklist

Before finishing token/CSS work, verify:

- [ ] Component CSS has no numbered/generated selector names.
- [ ] Component CSS uses stable semantic base, variant, and slot class names.
- [ ] Component TSX composes classes from its own `*.styles.ts` utility instead of hardcoded selector strings.
- [ ] Component CSS reads existing global tokens directly when they are semantically correct.
- [ ] New component tokens are defined in `packages/lib/src/styles/tokens.css`.
- [ ] New component tokens describe DOM role + property.
- [ ] No direct `--var-component-*` definitions are simple `var(...)` aliases.
- [ ] No `color-mix()` appears in touched token/component CSS.
- [ ] Component color tokens use explicit `hsla(...)` defaults.
- [ ] Component geometry tokens derive from base tokens with `calc()`.
- [ ] `DESIGN_TOKEN_MIGRATIONS.md` includes the component checklist item when migrating.

Useful checks:

```bash
git grep -n -e 'color-mix' -- packages/lib/src/styles/tokens.css packages/lib/src/components

git grep -n -E '__.*__(slot|tw|extra)-?[0-9]+' -- packages/lib/src/components
```

For component-specific validation, write a small script that compares `var(--var-component-*)` refs in component CSS with definitions in `tokens.css` and flags direct `--var-component-* : var(...)` aliases.
