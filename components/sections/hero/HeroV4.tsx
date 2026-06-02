"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import "../../../styles/hero-v4.css";

/* ===== Word-by-word blur reveal ===== */

const line1Text = "Building India's most";
const line1Words = line1Text.split(" ");

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(12px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const line1Container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const line2Container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 1.1 } },
};

/* ===== App Icon Stack ===== */

const appIcons = [
  { src: "/assets/naukri_icon.png", alt: "Naukri" },
  { src: "/assets/js_icon.png", alt: "Jeevansathi" },
  { src: "/assets/99_icon.png", alt: "99acres" },
  { src: "/assets/shiksha_icon.png", alt: "Shiksha" },
];

function AppIconStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % appIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="hero-v4__icon-stack">
      {appIcons.map((icon, i) => {
        const position = (i - activeIndex + appIcons.length) % appIcons.length;
        let scale = 1, rotate = 0, translateX = 0, translateY = 0, opacity = 1, zIndex = 4;

        if (position === 0) {
          scale = 1; rotate = 0; translateX = 0; translateY = 0; zIndex = 4; opacity = 1;
        } else if (position === 1) {
          scale = 0.88; rotate = 12; translateX = 12; translateY = 6; zIndex = 3; opacity = 0.7;
        } else if (position === 2) {
          scale = 0.76; rotate = -5; translateX = -8; translateY = 10; zIndex = 2; opacity = 0.4;
        } else {
          scale = 0.7; rotate = -12; translateX = -14; translateY = 4; zIndex = 1; opacity = 0;
        }

        return (
          <motion.span
            key={icon.alt}
            className="hero-v4__icon-card"
            animate={{ scale, rotate, x: translateX, y: translateY, opacity, zIndex }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: "absolute", zIndex }}
          >
            <Image
              src={icon.src}
              alt={icon.alt}
              width={80}
              height={80}
              className="hero-v4__icon-img"
            />
          </motion.span>
        );
      })}
    </span>
  );
}

/* ===== HeroV4 ===== */

export default function HeroV4() {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowStats(true), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero-v4">
      <div className="hero-v4__content">
        <h1 className="hero-v4__heading">
          <span className="hero-v4__line">
            <motion.span
              className="hero-v4__line-inner"
              variants={line1Container}
              initial="hidden"
              animate="visible"
            >
              {line1Words.map((word, i) => (
                <Fragment key={i}>
                  <motion.span className="hero-v4__word" variants={wordVariants}>
                    {word}
                  </motion.span>
                  {i < line1Words.length - 1 && " "}
                </Fragment>
              ))}
            </motion.span>
          </span>
          <br />
          <span className="hero-v4__line">
            <motion.span
              className="hero-v4__line-inner"
              variants={line2Container}
              initial="hidden"
              animate="visible"
            >
              <motion.span className="hero-v4__word" variants={wordVariants}>trusted</motion.span>
              {" "}
              <motion.span className="hero-v4__word" variants={wordVariants}>digital</motion.span>
              {" "}
              <motion.span className="hero-v4__word" variants={wordVariants}>
                <AppIconStack />
              </motion.span>
              {" "}
              <motion.span className="hero-v4__word" variants={wordVariants}>platforms</motion.span>
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="hero-v4__stats"
          initial={{ opacity: 0, y: 24 }}
          animate={showStats ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="hero-v4__stat-block">
            <span className="hero-v4__stat-number">45,000 Cr.+</span>
            <span className="hero-v4__stat-label">Market cap</span>
          </div>
          <div className="hero-v4__stat-divider" />
          <div className="hero-v4__stat-block">
            <span className="hero-v4__stat-number">50+</span>
            <span className="hero-v4__stat-label">Active Investments</span>
          </div>
          <div className="hero-v4__stat-divider" />
          <div className="hero-v4__stat-block">
            <span className="hero-v4__stat-number">25+ Years</span>
            <span className="hero-v4__stat-label">Building Trust</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
