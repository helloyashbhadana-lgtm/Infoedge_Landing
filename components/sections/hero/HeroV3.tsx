"use client";

import ParticleBuilding from "../../ui/ParticleBuilding";
import "../../../styles/hero-v3.css";

export default function HeroV3() {
  return (
    <section className="hero-v3">
      <div className="hero-v3__bg-gradient" />

      <div className="hero-v3__layout">
        <div className="hero-v3__content">
          <h1 className="hero-v3__heading">
            Building India&#8217;s most
            <br />
            trusted digital platforms
          </h1>

          <div className="hero-v3__stats">
            <div className="hero-v3__stat-block">
              <span className="hero-v3__stat-number">45,000 Cr.+</span>
              <span className="hero-v3__stat-label">Market cap</span>
            </div>
            <div className="hero-v3__stat-divider" />
            <div className="hero-v3__stat-block">
              <span className="hero-v3__stat-number">50+</span>
              <span className="hero-v3__stat-label">Active Investments</span>
            </div>
            <div className="hero-v3__stat-divider" />
            <div className="hero-v3__stat-block">
              <span className="hero-v3__stat-number">25+ Years</span>
              <span className="hero-v3__stat-label">Building Trust</span>
            </div>
          </div>
        </div>
      </div>

      <ParticleBuilding />
    </section>
  );
}
