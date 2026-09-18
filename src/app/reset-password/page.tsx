"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Password reset moved to a 6-digit email code entered right on the Forgot
// Password page, instead of a magic link landing here - keep this route
// alive (old links/bookmarks) and just forward people to the new flow.
export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/forgot-password");
  }, [router]);

  return null;
}
