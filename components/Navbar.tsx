"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Navbar.module.css";

const sectionLinks = [
  { label: "About", anchor: "#about" },
  { label: "Projects", anchor: "#projects" },
  { label: "Contact", anchor: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {isHome ? (
          <a href="#" className={styles.logo}>
            {siteConfig.name}
          </a>
        ) : (
          <Link href="/" className={styles.logo}>
            {siteConfig.name}
          </Link>
        )}
        <div className={styles.right}>
          <ul className={styles.links}>
            {sectionLinks.map((link) => (
              <li key={link.anchor}>
                {isHome ? (
                  <a href={link.anchor} className={styles.link}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={`/${link.anchor}`} className={styles.link}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/blog" className={styles.link}>
                Blog
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
