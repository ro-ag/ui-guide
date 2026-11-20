import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { bindRowNudge, isReducedMotionDomActive } from "../../lib/motion";
import { SPRING_PILL } from "../ui/MotionPrimitives";

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
      {active ? (
        <motion.span
          layoutId="sidebar-active-nav"
          transition={SPRING_PILL}
          className="sidebar-active-pill"
          aria-hidden="true"
        />
      ) : null}
      <span
        className={`relative z-10 shrink-0 transition-colors duration-150 ${
          active ? "text-accent-text" : "opacity-80"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span ref={labelRef} className="relative z-10 min-w-0 flex-1 truncate">
        {label}
      </span>
      <kbd className="relative z-10 shrink-0 font-mono text-[0.6875rem] text-ink-faint opacity-80">
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
 * Collection item row pairing spring-gliding `layoutId` active pill with
 * interruptible `motion/mini` title nudge (stationary hit target).
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
      className="sidebar-row group"
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active-space"
          transition={SPRING_PILL}
          className="sidebar-active-pill"
          aria-hidden="true"
        />
      ) : null}
      <span
        ref={labelRef}
        className={`relative z-10 min-w-0 flex-1 truncate ${
          active
            ? "font-semibold text-[var(--nav-active-text)]"
            : settled
              ? "font-medium text-ink-faint"
              : "font-semibold text-ink-soft group-hover:text-ink-primary"
        }`}
      >
        {title}
      </span>
      <span className="relative z-10 flex shrink-0 items-center">
        {trailing}
      </span>
    </button>
  );
}
