// @g4rcez/lint: Oxlint rules and the project model used by the rules.

import { plugin } from "./plugin";
import { componentsFor } from "./project/components";
import { projectFor } from "./project/components-json";
import { colorTokensFor, themeFileFor } from "./project/theme";
import { variantDefinitionsOf, variantNamesFor } from "./project/variants";

export { plugin } from "./plugin";

// Experimental: the project model may change before 1.0.
export const project = {
    projectFor,
    themeFileFor,
    colorTokensFor,
    componentsFor,
    variantDefinitionsOf,
    variantNamesFor,
};

export default plugin;
