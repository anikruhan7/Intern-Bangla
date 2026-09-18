import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/lib/marketData";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80">
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">{post.tag}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{post.readTime}</p>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sources</p>
        <ul className="mt-2 space-y-1">
          {post.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
