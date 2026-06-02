import type { Metadata } from "next";
import VersionSwitcher from "../components/ui/VersionSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Info Edge — Building India's Most Trusted Digital Platforms",
  description:
    "Info Edge is the parent company of Naukri.com, 99acres, Jeevansathi, and Shiksha — building India's most trusted digital platforms for over 25 years.",
  openGraph: {
    title: "Info Edge — Building India's Most Trusted Digital Platforms",
    description:
      "Info Edge is the parent company of Naukri.com, 99acres, Jeevansathi, and Shiksha.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Text:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
        />
      </head>
      <body>
        {children}
        <VersionSwitcher />
      </body>
    </html>
  );
}
