import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { RouteHeading } from "../components/ui/RouteHeading";
import { appInfoQueryOptions, starterItemsQueryOptions } from "../lib/queries";
import { shellStore } from "../stores/shell-store";

export const Route = createFileRoute("/activity")({
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(appInfoQueryOptions),
      queryClient.ensureQueryData(starterItemsQueryOptions),
    ]),
  component: ActivityRoute,
});

function ActivityRoute() {
  const { data: appInfo } = useQuery(appInfoQueryOptions);
  const {
    data: items = [],
    isFetching,
    refetch,
  } = useQuery(starterItemsQueryOptions);

  return (
    <div className="mx-auto max-w-4xl px-6 py-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <RouteHeading
          eyebrow="TanStack Query + Tauri IPC"
          title="Activity"
          description="Demonstrates route-level query preloading via TanStack Router loaders backed by a typed Tauri invoke bridge with automatic browser fallback."
        />
        <button
          type="button"
          onClick={() => {
            void refetch();
            shellStore.actions.pushToast(
              "Query refreshed",
              `Fetched items via ${appInfo?.runtime === "tauri" ? "Tauri IPC" : "browser mock bridge"}.`,
              "info",
            );
          }}
          disabled={isFetching}
          className="btn-primary mt-1"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>{isFetching ? "Refreshing…" : "Refresh IPC"}</span>
        </button>
      </div>

      <div className="grid gap-2.5" role="list" aria-label="Starter items">
        {items.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className="interactive-card flex flex-wrap items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink-faint">
                  {item.id}
                </span>
                <span className="rounded-full border border-line-subtle bg-fill px-2 py-0.5 text-[0.6875rem] font-semibold text-ink-muted capitalize">
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-ink-primary">
                {item.title}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">{item.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-accent-text tabular-nums">
                {item.progress}%
              </span>
              <button
                type="button"
                className="btn-secondary min-h-8"
                onClick={() => {
                  shellStore.actions.selectItem(item.id);
                  shellStore.actions.setInspectorOpen(true);
                }}
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
