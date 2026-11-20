import { describe, expect, it } from "vitest";
import {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  clampSidebarWidth,
  readStoredSidebarWidth,
  sidebarMaximumWidth,
  sidebarWidthFromKey,
} from "./layout";
import { reducedMotionActive } from "./motion";
import { nextQuickTogglePreference, resolveTheme } from "./theme";

describe("sidebar layout clamping and keyboard resizing", () => {
  it("clamps width within [180, 420] and 45% of viewport width", () => {
    expect(clampSidebarWidth(100, 1440)).toBe(MIN_SIDEBAR_WIDTH);
    expect(clampSidebarWidth(600, 1440)).toBe(MAX_SIDEBAR_WIDTH);
    expect(clampSidebarWidth(400, 700)).toBe(Math.floor(700 * 0.45));
    expect(sidebarMaximumWidth(320)).toBe(MIN_SIDEBAR_WIDTH);
  });

  it("recovers gracefully from missing or invalid stored values", () => {
    expect(readStoredSidebarWidth(null, 1440)).toBe(DEFAULT_SIDEBAR_WIDTH);
    expect(readStoredSidebarWidth("", 1440)).toBe(DEFAULT_SIDEBAR_WIDTH);
    expect(readStoredSidebarWidth("NaN", 1440)).toBe(DEFAULT_SIDEBAR_WIDTH);
    expect(readStoredSidebarWidth("290", 1440)).toBe(290);
  });

  it("steps cleanly with arrow, page, home, and end keys", () => {
    expect(sidebarWidthFromKey(248, "ArrowLeft", 1440)).toBe(232);
    expect(sidebarWidthFromKey(248, "ArrowRight", 1440)).toBe(264);
    expect(sidebarWidthFromKey(248, "PageDown", 1440)).toBe(184);
    expect(sidebarWidthFromKey(248, "PageUp", 1440)).toBe(312);
    expect(sidebarWidthFromKey(248, "Home", 1440)).toBe(MIN_SIDEBAR_WIDTH);
    expect(sidebarWidthFromKey(248, "End", 1440)).toBe(MAX_SIDEBAR_WIDTH);
    expect(sidebarWidthFromKey(248, "Enter", 1440)).toBeNull();
  });
});

describe("3-state reduced motion resolution", () => {
  it("honors explicit overrides and delegates system to OS media query", () => {
    expect(reducedMotionActive("always", false)).toBe(true);
    expect(reducedMotionActive("never", true)).toBe(false);
    expect(reducedMotionActive("system", true)).toBe(true);
    expect(reducedMotionActive("system", false)).toBe(false);
  });
});

describe("smart 2-state color-scheme toggle", () => {
  it("stores explicit override when diverging and clears back to system when matching OS", () => {
    // OS is light, app is following system (light) -> user flips to dark override.
    expect(nextQuickTogglePreference("system", "light")).toBe("dark");
    // OS changes to dark while override is "dark": rendered is dark -> user flips to light override.
    expect(nextQuickTogglePreference("dark", "dark")).toBe("light");
    // OS is light, override is "dark" -> user flips back to light, matching OS -> clears to "system".
    expect(nextQuickTogglePreference("dark", "light")).toBe("system");
    expect(resolveTheme("system", "dark")).toBe("dark");
    expect(resolveTheme("light", "dark")).toBe("light");
  });
});
