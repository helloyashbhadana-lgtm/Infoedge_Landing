"use client";

import { useState, useEffect } from "react";
import FooterLogo from "../ui/FooterLogo";
import "../../styles/footer.css";

/* ===== Footer data ===== */
const columns = [
  {
    title: "About",
    links: [
      "Vision, Mission & Values",
      "Message from the CEO",
      "Leadership",
      "Company Profile",
      "History",
      "Our Business Model",
      "Group Companies",
      "Material Foundation",
      "Corporate Blog",
    ],
  },
  {
    title: "Sustainability",
    links: [
      "About Sustainability",
      "Environmental",
      "Social Impact",
      "Human Rights",
      "Our People",
      "Governance",
      "Data & Reports",
    ],
  },
  {
    title: "Investor Relations",
    links: [
      "IR Events",
      "IR News",
      "Quarterly Results & Annual Report",
      "Investor Information Center",
      "Resources",
    ],
  },
  {
    title: "Information",
    links: ["Newsroom", "Contact Us"],
  },
];

/* ===== IST Time Widget ===== */
function ISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      const hours = ist.getHours();
      const minutes = ist.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const h = hours % 12 || 12;
      const m = minutes.toString().padStart(2, "0");
      setTime(`${h}:${m} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="footer__time">{time}</span>;
}

/* ===== Footer Component ===== */
export default function Footer() {
  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      {/* Link columns */}
      <div className="footer__container">
        <div className="footer__columns">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="footer__column-title">{col.title}</h4>
              <ul className="footer__column-list">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer__column-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Logo watermark */}
      <div className="footer__watermark">
        <FooterLogo />
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <ISTClock />
          <span className="footer__copyright">
            All rights reserved &copy; 2015 Info Edge India Ltd., CIN No.:
            L74899DL1995PLC068021
          </span>
          <button className="footer__go-top" onClick={handleGoTop}>
            Go to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
