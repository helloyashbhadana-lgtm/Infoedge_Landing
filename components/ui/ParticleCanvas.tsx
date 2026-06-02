"use client";

import { useEffect, useRef, useCallback } from "react";

/* ================================================================
   Particle types
   ================================================================ */

interface AmbientParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  driftAngle: number;
  driftSpeed: number;
}

/* ================================================================
   Gradient sweep colors — cycle through these based on angle
   ================================================================ */

const SWEEP_COLORS = [
  [38, 93, 245],    // Naukri #265DF5
  [230, 49, 87],    // Jeevansathi #E63157
  [26, 129, 195],   // 99acres #1A81C3
  [1, 128, 140],    // Shiksha #01808C
  [1, 149, 41],     // iimjobs #019529
  [251, 70, 22],    // Hirist #FB4616
  [38, 166, 154],   // JobHai #26A69A
  [45, 95, 172],    // Zwayam #2D5FAC
  [38, 93, 245],    // Naukri (loop)
];

function getSweepColor(angle: number, intensity: number): string {
  const t = ((angle + Math.PI) / (Math.PI * 2)) % 1;
  const segCount = SWEEP_COLORS.length - 1;
  const seg = t * segCount;
  const idx = Math.min(Math.floor(seg), segCount - 1);
  const f = seg - idx;
  const c1 = SWEEP_COLORS[idx];
  const c2 = SWEEP_COLORS[idx + 1];
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
  return `rgb(${r},${g},${b})`;
}

/* ================================================================
   Component
   ================================================================ */

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ambientRef = useRef<AmbientParticle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const initializedRef = useRef(false);

  const GRID_SPACING = 40;
  const MOUSE_RADIUS = 120;
  const SWEEP_RADIUS = 180;

  /* ===== Init ambient grid ===== */
  const initParticles = useCallback((width: number, height: number) => {
    const particles: AmbientParticle[] = [];

    // Exclusion zone: center area where heading + stats sit
    const exclW = Math.min(width * 0.65, 860);
    const exclH = 280;
    const exclLeft = (width - exclW) / 2;
    const exclRight = exclLeft + exclW;
    const cy = height / 2;
    const exclTop = cy - exclH * 0.45;
    const exclBottom = cy + exclH * 0.55;

    for (let y = GRID_SPACING; y < height; y += GRID_SPACING) {
      for (let x = GRID_SPACING; x < width; x += GRID_SPACING) {
        if (x > exclLeft && x < exclRight && y > exclTop && y < exclBottom) {
          continue;
        }
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          radius: 1,
          baseRadius: 1,
          opacity: 0.3,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.15 + Math.random() * 0.25,
        });
      }
    }
    ambientRef.current = particles;
    initializedRef.current = true;
  }, []);

  /* ===== Main animation loop ===== */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;
    const ambient = ambientRef.current;
    const mouseActive = mouse.x > -9000;

    for (let i = 0; i < ambient.length; i++) {
      const p = ambient[i];

      // Spring back to origin
      const dx = p.originX - p.x;
      const dy = p.originY - p.y;
      p.vx += dx * 0.03;
      p.vy += dy * 0.03;
      p.vx *= 0.92;
      p.vy *= 0.92;

      // Mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const a = Math.atan2(mdy, mdx);
        p.vx += Math.cos(a) * force * 5;
        p.vy += Math.sin(a) * force * 5;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Gradient sweep: particles near cursor grow + get colored
      let targetRadius = p.baseRadius;
      let color = `rgba(0,0,0,${p.opacity})`;

      if (mouseActive && dist < SWEEP_RADIUS) {
        const proximity = 1 - dist / SWEEP_RADIUS;
        const ease = proximity * proximity;
        targetRadius = p.baseRadius + ease * (5 + Math.random() * 0.02);
        const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
        const intensity = ease * 0.7 + p.opacity * (1 - ease);
        color = getSweepColor(angle, intensity);
      }

      p.radius += (targetRadius - p.radius) * 0.08;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  /* ===== Setup canvas + events ===== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      if (!initializedRef.current) {
        initParticles(rect.width, rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resize();
    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
