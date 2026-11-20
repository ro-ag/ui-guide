import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { X } from "lucide-react";
import { starterItemsQueryOptions } from "../../lib/queries";
import { shellStore } from "../../stores/shell-store";
import { NativeDialog } from "./NativeDialog";

export function InspectorDrawer() {
  const open = useSelector(shellStore, (s) => s.inspectorOpen);
  const selectedItemId = useSelector(shellStore, (s) => s.selectedItemId);
  const { data: items = [] } = useQuery(starterItemsQueryOptions);

  const selected =
    items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;

  return (
    <NativeDialog
      open={open}
      onClose={() => shellStore.actions.setInspectorOpen(false)}
      ariaLabelledBy="inspector-drawer-title"
      variant="drawer"
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line-subtle px-5 py-4">
        <div className="min-w-0">
          <p className="mb-1 text-[0.6875rem] font-extrabold tracking-[0.14em] text-accent-text uppercase">
            Inspector · {selected?.id ?? "none"}
          </p>
          <h2
            id="inspector-drawer-title"
            className="text-base leading-snug font-bold tracking-[-0.02em] text-ink-primary"
          >
            {selected?.title ?? "No item selected"}
          </h2>
          {selected ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text capitalize">
                {selected.status}
              </span>
              <span className="font-mono text-xs text-ink-faint">
                updated {selected.updatedAt}
              </span>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="btn-secondary min-h-8 px-2.5"
          onClick={() => shellStore.actions.setInspectorOpen(false)}
          aria-label="Close Inspector"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Close</span>
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <section className="pb-4">
          <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-muted uppercase">
            Unblurred Context Scrim
          </p>
          <p className="text-xs leading-relaxed text-ink-soft">
            Following p-track&apos;s drawer pattern, this slide-over surface uses
            a light unblurred scrim behind it so the main canvas stays legible
            while inspecting item metadata.
          </p>
        </section>

        {selected ? (
          <section className="border-t border-line-subtle py-4">
            <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-muted uppercase">
              Selected Item Details
            </p>
            <div className="rounded-[10px] border border-line-subtle bg-fill-subtle p-3">
              <p className="text-xs leading-relaxed text-ink-soft">
                {selected.subtitle}
              </p>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between font-mono text-xs text-ink-muted">
                  <span>Completion</span>
                  <span className="font-semibold text-accent-text">
                    {selected.progress}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-fill-strong">
                  <span
                    className="progress-meter-fill"
                    style={{ width: `${selected.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-line-subtle py-4">
          <p className="mb-2 text-[0.6875rem] font-extrabold tracking-[0.12em] text-ink-muted uppercase">
            Starter Slot
          </p>
          <div className="rounded-[9px] border border-dashed border-line p-4 text-center text-xs text-ink-faint">
            Replace this inspector body with forms, history logs, or linked
            records for your domain.
          </div>
        </section>
      </div>
    </NativeDialog>
  );
}
