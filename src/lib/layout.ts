export const DEFAULT_SIDEBAR_WIDTH = 248;
export const MIN_SIDEBAR_WIDTH = 180;
export const MAX_SIDEBAR_WIDTH = 420;

export const SIDEBAR_WIDTH_KEY = "shell-sidebar-width";
export const SIDEBAR_HIDDEN_KEY = "shell-sidebar-hidden";

export function sidebarMaximumWidth(viewportWidth: number): number {
  return Math.max(
    MIN_SIDEBAR_WIDTH,
    Math.min(MAX_SIDEBAR_WIDTH, Math.floor(viewportWidth * 0.45)),
  );
}

export function clampSidebarWidth(width: number, viewportWidth: number): number {
  const responsiveMax = sidebarMaximumWidth(viewportWidth);
  const finite = Number.isFinite(width) ? width : DEFAULT_SIDEBAR_WIDTH;
  return Math.round(
    Math.max(MIN_SIDEBAR_WIDTH, Math.min(finite, responsiveMax)),
  );
}

export function readStoredSidebarWidth(
  rawValue: string | null,
  viewportWidth: number,
): number {
  if (rawValue === null || rawValue.trim() === "") {
    return clampSidebarWidth(DEFAULT_SIDEBAR_WIDTH, viewportWidth);
  }
  return clampSidebarWidth(Number(rawValue), viewportWidth);
}

export function sidebarWidthFromKey(
  currentWidth: number,
  key: string,
  viewportWidth: number,
): number | null {
  switch (key) {
    case "ArrowLeft":
      return clampSidebarWidth(currentWidth - 16, viewportWidth);
    case "ArrowRight":
      return clampSidebarWidth(currentWidth + 16, viewportWidth);
    case "PageDown":
      return clampSidebarWidth(currentWidth - 64, viewportWidth);
    case "PageUp":
      return clampSidebarWidth(currentWidth + 64, viewportWidth);
    case "Home":
      return MIN_SIDEBAR_WIDTH;
    case "End":
      return clampSidebarWidth(MAX_SIDEBAR_WIDTH, viewportWidth);
    default:
      return null;
  }
}

export function safeStorageGet(key: string): string | null {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function safeStorageSet(key: string, value: string | null): void {
  try {
    if (value === null) {
      globalThis.localStorage?.removeItem(key);
    } else {
      globalThis.localStorage?.setItem(key, value);
    }
  } catch {
    // Keep live state functional if storage is unavailable in a sandboxed WebView.
  }
}
