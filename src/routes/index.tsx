import { createFileRoute } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import {
  Bell,
  Command,
  FileCode2,
  Monitor,
  Moon,
  PanelLeft,
  PanelRight,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import {
  SPRING_PILL,
  StaggerItem,
  StaggerStage,
} from "../components/ui/MotionPrimitives";
import { RouteHeading } from "../components/ui/RouteHeading";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { ACCENT_PRESETS } from "../config/shell-config";
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
  const accent = useSelector(shellStore, (s) => s.accent);

  return (
    <StaggerStage className="mx-auto max-w-4xl px-6 py-7">
      <StaggerItem>
        <RouteHeading
          eyebrow="Prism Aurora Starter"
          title="Luminous Glass Desktop Shell"
          description="A transparent sidebar floating over a living multi-orb aurora mesh, paired with a frosted glass canvas, spring-gliding navigation, and 4 instant gradient worlds."
        />
      </StaggerItem>

      {/* Luminous Gradient Studio Switcher with Spring-Gliding Pills */}
      <StaggerItem>
        <section
          aria-label="Live theme and gradient world controls"
          className="relative mb-6 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,var(--accent-soft),transparent_62%),var(--surface-soft)] p-4 shadow-[var(--highlight-inset),var(--shadow-button)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[0.6875rem] font-extrabold tracking-[0.14em] text-ink-muted uppercase">
                Atmosphere
              </span>
              <LayoutGroup id="studio-mode">
                <div
                  role="group"
                  aria-label="Theme mode"
                  className="inline-flex items-center gap-0.5 rounded-xl border border-line bg-canvas/85 p-1 backdrop-blur-md"
                >
                  {THEME_OPTIONS.map(({ id, label, icon: Icon }) => {
                    const active = themePreference === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => shellStore.actions.setThemePreference(id)}
                        className={`relative inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors duration-150 ease-shell ${
                          active
                            ? "text-ink-primary"
                            : "text-ink-muted hover:text-ink-primary"
                        }`}
                      >
                        {active ? (
                          <motion.span
                            layoutId="studio-mode-pill"
                            transition={SPRING_PILL}
                            className="absolute inset-0 rounded-lg border border-accent/35 bg-accent-soft shadow-[var(--highlight-inset)]"
                            aria-hidden="true"
                          />
                        ) : null}
                        <Icon
                          className={`relative z-10 h-3.5 w-3.5 ${
                            active ? "text-accent-text" : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span className="relative z-10">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>

            {/* 4 Gradient Worlds */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 text-[0.6875rem] font-extrabold tracking-[0.14em] text-ink-muted uppercase">
                <Sparkles className="h-3 w-3 text-accent-text" aria-hidden="true" />
                <span>World</span>
              </span>
              <LayoutGroup id="studio-world">
                <div
                  role="group"
                  aria-label="Gradient world"
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {ACCENT_PRESETS.map((preset) => {
                    const selected = accent === preset.id;
                    const gradient =
                      resolvedTheme === "dark"
                        ? preset.gradientDark
                        : preset.gradientLight;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={selected}
                        title={preset.tagline}
                        onClick={() => shellStore.actions.setAccent(preset.id)}
                        className={`relative inline-flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors duration-150 ease-shell ${
                          selected
                            ? "border-transparent text-ink-primary"
                            : "border-line bg-canvas/75 text-ink-muted hover:border-line-strong hover:text-ink-primary"
                        }`}
                      >
                        {selected ? (
                          <motion.span
                            layoutId="studio-world-pill"
                            transition={SPRING_PILL}
                            className="absolute inset-0 rounded-full border border-accent/50 bg-accent-soft shadow-[0_4px_18px_-6px_var(--accent-glow)]"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span
                          className="relative z-10 h-3.5 w-3.5 rounded-full shadow-sm"
                          style={{ background: gradient }}
                          aria-hidden="true"
                        />
                        <span className="relative z-10">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </div>
          </div>
        </section>
      </StaggerItem>

      {/* Cursor-Tracking Iridescent Spotlight Bento Grid */}
      <StaggerItem className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SpotlightCard ariaLabel="Quick customization map" className="p-5">
          <div className="relative z-10">
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-xl text-on-accent shadow-[0_6px_18px_-4px_var(--accent-glow)]"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  <FileCode2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="m-0 text-xs font-bold text-ink-primary">
                    Modular Shell Architecture
                  </h3>
                  <p className="m-0 text-[0.6875rem] text-ink-faint">
                    Change brand, routes, or palettes in seconds
                  </p>
                </div>
              </div>
            </div>

            <ul className="m-0 grid list-none gap-2 p-0 text-xs">
              <li className="rounded-xl border border-line-subtle bg-surface-soft/75 px-3 py-2.5">
                <code className="font-mono text-[0.75rem] font-semibold text-accent-text">
                  src/config/shell-config.ts
                </code>
                <p className="mt-0.5 mb-0 text-ink-muted">
                  Single config for Brand, Primary Nav, and Gradient Worlds.
                </p>
              </li>
              <li className="rounded-xl border border-line-subtle bg-surface-soft/75 px-3 py-2.5">
                <code className="font-mono text-[0.75rem] font-semibold text-accent-text">
                  src/styles/themes/
                </code>
                <p className="mt-0.5 mb-0 text-ink-muted">
                  Drop-in <code>dark.css</code>, <code>light.css</code>, and{" "}
                  <code>accents.css</code> — all WCAG AA tested.
                </p>
              </li>
              <li className="rounded-xl border border-line-subtle bg-surface-soft/75 px-3 py-2.5">
                <code className="font-mono text-[0.75rem] font-semibold text-accent-text">
                  src/components/ui/MotionPrimitives.tsx
                </code>
                <p className="mt-0.5 mb-0 text-ink-muted">
                  Shared spring curves, <code>StaggerStage</code>, and{" "}
                  <code>SpotlightCard</code> primitives.
                </p>
              </li>
            </ul>
          </div>
        </SpotlightCard>

        <div className="grid grid-cols-2 gap-3">
          <SpotlightCard
            onClick={() => shellStore.actions.setPaletteOpen(true)}
            className="flex flex-col justify-between gap-3 p-4"
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <Command className="h-4 w-4" aria-hidden="true" />
              </span>
              <kbd className="rounded-md bg-fill-strong px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint">
                ⌘K
              </kbd>
            </div>
            <div className="relative z-10">
              <p className="m-0 text-xs font-bold text-ink-primary">
                Command Palette
              </p>
              <p className="mt-1 mb-0 text-[0.6875rem] leading-snug text-ink-muted">
                Frosted top-layer modal with blur &amp; scale entry
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => shellStore.actions.setInspectorOpen(true)}
            className="flex flex-col justify-between gap-3 p-4"
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <PanelRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <kbd className="rounded-md bg-fill-strong px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint">
                ⌘I
              </kbd>
            </div>
            <div className="relative z-10">
              <p className="m-0 text-xs font-bold text-ink-primary">
                Glass Drawer
              </p>
              <p className="mt-1 mb-0 text-[0.6875rem] leading-snug text-ink-muted">
                Slide-over panel with legible unblurred scrim
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => shellStore.actions.toggleSidebar()}
            className="flex flex-col justify-between gap-3 p-4"
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <PanelLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <kbd className="rounded-md bg-fill-strong px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink-faint">
                ⌘\
              </kbd>
            </div>
            <div className="relative z-10">
              <p className="m-0 text-xs font-bold text-ink-primary">
                Fluid Sidebar
              </p>
              <p className="mt-1 mb-0 text-[0.6875rem] leading-snug text-ink-muted">
                Smooth collapse with macOS traffic-light clearance
              </p>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() =>
              shellStore.actions.pushToast(
                "Prism Motion Active",
                `Dissolved cleanly into ${resolvedTheme} · ${accent} aurora.`,
                "success",
              )
            }
            className="flex flex-col justify-between gap-3 p-4"
          >
            <div className="relative z-10 flex w-full items-center justify-between">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <Bell className="h-4 w-4" aria-hidden="true" />
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  shellStore.actions.setSettingsOpen(true);
                }}
                aria-label="Open Settings"
                className="icon-spin-hover rounded-md p-1 text-ink-faint hover:bg-fill-strong hover:text-ink-primary"
              >
                <Settings className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative z-10">
              <p className="m-0 text-xs font-bold text-ink-primary">
                Spring Toast
              </p>
              <p className="mt-1 mb-0 text-[0.6875rem] leading-snug text-ink-muted">
                Pop-layout AnimatePresence notification stack
              </p>
            </div>
          </SpotlightCard>
        </div>
      </StaggerItem>
    </StaggerStage>
  );
}
