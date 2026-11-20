import { type ReactNode, useEffect, useRef } from "react";
import {
  bindDialogLightDismiss,
  closeTopLayerDialog,
} from "../../lib/top-layer";

interface NativeDialogProps {
  open: boolean;
  onClose: () => void;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  variant?: "default" | "settings" | "palette" | "drawer";
  lightDismiss?: boolean;
  children: ReactNode;
}

/**
 * Native top-layer <dialog> using `showModal()`.
 *
 * Delegates focus containment, inert background, top-layer stacking, `Esc`
 * handling, and focus restoration to the platform, while layering smooth
 * `@starting-style` entry/exit transitions and WKWebView/Safari fallbacks.
 */
export function NativeDialog({
  open,
  onClose,
  ariaLabelledBy,
  ariaLabel,
  variant = "default",
  lightDismiss = true,
  children,
}: NativeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.removeAttribute("data-closing");
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      void closeTopLayerDialog(dialog);
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const requestClose = () => {
      void closeTopLayerDialog(dialog);
    };

    const handleCancel = (event: Event) => {
      // Intercept native Esc / light-dismiss cancel so WKWebView & Firefox
      // play the exit transition before removing the dialog from the top layer.
      event.preventDefault();
      requestClose();
    };

    const handleClose = () => {
      // Always clear returnValue so stale button values never leak across opens.
      dialog.returnValue = "";
      dialog.removeAttribute("data-closing");
      onCloseRef.current();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    const unbindLightDismiss = lightDismiss
      ? bindDialogLightDismiss(dialog, requestClose)
      : () => {};

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
      unbindLightDismiss();
    };
  }, [lightDismiss]);

  const variantClass =
    variant === "default" ? "" : ` shell-dialog--${variant}`;

  const nativeAttributes = {
    closedby: lightDismiss ? "any" : "closerequest",
  } as Record<string, string>;

  return (
    <dialog
      ref={dialogRef}
      className={`shell-dialog${variantClass}`}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      {...nativeAttributes}
    >
      {children}
    </dialog>
  );
}
