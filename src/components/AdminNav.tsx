"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Building2, Briefcase, GraduationCap, CalendarDays, UserCog, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const links = [
  { href: "/staff/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/staff/users", label: "Users", icon: Users },
  { href: "/staff/companies", label: "Companies", icon: Building2 },
  { href: "/staff/internships", label: "Internships", icon: Briefcase },
  { href: "/staff/courses", label: "Courses", icon: GraduationCap },
  { href: "/staff/events", label: "Events", icon: CalendarDays },
  { href: "/account", label: "My Account", icon: UserCog },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card px-3 py-6">
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "brand-gradient-bg text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="mt-4 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
