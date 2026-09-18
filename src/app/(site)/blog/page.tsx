"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { blogPosts } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Intern Bangla Blog</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Insights and guides on the real Bangladesh job and internship market - sourced and cited, not guesswork.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <RevealItem key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <Card className="h-full p-6 transition-colors hover:border-primary/50">
                <CardContent className="flex h-full flex-col gap-3 p-0">
                  <Badge variant="secondary" className="w-fit">{post.tag}</Badge>
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>{post.readTime}</span>
                    <span className="flex items-center gap-1 text-primary">
                      Read <ArrowRight size={13} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
