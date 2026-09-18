"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { OtpInput } from "@/components/ui/otp-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Step = "email" | "otp" | "done";

// Matches the backend's OTP_TTL_MS (src/auth/auth.service.ts) - keep in sync.
const OTP_SECONDS = 300;

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const steps = [
  { key: "email", label: "Email", icon: Mail },
  { key: "otp", label: "Verify", icon: ShieldCheck },
] as const;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== "otp") return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setOtp("");
      setSecondsLeft(OTP_SECONDS);
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setOtp("");
      setSecondsLeft(OTP_SECONDS);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setStep("done");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That code is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  }

  const currentStepIndex = step === "email" ? 0 : 1;

  return (
    <div className="relative mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-6 py-16">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-20 blur-3xl brand-gradient-bg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative">
        <Card className="overflow-hidden">
          {step !== "done" && (
            <div className="flex items-center justify-center gap-3 border-b border-border bg-muted/40 py-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const active = i === currentStepIndex;
                const complete = i < currentStepIndex;
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                          complete && "brand-gradient-bg border-transparent text-white",
                          active && !complete && "border-primary text-primary",
                          !active && !complete && "border-border text-muted-foreground",
                        )}
                      >
                        {complete ? <CheckCircle2 size={14} /> : <Icon size={13} />}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          active ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && <span className="h-px w-6 bg-border" />}
                  </div>
                );
              })}
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              {step === "email" && "Enter your email and we'll send you a 6-digit code."}
              {step === "otp" && "Enter the code we sent and choose a new password."}
              {step === "done" && "All set."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={requestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" variant="gradient" disabled={loading} className="w-full">
                  {loading ? "Sending…" : "Send Code"}
                </Button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={submitReset} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
                >
                  <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    A 6-digit code was sent to <strong className="text-foreground">{email}</strong>. Check
                    your inbox (and spam folder) - it can take a minute or two to arrive.
                  </span>
                </motion.div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-xs">
                    {secondsLeft > 0 ? (
                      <span className="text-muted-foreground">
                        Code expires in <span className="font-semibold text-foreground">{formatCountdown(secondsLeft)}</span>
                      </span>
                    ) : (
                      <span className="font-medium text-destructive">Code expired</span>
                    )}
                  </div>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    onComplete={() => newPasswordRef.current?.focus()}
                    disabled={loading}
                    autoFocus
                  />
                  {secondsLeft <= 0 && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={loading}
                        className="text-sm font-medium text-primary hover:opacity-80"
                      >
                        Resend code
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <KeyRound size={13} /> New Password
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forgot-new-password">New Password</Label>
                    <PasswordInput
                      id="forgot-new-password"
                      ref={newPasswordRef}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forgot-confirm-password">Confirm New Password</Label>
                    <PasswordInput
                      id="forgot-confirm-password"
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" variant="gradient" disabled={loading} className="w-full">
                  {loading ? "Resetting…" : "Reset Password"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
                >
                  Use a different email
                </button>
              </form>
            )}

            {step === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full brand-gradient-bg text-white">
                  <CheckCircle2 size={22} />
                </span>
                <p className="text-sm text-muted-foreground">Password reset. Redirecting you to log in…</p>
              </motion.div>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-semibold text-primary hover:opacity-80">
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
