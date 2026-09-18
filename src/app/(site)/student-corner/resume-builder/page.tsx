"use client";

import { ExternalLink, FileText, GraduationCap, SquarePlay } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const cvTools = [
  { name: "FlowCV", url: "https://flowcv.com/", note: "Unlimited free PDF exports, no watermark, no signup wall." },
  { name: "FreeCV", url: "https://freecv.org/", note: "No account needed, ATS-ready templates, free PDF export." },
  { name: "Google Docs Resume Templates", url: "https://docs.google.com/", note: "Fully free, unlimited edits, instant PDF export." },
  { name: "OpenResume", url: "https://www.open-resume.com/", note: "Open-source, completely free resume builder + parser." },
];

const learningLinks = [
  { name: "W3Schools", url: "https://www.w3schools.com/", note: "The standard free reference for HTML, CSS, JavaScript, SQL, Python, and more." },
  { name: "freeCodeCamp (YouTube)", url: "https://www.youtube.com/@freecodecamp", note: "Full-length, structured free courses on web development and more." },
  { name: "Traversy Media (YouTube)", url: "https://www.youtube.com/@TraversyMedia", note: "Practical crash courses across the web development stack." },
  { name: "The Net Ninja (YouTube)", url: "https://www.youtube.com/@NetNinja", note: "Beginner-friendly playlists on JS, React, Node, and more." },
  { name: "Programming Hero (YouTube)", url: "https://www.youtube.com/c/ProgrammingHeroCommunity", note: "Bangladesh-based tech education channel, Bangla-language content." },
];

export default function Page() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student Corner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Career Toolkit</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          We&apos;d rather point you to genuinely good, free tools than build a worse version ourselves.
          Here&apos;s what we actually recommend.
        </p>
      </Reveal>

      <Reveal className="mt-12 flex items-center gap-2 text-lg font-bold">
        <FileText size={20} className="text-primary" /> Free CV / Resume Builders
      </Reveal>
      <RevealGroup className="mt-4 grid gap-4 sm:grid-cols-2">
        {cvTools.map((tool) => (
          <RevealItem key={tool.name}>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full p-5 transition-colors hover:border-primary/50">
                <CardContent className="flex items-start justify-between gap-3 p-0">
                  <div>
                    <p className="font-semibold">{tool.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.note}</p>
                  </div>
                  <ExternalLink size={15} className="mt-1 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-12 flex items-center gap-2 text-lg font-bold">
        <GraduationCap size={20} className="text-primary" /> Free Learning Resources for Beginners
      </Reveal>
      <RevealGroup className="mt-4 grid gap-4 sm:grid-cols-2">
        {learningLinks.map((link) => (
          <RevealItem key={link.name}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full p-5 transition-colors hover:border-primary/50">
                <CardContent className="flex items-start justify-between gap-3 p-0">
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold">
                      {link.name.includes("YouTube") && <SquarePlay size={14} />} {link.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{link.note}</p>
                  </div>
                  <ExternalLink size={15} className="mt-1 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-10 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        These are external, independently-run sites and channels, linked here as a courtesy - Intern
        Bangla isn&apos;t affiliated with them. See our{" "}
        <a href="/legal/credits" className="text-primary hover:underline">Credits &amp; Sources</a> page
        for details.
      </Reveal>
    </section>
  );
}
