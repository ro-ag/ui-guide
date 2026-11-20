import { animate } from "motion/mini";
import { safeStorageGet, safeStorageSet } from "./layout";

export type ReducedMotionPreference = "system" | "always" | "never";

export const REDUCED_MOTION_KEY = "shell-reduced-motion";

/** Shared cubic-bezier deceleration curve matching CSS `--ease`. */
export const SHELL_EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export function reducedMotionActive(
  preference: ReducedMotionPreference,
  osPrefersReduced: boolean,
): boolean {
  if (preference === "always") return true;
  if (preference === "never") return false;
  return osPrefersReduced;
}

export function readStoredReducedMotion(): ReducedMotionPreference {
  const stored = safeStorageGet(REDUCED_MOTION_KEY);
  if (stored === "always" || stored === "never") return stored;
  return "system";
}

export function applyReducedMotionPreference(
  preference: ReducedMotionPreference,
): void {
  if (preference === "system") {
    document.documentElement.removeAttribute("data-reduced-motion");
    safeStorageSet(REDUCED_MOTION_KEY, null);
  } else {
    document.documentElement.dataset.reducedMotion = preference;
    safeStorageSet(REDUCED_MOTION_KEY, preference);
  }
}

export function isReducedMotionDomActive(): boolean {
  if (typeof window === "undefined") return false;
  const attr = document.documentElement.dataset.reducedMotion;
  const pref: ReducedMotionPreference =
    attr === "always" || attr === "never" ? attr : "system";
  return reducedMotionActive(
    pref,
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
}

/**
 * Interruptible sidebar-item hover nudge (adapted from p-track's plan-motion).
 *
 * Moves ONLY the inner label node so the row's hit target and trailing
 * action buttons remain completely stationary under the pointer.
 */
export function bindRowNudge(
  row: HTMLElement,
  label: HTMLElement,
  options?: { hoverOffset?: number; pressOffset?: number },
): () => void {
  const hoverOffset = options?.hoverOffset ?? 4;
  const pressOffset = options?.pressOffset ?? 2;
  let activeAnimation: { stop: () => void } | undefined;
  let hovered = false;

  const move = (offset: number) => {
    activeAnimation?.stop();
    if (isReducedMotionDomActive()) {
      label.style.transform = "none";
      return;
    }
    activeAnimation = animate(
      label,
      { transform: `translateX(${offset}px)` },
      { duration: 0.16, ease: SHELL_EASE },
    );
  };

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hovered = true;
    move(hoverOffset);
  };

  const onLeave = () => {
    hovered = false;
    move(0);
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest("[data-row-action]")) return;
    move(pressOffset);
  };

  const onUp = () => move(hovered ? hoverOffset : 0);

  const onCancel = () => {
    hovered = false;
    move(0);
  };

  row.addEventListener("pointerenter", onEnter);
  row.addEventListener("pointerleave", onLeave);
  row.addEventListener("pointerdown", onDown);
  row.addEventListener("pointerup", onUp);
  row.addEventListener("pointercancel", onCancel);

  return () => {
    activeAnimation?.stop();
    row.removeEventListener("pointerenter", onEnter);
    row.removeEventListener("pointerleave", onLeave);
    row.removeEventListener("pointerdown", onDown);
    row.removeEventListener("pointerup", onUp);
    row.removeEventListener("pointercancel", onCancel);
  };
}
