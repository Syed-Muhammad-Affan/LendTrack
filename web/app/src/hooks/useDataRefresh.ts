import { DataRefreshContext } from "@/context/DataRefreshContext";
import { useContext } from "react";

export function useDataRefresh() {
  const ctx = useContext(DataRefreshContext);
  if (!ctx) throw new Error("useDataRefresh must be used within DataRefreshProvider");
  return ctx;
}