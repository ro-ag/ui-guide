import { motion } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { SHELL_EASE } from "../../lib/motion";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Interactive glass card that tracks pointer coordinates to cast a silky
 * iridescent spotlight across its surface, paired with spring micro-lift.
 */
export function SpotlightCard({
  children,
  className = "",
  onClick,
  ariaLabel,
}: SpotlightCardProps) {
  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--spot-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--spot-y",
      `${event.clientY - rect.top}px`,
    );
  };

  if (onClick) {
    return (
      <motion.button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2, ease: SHELL_EASE }}
        className={`spotlight-card text-left cursor-pointer ${className}`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.section
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
    >
      {children}
    </motion.section>
  );
}
