import { queryOptions } from "@tanstack/react-query";
import { tauriBridge } from "./tauri-bridge";

export const shellQueryKeys = {
  all: ["shell"] as const,
  appInfo: () => [...shellQueryKeys.all, "app-info"] as const,
  starterItems: () => [...shellQueryKeys.all, "starter-items"] as const,
};

export const appInfoQueryOptions = queryOptions({
  queryKey: shellQueryKeys.appInfo(),
  queryFn: () => tauriBridge.getAppInfo(),
  staleTime: Infinity,
});

export const starterItemsQueryOptions = queryOptions({
  queryKey: shellQueryKeys.starterItems(),
  queryFn: () => tauriBridge.listStarterItems(),
  staleTime: 30_000,
});
