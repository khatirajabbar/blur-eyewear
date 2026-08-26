"use client";

import { useEffect, useRef } from "react";

type Rgb = { r: number; g: number; b: number };

const fieldWidth = 48;
const fieldHeight = 32;

function hexToRgb(value: string): Rgb {
  const hex = value.replace("#", "");
  const expanded = hex.length === 3 ? hex.split("").map((part) => `${part}${part}`).join("") : hex;
  const numeric = Number.parseInt(expanded, 16);

  return {
    r: (numeric >> 16) & 255,
    g: (numeric >> 8) & 255,
    b: numeric & 255,
  };
}

function blend(from: Rgb, to: Rgb, amount: number): Rgb {
  return {
    r: Math.round(from.r + (to.r - from.r) * amount),
    g: Math.round(from.g + (to.g - from.g) * amount),
    b: Math.round(from.b + (to.b - from.b) * amount),
  };
}

function drawField(canvas: HTMLCanvasElement, base: Rgb) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.width = fieldWidth;
  canvas.height = fieldHeight;
  context.imageSmoothingEnabled = false;

  const shadow = blend(base, { r: 12, g: 24, b: 29 }, 0.48);
  const highlight = blend(base, { r: 245, g: 255, b: 252 }, 0.42);

  for (let y = 0; y < fieldHeight; y += 1) {
    for (let x = 0; x < fieldWidth; x += 1) {
      const wave = Math.sin(x * 0.32 + y * 0.13) * 0.18;
      const crossWave = Math.cos(x * 0.1 - y * 0.29) * 0.14;
      const lightPool = Math.max(0, 1 - Math.hypot((x - 9) / 14, (y - 7) / 10)) * 0.42;
      const shadowPool = Math.max(0, 1 - Math.hypot((x - 37) / 13, (y - 25) / 12)) * 0.36;
      const hardBreak = ((x * 7 + y * 11) % 9) / 9 - 0.5;
      const mix = Math.min(1, Math.max(0, 0.56 + wave + crossWave + lightPool - shadowPool + hardBreak * 0.1));
      const tone = blend(shadow, highlight, mix);
      const quantize = (channel: number) => Math.round(channel / 8) * 8;

      context.fillStyle = `rgb(${quantize(tone.r)} ${quantize(tone.g)} ${quantize(tone.b)})`;
      context.fillRect(x, y, 1, 1);
    }
  }
}

export function PixelField({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentColor = useRef<Rgb | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const target = hexToRgb(color);
    const source = currentColor.current ?? target;
    const startedAt = performance.now();
    const duration = 960;
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const rendered = blend(source, target, eased);
      currentColor.current = rendered;
      drawField(canvas, rendered);

      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [color]);

  return <canvas ref={canvasRef} className="pixel-field" aria-hidden="true" />;
}
