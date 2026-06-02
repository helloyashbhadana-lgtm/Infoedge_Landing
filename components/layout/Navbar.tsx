"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";
import "../../styles/navbar.css";

const navLinks = [
  { label: "About us", href: "#about", hasDropdown: true },
  { label: "Investor Relations", href: "#investors", hasDropdown: true },
  { label: "Newsroom", href: "#newsroom" },
  { label: "careers", href: "#careers" },
  { label: "Contact us", href: "#contact" },
];

const mobileDrawerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export default function Navbar({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch navbar style when hero section is scrolled out of view
      const heroHeight = window.innerHeight * 0.9;
      setScrolled(window.scrollY > heroHeight - 64);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${!scrolled && variant === "light" ? "navbar--light" : ""}`}>
        <div className="container-wide navbar__inner">
          <a href="/" aria-label="Info Edge Home">
            <Image
              src="/assets/brand_logo.svg"
              alt="infoedge"
              width={151}
              height={40}
              priority
              className="navbar__logo"
            />
          </a>

          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`navbar__link ${link.hasDropdown ? "navbar__link--has-dropdown" : ""}`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <Image
                      src="/assets/down_arrow.svg"
                      alt=""
                      width={12}
                      height={12}
                      aria-hidden="true"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="navbar__menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-drawer"
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="navbar__mobile-links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="navbar__mobile-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
