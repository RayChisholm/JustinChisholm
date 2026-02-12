import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/Navbar";
import { ParticleBackground } from "@/components/ParticleBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <div style={{ position: "relative" }}>
            <ParticleBackground />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
