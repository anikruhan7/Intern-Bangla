"use client";

import { Calendar, Globe, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { eventsCatalog } from "@/lib/marketData";

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Programs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Events &amp; Workshops</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Live workshops and community events built around the parts of job-hunting that coursework doesn&apos;t
          teach - resumes, interviews, and freelancing.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
        {eventsCatalog.map((e) => (
          <RevealItem key={e.title}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{e.title}</p>
                  <Badge variant={e.mode === "Online" ? "default" : "secondary"}>{e.mode}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{e.description}</p>
                <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
                  {e.mode === "Online" ? <Globe size={13} /> : <MapPin size={13} />}
                  <Calendar size={13} className="ml-2" /> {e.when}
                </div>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Sample schedule for demonstration. Exact dates and registration links go live as events are confirmed.
      </Reveal>
    </section>
  );
}
