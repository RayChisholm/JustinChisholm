"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { siteConfig } from "@/config/site.config";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={siteConfig.theme.default}
      themes={["minimal", "cyberpunk", "retro", "nord", "sunset", "forest"]}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
