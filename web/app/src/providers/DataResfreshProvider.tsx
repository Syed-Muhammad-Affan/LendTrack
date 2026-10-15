import { DataRefreshContext } from "@/context/DataRefreshContext";
import { useCallback, useMemo, useState, type ReactNode } from "react";

export function DataRefreshProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const notifyChanged = useCallback(() => setVersion((v) => v + 1), []);
  const value = useMemo(
    () => ({ version, notifyChanged }),
    [version, notifyChanged],
  );

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
}
