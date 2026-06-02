"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

const PARTICLE_SPACING = 3;
const MOUSE_RADIUS = 80;
const PARTICLE_SIZE = 1; // 1px dots
const PARTICLE_OPACITY = 0.08;

export default function FooterParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const img = new Image();
    img.onload = () => {
      // Offscreen canvas to sample SVG shape
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Scale SVG to fill the area (151x40 aspect ratio)
      const svgAspect = 151 / 40;
      const areaAspect = width / height;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (areaAspect > svgAspect) {
        // Width-constrained
        drawW = width * 0.85;
        drawH = drawW / svgAspect;
      } else {
        drawH = height * 0.7;
        drawW = drawH * svgAspect;
      }
      drawX = (width - drawW) / 2;
      drawY = (height - drawH) / 2;

      offCtx.drawImage(img, drawX, drawY, drawW, drawH);

      // Sample pixels
      const imageData = offCtx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const particles: Particle[] = [];

      for (let y = 0; y < height; y += PARTICLE_SPACING) {
        for (let x = 0; x < width; x += PARTICLE_SPACING) {
          const idx = (y * width + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 50) {
            particles.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }

      particlesRef.current = particles;
    };
    img.src = "/assets/brand_logo.svg";
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Spring back to origin
      const dx = p.originX - p.x;
      const dy = p.originY - p.y;
      p.vx += dx * 0.04;
      p.vy += dy * 0.04;
      p.vx *= 0.88;
      p.vy *= 0.88;

      // Mouse repulsion
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const dist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const angle = Math.atan2(mdy, mdx);
        p.vx += Math.cos(angle) * force * 6;
        p.vy += Math.sin(angle) * force * 6;
      }

      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, PARTICLE_SIZE * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${PARTICLE_OPACITY})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

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
      initParticles(rect.width, rect.height);
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
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

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
        zIndex: 0,
      }}
    />
  );
}
