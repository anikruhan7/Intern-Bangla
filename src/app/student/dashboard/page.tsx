"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredUser, updateStoredUser, logout, type AuthUser } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const tabs = ["Today", "Tasks", "Support", "Profile"] as const;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Today");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
    setUser(stored);
    setFirstName(stored.firstName);
    setLastName(stored.lastName);
    setEmail(stored.email);
    api
      .get<AuthUser & { phone?: string | null }>(`/user/${stored.id}`)
      .then((full) => setPhone(full.phone ?? ""))
      .catch(() => {});
  }, [router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      await api.patch(`/user/${user!.id}`, { firstName, lastName, email, phone: phone || undefined });
      updateStoredUser({ firstName, lastName, email });
      setUser((u) => (u ? { ...u, firstName, lastName, email } : u));
      setSaveMessage("Profile updated.");
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="text-2xl font-bold">Welcome back, {user.firstName}</h1>
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

      <nav className="mt-8 flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "Today" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <p className="text-sm font-semibold">Weekly Schedule</p>
              <p className="mt-2 text-sm text-muted-foreground">
                No classes scheduled yet. Check back soon, or reach out to your mentor.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-semibold">Overall Progress</p>
              <p className="mt-2 text-2xl font-bold">0%</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm font-semibold">Assigned Mentor</p>
              <p className="mt-2 text-sm text-muted-foreground">Unassigned</p>
            </Card>
          </div>
        )}

        {tab === "Tasks" && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No tasks assigned for this week.
          </div>
        )}

        {tab === "Support" && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Support &amp; announcements coming soon.
          </div>
        )}

        {tab === "Profile" && (
          <Card className="max-w-xl p-6">
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="sp-first-name">First Name</Label>
                  <Input id="sp-first-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sp-last-name">Last Name</Label>
                  <Input id="sp-last-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sp-email">Email Address</Label>
                <Input id="sp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sp-phone">Phone Number</Label>
                <Input
                  id="sp-phone"
                  type="tel"
                  placeholder="e.g. +8801XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Student ID</Label>
                <p className="text-sm text-muted-foreground">{user.id}</p>
              </div>

              {saveError && <p className="text-sm text-destructive">{saveError}</p>}
              {saveMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>}

              <Button type="submit" variant="gradient" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
