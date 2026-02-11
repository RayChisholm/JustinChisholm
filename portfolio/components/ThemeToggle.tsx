"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site.config";
import styles from "./ThemeToggle.module.css";

const themes = ["minimal", "cyberpunk", "retro"] as const;

const themeLabels: Record<string, string> = {
  minimal: "Minimal",
  cyberpunk: "Cyber",
  retro: "Retro",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!siteConfig.theme.allowUserToggle) return null;
  if (!mounted) return null;

  return (
    <div className={styles.toggle}>
      {themes.map((t) => (
        <button
          key={t}
          className={`${styles.button} ${theme === t ? styles.active : ""}`}
          onClick={() => setTheme(t)}
          aria-label={`Switch to ${themeLabels[t]} theme`}
        >
          {themeLabels[t]}
        </button>
      ))}
    </div>
  );
}
