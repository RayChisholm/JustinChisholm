import { siteConfig } from "@/config/site.config";
import styles from "./Contact.module.css";

export function Contact() {
  const { email, github, linkedin } = siteConfig.contact;

  return (
    <section id="contact" className={styles.contact}>
      <div className="section">
        <h2 className={styles.heading}>Contact</h2>
        <p className={styles.text}>
          Want to work together or just say hello? Reach out through any of the
          links below.
        </p>
        <div className={styles.links}>
          {email && (
            <a href={`mailto:${email}`} className={styles.link}>
              Email
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
