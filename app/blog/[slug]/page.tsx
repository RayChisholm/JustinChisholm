import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: `${post.title} — Justin Chisholm`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <main>
      <article className="section">
        <Link href="/blog" className={styles.back}>
          &larr; Back to Blog
        </Link>
        <header className={styles.header}>
          <time className={styles.date}>{post.date}</time>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
