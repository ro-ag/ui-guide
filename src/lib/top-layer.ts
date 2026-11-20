/**
 * Modern Top-Layer <dialog> Fallback Utilities
 *
 * Ensures smooth exit transitions and light-dismiss behavior across every
 * Tauri WebView engine — especially macOS WKWebView (Safari/WebKit) and
 * Linux WebKitGTK, which do not yet implement CSS `overlay` or `closedby`.
 */

let cachedDisplayTransitionSupport: boolean | undefined;

/**
 * Probes whether the current engine genuinely transitions `display: none`
 * when `transition-behavior: allow-discrete` is applied (avoids Firefox
 * bug 1882408 where CSS.supports returns true without actually animating).
 */
export function canTransitionDisplay(): boolean {
  if (cachedDisplayTransitionSupport !== undefined) {
    return cachedDisplayTransitionSupport;
  }
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  cachedDisplayTransitionSupport = getComputedStyle(probe).display === "block";
  probe.remove();
  return cachedDisplayTransitionSupport;
}

export function supportsTopLayerExit(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      window.CSS?.supports?.("overlay", "auto") &&
      canTransitionDisplay(),
  );
}

/**
 * Smoothly closes a modal <dialog>. When the engine lacks native `overlay`
 * transitions (WKWebView / Safari / Firefox), applies `data-closing` so the
 * exit transition plays in the top layer before calling `dialog.close()`.
 */
export async function closeTopLayerDialog(
  dialog: HTMLDialogElement,
): Promise<void> {
  if (!dialog.open) return;

  if (!supportsTopLayerExit()) {
    if (dialog.hasAttribute("data-closing")) return;
    dialog.setAttribute("data-closing", "");
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((animation) => animation.finished)),
        new Promise<void>((resolve) => setTimeout(resolve, 600)),
      ]);
    }
    if (!dialog.hasAttribute("data-closing")) return;
    dialog.removeAttribute("data-closing");
  }

  if (dialog.open) {
    dialog.close();
  }
}

/**
 * Light-dismiss fallback for engines without `dialog.closedBy` (WKWebView/Safari).
 * Requires both pointerdown and pointerup outside the dialog bounding rect so
 * a text-selection drag that finishes over the backdrop does not dismiss it.
 */
export function bindDialogLightDismiss(
  dialog: HTMLDialogElement,
  onRequestClose: () => void,
): () => void {
  if (
    typeof HTMLDialogElement !== "undefined" &&
    "closedBy" in HTMLDialogElement.prototype
  ) {
    return () => {};
  }

  const isOutside = (event: PointerEvent) => {
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  let pressedOutside = false;

  const onPointerDown = (event: PointerEvent) => {
    pressedOutside = isOutside(event);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (pressedOutside && isOutside(event)) {
      onRequestClose();
    }
    pressedOutside = false;
  };

  dialog.addEventListener("pointerdown", onPointerDown);
  dialog.addEventListener("pointerup", onPointerUp);

  return () => {
    dialog.removeEventListener("pointerdown", onPointerDown);
    dialog.removeEventListener("pointerup", onPointerUp);
  };
}
