"use client";

import { usePathname } from "next/navigation";
import "../../styles/version-switcher.css";

const versions = [
  { label: "V1", href: "/" },
  { label: "V2", href: "/v2" },
  { label: "V3", href: "/v3" },
  { label: "V4", href: "/v4" },
];

export default function VersionSwitcher() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <div className="version-switcher">
      {versions.map((v) => (
        <button
          key={v.href}
          onClick={() => handleClick(v.href)}
          className={`version-switcher__btn ${isActive(v.href) ? "version-switcher__btn--active" : ""}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
