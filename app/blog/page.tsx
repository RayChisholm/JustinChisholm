import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog — Justin Chisholm",
  description: "Writing about projects, tools, and technical deep-dives.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      <div className="section">
        <h1 className={styles.heading}>Blog</h1>
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              <time className={styles.date}>{post.date}</time>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={styles.description}>{post.description}</p>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
