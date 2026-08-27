"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const pathname = usePathname();

  return <CursorSurface key={pathname} />;
}

function CursorSurface() {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 761px)");
    const updateCapability = () => setEnabled(pointer.matches && desktop.matches && !reducedMotion.matches);
    updateCapability();
    pointer.addEventListener("change", updateCapability);
    reducedMotion.addEventListener("change", updateCapability);
    desktop.addEventListener("change", updateCapability);

    const productTarget = (target: EventTarget | null) => (
      target instanceof Element ? target.closest<HTMLElement>("[data-product-link]") : null
    );
    const clearLabel = () => setLabel("");
    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      const target = productTarget(event.target);
      setLabel(target?.dataset.cursorLabel ?? "");
    };
    const leaveProduct = (event: PointerEvent) => {
      if (productTarget(event.target) && !productTarget(event.relatedTarget)) clearLabel();
    };
    const clearOnVisibilityChange = () => {
      if (document.visibilityState !== "visible") clearLabel();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leaveProduct, { passive: true });
    window.addEventListener("pointercancel", clearLabel, true);
    window.addEventListener("scroll", clearLabel, { passive: true, capture: true });
    window.addEventListener("blur", clearLabel);
    window.addEventListener("popstate", clearLabel);
    document.addEventListener("visibilitychange", clearOnVisibilityChange);
    return () => {
      pointer.removeEventListener("change", updateCapability);
      reducedMotion.removeEventListener("change", updateCapability);
      desktop.removeEventListener("change", updateCapability);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leaveProduct);
      window.removeEventListener("pointercancel", clearLabel, true);
      window.removeEventListener("scroll", clearLabel, true);
      window.removeEventListener("blur", clearLabel);
      window.removeEventListener("popstate", clearLabel);
      document.removeEventListener("visibilitychange", clearOnVisibilityChange);
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
