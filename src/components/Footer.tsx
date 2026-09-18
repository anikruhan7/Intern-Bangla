import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Link2, Camera, MessageCircle, SquarePlay } from "lucide-react";
import { footerLegalLinks } from "@/lib/nav";
import { contactInfo } from "@/lib/contact";

const socialLinks = [
  { label: "LinkedIn", icon: Link2, href: "#" },
  { label: "Instagram", icon: Camera, href: "#" },
  { label: "WhatsApp", icon: MessageCircle, href: "#" },
  { label: "YouTube", icon: SquarePlay, href: "#" },
];

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-border"
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--primary) 10%, var(--muted)) 0%, var(--muted) 45%, color-mix(in srgb, var(--secondary) 12%, var(--muted)) 100%)",
      }}
    >
      <div aria-hidden className="h-1 w-full" style={{ background: "var(--gradient-brand)" }} />
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="flex items-center gap-2 text-lg font-bold">
              <span className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/brand/logo-icon.png"
                  alt="Intern Bangla"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              Intern <span className="brand-gradient-text">Bangla</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Build real skills. Land real jobs. Virtual internships and learning tracks for
              students across Bangladesh.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Platform</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/programs/internships" className="transition-colors hover:text-primary">Internships</Link></li>
              <li><Link href="/programs/courses" className="transition-colors hover:text-primary">Courses</Link></li>
              <li><Link href="/programs/events" className="transition-colors hover:text-primary">Events</Link></li>
              <li><Link href="/student-corner/hall-of-fame" className="transition-colors hover:text-primary">Hall of Fame</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-primary">Blog</Link></li>
            </ul>
          </div>

          <div>
            <p className="brand-gradient-text text-sm font-semibold">Company</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              {[
                { href: "/company/hire-talent", label: "Hire Top Talent" },
                { href: "/company/about", label: "About Us" },
                { href: "/student-corner/resume-builder", label: "Career Toolkit" },
                { href: "/contact", label: "Contact" },
              ].map((link, i) => (
                <li key={link.href} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: i % 2 === 0 ? "var(--primary)" : "var(--secondary)" }}
                  />
                  <Link href={link.href} className="transition-colors hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Contact</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href={`tel:${contactInfo.phoneHref}`} className="flex items-center gap-2 transition-colors hover:text-primary">
                  <Phone size={14} className="shrink-0" /> {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 transition-colors hover:text-primary">
                  <Mail size={14} className="shrink-0" /> {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" /> {contactInfo.location}
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Legal</p>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">{link.label}</Link>
                </li>
              ))}
              <li><Link href="/legal/credits" className="transition-colors hover:text-primary">Credits &amp; Sources</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ background: "var(--gradient-brand)" }}>
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-white">
          <p>
            Intern Bangla &copy; {new Date().getFullYear()} AR Solutions. All rights reserved. Created by{" "}
            <span className="font-semibold">Anik Ruhan</span>.
          </p>
          <p className="mt-1 font-semibold tracking-wide">
            <span aria-hidden>🇧🇩</span> Only made for Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
