import { useContext } from "react";
import { Context } from "../config/context";

export const useFloatingRef = () => {
  const ctx = useContext(Context);
  return ctx.floatingRef ?? undefined;
};
