"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/ai-core.css";

gsap.registerPlugin(ScrollTrigger);

export default function AiCore() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  /* GSAP ScrollTrigger — expand bg from 1200px to full screen */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      gsap.to(bg, {
        width: "100vw",
        height: "850px",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.8,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ai-core" ref={sectionRef}>
      {/* Expanding dark background */}
      <div ref={bgRef} className="ai-core__bg" />

      <div className="ai-core__container">
        <div className="ai-core__card">
          {/* Left — Hitesh photo */}
          <div className="ai-core__image-area">
            <div className="ai-core__image-glow ai-core__image-glow--visible" />
            <div className="ai-core__image-frame">
              <Image
                src="/assets/hitest_photo.png"
                alt="Hitesh Oberoi, CEO - Info Edge"
                fill
                sizes="542px"
              />
            </div>
          </div>

          {/* Right — Content */}
          <div className="ai-core__content">
            <h2 className="ai-core__heading">
              <span className="ai-core__heading-solid">
                AI at the core of
                <br />
                everything we build
              </span>
            </h2>

            <p className="ai-core__text">
              AI is redefining the future of digital businesses, and Info Edge is
              determined to be at the forefront of that transformation. Our
              continued investments in AI-led innovation are already elevating
              product performance, unlocking scale, and strengthening customer
              value across every one of our platforms.
            </p>

            <p className="ai-core__text">
              As we build a future-ready Info Edge, AI remains our most important
              strategic lever for long-term, sustainable growth.
            </p>

            <div className="ai-core__signature">
              <Image
                src="/assets/sign.svg"
                alt="Hitesh Oberoi signature"
                width={180}
                height={60}
                className="ai-core__signature-img"
              />
              <span className="ai-core__signature-title">
                CEO - INFOEDGE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
