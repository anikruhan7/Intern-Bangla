"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Company = { id: number; name: string };
type Internship = {
  id: number;
  title: string;
  description: string;
  requirements: string;
  isActive: boolean;
  company: Company;
};

const emptyForm = { title: "", description: "", requirements: "", companyId: "" };

export default function InternshipsAdminPage() {
  const [items, setItems] = useState<Internship[] | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get<Internship[]>("/internship").then(setItems).catch((err) =>
      setError(err instanceof ApiError ? err.message : "Failed to load internships."),
    );
  }

  useEffect(() => {
    load();
    api.get<Company[]>("/company").then(setCompanies).catch(() => {});
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: Internship) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      requirements: item.requirements,
      companyId: String(item.company?.id ?? ""),
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, companyId: Number(form.companyId) };
      if (editingId) {
        await api.patch(`/internship/${editingId}`, payload);
      } else {
        await api.post("/internship", payload);
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save internship.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this internship listing?")) return;
    try {
      await api.delete(`/internship/${id}`);
      setItems((i) => i?.filter((row) => row.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete internship.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Internships</h1>
          <p className="text-sm text-muted-foreground">Create and manage internship listings.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={openCreate}>
              <Plus size={16} /> New Internship
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Internship" : "New Internship"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                  <option value="">Select a company…</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Requirements</Label>
                <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button variant="gradient" className="w-full" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Internship"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6 overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.map((i) => (
              <tr key={i.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{i.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.company?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={i.isActive ? "success" : "outline"}>{i.isActive ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(i)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(i.id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items?.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No internships yet.</td></tr>
            )}
          </tbody>
        </table>
        {items === null && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
      </Card>
    </div>
  );
}
