"use client";

import Image from "next/image";
import "../../styles/our-business.css";

interface Business {
  logo: string;
  hoverLogo?: string;
  name: string;
  logoWidth?: number;
  logoHeight?: number;
  brandColor: string;
  defaultLogoColor?: boolean;
  description: string;
  revenue: string;
  label: string;
}

const businesses: Business[] = [
  {
    logo: "/assets/naukri_logo_ourbusiness.svg",
    hoverLogo: "/assets/naukri_logo.svg",
    name: "Naukri",
    logoHeight: 50,
    brandColor: "#265DF5",
    description:
      "India’s leading recruitment platform connecting millions of job seekers with employers across industries and career opportunities.",
    revenue: "2,158 Cr",
    label: "FY26 annual billings",
  },
  {
    logo: "/assets/js_logo_ourbusiness.svg",
    name: "Jeevansathi",
    logoHeight: 40,
    brandColor: "#E63157",
    description:
      "A trusted matchmaking platform for serious relationships and marriages, with a strong presence in India’s matrimony market.",
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
      "A leading real estate platform enabling property discovery, transactions, and insights within India’s rapidly growing digital property ecosystem.",
    revenue: "451 Cr",
    label: "FY26 annual billings",
  },
  {
    logo: "/assets/shiksha_logo_ourbusiness.svg",
    name: "Shiksha",
    brandColor: "#01808C",
    description:
      "An education platform helping students choose courses, colleges, and careers at education and employability’s growing intersection.",
    revenue: "163.7 Cr",
    label: "FY26 annual billings",
  },
];

export default function OurBusiness() {
  return (
    <section className="our-business" id="our-business">
      <div className="our-business__header">
        <h2 className="our-business__heading">Our business</h2>
        <p className="our-business__description">
          A technology-driven company with a strong culture of entrepreneurship,
          governance and long-term value creation.
        </p>
      </div>

      <div className="our-business__grid">
        {businesses.map((biz) => (
          <div
            className="our-business__card"
            key={biz.name}
            style={{ "--brand-color": biz.brandColor } as React.CSSProperties}
          >
            <div className="our-business__card-logo-wrap" data-has-hover={!!biz.hoverLogo} style={{ height: biz.logoHeight ? `${biz.logoHeight}px` : '48px' }}>
              <Image
                className={`our-business__card-logo our-business__card-logo--default${biz.defaultLogoColor ? ' our-business__card-logo--brand-tint' : ''}`}
                src={biz.logo}
                alt={biz.name}
                width={biz.logoWidth || 160}
                height={biz.logoHeight || 48}
                style={{ height: biz.logoHeight ? `${biz.logoHeight}px` : '48px', width: 'auto' }}
              />
              {biz.hoverLogo && (
                <Image
                  className="our-business__card-logo our-business__card-logo--hover"
                  src={biz.hoverLogo}
                  alt={biz.name}
                  width={biz.logoWidth || 160}
                  height={biz.logoHeight || 48}
                  style={{ height: biz.logoHeight ? `${biz.logoHeight}px` : '48px', width: 'auto' }}
                />
              )}
            </div>
            <p className="our-business__card-desc">{biz.description}</p>
            <div className="our-business__card-bottom">
              <span className="our-business__card-revenue">{biz.revenue}</span>
              <span className="our-business__card-label">{biz.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
