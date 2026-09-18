"use client";

import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { coursesCatalog } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Programs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Premium Courses</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Self-paced, project-based courses across the domains employers are actually hiring for in 2026 -
          AI/ML and cloud skills lead demand, alongside steady need for web development, cybersecurity, and
          data analytics talent.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {coursesCatalog.map((c) => (
          <RevealItem key={c.title}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{c.title}</p>
                  <Badge variant={c.isFree ? "success" : "default"}>
                    {c.isFree ? "Free" : `৳${c.price}`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{c.summary}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={13} /> {c.durationWeeks} weeks · {c.domain}
                </div>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                  {c.curriculum.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sample catalog for demonstration. Enrollment and course progress tracking will open once you&apos;re
        logged in as a student.
      </Reveal>
    </section>
  );
}
