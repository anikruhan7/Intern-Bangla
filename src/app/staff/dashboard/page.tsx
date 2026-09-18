"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Building2, Briefcase, GraduationCap } from "lucide-react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

type Counts = { users: number; companies: number; internships: number; courses: number };

export default function StaffDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const user = getStoredUser();

  useEffect(() => {
    Promise.all([
      api.get<unknown[]>("/user").catch(() => []),
      api.get<unknown[]>("/company").catch(() => []),
      api.get<unknown[]>("/internship").catch(() => []),
      api.get<unknown[]>("/course").catch(() => []),
    ]).then(([users, companies, internships, courses]) => {
      setCounts({
        users: users.length,
        companies: companies.length,
        internships: internships.length,
        courses: courses.length,
      });
    });
  }, []);

  const stats = [
    { label: "Total Users", value: counts?.users, icon: Users, href: "/staff/users" },
    { label: "Companies", value: counts?.companies, icon: Building2, href: "/staff/companies" },
    { label: "Internships", value: counts?.internships, icon: Briefcase, href: "/staff/internships" },
    { label: "Courses", value: counts?.courses, icon: GraduationCap, href: "/staff/courses" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-sm text-muted-foreground">Welcome back,</p>
      <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>

      <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <RevealItem key={label}>
            <Link href={href}>
              <Card className="p-6 transition-colors hover:border-primary/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient-bg text-white">
                  <Icon size={16} />
                </span>
                <p className="mt-4 text-2xl font-bold">{value ?? "…"}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </Card>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
