"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SHUFFLE_DURATION_MS = 250;
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

type TextShuffleProps = {
  text: string;
  className?: string;
};

function randomCharacter(character: string) {
  if (UPPERCASE.includes(character)) {
    return UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  }

  if (LOWERCASE.includes(character)) {
    return LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  }

  if (NUMBERS.includes(character)) {
    return NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  }

  // Keep spaces, punctuation and other non-Latin characters fixed in place.
  return character;
}

function makeShuffleFrame(text: string, resolvedCharacters: number) {
  return Array.from(text, (character, index) => (
    index < resolvedCharacters ? character : randomCharacter(character)
  )).join("");
}

/**
 * A compact hover/focus treatment for labels inside links and buttons.
 * It finds its nearest interactive parent so keyboard focus and pointer hover
 * always follow the complete hit area, not only the letters themselves.
 */
export function TextShuffle({ text, className }: TextShuffleProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);
  const [shuffledText, setShuffledText] = useState<string | null>(null);

  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setShuffledText(null);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches) reset();
    };

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, [reset]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const trigger = root.closest<HTMLElement>("a, button, [role='button']") ?? root;

    const play = () => {
      if (reducedMotionRef.current) {
        reset();
        return;
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      const startedAt = window.performance.now();
      setShuffledText(makeShuffleFrame(text, 0));

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / SHUFFLE_DURATION_MS, 1);
        const resolvedCharacters = Math.floor(progress * Array.from(text).length);

        setShuffledText(makeShuffleFrame(text, resolvedCharacters));

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        animationFrameRef.current = null;
        setShuffledText(null);
      };

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    trigger.addEventListener("pointerenter", play);
    trigger.addEventListener("pointerleave", reset);
    trigger.addEventListener("focus", play);
    trigger.addEventListener("blur", reset);

    return () => {
      trigger.removeEventListener("pointerenter", play);
      trigger.removeEventListener("pointerleave", reset);
      trigger.removeEventListener("focus", play);
      trigger.removeEventListener("blur", reset);
      reset();
    };
  }, [reset, text]);

  return (
    <span ref={rootRef} className={className}>
      <span aria-hidden="true">{shuffledText ?? text}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
