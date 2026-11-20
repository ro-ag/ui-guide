import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef } from "react";
import { bindRowNudge, isReducedMotionDomActive } from "../../lib/motion";

interface SidebarNavItemProps {
  to: "/" | "/workspace" | "/activity";
  label: string;
  shortcut: string;
  icon: ReactNode;
  active: boolean;
}

export function SidebarNavItem({
  to,
  label,
  shortcut,
  icon,
  active,
}: SidebarNavItemProps) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const labelNode = labelRef.current;
    if (!row || !labelNode) return;
    return bindRowNudge(row, labelNode);
  }, []);

  return (
    <Link
      ref={rowRef}
      to={to}
      viewTransition={!isReducedMotionDomActive()}
      title={`${label} — ${shortcut}`}
      aria-current={active ? "page" : undefined}
      className="sidebar-row"
    >
      <span className="shrink-0 opacity-80" aria-hidden="true">
        {icon}
      </span>
      <span ref={labelRef} className="min-w-0 flex-1 truncate">
        {label}
      </span>
      <kbd className="shrink-0 font-mono text-[0.6875rem] text-ink-faint opacity-75">
        {shortcut}
      </kbd>
    </Link>
  );
}

interface SidebarCollectionItemProps {
  title: string;
  active: boolean;
  settled?: boolean;
  onSelect: () => void;
  trailing?: ReactNode;
}

/**
 * Collection item row demonstrating p-track's interruptible `motion/mini`
 * title nudge paired with the inset 3px left accent hover indicator.
 */
export function SidebarCollectionItem({
  title,
  active,
  settled = false,
  onSelect,
  trailing,
}: SidebarCollectionItemProps) {
  const rowRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const labelNode = labelRef.current;
    if (!row || !labelNode) return;
    return bindRowNudge(row, labelNode);
  }, []);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onSelect}
      data-active={active ? "true" : undefined}
      aria-pressed={active}
      className="sidebar-row sidebar-row--accent-hover group"
    >
      <span
        ref={labelRef}
        className={`min-w-0 flex-1 truncate ${
          active
            ? "font-semibold text-[var(--nav-active-text)]"
            : settled
              ? "font-medium text-ink-faint"
              : "font-semibold text-ink-primary"
        }`}
      >
        {title}
      </span>
      {trailing}
    </button>
  );
}
