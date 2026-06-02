"use client";

import { useEffect, useRef, useCallback } from "react";

/* ================================================================
   Types
   ================================================================ */

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  brightness: number;
  settled: boolean;
  vx: number;
  vy: number;
  settleDelay: number;
}

interface FlyingParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  brightness: number;
  life: number;
  speed: number;
}

/* ================================================================
   Sample particles from the building image
   ================================================================ */

function sampleParticlesFromImage(
  imgData: ImageData,
  imgW: number,
  imgH: number,
  canvasW: number,
  canvasH: number
): { targetX: number; targetY: number; size: number; brightness: number }[] {
  const particles: { targetX: number; targetY: number; size: number; brightness: number }[] = [];
  const data = imgData.data;

  // Position the building on the right side of the canvas
  // Scale to fill roughly 55% of canvas height
  const buildingScale = (canvasH * 0.75) / imgH;
  const buildingW = imgW * buildingScale;
  const buildingH = imgH * buildingScale;

  // Offset: right side, anchored to bottom
  const offsetX = canvasW - buildingW - canvasW * 0.02;
  const offsetY = canvasH - buildingH;

  // Sampling step — smaller = more particles
  const step = 2;

  for (let py = 0; py < imgH; py += step) {
    for (let px = 0; px < imgW; px += step) {
      const idx = (py * imgW + px) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Luminance from the pixel
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      const alpha = a / 255;
      const combined = luminance * alpha;

      // Skip dark/transparent pixels
      if (combined < 0.08) continue;

      // Brighter pixels = higher chance of particle, also larger and brighter
      // Use probability based on brightness to vary density
      const probability = combined * combined; // quadratic for more contrast
      if (Math.random() > probability * 1.5) continue;

      const canvasX = offsetX + px * buildingScale;
      const canvasY = offsetY + py * buildingScale;

      // Particle size and brightness based on source pixel brightness
      const size = 0.5 + combined * 1.0;
      const brightness = 0.3 + combined * 0.7;

      particles.push({
        targetX: canvasX + (Math.random() - 0.5) * 1.5,
        targetY: canvasY + (Math.random() - 0.5) * 1.5,
        size,
        brightness,
      });
    }
  }

  return particles;
}

/* ================================================================
   Component
   ================================================================ */

export default function ParticleBuilding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const flyingRef = useRef<FlyingParticle[]>([]);
  const initializedRef = useRef(false);
  const frameRef = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const buildingBoundsRef = useRef({ left: 0, right: 0, top: 0, bottom: 0, centerX: 0, centerY: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Mouse interaction constants
  const MOUSE_RADIUS = 120;       // influence radius
  const MOUSE_PUSH_FORCE = 8;     // push strength
  const SPRING_BACK = 0.03;       // how fast particles return
  const DAMPING = 0.92;           // velocity damping for elastic feel

  const init = useCallback((w: number, h: number) => {
    const img = imageRef.current;
    if (!img || !img.complete) return;

    // Draw image to offscreen canvas to read pixels
    const offCanvas = document.createElement("canvas");
    offCanvas.width = img.naturalWidth;
    offCanvas.height = img.naturalHeight;
    const offCtx = offCanvas.getContext("2d")!;
    offCtx.drawImage(img, 0, 0);
    const imgData = offCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

    const sampled = sampleParticlesFromImage(
      imgData, img.naturalWidth, img.naturalHeight, w, h
    );

    // Compute building bounds from sampled positions
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const s of sampled) {
      if (s.targetX < minX) minX = s.targetX;
      if (s.targetX > maxX) maxX = s.targetX;
      if (s.targetY < minY) minY = s.targetY;
      if (s.targetY > maxY) maxY = s.targetY;
    }
    buildingBoundsRef.current = {
      left: minX, right: maxX, top: minY, bottom: maxY,
      centerX: (minX + maxX) / 2, centerY: (minY + maxY) / 2,
    };

    // Create particles — start near target with random scatter, fade in
    particlesRef.current = sampled.map((s, i) => ({
      x: s.targetX + (Math.random() - 0.5) * 30,
      y: s.targetY + (Math.random() - 0.5) * 30,
      targetX: s.targetX,
      targetY: s.targetY,
      size: s.size,
      brightness: s.brightness,
      settled: false,
      vx: 0,
      vy: 0,
      settleDelay: Math.random() * 180,
    }));

    flyingRef.current = [];
    initializedRef.current = true;
    frameRef.current = 0;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initializedRef.current) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    frameRef.current++;
    const frame = frameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const flying = flyingRef.current;

    // === Update & draw structure particles ===
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!p.settled) {
        // Wait for settle delay (staggered entrance)
        if (frame < p.settleDelay) {
          // Fade in gently near target
          const fadeWindow = 20;
          if (frame > p.settleDelay - fadeWindow) {
            const preAlpha = (frame - (p.settleDelay - fadeWindow)) / fadeWindow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.3 + preAlpha * 0.7), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(210, 225, 255, ${preAlpha * 0.3})`;
            ctx.fill();
          }
          continue;
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.3) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.settled = true;
        } else {
          p.x += dx * 0.06;
          p.y += dy * 0.06;
        }
      } else {
        // Mouse repulsion
        const mouse = mouseRef.current;
        const mDx = p.x - mouse.x;
        const mDy = p.y - mouse.y;
        const mDist = Math.sqrt(mDx * mDx + mDy * mDy);

        if (mDist < MOUSE_RADIUS && mDist > 0.1) {
          const force = (1 - mDist / MOUSE_RADIUS) * MOUSE_PUSH_FORCE;
          p.vx += (mDx / mDist) * force;
          p.vy += (mDy / mDist) * force;
        }

        // Spring back to target
        const breathX = Math.sin(frame * 0.015 + i * 0.08) * 0.4;
        const breathY = Math.sin(frame * 0.012 + i * 0.06) * 0.3;
        p.vx += (p.targetX + breathX - p.x) * SPRING_BACK;
        p.vy += (p.targetY + breathY - p.y) * SPRING_BACK;
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw particle
      const alpha = p.settled
        ? p.brightness * (0.7 + Math.sin(frame * 0.025 + i * 0.04) * 0.3)
        : p.brightness * 0.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 225, 255, ${alpha})`;
      ctx.fill();

      // Glow on bright particles
      if (p.size > 1.2 && p.brightness > 0.6) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 200, 255, ${alpha * 0.08})`;
        ctx.fill();
      }
    }

    // === Spawn ambient particles right at building's left edge ===
    const bounds = buildingBoundsRef.current;
    if (frame > 60 && frame % 3 === 0 && flying.length < 60) {
      const spawnY = bounds.top + Math.random() * (bounds.bottom - bounds.top);
      const spawnX = bounds.left + (Math.random() - 0.3) * 10;

      // Target: random depth into the building toward center
      const depth = 0.3 + Math.random() * 0.7;
      const targetX = spawnX + (bounds.centerX - spawnX) * depth;
      const targetY = spawnY + (bounds.centerY - spawnY) * depth * 0.3;

      flying.push({
        x: spawnX,
        y: spawnY,
        targetX,
        targetY,
        size: 0.5 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.5,
        life: 0,
        speed: 0.003 + Math.random() * 0.006,
      });
    }

    // Update & draw ambient particles
    for (let i = flying.length - 1; i >= 0; i--) {
      const fp = flying[i];
      fp.life += fp.speed;

      if (fp.life >= 1) {
        flying.splice(i, 1);
        continue;
      }

      // Drift toward target deep inside the building
      fp.x += (fp.targetX - fp.x) * 0.012;
      fp.y += (fp.targetY - fp.y) * 0.012;
      fp.y += Math.sin(frame * 0.02 + i * 0.7) * 0.12;

      // Smooth fade in, then fade out as it reaches deeper
      const fadeIn = Math.min(fp.life * 4, 1);
      const fadeOut = 1 - Math.max(0, (fp.life - 0.5) / 0.5);
      const alpha = fp.brightness * fadeIn * fadeOut;

      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 225, 255, ${alpha})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Load image
    const img = new Image();
    img.src = "/assets/building_particle.png";
    imageRef.current = img;

    const setup = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      init(rect.width, rect.height);
    };

    img.onload = () => {
      setup();
      rafRef.current = requestAnimationFrame(animate);
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

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      initializedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      setup();
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, init]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}
    />
  );
}
