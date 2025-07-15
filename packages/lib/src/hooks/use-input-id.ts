import { useId } from "react";

type S = string | undefined;

export const useInputId = (id: S, name: S) => {
  const same = useId();
  return id || name || same;
}
