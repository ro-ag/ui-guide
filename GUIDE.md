# Tauri Canvas Shell — UI, Motion & Architecture Guide

> A production-oriented reference guide for building desktop applications with **Tauri v2**, **TanStack** (Router, Query, Store), **Tailwind CSS v4**, and **Motion** — modeled on the **canvas-embedded sidebar** and **layered transition system** of `p-track`.

---

## Table of Contents

1. [Design Philosophy: The Canvas-Embedded Sidebar](#1-design-philosophy-the-canvas-embedded-sidebar)
2. [Window Chrome & Tauri v2 Integration](#2-window-chrome--tauri-v2-integration)
3. [Design Tokens, Theming & WCAG AA Contrast](#3-design-tokens-theming--wcag-aa-contrast)
4. [The 4-Tier Transition & Motion System](#4-the-4-tier-transition--motion-system)
5. [TanStack + Tailwind CSS v4 Architecture](#5-tanstack--tailwind-css-v4-architecture)
6. [Extending the Skeleton (Cookbook)](#6-extending-the-skeleton-cookbook)
7. [Verification Checklist](#7-verification-checklist)

---

## 1. Design Philosophy: The Canvas-Embedded Sidebar

Most desktop web apps draw a solid sidebar box separated from the main view by a hard vertical border. That creates visual clutter and makes the window feel like a web page trapped inside a desktop frame.

This architecture inverts the hierarchy: **the sidebar has no background of its own — it sits directly on the window background**, while the primary workspace floats beside it as an elevated, inset, rounded surface.

### Layer Hierarchy

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Window Canvas (--night + --body-glow-1 top-left + --body-glow-2 bottom)  │
│                                                                          │
│  ┌─ Transparent Sidebar ──┐  ┌─ Elevated Floating Canvas (.app-canvas) ─┐│
│  │ ● ● ●  (44px drag zone)│  │ ┌─ Frosted Topbar (44px, drag region) ─┐ ││
│  │                        │  │ │ Route label       [ ◧ | ◨ | ⌕ | ☀ ] │ ││
│  │ ┃ CANVAS SHELL         │  │ └──────────────────────────────────────┘ ││
│  │ ┃ v0.1.0               │░░│                                          ││
│  │ ┃ Starter App          │5p│  Main Route Stage (.canvas-route-stage)  ││
│  │                        │x │  Scrollable content / blank workspace    ││
│  │ ▸ Home             ⌘1  │  │                                          ││
│  │   Workspace        ⌘2  │r │  (Optional bottom utility dock slot)     ││
│  │   Activity         ⌘3  │e │                                          ││
│  │ ────────────────────── │s │                                          ││
│  │ COLLECTIONS          3 │i │                                          ││
│  │ ┌────────────────────┐ │z │                                          ││
│  │ │ Active card        │ │e │                                          ││
│  │ │ ▓▓▓▓▓▓▓▓░░░░  72%  │ │r │                                          ││
│  │ └────────────────────┘ │  │                                          ││
│  │   Item rows (nudge)    │  │                                          ││
│  │ ────────────────────── │  │                                          ││
│  │ ⌘ Command Palette  ⌘K  │  │                                          ││
│  │ ⚙ Settings         ⌘,  │  │                                          ││
│  └────────────────────────┘  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

### Key Spatial Rules

| Element | Implementation | Why It Works |
| --- | --- | --- |
| **Window background** | `background: var(--body-glow-1), var(--body-glow-2), var(--night)` on `.app-shell` | Subtle corner radial glows (`7%` mint top-left, `6%` indigo bottom-right) give atmospheric depth without fighting text legibility. |
| **Transparent sidebar** | `--sidebar-bg: transparent` in column 1 of a 3-column CSS Grid (`var(--sidebar-width) 5px minmax(0, 1fr)`) | Traffic lights and brand identity sit seamlessly on the window backdrop with zero double-chrome. |
| **Invisible glowing resizer** | 5px middle track (`.sidebar-resizer`) whose `::after` pill stays `transparent` until hover, focus, or drag | Eliminates permanent dividing lines while still giving unmistakable tactile feedback (`--accent` + glow) the moment the pointer approaches. |
| **Floating inset canvas** | `.app-canvas` has `margin: var(--space-100) var(--space-100) var(--space-100) 0`, `border: 1px solid var(--line)`, `border-radius: 10px`, `box-shadow: var(--shadow-1)` | Creates crisp figure-ground separation in both dark mode (`#10151e` over `#080b11`) and light mode (`#ffffff` over `#f5f6f8`). |
| **Collapsed symmetry** | When `data-sidebar-hidden="true"`, `.app-canvas` receives `margin-left: var(--space-100)` and macOS `.app-topbar` adds `padding-left: 88px` | Keeps all four edges evenly framed and ensures topbar content never collides with macOS traffic lights. |
| **Frosted topbar** | 44px height matching `.sidebar-top`, `backdrop-filter: blur(18px) saturate(1.35)`, housing only compact segmented layout controls | Keeps navigation and chrome lightweight; primary actions belong in the sidebar or inside the active view. |

### Sidebar Internal Anatomy

1. **Traffic-light drag strip (`h-11` / `44px`)** — Empty `data-tauri-drag-region` directly underneath the macOS window controls (`x: 16, y: 17`).
2. **Brand lockup** — Glowing 6px vertical `.brand-mark` pill stretched to match the three identity lines (eyebrow, clickable monospace version badge opening About, truncated H1 workspace title).
3. **Primary navigation** — Compact 30px rounded rows (`Home`, `Workspace`, `Activity`) with translucent mint active fill (`--nav-active-bg`).
4. **Scrollable secondary zone** — Divided by a subtle hairline (`--line-subtle`), with an optional **recessed featured card** (`.sidebar-featured-card`) kept *outside* the scrolling grid so WebKit never miscomputes track height and overlaps rows.
5. **Pinned footer** — Separated by a hairline and anchored to the bottom of the flex column (`Command Palette ⌘K`, `Settings ⌘,`).

---

## 2. Window Chrome & Tauri v2 Integration

The seamless desktop feel depends on coordinating `src-tauri/tauri.conf.json`, `index.html`, and `src-tauri/src/lib.rs`.

### Overlay Titlebar & Anti-Flash Startup

In `src-tauri/tauri.conf.json`:

```json
{
  "label": "main",
  "width": 1280,
  "height": 820,
  "minWidth": 880,
  "minHeight": 560,
  "backgroundColor": "#080b11",
  "decorations": true,
  "titleBarStyle": "Overlay",
  "hiddenTitle": true,
  "trafficLightPosition": { "x": 16, "y": 17 },
  "visible": false
}
```

Why every field matters:
- **`titleBarStyle: "Overlay"` + `hiddenTitle: true`**: Removes the opaque macOS titlebar strip while keeping native window shadows, rounded corners, and traffic lights.
- **`trafficLightPosition: { "x": 16, "y": 17 }`**: Vertically centers the three 12px traffic lights inside the 44px `.sidebar-top` / `.app-topbar` strip (`(44 - 12) / 2 ≈ 16–17px`).
- **`backgroundColor: "#080b11"`**: Eliminates the white native WebView flash during cold start.
- **`visible: false` + unconditional `window.show()` in Rust `setup`**: Lets native geometry restoration and theme setup finish before the first painted frame. Always call `window.show()` *before* any fallible startup work so an error can never strand the app invisible.

### Drag Regions & Least-Privilege Capabilities

Because `Overlay` titlebars remove the native title bar handle, the frontend marks draggable strips with `data-tauri-drag-region=""`. That requires **only** four permissions in `src-tauri/capabilities/main-window.json`:

```json
{
  "windows": ["main"],
  "permissions": [
    "core:event:allow-listen",
    "core:event:allow-unlisten",
    "core:window:allow-start-dragging",
    "core:window:allow-internal-toggle-maximize"
  ]
}
```

- Avoid ambient wildcard grants like `core:default` or `core:window:default`.
- Keep `script-src 'self'` in CSP: Tauri v2 automatically computes and injects the SHA-256 hash of the synchronous pre-paint `<script>` in `index.html` at build time.

### Native Theme & Menu Sync

- Calling `tauriBridge.setNativeTheme(preference)` invokes Rust `set_native_theme`, which calls `window.set_theme(Some(Theme::Dark | Theme::Light) | None)` on every webview window so macOS dialogs, context chrome, and titlebar buttons match the app.
- Native menus (`src-tauri/src/menu.rs`) emit window-targeted events via `app.emit_to("main", event, ())`, keeping shortcuts (`⌘1`–`⌘3`, `⌘K`, `⌘,`, `⌘\`, `⌘I`) aligned between native menu bars and web key handlers.

---

## 3. Design Tokens, Theming & WCAG AA Contrast

Theme palettes are separated into modular stylesheets so any downstream app can customize or swap themes cleanly:
- `src/styles/themes/light.css` — Light theme `--light-*` primitives and fallback rules
- `src/styles/themes/dark.css` — Dark theme `--dark-*` primitives and fallback rules
- `src/styles/tokens.css` — Imports both theme files, manages `color-scheme: light dark` and `light-dark()` resolution, and defines the spacing/density scale and shared `--ease` curve
- `src/styles/app.css` — Bridges tokens into Tailwind CSS v4 via `@theme inline` and registers `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));` so standard Tailwind `dark:*` utilities also follow the active app theme override

### Pre-Paint Bootstrap & Zero-JS Safe CSS

1. `<meta name="color-scheme" content="light dark">` sits in `<head>` so the WebView knows both schemes are supported before parsing CSS.
2. An inline synchronous `<script>` immediately after the `<meta>` reads `localStorage` (`shell-color-scheme`, `shell-density`, `shell-reduced-motion`, `shell-sidebar-width`, `shell-sidebar-hidden`) and updates `<meta>`, `data-theme`, `data-theme-override`, `data-*` attributes, and `--sidebar-width` before first paint.
3. CSS never depends on JavaScript to render the right theme, and also listens to `data-theme-override` so dynamic toggles invalidate immediately in macOS WKWebView:

```css
:root {
  color-scheme: light dark;

  &:has(> head > meta[name="color-scheme"][content="dark"]),
  &[data-theme-override="dark"] {
    color-scheme: dark;
  }

  &:has(> head > meta[name="color-scheme"][content="light"]),
  &[data-theme-override="light"] {
    color-scheme: light;
  }
}
```

4. Color tokens use standard `light-dark(var(--light-...), var(--dark-...))` inside `@supports (color: light-dark(white, black))`, backed by `@media (prefers-color-scheme: dark)` and `:root[data-theme="..."]` fallbacks for older WebViews.
5. In Tauri, `set_native_theme` also updates both `window.set_theme(...)` and `window.set_background_color(...)` (`#080b11` dark / `#f5f6f8` light) so macOS titlebar controls, native dialogs, and window resize edges match the active theme seamlessly.

### Smart 2-State Topbar Toggle vs. 3-State Settings Control

- **Topbar quick toggle (`Topbar.tsx`)**: Computes `target = opposite of currently rendered theme`. If `target` matches the OS preference, it **removes** the stored override (`"system"`) so future scheduled OS theme transitions keep working. If `target` differs from the OS, it stores `"light"` or `"dark"` literally.
- **Settings modal (`SettingsDialog.tsx`)**: Exposes all three explicit states — `System (Currently dark/light)`, `Dark`, and `Light` — because users in Settings are making deliberate long-term choices.

### Density Scale

Switching `:root[data-density="compact"]` compresses the shared spacing scale (`--space-050` through `--space-400`) in one place, tightening margins, padding, and gaps across the shell without duplicating component classes.

### Automated WCAG Contrast Verification

`src/styles/contrast.test.ts` parses `src/styles/tokens.css` directly and fails `npm test` if any palette edit breaks accessibility:
- **WCAG AA text (`≥ 4.5:1`)**: Every text token (`text`, `text-soft`, `muted`, `faint`, `accent-text`, `placeholder`) against every opaque surface (`surface`, `surface-raised`, `surface-soft`, `canvas-bg`, `dialog-bg`) in both light and dark modes.
- **Button gradient stops (`≥ 4.5:1`)**: `--ink` text against every gradient stop of primary buttons (default and hover). Notice how light mode uses darker `--light-accent-text: #0a7a54` and darker button stops (`#0b8259` → `#0a7350`) specifically so white text and accent labels clear `4.5:1`.
- **Scrollbar non-text contrast (`≥ 3.0:1`, WCAG 1.4.11)**: `--scrollbar-thumb` against `--canvas-bg`, ensuring macOS overlay scrollbars remain visible even over transparent tracks.

### Scrollbar Rules

- Use standard `scrollbar-color` and `scrollbar-width: thin` as the base rule.
- **Never transition `scrollbar-color`** (WebKit bug #311752 causes visible flickering).
- Gate legacy `::-webkit-scrollbar` pseudo-elements inside `@supports not (scrollbar-color: auto)` and reset `scrollbar-width: auto` inside that block so engines that ship `scrollbar-width` before `scrollbar-color` do not suppress WebKit styling.

---

## 4. The 4-Tier Transition & Motion System

Every transition in the skeleton follows one shared timing signature:

```css
--ease: cubic-bezier(0.2, 0.8, 0.2, 1);
```

Fast initial departure (`0.2, 0.8`) paired with a long, calm settle (`0.2, 1`) gives controls crisp responsiveness without springy overshoot.

### Tier 1 — GPU-Composited Micro-Transitions (150ms–240ms)

Stay on compositor-friendly properties (`opacity`, `transform`, `color`, `background-color`, `border-color`, `box-shadow`):

| Surface | Motion | Duration |
| --- | --- | --- |
| Primary & secondary buttons | Border/glow highlight on hover; `translateY(1px)` press depression | `150ms var(--ease)` |
| Interactive cards | Subtle `translateY(-1px)` lift + elevated `--shadow-1` | `150ms var(--ease)` |
| Sidebar collection rows | Translucent mint wash + inset `3px` left `--accent` bar | `160ms var(--ease)` |
| Gear / action icons | `rotate(60deg)` on hover; `rotate(90deg) scale(0.9)` on press | `200ms var(--ease)` |
| Sidebar resizer pill | Transparent to `--accent` + glow | `150ms var(--ease)` |
| Progress meters | Smooth `width` interpolation | `240ms var(--ease)` |

### Tier 2 — Interruptible Pointer Motion (`motion/mini`)

Adapted directly from `p-track`'s `plan-motion.js`, `src/lib/motion.ts` exports `bindRowNudge(row, label)`:

- On `pointerenter` (ignoring `pointerType === "touch"`), animates **only the inner text label** by `translateX(4px)` over `160ms` with `[0.2, 0.8, 0.2, 1]`.
- On `pointerdown`, interrupts the active animation (`activeAnimation?.stop()`) and pulls back to `translateX(2px)`.
- On `pointerleave` / `pointercancel`, smoothly returns to `0px`.
- **Why only the label moves**: The row's hit target and any trailing action buttons never shift under the cursor, preventing mis-clicks and hover-jitter loops.

> **WebKit / WKWebView Note for 3D Animations:** If you build 3D perspective widgets (such as `p-track`'s cover-flow project carousel), drive `transform` with `motion`'s numeric JS tween (`animate(0, 1, { onUpdate })`) rather than WebKit WAAPI `transform` keyframes, which can drop intermediate 3D matrix updates in native macOS WKWebView.

### Tier 3 — Native Top-Layer `<dialog>` & Slide-Over Drawer Transitions

All modals (`SettingsDialog`, `CommandPalette`, `AboutDialog`) and the right slide-over `InspectorDrawer` are built on `NativeDialog.tsx` using the HTML `<dialog>` element opened via `dialog.showModal()`:

1. **Platform semantics for free**: Top-layer rendering, inert background, focus containment, `Esc` dismissal, and automatic focus return to the invoking button. Do **not** add `role="dialog"`, `aria-modal`, manual focus traps, or `overflow: hidden` on `<body>`.
2. **Prevent scroll chaining**: Apply `overscroll-behavior: contain` on `dialog:modal` and both `overflow: hidden; overscroll-behavior: contain` on `dialog::backdrop`.
3. **Scope `display` to `[open]`**: Never set `display: flex` unconditionally on `dialog` (it overrides the browser's closed `display: none`).
4. **Modern top-layer entry & exit**:
   - Declare `transition-property: opacity, transform, display, overlay;` and a **separate** `transition-behavior: allow-discrete;` line (never put `allow-discrete` inside the `transition` shorthand or older engines drop the entire declaration).
   - Define entry start states in `@starting-style` nested inside `dialog.shell-dialog[open]:where(:not([data-closing]))`.
5. **WKWebView / Safari / Firefox exit fallback (`src/lib/top-layer.ts`)**:
   - Because macOS WKWebView (Safari) and Firefox do not yet support CSS `overlay` transitions (and Firefox bug 1882408 reports `allow-discrete` without animating `display`), `closeTopLayerDialog()` probes real support lazily (`supportsTopLayerExit()`).
   - When native top-layer exit is unavailable, it sets `data-closing=""`, waits for `dialog.getAnimations({ subtree: true })` to finish (with a safety timeout), removes `data-closing`, and then calls `dialog.close()`.
   - `NativeDialog` also intercepts `cancel` (`Esc`) through `closeTopLayerDialog()` and attaches a pointer-bounds `bindDialogLightDismiss()` fallback when `HTMLDialogElement.prototype.closedBy` is missing (WKWebView/Safari).
6. **Drawer scrim choice**: Centered modals blur the backdrop (`blur(10px) saturate(1.15)`), while slide-over drawers (`shell-dialog--drawer`) use a **light, unblurred scrim** (`--drawer-scrim`) so the user can still read the canvas content they are inspecting.

### Tier 4 — Route View Transitions with TanStack Router

Navigating between `Home`, `Workspace`, and `Activity` passes `viewTransition: !isReducedMotionDomActive()` to TanStack Router:

- `.app-sidebar` (`view-transition-name: shell-sidebar`) and `.app-topbar` (`view-transition-name: shell-topbar`) disable their snapshot animations (`animation: none`), so persistent chrome stays completely stationary.
- `.canvas-route-stage` (`view-transition-name: canvas-stage`) cross-fades out (`140ms`, `-4px` Y) and fades in (`190ms`, `+6px` Y).
- **Mandatory Focus Routing**: View Transitions do not move keyboard focus. Every route renders `<RouteHeading />` (`tabIndex={-1}`), which focuses itself on mount so keyboard and screen-reader users immediately land in the new view's context.

### 3-State Reduced Motion Contract (`system` | `always` | `never`)

Rather than applying a destructive global `* { animation-duration: 0.01ms !important }` override (which can break `transitionend` listeners and make progress indicators flash abruptly):

- **Spatial motion is opt-in**: Button press translation, card hover lift, icon spin, and dialog/drawer slide/scale transforms are gated behind `@media (prefers-reduced-motion: no-preference)` (with `:root:not([data-reduced-motion="always"])`) and explicit `:root[data-reduced-motion="never"]`.
- **Non-spatial transitions stay intact**: Color, border, background hover feedback, and a brief `80ms` dialog opacity fade remain smooth under reduced motion.
- **JS and CSS share one contract**: `isReducedMotionDomActive()` checks `data-reduced-motion` + `matchMedia("(prefers-reduced-motion: reduce)")` before launching any `motion/mini` tween or `document.startViewTransition`.

---

## 5. TanStack + Tailwind CSS v4 Architecture

### Clear State Boundaries

| State Category | Library | Examples |
| --- | --- | --- |
| **Navigation & URL state** | `@tanstack/react-router` | Active view (`/`, `/workspace`, `/activity`), route loaders, intent preloading |
| **Backend / IPC async state** | `@tanstack/react-query` | `get_app_info`, `list_starter_items`, future Rust commands, caching & refetching |
| **Client UI & shell preferences** | `@tanstack/react-store` | Sidebar width/hidden, theme, density, reduced motion, overlay open flags, toasts |

### Why Hash History for Tauri?

`src/router.tsx` uses `createHashHistory()`. In production Tauri bundles served from `tauri://localhost` or `http://tauri.localhost`, hash routing guarantees zero 404 errors on reload, deep links, or multi-window URLs without extra server rewrite rules.

### Browser Preview Fallback (`src/lib/tauri-bridge.ts`)

Every Rust IPC call passes through `tauriBridge`. When `window.__TAURI_INTERNALS__` is absent (e.g. during fast `npm run dev` UI iteration in a standard browser), `tauriBridge` returns typed fallback data and safely no-ops native event subscriptions.

### Tailwind CSS v4 `@theme inline` Bridge

`src/styles/app.css` maps every semantic CSS custom property into Tailwind's theme namespace (`--color-canvas`, `--color-surface-raised`, `--color-ink-primary`, `--color-accent-text`, `--ease-shell`). As a result, utility classes like `bg-surface-raised text-ink-primary border-line ease-shell` automatically adapt to dark mode, light mode, and forced-colors mode with zero `dark:` prefix duplication.

### Recommended Browser / WebView Policy

Because Tauri apps run on known desktop WebViews (macOS WKWebView / Safari 16+, Windows WebView2 / Chromium, Linux WebKitGTK), you can document an explicit support policy in your project's `AGENTS.md`:

> **WebView Support Policy:** Target Tauri desktop WebViews (macOS WKWebView, Windows WebView2, Linux WebKitGTK). Allow Baseline Newly Available CSS/HTML features when paired with lightweight progressive-enhancement fallbacks (≤ 30 lines, zero polyfill dependencies) for WKWebView gaps (`overlay` exit animations, `dialog.closedBy`, `scrollbar-color`).

---

## 6. Extending the Skeleton (Cookbook)

### Add a New Route

1. Create `src/routes/analytics.tsx` exporting `Route = createFileRoute("/analytics")({ ... })` with `<RouteHeading eyebrow="..." title="Analytics" />`.
2. Run `npm run dev` or `npm run build` — `@tanstack/router-plugin` automatically updates `src/routeTree.gen.ts`.
3. Add a `<SidebarNavItem to="/analytics" ... />` entry in `src/components/shell/Sidebar.tsx`, a command entry in `src/components/overlays/CommandPalette.tsx`, and optional shortcut/menu wiring in `KeyboardShortcuts.tsx` + `src-tauri/src/menu.rs`.

### Add a New Rust Tauri Command + TanStack Query Hook

1. Add `#[tauri::command]` in `src-tauri/src/commands.rs` and register it inside `tauri::generate_handler![...]` in `src-tauri/src/lib.rs`.
2. Add a typed method with a browser fallback in `src/lib/tauri-bridge.ts`.
3. Export a `queryOptions(...)` object and key in `src/lib/queries.ts`.
4. Preload it in a route `loader` (`queryClient.ensureQueryData(...)`) and read it with `useQuery(...)`.

### Add a New Modal or Slide-Over Drawer

1. Add a boolean state flag and action to `src/stores/shell-store.ts`.
2. Wrap your content in `<NativeDialog open={open} onClose={...} variant="default" | "drawer" ariaLabelledBy="...">`.
3. Provide a visible close `<button>` and put `autofocus` on the primary input (or safe cancel action for destructive confirmations).

### Customize the Palette Safely

1. Edit the `--light-*` primitives in `src/styles/themes/light.css` and the `--dark-*` primitives in `src/styles/themes/dark.css`.
2. Run `npm test` — `src/styles/contrast.test.ts` immediately checks all 71 WCAG AA and 1.4.11 contrast pairs across both themes.

---

## 7. Verification Checklist

Run these commands before committing changes or cutting a release:

```bash
npm run typecheck          # Strict TypeScript verification
npm test                   # Layout, reduced-motion, theme toggle, and 71 WCAG contrast tests
npm run build              # Production Vite 8 + Tailwind v4 + TanStack Router bundle
cd src-tauri && cargo test # Rust lints (#![forbid(unsafe_code)]), Tauri compile, menu tests
```
