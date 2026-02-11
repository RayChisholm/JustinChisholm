import { siteConfig } from "@/config/site.config";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="section">
        <h2 className={styles.heading}>About</h2>
        <p className={styles.text}>{siteConfig.about}</p>
      </div>
    </section>
  );
}
