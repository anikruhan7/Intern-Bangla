"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { navGroups, singleLinks } from "@/lib/nav";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <nav aria-label="Main Navigation" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          Intern Bangla
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.label)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <button className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400">
                {group.label}
              </button>
              {openGroup === group.label && (
                <div className="absolute left-0 top-full w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {singleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/staff/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:text-indigo-600 dark:text-neutral-200 dark:hover:text-indigo-400"
          >
            Staff Login
          </Link>
          <Link
            href="/student/login"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Student Login
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close Menu" : "Open Navigation Menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 lg:hidden dark:border-neutral-700"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-200 px-6 py-4 lg:hidden dark:border-neutral-800">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {group.label}
              </p>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2 text-sm text-neutral-700 dark:text-neutral-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="mt-4 flex items-center gap-3">
            <ThemeToggle />
            <Link href="/staff/login" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Staff Login
            </Link>
            <Link
              href="/student/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Student Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
