import { withOptions } from "tailwindcss/plugin";

const css = String.raw

const plugin = withOptions(
  () => {
    return function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("link", ["&:hover", "&:active"]);
      addVariant("group-assert", [css`:merge(.group):valid:has(.input:valid:not(:placeholder-shown)) &`]);
      addVariant("group-checkbox-checked", [css`:merge(&:has(.form-checkbox[type="checkbox"]:checked))`]);
      addVariant("group-error", [
        css`:merge(.group):invalid:has(.input:not(:focus):invalid[data-initialized=true]) &`,
        css`:merge(.group[data-error=true]:has(.input[data-initialized=true])) &`,
        css`:merge(.group[data-error=true][data-interactive=true]):has(.input) &`,
        css`:merge(.group[data-error=true][data-interactive=true]):has(.input[data-initialized=true]) &`,
      ]);

    }
  },
  () => {
    return {
      theme: {},
    }
  }
)

export default plugin
