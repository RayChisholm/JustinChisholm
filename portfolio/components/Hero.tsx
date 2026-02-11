import { siteConfig } from "@/config/site.config";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.name}>{siteConfig.name}</h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={styles.cta}>
          <a href="#projects" className={styles.primary}>
            View Projects
          </a>
          <a href="#contact" className={styles.secondary}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
