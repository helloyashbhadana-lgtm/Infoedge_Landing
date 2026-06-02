"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface BrandCardProps {
  name: string;
  bgImage: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  brandColor: string;
  description: string;
}

export default function BrandCard({
  name,
  bgImage,
  logo,
  logoWidth,
  logoHeight,
  brandColor,
  description,
}: BrandCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="brand-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover — image by default, brand color on hover */}
      <div className="brand-card__cover">
        {/* Background image — always visible */}
        <Image
          src={bgImage}
          alt={`${name} background`}
          fill
          sizes="(max-width: 767px) 260px, (max-width: 1279px) 340px, 380px"
          style={{ objectFit: "cover" }}
        />

        {/* Brand color overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: brandColor,
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Logo at actual SVG size */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Image
            src={logo}
            alt={`${name} logo`}
            width={logoWidth}
            height={logoHeight}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Text + CTA — scrolls together with cover */}
      <h3 className="brand-card__title">{name}</h3>
      <p className="brand-card__desc">{description}</p>
      <a href="#" className="brand-card__cta" aria-label={`Read more about ${name}`}>
        <span className="brand-card__cta-inner">
          VISIT WEBSITE
          <Image
            src="/assets/down_arrow.svg"
            alt=""
            width={12}
            height={12}
            aria-hidden="true"
            className="brand-card__cta-arrow"
            style={{ transform: "rotate(-90deg)" }}
          />
        </span>
      </a>
    </div>
  );
}
