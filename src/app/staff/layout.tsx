"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminNav } from "@/components/AdminNav";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-muted/40">
      <header className="border-b border-border bg-background px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          Intern <span className="brand-gradient-text">Bangla</span>{" "}
          <span className="text-sm font-normal text-muted-foreground">Admin Panel</span>
        </Link>
      </header>
      <div className="flex flex-1">
        <AdminGuard>
          {() => (
            <>
              <AdminNav />
              <main className="flex-1 overflow-x-hidden">{children}</main>
            </>
          )}
        </AdminGuard>
      </div>
    </div>
  );
}
