"use client";

import {
  PresentationChart,
  PlayCircle,
  FileText,
  Megaphone,
  BookOpen,
} from "@phosphor-icons/react";
import ArrowGrid from "../ui/ArrowGrid";
import "../../styles/investor-relations.css";

const links = [
  {
    label: "Latest earnings ppt",
    icon: <PresentationChart size={24} weight="regular" />,
  },
  {
    label: "Earnings call audio/video",
    icon: <PlayCircle size={24} weight="regular" />,
  },
  {
    label: "Earnings call transcript",
    icon: <FileText size={24} weight="regular" />,
  },
  {
    label: "Announcements",
    icon: <Megaphone size={24} weight="regular" />,
  },
  {
    label: "Policies",
    icon: <BookOpen size={24} weight="regular" />,
  },
];

export default function InvestorRelations() {
  return (
    <section className="investor-relations">
      <ArrowGrid
        arrowSize={30}
        gridSpacing={60}
        defaultTargetSelector=".investor-relations__card"
      />
      <div className="investor-relations__container">
        <div className="investor-relations__text">
          <h2 className="investor-relations__heading">Investor Relations</h2>
          <p className="investor-relations__description">
            Driving sustainable growth through market-leading digital businesses
            and disciplined capital allocation.
          </p>
        </div>

        <div className="investor-relations__card">
          {links.map((link) => (
            <a className="investor-relations__link" key={link.label}>
              <span className="investor-relations__link-icon">{link.icon}</span>
              <span className="investor-relations__link-label">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
