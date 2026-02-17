"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site.config";
import styles from "./ThemeToggle.module.css";

const themes = ["minimal", "cyberpunk", "retro", "nord", "sunset", "forest"] as const;

const themeLabels: Record<string, string> = {
  minimal: "Minimal",
  cyberpunk: "Cyber",
  retro: "Retro",
  nord: "Nord",
  sunset: "Sunset",
  forest: "Forest",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  if (!siteConfig.theme.allowUserToggle) return null;
  if (!mounted) return null;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Select theme"
      >
        {themeLabels[theme ?? ""] ?? "Theme"}
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {themes.map((t) => (
            <button
              key={t}
              className={`${styles.option} ${theme === t ? styles.active : ""}`}
              onClick={() => {
                setTheme(t);
                setOpen(false);
              }}
              aria-label={`Switch to ${themeLabels[t]} theme`}
            >
              {themeLabels[t]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
