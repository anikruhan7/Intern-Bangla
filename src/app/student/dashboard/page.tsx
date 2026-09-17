"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout, type AuthUser } from "@/lib/auth";

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

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/student/login");
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
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{greeting()},</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Welcome back, {user.firstName}
          </h1>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/student/login");
          }}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
        >
          Logout
        </button>
      </div>

      <nav className="mt-8 flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "Today" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Weekly Schedule</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                No classes scheduled yet. Check back soon, or reach out to your mentor.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Overall Progress</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">0%</p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">Assigned Mentor</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Unassigned</p>
            </div>
          </div>
        )}

        {tab === "Tasks" && (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-400 dark:border-neutral-700">
            No tasks assigned for this week.
          </div>
        )}

        {tab === "Support" && (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-400 dark:border-neutral-700">
            Support &amp; announcements coming soon.
          </div>
        )}

        {tab === "Profile" && (
          <div className="max-w-xl rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Full Name</dt>
                <dd className="font-medium text-neutral-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Email Address</dt>
                <dd className="font-medium text-neutral-900 dark:text-white">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500 dark:text-neutral-400">Student ID</dt>
                <dd className="font-medium text-neutral-900 dark:text-white">{user.id}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
