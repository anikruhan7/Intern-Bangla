"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CompanyRow = {
  id: number;
  name: string;
  industry: string;
  isVerified: boolean;
};

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = useState<CompanyRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<CompanyRow[]>("/company")
      .then(setCompanies)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load companies."));
  }, []);

  async function verify(id: number) {
    try {
      await api.patch(`/company/${id}/verify`);
      setCompanies((c) => c?.map((row) => (row.id === id ? { ...row, isVerified: true } : row)) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to verify company.");
    }
  }

  async function remove(id: number) {
    if (!confirm("Remove this company? Its internship listings will be affected.")) return;
    try {
      await api.delete(`/company/${id}`);
      setCompanies((c) => c?.filter((row) => row.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove company.");
    }
  }

  const filtered = companies?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-muted-foreground">Verify hiring partners before they can post internships.</p>
        </div>
        <Input placeholder="Search companies…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered?.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.industry}</td>
                <td className="px-4 py-3">
                  <Badge variant={c.isVerified ? "success" : "warning"}>
                    {c.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {!c.isVerified && (
                      <Button size="sm" variant="outline" onClick={() => verify(c.id)}>
                        <CheckCircle2 size={14} /> Verify
                      </Button>
                    )}
                    <button
                      onClick={() => remove(c.id)}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete company"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No companies found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {companies === null && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
      </Card>
    </div>
  );
}
