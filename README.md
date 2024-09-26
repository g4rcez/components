# unamed-components

I need to think in a good name for this.

# Tokens

You can edit the files `src/styles/dark.json` and `src/styles/light.json` to interact with colors of the project. I will configure other things like:

-   border-radius
-   shadow
-   custom themes: you will use other themes instead only `dark`

# Components

For now, we have only Input, Select and Autocomplete.

## Input

Basic and styled input component. Provides masks using [the-mask-input](https://www.npmjs.com/package/the-mask-input).

## Select and Autocomplete

The difference between then is:

-   Select is a native component with styles
-   Autocomplete uses [floating-ui](https://floating-ui.com/) to provide options list

# Roadmap

1. Documentation
2. IntersectionArea: component just render when appear at screen
3. Refactor component architecture to seems like shadcn: allows you to copy and paste implementations
