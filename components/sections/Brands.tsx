"use client";

import { useRef, useEffect, useCallback } from "react";
import BrandCard from "../ui/BrandCard";
import "../../styles/brands.css";

const brands = [
  {
    name: "Naukri",
    bgImage: "/assets/naukri_bg_img.png",
    logo: "/assets/naukri_logo.svg",
    logoWidth: 290,
    logoHeight: 80,
    brandColor: "#265DF5",
    description:
      "India's largest recruitment platform bridging millions of ambitious job seekers with top employers across all sectors.",
  },
  {
    name: "Jeevansathi",
    bgImage: "/assets/js_bg_img.png",
    logo: "/assets/js_logo.svg",
    logoWidth: 256,
    logoHeight: 50,
    brandColor: "#E63157",
    description:
      "Trusted online matrimony platform for meaningful bonds, blending unique cultural values with modern matchmaking tech.",
  },
  {
    name: "99acres",
    bgImage: "/assets/99acres_bg_img.png",
    logo: "/assets/99acres_logo.svg",
    logoWidth: 238,
    logoHeight: 50,
    brandColor: "#1A81C3",
    description:
      "Leading real estate classifieds platform powering property discovery, insights, and seamless deals across the nation.",
  },
  {
    name: "Shiksha",
    bgImage: "/assets/shiksha_bg_img.png",
    logo: "/assets/shiksha_logo.svg",
    logoWidth: 229,
    logoHeight: 80,
    brandColor: "#01808C",
    description:
      "Education discovery platform guiding students through informed choices on top courses, colleges, and career pathways.",
  },
  {
    name: "iimjobs",
    bgImage: "/assets/iimjobs_bg_img.png",
    logo: "/assets/iimjobs_logo.svg",
    logoWidth: 217,
    logoHeight: 69,
    brandColor: "#019529",
    description:
      "Premium career portal exclusively for seasoned professionals and top-tier MBA graduates pursuing high-impact role opportunities.",
  },
  {
    name: "Hirist",
    bgImage: "/assets/hirist_bg_img.png",
    logo: "/assets/hirist_logo.svg",
    logoWidth: 284,
    logoHeight: 44,
    brandColor: "#FB4616",
    description:
      "Tech-first hiring platform connecting exceptional engineering talent with innovative companies building the future.",
  },
  {
    name: "Zwayam",
    bgImage: "/assets/zwayam_bg_img.png",
    logo: "/assets/zwayam.png",
    logoWidth: 254,
    logoHeight: 80,
    brandColor: "#2D5FAC",
    description:
      "AI-powered recruitment automation platform helping global enterprises streamline their talent acquisition journey.",
  },
  {
    name: "JobHai",
    bgImage: "/assets/jobhai_bg_img.png",
    logo: "/assets/job_hai_logo.svg",
    logoWidth: 179,
    logoHeight: 100,
    brandColor: "#26A69A",
    description:
      "Entry-level and blue-collar jobs platform bridging millions of dedicated local workers with nearby job opportunities.",
  },
];

export default function Brands() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentPosRef = useRef(0);
  const targetPosRef = useRef(0);
  const rafRef = useRef(0);

  const SCROLL_MULTIPLIER = 0.5; // how much each wheel tick moves
  const LERP_SPEED = 0.06;       // constant smooth interpolation

  const getMaxScroll = useCallback(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return 0;
    return Math.max(0, track.scrollWidth - section.clientWidth);
  }, []);

  const animate = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // Smooth lerp toward target at constant rate
    const diff = targetPosRef.current - currentPosRef.current;
    if (Math.abs(diff) > 0.1) {
      currentPosRef.current += diff * LERP_SPEED;
    } else {
      currentPosRef.current = targetPosRef.current;
    }

    track.style.transform = `translateX(-${currentPosRef.current}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const max = getMaxScroll();
      const atStart = targetPosRef.current <= 0 && e.deltaY < 0;
      const atEnd = targetPosRef.current >= max && e.deltaY > 0;

      if (atStart || atEnd) return;

      e.preventDefault();
      targetPosRef.current += e.deltaY * SCROLL_MULTIPLIER;
      targetPosRef.current = Math.max(0, Math.min(targetPosRef.current, max));
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, getMaxScroll]);

  return (
    <section className="brands" ref={sectionRef}>
      <div className="brands__scroll-wrapper">
        <div className="brands__scroll-track" ref={trackRef}>
          {brands.map((brand) => (
            <BrandCard
              key={brand.name}
              name={brand.name}
              bgImage={brand.bgImage}
              logo={brand.logo}
              logoWidth={brand.logoWidth}
              logoHeight={brand.logoHeight}
              brandColor={brand.brandColor}
              description={brand.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
