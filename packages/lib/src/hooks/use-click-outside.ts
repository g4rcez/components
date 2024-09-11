import React, { useEffect } from "react";

export const useOnClickOutside = <T extends HTMLElement>(ref: React.RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as any)) return;
      handler(event);
    };
    const params = { passive: true };
    document.addEventListener("mousedown", listener, params);
    document.addEventListener("touchstart", listener, params);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
