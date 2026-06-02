"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import "../../styles/built-on-purpose.css";

/* ===== Card data ===== */
interface CardData {
  icon: string;
  title: string;
  text: string;
}

const cards: CardData[] = [
  {
    icon: "/assets/vision_icon.svg",
    title: "Vision",
    text: "To create world-class platforms that transform lives enabling millions of Indians to access opportunities in employment, education, real estate, and relationships.",
  },
  {
    icon: "/assets/mission_icon.svg",
    title: "Mission",
    text: "We continuously delight customers in current and new businesses, delivering superior value via platforms, while leveraging entrepreneurial spirit, financial strength, and expertise.",
  },
  {
    icon: "/assets/value_icon.svg",
    title: "Values",
    text: "Customer Delight · Results · Entrepreneurship · Trust · Knowledge — five principles that guide how we build products, grow teams and create lasting value for all stakeholders.",
  },
];

/* ===== Spring-animated interactive card ===== */
const SPRING_STIFFNESS = 0.08;
const SPRING_DAMPING = 0.85;
const MAX_TILT = 8; // degrees
const MAX_SHIFT = 6; // pixels

function InteractiveCard({ card }: { card: CardData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  // Current animated values
  const current = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });
  // Target values from mouse position
  const target = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });
  // Velocity for spring
  const velocity = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

  const animate = useCallback(() => {
    const c = current.current;
    const t = target.current;
    const v = velocity.current;

    // Spring physics for each axis
    v.rx += (t.rx - c.rx) * SPRING_STIFFNESS;
    v.ry += (t.ry - c.ry) * SPRING_STIFFNESS;
    v.tx += (t.tx - c.tx) * SPRING_STIFFNESS;
    v.ty += (t.ty - c.ty) * SPRING_STIFFNESS;

    v.rx *= SPRING_DAMPING;
    v.ry *= SPRING_DAMPING;
    v.tx *= SPRING_DAMPING;
    v.ty *= SPRING_DAMPING;

    c.rx += v.rx;
    c.ry += v.ry;
    c.tx += v.tx;
    c.ty += v.ty;

    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(800px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translate(${c.tx}px, ${c.ty}px)`;
    }

    // Keep animating if still moving
    const isMoving =
      Math.abs(v.rx) > 0.001 ||
      Math.abs(v.ry) > 0.001 ||
      Math.abs(v.tx) > 0.001 ||
      Math.abs(v.ty) > 0.001;

    if (isMoving) {
      raf.current = requestAnimationFrame(animate);
    }
  }, []);

  const startAnimation = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(animate);
  }, [animate]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const wrapper = e.currentTarget;
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1

      // Center-relative: -0.5 to 0.5
      const cx = x - 0.5;
      const cy = y - 0.5;

      // Tilt: rotateX is inverted (mouse top = tilt forward)
      target.current.rx = -cy * MAX_TILT;
      target.current.ry = cx * MAX_TILT;
      // Shift: card moves slightly toward cursor
      target.current.tx = cx * MAX_SHIFT;
      target.current.ty = cy * MAX_SHIFT;

      // Move glow to follow cursor
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(
          600px circle at ${x * 100}% ${y * 100}%,
          ${glowRef.current.dataset.color},
          transparent 70%
        )`;
      }

      startAnimation();
    },
    [startAnimation]
  );

  const handleMouseLeave = useCallback(() => {
    // Spring back to rest
    target.current = { rx: 0, ry: 0, tx: 0, ty: 0 };
    startAnimation();
  }, [startAnimation]);

  // Glow colors per card index
  const glowColors: Record<string, string> = {
    Vision: "rgba(168, 130, 255, 0.45), rgba(255, 150, 200, 0.3)",
    Mission: "rgba(100, 200, 255, 0.45), rgba(150, 230, 200, 0.3)",
    Values: "rgba(255, 170, 120, 0.45), rgba(255, 140, 180, 0.3)",
  };

  return (
    <div
      className="built-on-purpose__card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={glowRef}
        className="built-on-purpose__glow"
        data-color={glowColors[card.title] || "rgba(168, 130, 255, 0.45)"}
      />
      <div ref={cardRef} className="built-on-purpose__card">
        <div className="built-on-purpose__icon">
          <Image src={card.icon} alt={card.title} width={40} height={40} />
        </div>
        <h3 className="built-on-purpose__card-title">{card.title}</h3>
        <p className="built-on-purpose__card-text">{card.text}</p>
      </div>
    </div>
  );
}

/* ===== Main Section ===== */
export default function BuiltOnPurpose() {
  return (
    <section className="built-on-purpose">
      <div className="built-on-purpose__container">
        {/* Header row */}
        <div className="built-on-purpose__header">
          <h2 className="built-on-purpose__heading">
            Built on purpose.
            <br />
            Driven by values.
          </h2>
          <p className="built-on-purpose__description">
            A technology-driven company with a strong culture of
            entrepreneurship, governance and long-term value creation.
          </p>
        </div>

        {/* Cards */}
        <div className="built-on-purpose__cards">
          {cards.map((card) => (
            <InteractiveCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
