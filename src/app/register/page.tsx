"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Building2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type AccountType = "STUDENT" | "COMPANY";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // The backend ignores everything except STUDENT/COMPANY here - there
      // is no way for this form to create an admin account.
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        accountType,
        ...(phone ? { phone } : {}),
        ...(accountType === "COMPANY" ? { companyName, industry, companyAddress, companyCity } : {}),
      });
      router.push(`/login?registered=1&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col justify-center px-6 py-6">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl brand-gradient-bg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <Card>
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join Intern Bangla as a student or a hiring company.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="mx-auto mb-4 grid max-w-sm grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              {(
                [
                  { type: "STUDENT" as const, label: "Student", icon: GraduationCap },
                  { type: "COMPANY" as const, label: "Company", icon: Building2 },
                ]
              ).map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={cn(
                    "relative flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors",
                    accountType === type ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {accountType === type && (
                    <motion.span
                      layoutId="account-type-pill"
                      className="absolute inset-0 rounded-md brand-gradient-bg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon size={15} /> {label}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-first-name">First Name</Label>
                  <Input id="reg-first-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-last-name">Last Name</Label>
                  <Input id="reg-last-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                {accountType === "COMPANY" && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-company-name">Company Name</Label>
                      <Input
                        id="reg-company-name"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-industry">Industry</Label>
                      <Input id="reg-industry" required value={industry} onChange={(e) => setIndustry(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-company-address">Company Address</Label>
                      <Input
                        id="reg-company-address"
                        required
                        placeholder="Street address"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-company-city">City</Label>
                      <Input
                        id="reg-company-city"
                        required
                        placeholder="e.g. Dhaka"
                        value={companyCity}
                        onChange={(e) => setCompanyCity(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground sm:col-span-2">
                      Companies must be located in Bangladesh - your account will be verified by our admin team.
                    </p>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email Address</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-phone">Phone Number (optional)</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password</Label>
                  <PasswordInput
                    id="reg-password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                  <PasswordInput
                    id="reg-confirm-password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  At least 6 characters. Adding a phone number lets you log in with it instead of email.
                </p>
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

              <Button type="submit" variant="gradient" disabled={loading} className="w-full">
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:opacity-80">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
