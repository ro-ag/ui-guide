# Tauri Canvas Shell

An empty, production-ready **Tauri v2** desktop application skeleton built with **TanStack** (Router, Query, Store), **Tailwind CSS v4**, and **Motion**, inspired by the visual craft and motion system of `p-track`.

Read **[GUIDE.md](./GUIDE.md)** for the full visual architecture, Tauri window integration, transition system, and extension cookbook.

## Highlights

- **Canvas-embedded sidebar**: Transparent left sidebar sitting directly on the window canvas (`--night` + ambient corner radial glows) under inset macOS traffic lights (`titleBarStyle: "Overlay"`), paired with an elevated, rounded floating workspace canvas.
- **Invisible glowing resizer**: 5px drag splitter with pointer capture, full keyboard resizing (`←`/`→`/`PageUp`/`PageDown`/`Home`/`End`), viewport clamping, and `--accent` glow on hover/focus.
- **4-tier transition system**:
  - Shared deceleration curve (`--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`) for tactile buttons, lifted cards, progress meters, and rotating icons.
  - Interruptible `motion/mini` title nudge on sidebar rows (keeps hit targets and trailing controls stationary).
  - Native top-layer `<dialog>` modals (Settings, `⌘K` Command Palette, About) and right slide-over Inspector Drawer (with unblurred scrim) animated via `@starting-style`, `transition-behavior: allow-discrete`, `overlay`, plus WKWebView/Safari exit and light-dismiss fallbacks.
  - Same-document View Transitions integrated with TanStack Router (pinned sidebar/topbar chrome + post-transition focus routing).
  - 3-state Reduced Motion (`system` / `always` / `never`).
- **Dark & light themes with WCAG AA verification**: Synchronous pre-paint FOUC prevention, `color-scheme: light dark`, `light-dark()` + fallbacks, native OS window theme sync (`window.set_theme`), and 71 automated Vitest contrast tests.
- **Robust TanStack stack**: File-based type-safe **TanStack Router** (hash history for Tauri), **TanStack Query** over a typed Tauri IPC bridge (with automatic browser preview fallback), and **TanStack Store** for client shell state.

## Quick Start

```bash
# Install frontend dependencies
npm install

# Run fast browser preview (uses typed browser fallback bridge)
npm run dev

# Run the native Tauri v2 desktop window
npm run tauri dev
```

## Verification Scripts

```bash
npm run typecheck           # Strict TypeScript check
npm test                    # Unit tests + WCAG AA & 1.4.11 token contrast audit
npm run build               # Production Vite bundle
cd src-tauri && cargo test  # Rust compilation & unit tests
```

## Project Layout

```text
├── GUIDE.md                       # Complete UI, motion, Tauri & TanStack engineering guide
├── index.html                     # Pre-paint anti-FOUC bootstrap
├── src/
│   ├── styles/
│   │   ├── themes/
│   │   │   ├── light.css          # Modular Light theme palette (WCAG AA verified)
│   │   │   └── dark.css           # Modular Dark theme palette (WCAG AA verified)
│   │   ├── tokens.css             # Theme bridge (color-scheme + light-dark()), density scale, --ease
│   │   ├── app.css                # Tailwind v4 @theme + @custom-variant dark, shell grid, dialogs, View Transitions
│   │   └── contrast.test.ts       # Automated WCAG AA (>= 4.5:1) & 1.4.11 contrast audit
│   ├── lib/
│   │   ├── tauri-bridge.ts        # Typed Tauri invoke/event bridge + browser preview fallback
│   │   ├── queries.ts             # TanStack Query keys & queryOptions
│   │   ├── layout.ts              # Sidebar width clamping & keyboard stepping
│   │   ├── motion.ts              # 3-state reduced motion + motion/mini row nudge
│   │   ├── theme.ts               # Smart 2-state/3-state theme manager + native sync
│   │   ├── top-layer.ts           # Native <dialog> WKWebView/Safari exit & light-dismiss fallbacks
│   │   └── shell.test.ts          # Unit tests for layout, motion, and theme logic
│   ├── stores/
│   │   └── shell-store.ts         # TanStack Store for shell layout, preferences & overlays
│   ├── components/
│   │   ├── shell/                 # AppShell, Sidebar, SidebarResizer, SidebarItem, Topbar, Shortcuts
│   │   ├── overlays/              # NativeDialog, SettingsDialog, CommandPalette, InspectorDrawer, About, Toasts
│   │   └── ui/                    # RouteHeading (post-transition focus target)
│   └── routes/                    # TanStack Router file-based routes (/, /workspace, /activity)
└── src-tauri/
    ├── tauri.conf.json            # Overlay titlebar, trafficLightPosition, visible: false, strict CSP
    ├── capabilities/              # Least-privilege main-window permissions
    └── src/                       # Rust backend: lib.rs, commands.rs, menu.rs
```
