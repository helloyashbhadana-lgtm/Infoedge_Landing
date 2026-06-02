"use client";

import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import ParticleCanvas from "../ui/ParticleCanvas";
import "../../styles/hero.css";

/* ===== Word-by-word blur reveal (Linear-style) ===== */

const line1Text = "Building India\u2019s most";
const line2Text = "trusted digital platforms";
const line1Words = line1Text.split(" ");
const line2Words = line2Text.split(" ");

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const line1Container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.2,
    },
  },
};

const line2Container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 1.1,
    },
  },
};

/* ===== Stats ===== */

const statsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0,
    },
  },
};

const statsChildVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

function StatBlock({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const { ref, display } = useAnimatedNumber({ target, suffix });

  return (
    <div className="hero__stat-block" ref={ref}>
      <span className="hero__stat-number">{display}</span>
      <span className="hero__stat-label">{label}</span>
    </div>
  );
}

/* ===== Animated line ===== */

function AnimatedLine({
  fullText,
  words,
  containerVariants,
  sweepActive,
  sweepDuration,
  onSweepEnd,
}: {
  fullText: string;
  words: string[];
  containerVariants: Variants;
  sweepActive: boolean;
  sweepDuration: number;
  onSweepEnd?: () => void;
}) {
  const [blurDone, setBlurDone] = useState(false);
  const [sweepDone, setSweepDone] = useState(false);
  const sweepRef = useRef<HTMLSpanElement>(null);

  /* Listen for sweep animation end so we can swap to normal text with hoverable "trusted" */
  useEffect(() => {
    const el = sweepRef.current;
    if (!el) return;
    const onEnd = () => {
      setSweepDone(true);
      onSweepEnd?.();
    };
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, [sweepActive, blurDone, onSweepEnd]);

  // Phase 1: blur reveal with motion.span words
  if (!blurDone) {
    return (
      <span className="hero__line">
        <motion.span
          className="hero__line-inner"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setBlurDone(true)}
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              <motion.span className="hero__word" variants={wordVariants}>
                {word}
              </motion.span>
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </motion.span>
      </span>
    );
  }

  // Phase 2: sweep active, NO child spans — plain text so background-clip: text works
  if (sweepActive && !sweepDone) {
    return (
      <span className="hero__line">
        <span
          ref={sweepRef}
          className="hero__line-inner hero__line-inner--sweep"
          style={{ "--sweep-duration": `${sweepDuration}s` } as React.CSSProperties}
        >
          {fullText}
        </span>
      </span>
    );
  }

  // Phase 3: sweep done (or no sweep) — normal text
  return (
    <span className="hero__line">
      <span className="hero__line-inner">{fullText}</span>
    </span>
  );
}

/* ===== Hero ===== */

export default function Hero() {
  const [sweepLine1, setSweepLine1] = useState(false);
  const [sweepLine2, setSweepLine2] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Sequence: blur reveal → stats wave → gradient sweep line1 → line2 (event-driven)
    const t1 = setTimeout(() => setShowStats(true), 2200);
    const t2 = setTimeout(() => setSweepLine1(true), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* Line2 sweep starts the instant line1 sweep ends */
  const handleLine1SweepEnd = useCallback(() => {
    setSweepLine2(true);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      {/* Particle canvas — covers entire hero */}
      <ParticleCanvas />

      <div className="hero__content">
        <h1 className="hero__heading">
          <AnimatedLine
            fullText={line1Text}
            words={line1Words}
            containerVariants={line1Container}
            sweepActive={sweepLine1}
            sweepDuration={1.2}
            onSweepEnd={handleLine1SweepEnd}
          />
          <br />
          <AnimatedLine
            fullText={line2Text}
            words={line2Words}
            containerVariants={line2Container}
            sweepActive={sweepLine2}
            sweepDuration={1.5}
          />
        </h1>

        <motion.div
          className="hero__stats"
          variants={statsContainerVariants}
          initial="hidden"
          animate={showStats ? "visible" : "hidden"}
        >
          <motion.div variants={statsChildVariants}>
            <StatBlock target={45000} suffix=" Cr.+" label="Market cap" />
          </motion.div>
          <motion.div className="hero__stat-divider" variants={statsChildVariants} />
          <motion.div variants={statsChildVariants}>
            <StatBlock target={50} suffix="+" label="Active Investments" />
          </motion.div>
          <motion.div className="hero__stat-divider" variants={statsChildVariants} />
          <motion.div variants={statsChildVariants}>
            <StatBlock target={25} suffix="+ Years" label="Building Digital Platforms" />
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
