"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ParticleCanvas from "../../ui/ParticleCanvas";
import "../../../styles/hero.css";

function AnimatedLine({
  text,
  sweepActive,
  sweepDuration,
  onSweepEnd,
}: {
  text: string;
  sweepActive: boolean;
  sweepDuration: number;
  onSweepEnd?: () => void;
}) {
  const [sweepDone, setSweepDone] = useState(false);
  const sweepRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = sweepRef.current;
    if (!el) return;
    const onEnd = () => {
      setSweepDone(true);
      onSweepEnd?.();
    };
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, [sweepActive, onSweepEnd]);

  if (sweepActive && !sweepDone) {
    return (
      <span className="hero__line">
        <span
          ref={sweepRef}
          className="hero__line-inner hero__line-inner--sweep"
          style={{ "--sweep-duration": `${sweepDuration}s` } as React.CSSProperties}
        >
          {text}
        </span>
      </span>
    );
  }

  return (
    <span className="hero__line">
      <span className="hero__line-inner">{text}</span>
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [sweepLine1, setSweepLine1] = useState(false);
  const [sweepLine2, setSweepLine2] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSweepLine1(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleLine1SweepEnd = useCallback(() => {
    setSweepLine2(true);
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <ParticleCanvas />

      <div className="hero__content">
        <h1 className="hero__heading">
          <AnimatedLine
            text="Building India&#8217;s most"
            sweepActive={sweepLine1}
            sweepDuration={2.0}
            onSweepEnd={handleLine1SweepEnd}
          />
          <br />
          <AnimatedLine
            text="trusted digital platforms"
            sweepActive={sweepLine2}
            sweepDuration={2.4}
          />
        </h1>

        <div className="hero__stats">
          <div className="hero__stat-block">
            <span className="hero__stat-number">45,000 Cr.+</span>
            <span className="hero__stat-label">Market cap</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat-block">
            <span className="hero__stat-number">50+</span>
            <span className="hero__stat-label">Active Investments</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat-block">
            <span className="hero__stat-number">25+ Years</span>
            <span className="hero__stat-label">Building Trust</span>
          </div>
        </div>
      </div>
    </section>
  );
}
