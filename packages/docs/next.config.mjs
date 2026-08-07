import { getComponentsSourceAliases } from "../../scripts/components-source-aliases.mjs";

const sourceAliases = process.env.NODE_ENV === "development" ? getComponentsSourceAliases(import.meta.dirname) : undefined;
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@g4rcez/components"],
    ...(sourceAliases && {
        turbopack: {
            root: sourceAliases.workspaceRoot,
            resolveAlias: sourceAliases.turbopack,
        },
    }),
    webpack(config, { dev }) {
        if (dev && sourceAliases) {
            config.resolve.alias = { ...config.resolve.alias, ...sourceAliases.webpack };
        }
        return config;
    },
};

export default nextConfig;
