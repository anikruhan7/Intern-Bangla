"use client";

import Link from "next/link";
import { Clock, Wallet, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { proInternships } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Programs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Pro Internships</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Paid, mentor-led internships with guaranteed project ownership and a verified certificate. Stipends
          in this track (৳20,000–35,000/month) sit near the top of what Bangladeshi startups typically pay
          before converting an intern to a full junior role.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {proInternships.map((p) => (
          <RevealItem key={p.title}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wide">{p.domain}</span>
                </div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.company}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Clock size={13} /> {p.duration}</div>
                  <div className="flex items-center gap-1.5"><Wallet size={13} /> {p.stipend}</div>
                </div>
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {p.perks.map((perk) => (
                    <Badge key={perk} variant="secondary">{perk}</Badge>
                  ))}
                </ul>
                <Button asChild variant="gradient" size="sm" className="mt-2 w-full">
                  <Link href="/register">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sample listings for demonstration. Real Pro Track placements go through an application and screening
        step before you&apos;re matched with a host company.
      </Reveal>
    </section>
  );
}
