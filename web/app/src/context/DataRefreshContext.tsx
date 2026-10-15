import { createContext } from "react";

interface DataRefreshValue {
  version: number;
  notifyChanged: () => void;
}

export const DataRefreshContext = createContext<DataRefreshValue | undefined>(
  undefined,
);
