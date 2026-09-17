"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, logout, isStaffRole, type AuthUser } from "@/lib/auth";

export default function StaffDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || !isStaffRole(stored.role)) {
      router.replace("/staff/login");
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
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Welcome back,</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/staff/login");
          }}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-200"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">Students</p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Manage student enrollments and progress.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">Internships</p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Review applications and internship listings.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">Companies</p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Manage hiring partners and interview pipelines.
          </p>
        </div>
      </div>
    </div>
  );
}
