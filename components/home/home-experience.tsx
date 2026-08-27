"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { products, type Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";
import { BlurLogo } from "@/components/brand/blur-mark";
import { ProductVisual } from "@/components/product/product-visual";
import { Grain } from "@/components/ui/grain";
import { PixelField } from "@/components/ui/pixel-field";
import { useBlurStore } from "@/store/blur-store";

type Placement = {
  productId: string;
  x: string;
  y: string;
  width: string;
  rotation: string;
  scale: number;
  mobileOrder: number;
  driftY: number;
  driftX: number;
  driftRotate: number;
  duration: number;
  delay: number;
  parallaxY: number;
  parallaxX: number;
};

// This composition is intentionally hand-positioned. It must never randomize between renders.
const productZones: Placement[][] = [
  [
    { productId: "blr-001", x: "9%", y: "25%", width: "28%", rotation: "-12deg", scale: 0.95, mobileOrder: 1, driftY: -10, driftX: 4, driftRotate: 1, duration: 9, delay: 0, parallaxY: -38, parallaxX: 6 },
    { productId: "blr-002", x: "63%", y: "18%", width: "22%", rotation: "9deg", scale: 0.83, mobileOrder: 2, driftY: 9, driftX: -5, driftRotate: -1, duration: 11, delay: 1.5, parallaxY: 42, parallaxX: -8 },
    { productId: "blr-003", x: "36%", y: "51%", width: "23%", rotation: "-2deg", scale: 0.8, mobileOrder: 3, driftY: -7, driftX: 3, driftRotate: 0.5, duration: 13, delay: 0.3, parallaxY: -28, parallaxX: 9 },
    { productId: "blr-004", x: "76%", y: "62%", width: "18%", rotation: "14deg", scale: 0.7, mobileOrder: 4, driftY: 7, driftX: 4, driftRotate: -1, duration: 10, delay: 2.2, parallaxY: 34, parallaxX: -3 },
    { productId: "blr-005", x: "5%", y: "72%", width: "19%", rotation: "-7deg", scale: 0.66, mobileOrder: 5, driftY: -6, driftX: -3, driftRotate: 1, duration: 12, delay: 1, parallaxY: 18, parallaxX: 5 },
  ],
  [
    { productId: "blr-006", x: "18%", y: "15%", width: "31%", rotation: "-3deg", scale: 1.03, mobileOrder: 1, driftY: 9, driftX: -4, driftRotate: -0.5, duration: 12, delay: 0.5, parallaxY: -45, parallaxX: -8 },
    { productId: "blr-007", x: "64%", y: "20%", width: "28%", rotation: "-10deg", scale: 0.93, mobileOrder: 2, driftY: -8, driftX: 5, driftRotate: 1, duration: 10, delay: 0.2, parallaxY: 38, parallaxX: 10 },
    { productId: "blr-008", x: "7%", y: "61%", width: "23%", rotation: "8deg", scale: 0.79, mobileOrder: 3, driftY: 5, driftX: 2, driftRotate: -0.5, duration: 14, delay: 1.8, parallaxY: 24, parallaxX: -6 },
    { productId: "blr-009", x: "41%", y: "67%", width: "23%", rotation: "-3deg", scale: 0.76, mobileOrder: 4, driftY: -7, driftX: -4, driftRotate: 1, duration: 11, delay: 0.8, parallaxY: -22, parallaxX: 8 },
    { productId: "blr-010", x: "77%", y: "66%", width: "18%", rotation: "-15deg", scale: 0.66, mobileOrder: 5, driftY: 6, driftX: 3, driftRotate: -1, duration: 9, delay: 1.2, parallaxY: 31, parallaxX: -4 },
  ],
  [
    { productId: "blr-011", x: "7%", y: "19%", width: "27%", rotation: "7deg", scale: 0.89, mobileOrder: 1, driftY: -9, driftX: 4, driftRotate: 1, duration: 13, delay: 0.6, parallaxY: 41, parallaxX: 4 },
    { productId: "blr-012", x: "44%", y: "9%", width: "21%", rotation: "-13deg", scale: 0.72, mobileOrder: 2, driftY: 7, driftX: -3, driftRotate: -0.5, duration: 10, delay: 0, parallaxY: -32, parallaxX: -5 },
    { productId: "blr-013", x: "74%", y: "22%", width: "21%", rotation: "3deg", scale: 0.74, mobileOrder: 3, driftY: -6, driftX: 5, driftRotate: 1, duration: 12, delay: 1, parallaxY: 28, parallaxX: 8 },
    { productId: "blr-014", x: "24%", y: "62%", width: "33%", rotation: "-5deg", scale: 1.04, mobileOrder: 4, driftY: 9, driftX: -4, driftRotate: -1, duration: 14, delay: 0.4, parallaxY: -48, parallaxX: -7 },
    { productId: "blr-015", x: "69%", y: "66%", width: "19%", rotation: "13deg", scale: 0.67, mobileOrder: 5, driftY: -5, driftX: 2, driftRotate: 0.5, duration: 11, delay: 2, parallaxY: 19, parallaxX: 3 },
  ],
  [
    { productId: "blr-016", x: "10%", y: "17%", width: "23%", rotation: "-10deg", scale: 0.77, mobileOrder: 1, driftY: 7, driftX: 3, driftRotate: -1, duration: 10, delay: 1.5, parallaxY: 34, parallaxX: -4 },
    { productId: "blr-017", x: "51%", y: "21%", width: "32%", rotation: "8deg", scale: 0.99, mobileOrder: 2, driftY: -9, driftX: -4, driftRotate: 0.5, duration: 13, delay: 0.3, parallaxY: -43, parallaxX: 8 },
    { productId: "blr-018", x: "76%", y: "59%", width: "19%", rotation: "-6deg", scale: 0.68, mobileOrder: 3, driftY: 6, driftX: 4, driftRotate: -0.5, duration: 11, delay: 0.8, parallaxY: 22, parallaxX: 5 },
    { productId: "blr-019", x: "18%", y: "65%", width: "28%", rotation: "5deg", scale: 0.89, mobileOrder: 4, driftY: -8, driftX: -4, driftRotate: 1, duration: 12, delay: 1.4, parallaxY: -37, parallaxX: -7 },
    { productId: "blr-020", x: "48%", y: "72%", width: "21%", rotation: "-14deg", scale: 0.7, mobileOrder: 5, driftY: 5, driftX: 2, driftRotate: -1, duration: 9, delay: 0.5, parallaxY: 25, parallaxX: 6 },
  ],
];

const byId = new Map(products.map((product) => [product.id, product]));

function FloatingProduct({
  placement,
  active,
  setActive,
  scrollY,
}: {
  placement: Placement;
  active: Product | null;
  setActive: (product: Product | null) => void;
  scrollY: MotionValue<number>;
}) {
  const product = byId.get(placement.productId)!;
  const { currency } = useBlurStore();
  const reduceMotion = useReducedMotion();
  const isActive = active?.id === product.id;
  const depth = placement.scale >= 0.94 ? "near" : placement.scale <= 0.72 ? "far" : "mid";
  const parallaxY = useSpring(useTransform(scrollY, [0, 5800], [0, placement.parallaxY]), { stiffness: 42, damping: 28, mass: 0.4 });
  const parallaxX = useSpring(useTransform(scrollY, [0, 5800], [0, placement.parallaxX]), { stiffness: 42, damping: 28, mass: 0.4 });
  const style = {
    "--x": placement.x,
    "--y": placement.y,
    "--width": placement.width,
    "--rotation": placement.rotation,
    "--scale": String(placement.scale),
    "--mobile-order": String(placement.mobileOrder),
  } as CSSProperties;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`floating-product depth-${depth} ${active && !isActive ? "is-muted" : ""} ${isActive ? "is-active" : ""}`}
      style={style}
      onPointerEnter={() => setActive(product)}
      onPointerLeave={() => setActive(null)}
      onPointerCancel={() => setActive(null)}
      onFocus={() => setActive(product)}
      onBlur={() => setActive(null)}
      onPointerDown={() => setActive(product)}
      data-product-link="true"
      data-cursor-label="view"
      aria-label={`View ${product.code} ${product.name}, ${formatCurrency(product.priceUSD, currency)}`}
    >
      <m.div className="parallax-motion" style={{ x: parallaxX, y: parallaxY }}>
        <m.div
          className="float-motion"
          animate={reduceMotion ? undefined : { y: [0, placement.driftY * 1.3, 0], x: [0, placement.driftX * 1.2, 0], rotate: [0, placement.driftRotate * 1.2, 0] }}
          transition={reduceMotion ? undefined : { duration: placement.duration, delay: placement.delay, ease: "easeInOut", repeat: Infinity }}
        >
          <ProductVisual product={product} />
          <span className="floating-meta">
            <span>{product.code.toLowerCase().replace("-", "–")} / {product.name.toLowerCase()}</span>
            <span>{product.lensColor.toLowerCase()} lens / {product.frameColor.toLowerCase()} frame</span>
            <span>{formatCurrency(product.priceUSD, currency)}</span>
          </span>
        </m.div>
      </m.div>
    </Link>
  );
}

export function HomeExperience() {
  const [active, setActive] = useState<Product | null>(null);
  const { scrollY } = useScroll();
  const clearActive = useCallback(() => setActive(null), []);
  const background = active?.backgroundColor ?? "#b8d6e1";

  useEffect(() => {
    const clearForPageChange = () => clearActive();

    window.addEventListener("scroll", clearForPageChange, { passive: true });
    window.addEventListener("blur", clearForPageChange);
    window.addEventListener("popstate", clearForPageChange);

    return () => {
      window.removeEventListener("scroll", clearForPageChange);
      window.removeEventListener("blur", clearForPageChange);
      window.removeEventListener("popstate", clearForPageChange);
    };
  }, [clearActive]);

  const handleCanvasPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.target instanceof Element && !event.target.closest("[data-product-link]")) {
      clearActive();
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <main
        id="objects"
        className="home-atmosphere"
        style={{ "--atmosphere": background } as CSSProperties}
        onPointerMove={handleCanvasPointerMove}
        onPointerLeave={clearActive}
        onPointerCancel={clearActive}
      >
        <PixelField color={background} />
        <Grain />
        <section className="product-canvas" aria-label="BLUR optical objects 01 through 20">
          <h1 className="sr-only">BLUR eyewear objects 01 through 20</h1>
          {productZones.map((zone, zoneIndex) => (
            <section key={zoneIndex} className={`floating-scene ${zoneIndex === 0 ? "opening-canvas" : ""}`} aria-label={`BLUR optical objects ${zoneIndex * 5 + 1} through ${zoneIndex * 5 + 5}`}>
              {zoneIndex === 0 && <>
                <BlurLogo className="canvas-logo" priority />
                <p className="canvas-index">objects 01—20</p>
                <p className="canvas-scroll">move through the collection <span>↓</span></p>
              </>}
              {zone.map((placement) => <FloatingProduct key={placement.productId} placement={placement} active={active} setActive={setActive} scrollY={scrollY} />)}
            </section>
          ))}
        </section>
        <footer className="minimal-footer"><span>blur / 2026</span><Link href="/campaign">campaign</Link><Link href="/about">about</Link><span>objects 01—20</span></footer>
      </main>
    </LazyMotion>
  );
}
