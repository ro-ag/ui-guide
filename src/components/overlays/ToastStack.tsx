import { useSelector } from "@tanstack/react-store";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SHELL_EASE } from "../../lib/motion";
import { shellStore } from "../../stores/shell-store";

export function ToastStack() {
  const toasts = useSelector(shellStore, (s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-6 bottom-6 z-40 flex max-w-[min(380px,calc(100vw-48px))] flex-col items-end gap-2"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const dotStyle =
            toast.tone === "success"
              ? { background: "var(--accent-gradient)" }
              : toast.tone === "warning"
                ? { background: "var(--doing)" }
                : { background: "var(--info)" };

          return (
            <motion.div
              key={toast.id}
              layout
              role="status"
              initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 24, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.24, ease: SHELL_EASE }}
              className="pointer-events-auto flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-line-strong bg-[var(--overlay-bg)] px-4 py-3 text-xs text-ink-primary shadow-[var(--highlight-inset),0_0_0_1px_var(--accent-soft),var(--shadow-2)] backdrop-blur-xl"
            >
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_10px_var(--accent-glow)]"
                style={dotStyle}
                aria-hidden="true"
              />
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
                className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-fill-strong hover:text-ink-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
