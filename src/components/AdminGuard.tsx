"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, isAdminRole, type AuthUser } from "@/lib/auth";

/**
 * Client-side gate for the /staff/* admin panel. This is a UX convenience,
 * not the real security boundary - every admin API call independently
 * requires a valid JWT with the ADMIN role, so a client without one simply
 * can't fetch or mutate any real data even if this check were bypassed.
 */
export function AdminGuard({ children }: { children: (user: AuthUser) => React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || !isAdminRole(stored.role)) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth check on mount
    setUser(stored);
  }, [router]);

  if (user === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Checking your session&hellip;
      </div>
    );
  }
  if (user === null) return null;

  return <>{children(user)}</>;
}
