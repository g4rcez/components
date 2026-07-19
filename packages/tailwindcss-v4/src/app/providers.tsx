"use client";

import { ComponentsProvider } from "@g4rcez/components";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
    return <ComponentsProvider>{children}</ComponentsProvider>;
}
