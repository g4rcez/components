import { use } from "react";
import { loadReference } from "@/generated/reference";
import type { Reference } from "./types";

/**
 * One promise per slug, created once: `use` needs a stable promise, or the page would suspend forever.
 * The JSON is split per page by the bundler, so a page only downloads its own reference.
 */
const cache = new Map<string, Promise<Reference | null>>();

export const readReference = (slug: string) => {
    let promise = cache.get(slug);
    if (!promise) {
        promise = loadReference(slug);
        cache.set(slug, promise);
    }
    return promise;
};

export const useReference = (slug: string) => use(readReference(slug));
