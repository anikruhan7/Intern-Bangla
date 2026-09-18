"use client";

import Link from "next/link";
import { MapPin, Clock, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { internships } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Programs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Internships</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse open internship tracks across every domain and apply in minutes. Stipends below reflect
          typical entry-level ranges reported across the Bangladeshi tech sector (usually ৳10,000–25,000/month)
          — the kind of first-role compensation you can realistically expect.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
        {internships.map((i) => (
          <RevealItem key={i.title}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{i.title}</p>
                    <p className="text-sm text-muted-foreground">{i.company}</p>
                  </div>
                  <Badge>{i.domainShort}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{i.description}</p>
                <div className="mt-auto space-y-1.5 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><MapPin size={13} /> {i.mode}</div>
                  <div className="flex items-center gap-1.5"><Clock size={13} /> {i.duration}</div>
                  <div className="flex items-center gap-1.5"><Wallet size={13} /> {i.stipend}</div>
                </div>
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {i.requirements.map((r) => (
                    <li key={r} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{r}</li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-2 w-full">
                  <Link href="/register">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        These are sample listings illustrating the kind of internships Intern Bangla connects students with.
        Real listings from verified companies will appear here as they&apos;re posted.
      </Reveal>
    </section>
  );
}
