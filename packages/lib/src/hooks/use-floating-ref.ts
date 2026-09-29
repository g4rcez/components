import { useContext } from "react";
import { Context } from "../config/context";

export const useFloatingRef = () => useContext(Context)?.floatingRef ?? undefined;
