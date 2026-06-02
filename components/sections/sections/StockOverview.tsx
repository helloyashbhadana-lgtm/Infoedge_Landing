"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/stock-overview.css";

/* ===== Types ===== */
interface StockData {
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
}

interface PressItem {
  id: number;
  title: string;
  date: string;
  isNew?: boolean;
}

/* ===== Static data ===== */
const pressReleases: PressItem[] = [
  {
    id: 1,
    title: "Info Edge (India) Limited announces Q1 FY16 results",
    date: "17 AUG, 2026",
    isNew: true,
  },
  {
    id: 2,
    title: "Info Edge (India) Limited announces Q4 FY15 results",
    date: "17 AUG, 2026",
    isNew: true,
  },
  {
    id: 3,
    title: "Info Edge (India) Limited announces Q3 FY21 results",
    date: "17 AUG, 2026",
  },
  {
    id: 4,
    title: "Info Edge (India) Limited announces Q2 FY22 results",
    date: "17 AUG, 2026",
  },
  {
    id: 5,
    title: "Info Edge (India) Limited announces Q1 FY23 results",
    date: "12 JUL, 2026",
  },
  {
    id: 6,
    title: "Info Edge (India) Limited announces annual results FY25",
    date: "28 MAY, 2026",
  },
];

const announcements: PressItem[] = [
  {
    id: 101,
    title: "Board meeting scheduled for approval of quarterly results",
    date: "10 AUG, 2026",
    isNew: true,
  },
  {
    id: 102,
    title: "Announcement under Regulation 30 - Acquisition update",
    date: "5 AUG, 2026",
    isNew: true,
  },
  {
    id: 103,
    title: "Disclosure under SEBI LODR Regulations",
    date: "28 JUL, 2026",
  },
  {
    id: 104,
    title: "Appointment of Independent Director",
    date: "15 JUL, 2026",
  },
  {
    id: 105,
    title: "Investor presentation - Q4 FY26",
    date: "1 JUL, 2026",
  },
];

/* ===== Stock Card ===== */
function StockCard({ data }: { data: StockData }) {
  const isUp = data.change >= 0;
  const sign = isUp ? "+" : "";

  return (
    <div className="stock-overview__card">
      <div className="press-card">
        <span className="stock-card__label">Our Stock</span>
        <div className="stock-card__price-row">
          <span className="stock-card__price">{data.price.toFixed(2)}</span>
          <span
            className={`stock-card__change ${isUp ? "stock-card__change--up" : "stock-card__change--down"}`}
          >
            {sign} {Math.abs(data.change).toFixed(2)}{" "}
            {Math.abs(data.changePercent).toFixed(2)} % Change
          </span>
        </div>
        <div className="stock-card__stats">
          <div className="stock-card__stat-row">
            <span className="stock-card__stat-label">Market opened at</span>
            <span className="stock-card__stat-value">
              {data.open.toFixed(2)}
            </span>
          </div>
          <div className="stock-card__stat-row">
            <span className="stock-card__stat-label">Daily High</span>
            <span className="stock-card__stat-value">
              {data.high.toFixed(2)}
            </span>
          </div>
          <div className="stock-card__stat-row">
            <span className="stock-card__stat-label">Daily Low</span>
            <span className="stock-card__stat-value">
              {data.low.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Press Releases Card ===== */
function PressCard() {
  const [activeTab, setActiveTab] = useState<"press" | "announcements">(
    "press"
  );
  const tabsRef = useRef<HTMLDivElement>(null);
  const pressTabRef = useRef<HTMLButtonElement>(null);
  const annTabRef = useRef<HTMLButtonElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const updateUnderline = useCallback(() => {
    const activeRef =
      activeTab === "press" ? pressTabRef.current : annTabRef.current;
    const container = tabsRef.current;
    if (!activeRef || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = activeRef.getBoundingClientRect();
    setUnderline({
      left: tRect.left - cRect.left,
      width: tRect.width,
    });
  }, [activeTab]);

  useEffect(() => {
    updateUnderline();
  }, [updateUnderline]);

  const [prevTab, setPrevTab] = useState<"press" | "announcements">("press");
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");

  const handleTabSwitch = (tab: "press" | "announcements") => {
    if (tab === activeTab) return;
    setSlideDir(tab === "announcements" ? "left" : "right");
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const items = activeTab === "press" ? pressReleases : announcements;
  // Duplicate for seamless loop
  const loopItems = [...items, ...items];

  return (
    <div className="stock-overview__card">
      <div className="press-card">
        {/* Tabs */}
        <div className="press-card__tabs" ref={tabsRef}>
          <button
            ref={pressTabRef}
            className={`press-card__tab ${activeTab === "press" ? "press-card__tab--active" : ""}`}
            onClick={() => handleTabSwitch("press")}
          >
            Press Releases
          </button>
          <button
            ref={annTabRef}
            className={`press-card__tab ${activeTab === "announcements" ? "press-card__tab--active" : ""}`}
            onClick={() => handleTabSwitch("announcements")}
          >
            Announcements
          </button>
          <span
            className="press-card__tab-underline"
            style={{ left: underline.left, width: underline.width }}
          />
        </div>

        {/* Scrolling list */}
        <div
          className={`press-card__list-wrapper press-card__list-wrapper--slide-${slideDir}`}
          key={activeTab}
        >
          <div className="press-card__list-track">
            {loopItems.map((item, i) => (
              <div className="press-card__item" key={`${item.id}-${i}`}>
                <div className="press-card__item-thumb" />
                <div className="press-card__item-content">
                  {item.isNew && i < items.length && (
                    <span className="press-card__new-tag">NEW</span>
                  )}
                  <div className="press-card__item-title">{item.title}</div>
                  <span className="press-card__item-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Main Section ===== */
export default function StockOverview() {
  const [stockData, setStockData] = useState<StockData>({
    price: 972.85,
    change: 0.0,
    changePercent: 0.0,
    open: 991.65,
    high: 995.0,
    low: 968.25,
  });

  /* Fetch live stock data via our API route (NAUKRI.NS) */
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch("/api/stock");
        if (res.ok) {
          const data = await res.json();
          setStockData({
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            open: data.open,
            high: data.high,
            low: data.low,
          });
        }
      } catch {
        // Use fallback mock data — already set as default
      }
    };
    fetchStock();
    // Refresh every 5 minutes during market hours
    const interval = setInterval(fetchStock, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="stock-overview">
      <div className="container-wide">
        <div className="stock-overview__grid">
          {/* Left column: heading + stock card */}
          <div className="stock-overview__left">
            <h2 className="stock-overview__heading">
              Stock overview &amp;
              <br />
              latest disclosures
            </h2>
            <StockCard data={stockData} />
          </div>

          {/* Right column: press card */}
          <PressCard />
        </div>
      </div>
    </section>
  );
}
