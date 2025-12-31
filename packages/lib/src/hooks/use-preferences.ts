import { useCallback, useState } from "react";
import { Is } from "sidekicker";
import { LocalStorage } from "storage-manager-js";

export const usePreferences = <T extends string, V>(
  key: T,
  defaultValue: V,
) => {
  const [state, setState] = useState<V>(() => {
    const saved = LocalStorage.get(key) as V;
    if (saved) return saved;
    return defaultValue;
  });

  const setCallback = useCallback(
    (params: Parameters<typeof setState>[0]) => {
      if (Is.function(params)) {
        return setState((prev) => {
          const result = params(prev);
          LocalStorage.set(key, result);
          return result;
        });
      }
      LocalStorage.set(key, params);
      return params;
    },
    [key],
  );
  return [state, setCallback] as const;
};

