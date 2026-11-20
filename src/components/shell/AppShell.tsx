import { useSelector } from "@tanstack/react-store";
import type { ReactNode } from "react";
import { shellStore } from "../../stores/shell-store";
import { AboutDialog } from "../overlays/AboutDialog";
import { CommandPalette } from "../overlays/CommandPalette";
import { InspectorDrawer } from "../overlays/InspectorDrawer";
import { SettingsDialog } from "../overlays/SettingsDialog";
import { ToastStack } from "../overlays/ToastStack";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { Sidebar } from "./Sidebar";
import { SidebarResizer } from "./SidebarResizer";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarHidden = useSelector(shellStore, (s) => s.sidebarHidden);

  return (
    <>
      <KeyboardShortcuts />

      <div
        className="app-shell"
        data-sidebar-hidden={sidebarHidden ? "true" : "false"}
      >
        <Sidebar />
        <SidebarResizer />

        <div className="app-canvas">
          <Topbar />
          <main
            aria-label="Workspace content"
            className="canvas-route-stage min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            {children}
          </main>
        </div>
      </div>

      {/* Native top-layer overlays */}
      <SettingsDialog />
      <CommandPalette />
      <InspectorDrawer />
      <AboutDialog />
      <ToastStack />
    </>
  );
}
