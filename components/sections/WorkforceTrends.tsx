"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Image from "next/image";
import "../../styles/workforce-trends.css";

/* ===== Report data ===== */
const reports = [
  { id: 1, image: "/assets/march.png", date: "March 2026" },
  { id: 2, image: "/assets/feb.png", date: "February 2026" },
  { id: 3, image: "/assets/jan.png", date: "January 2026" },
  { id: 4, image: "/assets/dec.png", date: "December 2025" },
  { id: 6, image: "/assets/march.png", date: "October 2025" },
  { id: 7, image: "/assets/feb.png", date: "September 2025" },
  { id: 8, image: "/assets/jan.png", date: "August 2025" },
  { id: 9, image: "/assets/dec.png", date: "July 2025" },
  { id: 10, image: "/assets/dec.png", date: "June 2025" },
  { id: 11, image: "/assets/march.png", date: "May 2025" },
  { id: 12, image: "/assets/feb.png", date: "April 2025" },
];

const CARD_WIDTH = 300;
const GAP = 20;
const SCROLL_COUNT = 1;

export default function WorkforceTrends() {
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcMax = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      const wrapperW = wrapperRef.current.offsetWidth;
      const trackW = trackRef.current.scrollWidth;
      setMaxOffset(Math.max(0, trackW - wrapperW));
    };
    calcMax();
    window.addEventListener("resize", calcMax);
    return () => window.removeEventListener("resize", calcMax);
  }, []);

  const scrollLeft = useCallback(() => {
    setOffset((prev) => Math.max(0, prev - SCROLL_COUNT * (CARD_WIDTH + GAP)));
  }, []);

  const scrollRight = useCallback(() => {
    setOffset((prev) =>
      Math.min(maxOffset, prev + SCROLL_COUNT * (CARD_WIDTH + GAP))
    );
  }, [maxOffset]);

  return (
    <section className="workforce-trends">
      {/* Header: heading + arrows */}
      <div className="workforce-trends__header">
        <h2 className="workforce-trends__heading">
          Workforce trends &amp;
          <br />
          job seeker reports
        </h2>
        <div className="workforce-trends__nav">
          <button
            className="workforce-trends__arrow"
            onClick={scrollLeft}
            disabled={offset === 0}
            aria-label="Scroll left"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            className="workforce-trends__arrow"
            onClick={scrollRight}
            disabled={offset >= maxOffset}
            aria-label="Scroll right"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Scrollable cards — starts at 1200px alignment, scrolls to screen edge */}
      <div className="workforce-trends__track-wrapper" ref={wrapperRef}>
        <div
          className="workforce-trends__track"
          ref={trackRef}
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {reports.map((report) => (
            <div key={report.id} className="workforce-trends__card">
              <div className="workforce-trends__cover">
                <Image
                  src={report.image}
                  alt={`Jobspeak Report - ${report.date}`}
                  fill
                  sizes="300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="workforce-trends__date">{report.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
