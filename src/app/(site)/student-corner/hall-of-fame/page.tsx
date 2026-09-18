"use client";

import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { hallOfFameProfiles } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student Corner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Hall of Fame</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Celebrating the kind of outcomes our tracks are designed for - from stipend intern to full-time hire.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
        {hallOfFameProfiles.map((p) => (
          <RevealItem key={p.name}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.name}</p>
                  <Badge variant="secondary">{p.domain}</Badge>
                </div>
                <p className="text-sm font-medium text-primary">{p.outcome}</p>
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Quote size={14} className="mt-1 shrink-0" />
                  {p.quote}
                </p>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        These are illustrative sample profiles showing the kind of outcomes our tracks are designed for, not
        real students yet. Real graduate stories will replace these as the first cohort completes their
        internships.
      </Reveal>
    </section>
  );
}
