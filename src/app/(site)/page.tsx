"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  BarChart3,
  ShieldCheck,
  Brain,
  Terminal,
  Coffee,
  Users,
  Briefcase,
  FileCheck,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { domains } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { BangladeshGlow } from "@/components/motion/BangladeshGlow";
import { ColorAura } from "@/components/motion/ColorAura";
import { BackgroundSlideshow } from "@/components/motion/BackgroundSlideshow";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { hallOfFameProfiles } from "@/lib/marketData";
import { paletteAt } from "@/lib/colorPalette";

const domainIcons = [Code2, BarChart3, ShieldCheck, Brain, Terminal, Coffee, Users];

const stats = [
  { label: "Students Trained", value: "10,000+" },
  { label: "Industry Domains", value: "7" },
  { label: "Weeks Duration", value: "4-6" },
  { label: "Verified Certificates", value: "100%" },
];

const whyUs = [
  { title: "Real-World Projects", desc: "Work on live briefs, not toy exercises.", icon: Briefcase },
  { title: "Offer Letter", desc: "Get an official internship offer letter on day one.", icon: FileCheck },
  { title: "Verified Certificate", desc: "Digital + physical certificates you can share anywhere.", icon: BadgeCheck },
  { title: "Flexible Learning", desc: "Self-paced weekly tracks that fit around your schedule.", icon: Clock },
];

const steps = [
  { title: "Apply & Enroll", desc: "Pick a domain and complete your application." },
  { title: "Access the Dashboard", desc: "Log in to your personalized student dashboard." },
  { title: "Build Projects", desc: "Complete weekly tasks and get mentor feedback." },
  { title: "Get Certified", desc: "Receive your verified internship certificate." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <BackgroundSlideshow />
        <motion.div
          aria-hidden
          className="aura-blob pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full opacity-[0.15] blur-3xl brand-gradient-bg"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <ColorAura />
        <BangladeshGlow />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              Welcome to Intern Bangla
            </motion.p>
            <AnimatedHeadline
              segments={[
                { text: "Build real skills." },
                { text: "Land real jobs.", gradient: true },
              ]}
              className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-6xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              Premium virtual internships and learning tracks for students in Bangladesh &mdash;
              real projects, industry mentorship, and verified certificates.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button asChild size="lg" variant="gradient">
                <Link href="/programs/internships">
                  Explore Programs <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </motion.div>
          </div>

          <RevealGroup className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
            {stats.map((s) => (
              <RevealItem key={s.label}>
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="font-numeric mt-1 text-3xl font-bold">{s.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Explore All Domains</h2>
            <Link href="/programs/internships" className="text-sm font-semibold text-primary hover:opacity-80">
              Explore All &rarr;
            </Link>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d, i) => {
              const Icon = domainIcons[i % domainIcons.length];
              const palette = paletteAt(i);
              return (
                <RevealItem key={d.slug}>
                  <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link href={`/programs/internships#${d.slug}`}>
                      <Card className="p-6 transition-colors hover:border-primary/50 hover:shadow-md">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full ${palette.bg} ${palette.text}`}>
                          <Icon size={18} />
                        </span>
                        <p className="mt-3 font-semibold">{d.name}</p>
                        <p className={`mt-2 text-sm font-medium ${palette.text}`}>Apply Now &rarr;</p>
                      </Card>
                    </Link>
                  </motion.div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold">Why Intern Bangla</h2>
          <p className="mt-2 text-muted-foreground">More than just an internship.</p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item, i) => {
            const palette = paletteAt(i + 3);
            return (
              <RevealItem key={item.title}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="p-6">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${palette.bg} ${palette.text}`}>
                      <item.icon size={18} />
                    </span>
                    <p className="mt-3 font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </Card>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <section id="how-it-works" className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Your Path to Success</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <RevealItem key={step.title}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${paletteAt(i + 1).solid}`}>
                  {i + 1}
                </span>
                <p className="mt-4 font-semibold">{step.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student Stories</p>
          <h2 className="font-display mt-2 text-2xl font-bold">What Our Interns Say</h2>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hallOfFameProfiles.map((p) => (
            <RevealItem key={p.name}>
              <Card className="h-full p-5">
                <p className="text-sm text-muted-foreground">&ldquo;{p.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.domain} Track</p>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Illustrative sample profiles &mdash; see the{" "}
          <Link href="/student-corner/hall-of-fame" className="text-primary hover:underline">
            Hall of Fame
          </Link>{" "}
          for details.
        </p>
      </section>

      <section className="border-t border-border py-16">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stay Connected</p>
          <h2 className="mt-2 text-2xl font-bold">Subscribe to our Newsletter</h2>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" variant="gradient">
              Subscribe
            </Button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
