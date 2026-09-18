"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { login, dashboardPathFor } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [identifier, setIdentifier] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(identifier, password);
      router.push(dashboardPathFor(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Incorrect email/phone or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="p-8 pb-2 sm:p-10 sm:pb-2">
        <CardTitle className="text-3xl">Welcome Back</CardTitle>
        <CardDescription className="text-base">Log in to your Intern Bangla account.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 sm:p-10 sm:pt-6">
        {justRegistered && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            Account created! Sign in below to get started.
          </motion.div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="login-identifier" className="text-base">Email or Phone Number</Label>
            <Input
              id="login-identifier"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-base">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:opacity-80">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" variant="gradient" size="lg" disabled={loading} className="w-full text-base">
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-8 text-center text-base text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="font-semibold text-primary hover:opacity-80">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="relative mx-auto flex min-h-[85vh] max-w-2xl flex-col justify-center px-6 py-12">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl brand-gradient-bg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
