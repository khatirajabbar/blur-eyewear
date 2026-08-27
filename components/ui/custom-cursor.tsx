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
  const [showHand, setShowHand] = useState(false);

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
      target instanceof Element ? target.closest<HTMLElement>("[data-product-link][data-cursor-hand]") : null
    );
    const clearHand = () => setShowHand(false);
    const move = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setShowHand(Boolean(productTarget(event.target)));
    };
    const leaveProduct = (event: PointerEvent) => {
      if (productTarget(event.target) && !productTarget(event.relatedTarget)) clearHand();
    };
    const clearOnVisibilityChange = () => {
      if (document.visibilityState !== "visible") clearHand();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leaveProduct, { passive: true });
    window.addEventListener("pointercancel", clearHand, true);
    window.addEventListener("scroll", clearHand, { passive: true, capture: true });
    window.addEventListener("blur", clearHand);
    window.addEventListener("popstate", clearHand);
    document.addEventListener("visibilitychange", clearOnVisibilityChange);
    return () => {
      pointer.removeEventListener("change", updateCapability);
      reducedMotion.removeEventListener("change", updateCapability);
      desktop.removeEventListener("change", updateCapability);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leaveProduct);
      window.removeEventListener("pointercancel", clearHand, true);
      window.removeEventListener("scroll", clearHand, true);
      window.removeEventListener("blur", clearHand);
      window.removeEventListener("popstate", clearHand);
      document.removeEventListener("visibilitychange", clearOnVisibilityChange);
    };
  }, []);

  if (!enabled || !showHand) return null;
  return (
    <span
      className="custom-cursor"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-hidden="true"
    >
      ☞
    </span>
  );
}
