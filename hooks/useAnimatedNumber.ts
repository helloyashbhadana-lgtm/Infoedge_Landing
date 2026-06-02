"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

interface UseAnimatedNumberOptions {
  target: number;
  duration?: number;
  suffix?: string;
  formatCommas?: boolean;
}

export function useAnimatedNumber({
  target,
  duration = 2,
  suffix = "",
  formatCommas = true,
}: UseAnimatedNumberOptions) {
  const [display, setDisplay] = useState("0");
  const motionValue = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const controls = animate(motionValue, target, {
            duration,
            ease: "easeOut",
            onUpdate: (value) => {
              const rounded = Math.round(value);
              const formatted = formatCommas
                ? rounded.toLocaleString("en-IN")
                : String(rounded);
              setDisplay(formatted + suffix);
            },
          });

          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration, suffix, formatCommas, motionValue]);

  return { ref, display };
}
