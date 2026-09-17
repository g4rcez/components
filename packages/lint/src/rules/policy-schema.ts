// The option shape every class rule shares, so a reader of one config
// knows them all. What the options mean is in docs/rules.md.

export const entriesSchema = { type: "array", items: { type: "string" } };

const message = { type: "string", maxLength: 500 };

// Mirrors settings.shadcn, where these are written once for every rule.
export const recognitionSchema = {
    componentImports: entriesSchema,
    ignoreImports: entriesSchema,
    mergeFunctions: entriesSchema,
    variantFunctions: entriesSchema,
};

export const contractsSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            pattern: { type: "string" },
            allow: entriesSchema,
            deny: entriesSchema,
            message,
        },
        required: ["pattern"],
        additionalProperties: false,
    },
};

export const policySchema = {
    allow: entriesSchema,
    deny: entriesSchema,
    contracts: contractsSchema,
    message,
};
