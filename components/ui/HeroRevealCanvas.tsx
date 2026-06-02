"use client";

import { useEffect, useRef, useCallback } from "react";

interface Props {
  bwSrc: string;
  colorSrc: string;
  revealRadius?: number;
}

export default function HeroRevealCanvas({
  bwSrc,
  colorSrc,
  revealRadius = 200,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);

  // Mouse state
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const lerpedRef = useRef({ x: -9999, y: -9999 });
  const prevLerpedRef = useRef({ x: -9999, y: -9999 });
  const isInsideRef = useRef(false);

  // Radius spring physics
  const radiusRef = useRef(0); // current rendered radius
  const radiusVelocityRef = useRef(0); // spring velocity
  const baseRadiusTargetRef = useRef(0); // target without effects

  // Breathing
  const breathPhaseRef = useRef(0);

  // Velocity tracking
  const velocityRef = useRef(0);
  const smoothVelocityRef = useRef(0);

  // Idle fade — blob visibility driven by movement
  const idleOpacityRef = useRef(0); // 0 = invisible, 1 = fully visible

  // Stretch (oval distortion)
  const stretchXRef = useRef(1);
  const stretchYRef = useRef(1);
  const moveAngleRef = useRef(0);

  // Images
  const bwImgRef = useRef<HTMLImageElement | null>(null);
  const colorImgRef = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef(0);

  const LERP_SPEED = 0.08;

  // Spring constants
  const SPRING_STIFFNESS = 0.04;
  const SPRING_DAMPING = 0.75;

  // Breathing
  const BREATH_SPEED = 0.025;
  const BREATH_AMOUNT = 12; // ±12px oscillation

  // Velocity
  const VELOCITY_SIZE_BOOST = 0.4; // how much velocity enlarges circle
  const VELOCITY_SMOOTH = 0.06;
  const MAX_VELOCITY_BOOST = 60; // cap the extra radius from speed

  // Stretch
  const STRETCH_AMOUNT = 0.15; // max oval distortion
  const STRETCH_LERP = 0.08;

  // Idle fade
  const IDLE_FADE_IN = 0.08;
  const IDLE_FADE_OUT = 0.12; // faster fade out for smooth opacity drop
  const IDLE_VELOCITY_THRESHOLD = 0.3;

  const loadImages = useCallback(() => {
    const bwImg = new Image();
    bwImg.src = bwSrc;
    bwImg.onload = () => {
      bwImgRef.current = bwImg;
      imagesLoadedRef.current++;
    };

    const colorImg = new Image();
    colorImg.src = colorSrc;
    colorImg.onload = () => {
      colorImgRef.current = colorImg;
      imagesLoadedRef.current++;
    };
  }, [bwSrc, colorSrc]);

  const getCoverDims = (
    imgW: number,
    imgH: number,
    canvasW: number,
    canvasH: number
  ) => {
    const imgAspect = imgW / imgH;
    const canvasAspect = canvasW / canvasH;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (canvasAspect > imgAspect) {
      drawW = canvasW;
      drawH = canvasW / imgAspect;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgAspect;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    return { drawX, drawY, drawW, drawH };
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // Lerp mouse position
    const mouse = mouseRef.current;
    const lerped = lerpedRef.current;

    if (lerped.x < -9000) {
      lerped.x = mouse.x;
      lerped.y = mouse.y;
    } else {
      lerped.x += (mouse.x - lerped.x) * LERP_SPEED;
      lerped.y += (mouse.y - lerped.y) * LERP_SPEED;
    }

    // Calculate velocity from lerped position movement
    const dx = lerped.x - prevLerpedRef.current.x;
    const dy = lerped.y - prevLerpedRef.current.y;
    const instantVelocity = Math.sqrt(dx * dx + dy * dy);
    prevLerpedRef.current = { x: lerped.x, y: lerped.y };

    // Smooth velocity
    smoothVelocityRef.current +=
      (instantVelocity - smoothVelocityRef.current) * VELOCITY_SMOOTH;
    const velocity = smoothVelocityRef.current;

    // Movement angle for stretch
    if (instantVelocity > 0.5) {
      moveAngleRef.current = Math.atan2(dy, dx);
    }

    // === Breathing ===
    breathPhaseRef.current += BREATH_SPEED;
    const breathOffset = Math.sin(breathPhaseRef.current) * BREATH_AMOUNT;

    // === Velocity-based size boost ===
    const velocityBoost = Math.min(
      velocity * VELOCITY_SIZE_BOOST,
      MAX_VELOCITY_BOOST
    );

    // === Idle fade: blob visible only while moving ===
    const isMoving = isInsideRef.current && velocity > IDLE_VELOCITY_THRESHOLD;
    if (isMoving) {
      idleOpacityRef.current += (1 - idleOpacityRef.current) * IDLE_FADE_IN;
    } else {
      idleOpacityRef.current += (0 - idleOpacityRef.current) * IDLE_FADE_OUT;
    }
    if (idleOpacityRef.current < 0.001) idleOpacityRef.current = 0;

    // === Compute target radius (always full size when inside) ===
    const desiredRadius = isInsideRef.current
      ? revealRadius + breathOffset + velocityBoost
      : 0;
    baseRadiusTargetRef.current = desiredRadius;

    // === Spring physics for radius (gives elastic overshoot) ===
    const springForce =
      (baseRadiusTargetRef.current - radiusRef.current) * SPRING_STIFFNESS;
    radiusVelocityRef.current += springForce;
    radiusVelocityRef.current *= SPRING_DAMPING;
    radiusRef.current += radiusVelocityRef.current;

    // Clamp to prevent negative
    if (radiusRef.current < 0) radiusRef.current = 0;

    const radius = radiusRef.current;

    // === Stretch (oval distortion based on velocity) ===
    const targetStretch = 1 + Math.min(velocity * 0.008, STRETCH_AMOUNT);
    const targetSqueeze = 1 / targetStretch; // preserve area
    stretchXRef.current += (targetStretch - stretchXRef.current) * STRETCH_LERP;
    stretchYRef.current += (targetSqueeze - stretchYRef.current) * STRETCH_LERP;

    // Clear main canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (imagesLoadedRef.current < 2) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const bwImg = bwImgRef.current!;
    const colorImg = colorImgRef.current!;
    const dims = getCoverDims(bwImg.naturalWidth, bwImg.naturalHeight, w, h);

    // Draw B&W as base layer
    ctx.drawImage(bwImg, dims.drawX, dims.drawY, dims.drawW, dims.drawH);

    // Skip compositing if radius negligible
    if (radius < 1) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Use offscreen canvas for compositing
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement("canvas");
    }
    const offscreen = offscreenRef.current;
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d")!;
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Draw color image on offscreen
    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.drawImage(colorImg, dims.drawX, dims.drawY, dims.drawW, dims.drawH);

    // Apply elliptical gradient mask using destination-in
    offCtx.globalCompositeOperation = "destination-in";

    // Transform to create stretched ellipse aligned with movement direction
    offCtx.save();
    offCtx.translate(lerped.x, lerped.y);
    offCtx.rotate(moveAngleRef.current);
    offCtx.scale(stretchXRef.current, stretchYRef.current);

    const gradient = offCtx.createRadialGradient(0, 0, 0, 0, 0, radius);
    // Solid core with smooth rolloff at edges (~220px of 400px = 0.55)
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.45, "rgba(0,0,0,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.95)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.85)");
    // Gradual feather
    gradient.addColorStop(0.65, "rgba(0,0,0,0.55)");
    gradient.addColorStop(0.75, "rgba(0,0,0,0.3)");
    gradient.addColorStop(0.85, "rgba(0,0,0,0.12)");
    gradient.addColorStop(0.93, "rgba(0,0,0,0.03)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    offCtx.fillStyle = gradient;
    // Fill a large enough rect to cover the canvas after transform
    offCtx.fillRect(
      -w / stretchXRef.current,
      -h / stretchYRef.current,
      (w * 2) / stretchXRef.current,
      (h * 2) / stretchYRef.current
    );
    offCtx.restore();

    // Reset composite mode
    offCtx.globalCompositeOperation = "source-over";

    // Draw composited result on main canvas with idle opacity
    ctx.globalAlpha = idleOpacityRef.current;
    ctx.drawImage(offscreen, 0, 0, w, h);
    ctx.globalAlpha = 1;

    rafRef.current = requestAnimationFrame(animate);
  }, [revealRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    loadImages();

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      offscreenRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (!isInsideRef.current) {
        isInsideRef.current = true;
        if (lerpedRef.current.x < -9000) {
          lerpedRef.current = { ...mouseRef.current };
          prevLerpedRef.current = { ...mouseRef.current };
        }
      }
    };

    const handleMouseLeave = () => {
      isInsideRef.current = false;
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
  }, [animate, loadImages]);

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
