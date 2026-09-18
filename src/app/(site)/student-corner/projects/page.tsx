"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { projectShowcase } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student Corner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Project Portfolio</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          The kind of real, portfolio-ready projects each track produces - the same type of work that shows up
          in a hiring manager&apos;s interview questions.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projectShowcase.map((p) => (
          <RevealItem key={p.title}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <Badge variant="secondary" className="w-fit">{p.domain}</Badge>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sample projects illustrating the kind of work each track produces. Real student submissions will
        replace these here as they&apos;re completed.
      </Reveal>
    </section>
  );
}
