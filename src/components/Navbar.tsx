"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { navGroups, singleLinks } from "@/lib/nav";
import { openTommy } from "@/lib/tommyEvents";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="glass-panel sticky top-0 z-50 border-b">
      <nav aria-label="Main Navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/brand/logo-icon.png"
              alt="Intern Bangla"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Intern <span className="brand-gradient-text">Bangla</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                {group.label}
              </button>
              <AnimatePresence>
                {openGroup === group.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full w-64 rounded-xl border border-border bg-card p-2 shadow-lg"
                  >
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {singleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={openTommy}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Sparkles size={12} /> Tommy
          </button>
          <ThemeToggle />
          <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
            Login
          </Link>
          <Button asChild size="sm" variant="gradient">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close Menu" : "Open Navigation Menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <div className="px-6 py-4">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-2 py-2 text-sm text-foreground/80"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    openTommy();
                    setOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80"
                >
                  <Sparkles size={12} /> Tommy
                </button>
                <ThemeToggle />
                <Link href="/login" className="text-sm font-medium text-foreground/80">
                  Login
                </Link>
                <Button asChild size="sm" variant="gradient">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
