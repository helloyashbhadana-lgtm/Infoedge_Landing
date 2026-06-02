"use client";

import { useEffect, useRef, useCallback } from "react";

interface Props {
  arrowSize?: number;
  gridSpacing?: number;
  defaultTargetSelector?: string;
}

export default function ArrowGrid({
  arrowSize = 16,
  gridSpacing = 40,
  defaultTargetSelector,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const isInsideRef = useRef(false);
  const anglesRef = useRef<Float32Array | null>(null);
  const targetAnglesRef = useRef<Float32Array | null>(null);
  const defaultTargetRef = useRef({ x: 0, y: 0 });
  const gridRef = useRef({ cols: 0, rows: 0 });

  const LERP_SPEED = 0.08;

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const cols = Math.floor(rect.width / gridSpacing) + 1;
    const rows = Math.floor(rect.height / gridSpacing) + 1;
    gridRef.current = { cols, rows };

    const count = cols * rows;
    anglesRef.current = new Float32Array(count);
    targetAnglesRef.current = new Float32Array(count);

    // Find default target (the card/list section)
    if (defaultTargetSelector) {
      const el = parent.querySelector(defaultTargetSelector);
      if (el) {
        const elRect = el.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        defaultTargetRef.current = {
          x: elRect.left - parentRect.left + elRect.width / 2,
          y: elRect.top - parentRect.top + elRect.height / 2,
        };
      }
    }

    // Initialize angles pointing toward default target
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const x = col * gridSpacing + gridSpacing / 2;
        const y = row * gridSpacing + gridSpacing / 2;
        const angle = Math.atan2(
          defaultTargetRef.current.y - y,
          defaultTargetRef.current.x - x
        );
        anglesRef.current[idx] = angle;
        targetAnglesRef.current[idx] = angle;
      }
    }
  }, [gridSpacing, defaultTargetSelector]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !anglesRef.current || !targetAnglesRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const { cols, rows } = gridRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mouse = mouseRef.current;
    const inside = isInsideRef.current;
    const target = defaultTargetRef.current;
    const half = arrowSize / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        const x = col * gridSpacing + gridSpacing / 2;
        const y = row * gridSpacing + gridSpacing / 2;

        // Compute target angle
        const tx = inside ? mouse.x : target.x;
        const ty = inside ? mouse.y : target.y;
        const targetAngle = Math.atan2(ty - y, tx - x);
        targetAnglesRef.current[idx] = targetAngle;

        // Lerp current angle toward target (shortest path)
        let current = anglesRef.current[idx];
        let diff = targetAngle - current;
        // Normalize to [-PI, PI]
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        current += diff * LERP_SPEED;
        anglesRef.current[idx] = current;

        // Draw simple line
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(current);

        const half = arrowSize / 2;
        ctx.strokeStyle = "#0E379D";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(-half, 0);
        ctx.lineTo(half, 0);
        ctx.stroke();

        ctx.restore();
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [arrowSize, gridSpacing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    setup();
    rafRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isInsideRef.current = true;
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
    };

    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      setup();
      rafRef.current = requestAnimationFrame(animate);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setup, animate]);

  return <canvas ref={canvasRef} className="investor-relations__arrows-canvas" />;
}
