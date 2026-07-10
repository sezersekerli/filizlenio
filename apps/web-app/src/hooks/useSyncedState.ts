"use client";

import { useEffect, useState } from "react";

/** Sunucudan gelen initial prop değişince local state'i senkronize eder */
export function useSyncedState<T>(value: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(value);
  useEffect(() => {
    setState(value);
  }, [value]);
  return [state, setState];
}
