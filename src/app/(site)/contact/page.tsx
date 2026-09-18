"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { contactInfo } from "@/lib/contact";

const channels = [
  { icon: Phone, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phoneHref}` },
  { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: MapPin, label: "Location", value: contactInfo.location, href: undefined },
];

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Get in Touch</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Have a question about our internships, courses, or partnerships? Reach out anytime.
        </p>
      </Reveal>

      <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-3">
        {channels.map(({ icon: Icon, label, value, href }) => (
          <RevealItem key={label}>
            <Card className="h-full p-6 transition-colors hover:border-primary/50">
              <CardContent className="flex flex-col items-start gap-3 p-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full brand-gradient-bg text-white">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                {href ? (
                  <a href={href} className="text-base font-medium transition-colors hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
