import { siteConfig } from "@/config/site.config";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className="section">
        <h2 className={styles.heading}>Projects</h2>
        <div className={styles.grid}>
          {siteConfig.projects.map((project) => (
            <article key={project.title} className={styles.card}>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>
              <div className={styles.tech}>
                {project.tech.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={styles.links}>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Blog
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Code
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
