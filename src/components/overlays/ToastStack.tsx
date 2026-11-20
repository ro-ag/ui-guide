import { useSelector } from "@tanstack/react-store";
import { X } from "lucide-react";
import { shellStore } from "../../stores/shell-store";

export function ToastStack() {
  const toasts = useSelector(shellStore, (s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-6 bottom-6 z-40 flex max-w-[min(380px,calc(100vw-48px))] flex-col items-end gap-2"
    >
      {toasts.map((toast) => {
        const borderAccent =
          toast.tone === "success"
            ? "border-l-accent"
            : toast.tone === "warning"
              ? "border-l-doing"
              : "border-l-info";

        return (
          <div
            key={toast.id}
            role="status"
            className={`shell-toast pointer-events-auto flex w-full items-start gap-3 rounded-[11px] border border-line-strong border-l-[3px] ${borderAccent} bg-[var(--overlay-bg)] px-4 py-3 text-xs text-ink-primary shadow-[var(--highlight-inset),var(--shadow-2)] backdrop-blur-md`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink-primary">{toast.title}</p>
              {toast.detail ? (
                <p className="mt-0.5 text-ink-muted">{toast.detail}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => shellStore.actions.dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 text-ink-faint transition-colors hover:bg-fill-strong hover:text-ink-primary"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
