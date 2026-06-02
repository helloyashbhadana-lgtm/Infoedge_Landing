"use client";

import Image from "next/image";
import "../../styles/backing-innovation.css";

/* ===== Data ===== */

interface Company {
  name: string;
  desc: string;
  logo: string;
}

const strategicList: Company[] = [
  { name: "Aisle Network", desc: "Dating app for serious relationships", logo: "/assets/Aisle Network.png" },
  { name: "Zwayam Digital", desc: "AI hiring and recruitment platform", logo: "/assets/Zwayam Digital.png" },
  { name: "Axilly Labs", desc: "HR automation and talent tools", logo: "/assets/Axilly Labs.png" },
  { name: "Terralytics Analysis", desc: "Mobility data analytics", logo: "/assets/Terralytics Analysis.png" },
  { name: "Sunrise Mentors", desc: "Career mentorship platform", logo: "/assets/Sunrise Mentors.png" },
  { name: "NoPaperForms Solutions", desc: "Education admissions SaaS", logo: "/assets/NoPaperForms Solutions.png" },
];

const financialList: Company[] = [
  { name: "Agstack Technologies", desc: "Agri-tech data platform", logo: "/assets/Agstack Technologies.png" },
  { name: "Printo Document Services", desc: "Online printing services", logo: "/assets/Printo Document Services.png" },
  { name: "Shop Kirana E Trading", desc: "B2B kirana marketplace", logo: "/assets/Shop Kirana E Trading.png" },
  { name: "Metis Eduventures", desc: "Career discovery platform", logo: "/assets/Metis Eduventures.png" },
  { name: "LQ Global Services", desc: "Market research services", logo: "/assets/LQ Global Services.png" },
  { name: "Llama Logisol", desc: "Supply chain software", logo: "/assets/Llama Logisol.png" },
];

/* ===== Brand logo ===== */
function BrandLogo({ logo, name }: { logo: string; name: string }) {
  return (
    <div className="backing-innovation__list-icon">
      <Image src={logo} alt={name} width={56} height={56} style={{ objectFit: "contain" }} />
    </div>
  );
}

/* ===== Component ===== */

export default function BackingInnovation() {
  const loopFinancial = [...financialList, ...financialList];

  return (
    <section className="backing-innovation">
      <div className="backing-innovation__container">
        {/* Header */}
        <div className="backing-innovation__header">
          <h2 className="backing-innovation__heading">
            Backing Innovation,
            <br />
            Building Shareholder Value
          </h2>
          <p className="backing-innovation__description">
            Strategic and financial investments that expand our reach, deepen our
            capabilities and participate in India&apos;s digital growth story.
          </p>
        </div>

        {/* Cards */}
        <div className="backing-innovation__cards">
          {/* Card 1 — Investments in Listed Companies */}
          <div className="backing-innovation__card">
            <h3 className="backing-innovation__card-title">
              Investments in Listed Companies
            </h3>
            <div className="backing-innovation__featured">
              <div className="backing-innovation__featured-item">
                <div className="backing-innovation__logo-box backing-innovation__logo-box--zomato">
                  <Image
                    src="/assets/zomato_logo.png"
                    alt="Zomato"
                    width={187}
                    height={40}
                    unoptimized
                  />
                </div>
                <span className="backing-innovation__featured-name">
                  Zomato
                </span>
                <span className="backing-innovation__featured-desc">
                  Food delivery and restaurant discovery
                </span>
              </div>
              <div className="backing-innovation__featured-item">
                <div className="backing-innovation__logo-box backing-innovation__logo-box--pb">
                  <Image
                    src="/assets/pb_logo.png"
                    alt="Policybazaar"
                    width={200}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <span className="backing-innovation__featured-name">
                  Policybazaar
                </span>
                <span className="backing-innovation__featured-desc">
                  Insurance comparison and buying platform
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 — Strategic Investments List */}
          <div className="backing-innovation__card">
            <h3 className="backing-innovation__card-title">
              Strategic Investments
            </h3>
            <div className="backing-innovation__list">
              {strategicList.map((item) => (
                <div key={item.name} className="backing-innovation__list-item">
                  <BrandLogo logo={item.logo} name={item.name} />
                  <div className="backing-innovation__list-info">
                    <div className="backing-innovation__list-name">
                      {item.name}
                    </div>
                    <div className="backing-innovation__list-desc">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Financial Investments (auto-scroll) */}
          <div className="backing-innovation__card">
            <h3 className="backing-innovation__card-title">
              Financial Investments
            </h3>
            <div className="backing-innovation__scroll-wrapper">
              <div className="backing-innovation__scroll-track">
                {loopFinancial.map((item, i) => (
                  <div
                    key={`${item.name}-${i}`}
                    className="backing-innovation__list-item"
                  >
                    <BrandLogo logo={item.logo} name={item.name} />
                    <div className="backing-innovation__list-info">
                      <div className="backing-innovation__list-name">
                        {item.name}
                      </div>
                      <div className="backing-innovation__list-desc">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
