import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { X } from "lucide-react";
import { appInfoQueryOptions } from "../../lib/queries";
import { shellStore } from "../../stores/shell-store";
import { NativeDialog } from "./NativeDialog";

export function AboutDialog() {
  const open = useSelector(shellStore, (s) => s.aboutOpen);
  const { data: appInfo } = useQuery(appInfoQueryOptions);

  return (
    <NativeDialog
      open={open}
      onClose={() => shellStore.actions.setAboutOpen(false)}
      ariaLabelledBy="about-dialog-title"
    >
      <div className="w-[min(420px,calc(100vw-32px))] p-6">
        <div className="flex items-start justify-between gap-4 border-b border-line-subtle pb-4">
          <div className="flex items-stretch gap-3">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <p className="text-[0.6875rem] font-extrabold tracking-[0.16em] text-accent-text uppercase">
                About
              </p>
              <h2
                id="about-dialog-title"
                className="text-lg font-bold tracking-[-0.025em] text-ink-primary"
              >
                {appInfo?.name ?? "Tauri Canvas Shell"}
              </h2>
              <p className="font-mono text-xs text-ink-faint">
                v{appInfo?.version ?? "0.1.0"} ·{" "}
                {appInfo?.runtime === "tauri" ? "Tauri v2" : "Web Preview"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary min-h-8 px-2"
            onClick={() => shellStore.actions.setAboutOpen(false)}
            aria-label="Close About dialog"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          A minimal desktop application skeleton built with Tauri v2, TanStack
          Router, TanStack Query, TanStack Store, Tailwind CSS v4, and Motion —
          featuring a background-integrated sidebar and an inset floating
          workspace canvas.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="btn-primary min-h-8"
            onClick={() => shellStore.actions.setAboutOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </NativeDialog>
  );
}
