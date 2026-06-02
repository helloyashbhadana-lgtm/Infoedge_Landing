"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/hero-to-business.css";

gsap.registerPlugin(ScrollTrigger);

const appIcons = [
  { src: "/assets/naukri_icon.png", alt: "Naukri" },
  { src: "/assets/js_icon.png", alt: "Jeevansathi" },
  { src: "/assets/99_icon.png", alt: "99acres" },
  { src: "/assets/shiksha_icon.png", alt: "Shiksha" },
];

const businesses = [
  {
    logo: "/assets/naukri_logo_ourbusiness.svg",
    hoverLogo: "/assets/naukri_logo.svg",
    name: "Naukri",
    logoHeight: 50,
    brandColor: "#265DF5",
    description:
      "India's leading recruitment platform connecting millions of job seekers with employers across industries and career opportunities.",
    revenue: "2,158 Cr",
    label: "FY26 annual billings",
  },
  {
    logo: "/assets/js_logo_ourbusiness.svg",
    name: "Jeevansathi",
    logoHeight: 40,
    brandColor: "#E63157",
    description:
      "A trusted matchmaking platform for serious relationships and marriages, with a strong presence in India's matrimony market.",
    revenue: "142.4 Cr",
    label: "FY26 annual billings",
  },
  {
    logo: "/assets/99acres_logo.svg",
    name: "99acres",
    logoHeight: 36,
    defaultLogoColor: true,
    brandColor: "#1A81C3",
    description:
      "A leading real estate platform enabling property discovery, transactions, and insights within India's rapidly growing digital property ecosystem.",
    revenue: "451 Cr",
    label: "FY26 annual billings",
  },
  {
    logo: "/assets/shiksha_logo_ourbusiness.svg",
    name: "Shiksha",
    brandColor: "#01808C",
    description:
      "An education platform helping students choose courses, colleges, and careers at education and employability's growing intersection.",
    revenue: "163.7 Cr",
    label: "FY26 annual billings",
  },
];

export default function HeroToBusinessTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardContentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.8,
        },
      });

      // Phase 1: Icons fan out from stacked to horizontal row (0 → 0.3)
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const xOffset = (i - 1.5) * 290; // spread across ~1160px
        tl.to(
          icon,
          {
            x: xOffset,
            y: 200,
            scale: 1,
            rotate: 0,
            opacity: 1,
            borderRadius: "16px",
            width: 80,
            height: 80,
            duration: 0.3,
          },
          0
        );
      });

      // Phase 2: Icons grow into card-sized containers (0.3 → 0.55)
      iconsRef.current.forEach((icon, i) => {
        if (!icon) return;
        const xOffset = (i - 1.5) * 290;
        tl.to(
          icon,
          {
            width: 260,
            height: 380,
            borderRadius: "0px",
            y: 220,
            duration: 0.25,
          },
          0.3
        );
      });

      // Phase 2b: Fade out icons, fade in card content (0.45 → 0.65)
      iconsRef.current.forEach((icon) => {
        if (!icon) return;
        const img = icon.querySelector(".htb__icon-img");
        if (img) {
          tl.to(img, { opacity: 0, scale: 0.5, duration: 0.15 }, 0.45);
        }
      });

      // Phase 3: Show header and card content (0.55 → 0.75)
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2 },
        0.5
      );

      cardContentRefs.current.forEach((content) => {
        if (!content) return;
        tl.fromTo(
          content,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.2 },
          0.55
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="htb" ref={containerRef}>
      <div className="htb__inner">
        {/* Floating icons that will animate */}
        <div className="htb__icons-layer">
          {appIcons.map((icon, i) => (
            <div
              key={icon.alt}
              className="htb__icon-box"
              ref={(el) => { iconsRef.current[i] = el; }}
              style={{ "--brand-color": businesses[i].brandColor } as React.CSSProperties}
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={80}
                height={80}
                className="htb__icon-img"
              />
              {/* Card content hidden initially, revealed by GSAP */}
              <div
                className="htb__card-content"
                ref={(el) => { cardContentRefs.current[i] = el; }}
              >
                <Image
                  src={businesses[i].logo}
                  alt={businesses[i].name}
                  width={160}
                  height={businesses[i].logoHeight || 48}
                  className={`htb__card-logo${businesses[i].defaultLogoColor ? " htb__card-logo--tint" : ""}`}
                  style={{ height: businesses[i].logoHeight ? `${businesses[i].logoHeight}px` : "48px", width: "auto" }}
                />
                <p className="htb__card-desc">{businesses[i].description}</p>
                <div className="htb__card-bottom">
                  <span className="htb__card-revenue">{businesses[i].revenue}</span>
                  <span className="htb__card-label">{businesses[i].label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section header — fades in */}
        <div className="htb__header" ref={headerRef}>
          <h2 className="htb__heading">Our business</h2>
          <p className="htb__description">
            A technology-driven company with a strong culture of entrepreneurship,
            governance and long-term value creation.
          </p>
        </div>
      </div>
    </div>
  );
}
