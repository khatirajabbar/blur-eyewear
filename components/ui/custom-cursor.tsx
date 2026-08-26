"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateCapability = () => setEnabled(pointer.matches && !reducedMotion.matches);
    updateCapability();
    pointer.addEventListener("change", updateCapability);
    reducedMotion.addEventListener("change", updateCapability);

    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor-label]");
      setLabel(target?.dataset.cursorLabel ?? "");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      pointer.removeEventListener("change", updateCapability);
      reducedMotion.removeEventListener("change", updateCapability);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  if (!enabled) return null;
  return (
    <span
      className={`custom-cursor ${label ? "cursor-labelled" : ""}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
