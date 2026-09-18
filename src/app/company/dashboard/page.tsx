"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUser, logout, isCompanyRole, type AuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || !isCompanyRole(stored.role)) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
    setUser(stored);
  }, [router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/account">My Account</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <RevealItem>
          <Card className="p-6">
            <p className="text-sm font-semibold">Post an Internship</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Reach thousands of students. Internship posting coming soon.
            </p>
          </Card>
        </RevealItem>
        <RevealItem>
          <Card className="p-6">
            <p className="text-sm font-semibold">Applications</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Review candidates who applied to your listings.
            </p>
          </Card>
        </RevealItem>
        <RevealItem>
          <Card className="p-6">
            <p className="text-sm font-semibold">Company Profile</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your company is pending verification by our team.
            </p>
          </Card>
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
