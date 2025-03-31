import { useContext } from "react";
import { Context } from "../config/context";
import { parsers } from "../styles/design-tokens";

export const useColorParser = () => {
    const ctx = useContext(Context);
    if (!ctx) return parsers.hsla;
    return ctx.parser!;
};
