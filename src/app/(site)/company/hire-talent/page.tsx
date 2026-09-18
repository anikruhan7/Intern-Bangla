"use client";

import Link from "next/link";
import { ShieldCheck, Wallet, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const reasons = [
  {
    icon: Wallet,
    title: "Cost-effective hiring",
    body: "Interns typically cost ৳10,000–25,000/month versus ৳25,000–45,000+ for a junior hire - a low-risk way to evaluate someone before making a full-time offer.",
  },
  {
    icon: ShieldCheck,
    title: "Verified companies only",
    body: "Every company account is manually verified by our team before it can post a listing, so students trust that opportunities on the platform are real.",
  },
  {
    icon: Users,
    title: "A pre-filtered talent pool",
    body: "Students choose a domain track (web dev, data, security, AI/ML, and more) before applying, so applicants already have relevant fundamentals.",
  },
];

const steps = [
  { title: "Register as a Company", desc: "Sign up and tell us your company name and industry." },
  { title: "Get Verified", desc: "Our team reviews and verifies your account, usually within 1-2 business days." },
  { title: "Post a Listing", desc: "Describe the role, duration, and stipend - and it's visible to students immediately." },
  { title: "Review Applicants", desc: "Manage applications and reach out to candidates from your dashboard." },
];

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Company</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Hire Talent</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Partner with Intern Bangla to find motivated, trained candidates for internships and junior roles -
          without the overhead of running your own campus recruiting pipeline.
        </p>
        <div className="mt-6">
          <Button asChild variant="gradient">
            <Link href="/register">Register Your Company</Link>
          </Button>
        </div>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-3">
        {reasons.map(({ icon: Icon, title, body }) => (
          <RevealItem key={title}>
            <Card className="h-full p-6">
              <CardContent className="flex flex-col gap-3 p-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full brand-gradient-bg text-white">
                  <Icon size={18} />
                </span>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-16">
        <h2 className="text-xl font-bold">How It Works</h2>
      </Reveal>
      <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <RevealItem key={step.title}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white brand-gradient-bg">
              {i + 1}
            </span>
            <p className="mt-3 font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
