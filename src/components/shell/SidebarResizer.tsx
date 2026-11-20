import { useSelector } from "@tanstack/react-store";
import { useEffect, useRef, useState } from "react";
import {
  MIN_SIDEBAR_WIDTH,
  sidebarMaximumWidth,
  sidebarWidthFromKey,
} from "../../lib/layout";
import { shellStore } from "../../stores/shell-store";

export function SidebarResizer() {
  const sidebarWidth = useSelector(shellStore, (s) => s.sidebarWidth);
  const sidebarHidden = useSelector(shellStore, (s) => s.sidebarHidden);
  const handleRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  // Re-clamp width whenever the desktop window resizes narrower.
  useEffect(() => {
    const onWindowResize = () => {
      shellStore.actions.setSidebarWidth(shellStore.state.sidebarWidth, false);
    };
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);

  const maxWidth =
    typeof window === "undefined" ? 420 : sidebarMaximumWidth(window.innerWidth);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (sidebarHidden || event.button !== 0) return;
    const handle = handleRef.current;
    if (!handle) return;

    event.preventDefault();
    const startX = event.clientX;
    const startWidth = shellStore.state.sidebarWidth;
    const pointerId = event.pointerId;

    setDragging(true);
    handle.setPointerCapture(pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      shellStore.actions.setSidebarWidth(
        startWidth + moveEvent.clientX - startX,
        false,
      );
    };

    const cleanup = () => {
      setDragging(false);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onFinish);
      handle.removeEventListener("pointercancel", onFinish);
      handle.removeEventListener("lostpointercapture", onFinish);
      if (handle.hasPointerCapture(pointerId)) {
        handle.releasePointerCapture(pointerId);
      }
    };

    const onFinish = (finishEvent: Event) => {
      if (
        finishEvent.type !== "lostpointercapture" &&
        "pointerId" in finishEvent &&
        finishEvent.pointerId !== pointerId
      ) {
        return;
      }
      cleanup();
      shellStore.actions.setSidebarWidth(shellStore.state.sidebarWidth, true);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onFinish);
    handle.addEventListener("pointercancel", onFinish);
    handle.addEventListener("lostpointercapture", onFinish);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (sidebarHidden) return;
    const nextWidth = sidebarWidthFromKey(
      sidebarWidth,
      event.key,
      window.innerWidth,
    );
    if (nextWidth === null) return;
    event.preventDefault();
    shellStore.actions.setSidebarWidth(nextWidth, true);
  };

  return (
    <div
      ref={handleRef}
      role="separator"
      tabIndex={0}
      aria-label="Resize sidebar"
      aria-orientation="vertical"
      aria-valuemin={MIN_SIDEBAR_WIDTH}
      aria-valuemax={maxWidth}
      aria-valuenow={sidebarWidth}
      data-dragging={dragging ? "true" : undefined}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="sidebar-resizer"
    />
  );
}
