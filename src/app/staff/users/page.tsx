"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type UserRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "STUDENT" | "ALUMNI" | "HR" | "ADMIN";
  createdAt: string;
};

const roleVariant: Record<UserRow["role"], "default" | "secondary" | "warning" | "success"> = {
  STUDENT: "default",
  ALUMNI: "secondary",
  HR: "warning",
  ADMIN: "success",
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const me = getStoredUser();

  function load() {
    api
      .get<UserRow[]>("/user")
      .then(setUsers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load users."));
  }

  useEffect(load, []);

  async function changeRole(id: number, role: UserRow["role"]) {
    const prev = users;
    setUsers((u) => u?.map((row) => (row.id === id ? { ...row, role } : row)) ?? null);
    try {
      await api.patch(`/user/${id}/role`, { role });
    } catch (err) {
      setUsers(prev ?? null);
      setError(err instanceof ApiError ? err.message : "Failed to update role.");
    }
  }

  async function removeUser(id: number) {
    if (!confirm("Permanently remove this user? This cannot be undone from the UI.")) return;
    try {
      await api.delete(`/user/${id}`);
      setUsers((u) => u?.filter((row) => row.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete user.");
    }
  }

  const filtered = users?.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage every account on the platform.</p>
        </div>
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
                    <Select
                      className="h-8 w-32 text-xs"
                      value={u.role}
                      disabled={u.id === me?.id}
                      onChange={(e) => changeRole(u.id, e.target.value as UserRow["role"])}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="ALUMNI">ALUMNI</option>
                      <option value="HR">HR</option>
                      <option value="ADMIN">ADMIN</option>
                    </Select>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeUser(u.id)}
                    disabled={u.id === me?.id}
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                    aria-label="Delete user"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {users === null && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
      </Card>
    </div>
  );
}
