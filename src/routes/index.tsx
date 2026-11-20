import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { Bell, Command, Monitor, Moon, PanelRight, Settings, Sun } from "lucide-react";
import { RouteHeading } from "../components/ui/RouteHeading";
import type { ThemePreference } from "../lib/theme";
import { shellStore } from "../stores/shell-store";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

const THEME_OPTIONS: Array<{
  id: ThemePreference;
  label: string;
  icon: typeof Sun;
}> = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

function HomeRoute() {
  const themePreference = useSelector(shellStore, (s) => s.themePreference);
  const resolvedTheme = useSelector(shellStore, (s) => s.resolvedTheme);

  return (
    <div className="mx-auto max-w-4xl px-6 py-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <RouteHeading
          eyebrow="Empty Skeleton"
          title="Canvas-Embedded Desktop Shell"
          description="The left sidebar sits directly on the window background beneath the inset macOS traffic lights while your views live inside this elevated, rounded workspace canvas."
        />

        {/* Quick 3-state theme preview switcher */}
        <div
          role="group"
          aria-label="Theme mode"
          className="mt-1 inline-flex items-center gap-0.5 rounded-[9px] border border-line bg-surface-soft p-0.5"
        >
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => {
            const active = themePreference === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => shellStore.actions.setThemePreference(id)}
                className={`inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2.5 text-xs font-semibold transition-colors duration-150 ease-shell ${
                  active
                    ? "bg-accent-soft text-accent-text shadow-[inset_0_0_0_1px_var(--accent-ring)]"
                    : "text-ink-muted hover:bg-fill-hover hover:text-ink-primary"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Callout banner modeled after p-track's glowing left-rail North Star card */}
      <section
        aria-label="Architecture summary"
        className="relative mb-6 overflow-hidden rounded-[10px] border border-accent/25 bg-[linear-gradient(120deg,var(--accent-soft),transparent_65%),var(--surface-soft)] p-4 shadow-[var(--highlight-inset)]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-accent-dim to-accent shadow-[0_0_14px_var(--accent-glow)]"
        />
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="m-0 text-[0.6875rem] font-extrabold tracking-[0.14em] text-accent-text uppercase">
            Ready to Build
          </p>
          <span className="font-mono text-[0.6875rem] text-ink-muted">
            Active palette: <strong className="text-ink-primary">{resolvedTheme}</strong>
          </span>
        </div>
        <p className="m-0 text-xs leading-relaxed text-ink-soft">
          Customize themes in{" "}
          <code className="rounded bg-fill-strong px-1.5 py-0.5 font-mono text-[0.75rem] text-ink-primary">
            src/styles/themes/light.css
          </code>{" "}
          and{" "}
          <code className="rounded bg-fill-strong px-1.5 py-0.5 font-mono text-[0.75rem] text-ink-primary">
            src/styles/themes/dark.css
          </code>
          , replace routes in{" "}
          <code className="rounded bg-fill-strong px-1.5 py-0.5 font-mono text-[0.75rem] text-ink-primary">
            src/routes/
          </code>
          , and see{" "}
          <code className="rounded bg-fill-strong px-1.5 py-0.5 font-mono text-[0.75rem] text-ink-primary">
            GUIDE.md
          </code>{" "}
          for the complete design and transition architecture.
        </p>
      </section>

      {/* Interactive transition & overlay starters */}
      <section aria-label="Built-in transition primitives">
        <div className="mb-3 flex items-center justify-between">
          <p className="m-0 text-[0.6875rem] font-extrabold tracking-[0.14em] text-ink-muted uppercase">
            Built-in Transition Surfaces
          </p>
          <span className="font-mono text-xs text-ink-faint">
            --ease: cubic-bezier(0.2, 0.8, 0.2, 1)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => shellStore.actions.setPaletteOpen(true)}
            className="interactive-card flex items-start gap-3 p-4 text-left"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <Command className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-primary">
                  Command Palette
                </span>
                <kbd className="font-mono text-[0.6875rem] text-ink-faint">
                  ⌘K
                </kbd>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                Native top-layer dialog with @starting-style scale/fade entry
                and frosted backdrop.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => shellStore.actions.setInspectorOpen(true)}
            className="interactive-card flex items-start gap-3 p-4 text-left"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <PanelRight className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-primary">
                  Slide-Over Inspector
                </span>
                <kbd className="font-mono text-[0.6875rem] text-ink-faint">
                  ⌘I
                </kbd>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                Right-aligned drawer sliding in over an unblurred scrim so the
                canvas remains readable.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => shellStore.actions.setSettingsOpen(true)}
            className="interactive-card flex items-start gap-3 p-4 text-left"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <Settings className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-primary">
                  Settings &amp; Preferences
                </span>
                <kbd className="font-mono text-[0.6875rem] text-ink-faint">
                  ⌘,
                </kbd>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                Live dark/light theme, comfortable/compact density, and 3-state
                reduced motion controls.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              shellStore.actions.pushToast(
                "Transition verified",
                "Toast notices slide up with the shared deceleration curve and auto-dismiss cleanly.",
                "success",
              )
            }
            className="interactive-card flex items-start gap-3 p-4 text-left"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-primary">
                  Toast Notification
                </span>
                <span className="font-mono text-[0.6875rem] text-accent-text">
                  Trigger
                </span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                Non-blocking frosted status stack anchored to the bottom-right
                corner of the window.
              </span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
