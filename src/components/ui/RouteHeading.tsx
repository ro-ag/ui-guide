import { useEffect, useRef } from "react";

interface RouteHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Accessible route heading that receives programmatic focus after a
 * route navigation (including after View Transitions settle), preserving
 * keyboard and screen-reader context without visible outline noise.
 */
export function RouteHeading({
  eyebrow,
  title,
  description,
}: RouteHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [title]);

  return (
    <header className="mb-6">
      <p className="mb-1 text-[0.6875rem] font-extrabold tracking-[0.16em] text-accent-text uppercase">
        {eyebrow}
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-[1.5rem] leading-tight font-bold tracking-[-0.03em] text-ink-primary outline-none focus-visible:shadow-none"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-[64ch] text-xs leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
