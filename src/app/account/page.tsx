"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Mail, User as UserIcon } from "lucide-react";
import { getStoredUser, updateStoredUser, type AuthUser } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/motion/Reveal";

type FullProfile = AuthUser & { phone?: string | null };

// Matches the backend's OTP_TTL_MS (src/auth/auth.service.ts) - keep in sync.
const OTP_SECONDS = 300;

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "otp">("idle");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSecondsLeft, setEmailSecondsLeft] = useState(OTP_SECONDS);

  useEffect(() => {
    if (emailStep !== "otp") return;
    const id = setInterval(() => setEmailSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [emailStep]);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth check on mount
    setUser(stored);
    api.get<FullProfile>(`/user/${stored.id}`).then((full) => {
      setFirstName(full.firstName);
      setLastName(full.lastName);
      setEmail(full.email);
      setPhone(full.phone ?? "");
    });
  }, [router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);
    try {
      await api.patch(`/user/${user!.id}`, { firstName, lastName, phone: phone || undefined });
      updateStoredUser({ firstName, lastName });
      setUser((u) => (u ? { ...u, firstName, lastName } : u));
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function requestEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage(null);
    setEmailError(null);
    setEmailSaving(true);
    try {
      const res = await api.post<{ message: string }>("/auth/request-email-change", { newEmail });
      setEmailMessage(res.message);
      setEmailOtp("");
      setEmailSecondsLeft(OTP_SECONDS);
      setEmailStep("otp");
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : "Failed to send verification code.");
    } finally {
      setEmailSaving(false);
    }
  }

  async function resendEmailOtp() {
    setEmailMessage(null);
    setEmailError(null);
    setEmailSaving(true);
    try {
      const res = await api.post<{ message: string }>("/auth/request-email-change", { newEmail });
      setEmailMessage(res.message);
      setEmailOtp("");
      setEmailSecondsLeft(OTP_SECONDS);
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : "Failed to send verification code.");
    } finally {
      setEmailSaving(false);
    }
  }

  async function confirmEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailMessage(null);
    setEmailError(null);
    setEmailSaving(true);
    try {
      const res = await api.post<{ message: string; email: string }>("/auth/confirm-email-change", {
        otp: emailOtp,
      });
      setEmail(res.email);
      updateStoredUser({ email: res.email });
      setUser((u) => (u ? { ...u, email: res.email } : u));
      setEmailMessage("Email address updated.");
      setEmailStep("idle");
      setNewEmail("");
      setEmailOtp("");
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : "That code is invalid or has expired.");
    } finally {
      setEmailSaving(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setPasswordMessage("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (user === undefined) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (user === null) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Reveal>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and password.</p>
      </Reveal>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <UserIcon size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Profile</span>
            </div>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>{user.email} · {user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone (optional)</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {profileError && <p className="text-sm text-destructive">{profileError}</p>}
              {profileMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{profileMessage}</p>}
              <Button type="submit" variant="gradient" disabled={profileSaving}>
                {profileSaving ? "Saving…" : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Mail size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Security</span>
            </div>
            <CardTitle>Change Email</CardTitle>
            <CardDescription>
              Current: <span className="text-foreground">{email}</span>. Changing it requires a 6-digit code
              sent to the new address, so a typo can&apos;t lock you out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailStep === "idle" ? (
              <form onSubmit={requestEmailChange} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>New Email Address</Label>
                  <Input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                {emailMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{emailMessage}</p>}
                <Button type="submit" variant="gradient" disabled={emailSaving}>
                  {emailSaving ? "Sending…" : "Send Verification Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={confirmEmailChange} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to <span className="text-foreground">{newEmail}</span>.
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>6-Digit Code</Label>
                    {emailSecondsLeft > 0 ? (
                      <span className="text-xs text-muted-foreground">Expires in {formatCountdown(emailSecondsLeft)}</span>
                    ) : (
                      <span className="text-xs font-medium text-destructive">Code expired</span>
                    )}
                  </div>
                  <Input
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    className="h-14 max-w-[12rem] rounded-xl text-center text-2xl font-bold tracking-[0.6em]"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  {emailSecondsLeft <= 0 && (
                    <button
                      type="button"
                      onClick={resendEmailOtp}
                      disabled={emailSaving}
                      className="text-sm font-medium text-primary hover:opacity-80"
                    >
                      Resend code
                    </button>
                  )}
                </div>
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                {emailMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{emailMessage}</p>}
                <div className="flex gap-3">
                  <Button type="submit" variant="gradient" disabled={emailSaving}>
                    {emailSaving ? "Confirming…" : "Confirm Change"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmailStep("idle");
                      setEmailError(null);
                      setEmailMessage(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <KeyRound size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Security</span>
            </div>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Enter your current password to set a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={savePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <PasswordInput
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <PasswordInput
                  autoComplete="new-password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">At least 6 characters, with an uppercase and a lowercase letter.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <PasswordInput
                  autoComplete="new-password"
                  minLength={6}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
              {passwordMessage && <p className="text-sm text-emerald-600 dark:text-emerald-400">{passwordMessage}</p>}
              <Button type="submit" variant="gradient" disabled={passwordSaving}>
                {passwordSaving ? "Updating…" : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
