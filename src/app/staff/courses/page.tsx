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

const DOMAINS = [
  "web_development",
  "data_analytics",
  "cyber_security",
  "ai_ml",
  "python",
  "java",
  "human_resources",
] as const;

type Course = {
  id: number;
  title: string;
  slug: string;
  domain: string;
  summary: string;
  durationWeeks: number;
  isFree: boolean;
  price: number;
  curriculum: string[] | null;
};

const emptyForm = {
  title: "",
  slug: "",
  domain: DOMAINS[0] as string,
  summary: "",
  durationWeeks: "6",
  isFree: true,
  price: "0",
  curriculum: "",
};

export default function CoursesAdminPage() {
  const [items, setItems] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get<Course[]>("/course").then(setItems).catch((err) =>
      setError(err instanceof ApiError ? err.message : "Failed to load courses."),
    );
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: Course) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      domain: item.domain,
      summary: item.summary,
      durationWeeks: String(item.durationWeeks),
      isFree: item.isFree,
      price: String(item.price),
      curriculum: (item.curriculum ?? []).join("\n"),
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        domain: form.domain,
        summary: form.summary,
        durationWeeks: Number(form.durationWeeks),
        isFree: form.isFree,
        price: form.isFree ? 0 : Number(form.price),
        curriculum: form.curriculum.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.patch(`/course/${editingId}`, payload);
      } else {
        await api.post("/course", payload);
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save course.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/course/${id}`);
      setItems((i) => i?.filter((row) => row.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete course.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage learning tracks students can enroll in.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={openCreate}>
              <Plus size={16} /> New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Course" : "New Course"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Domain</Label>
                  <Select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d.replace(/_/g, " ")}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Duration (weeks)</Label>
                  <Input type="number" min={1} value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Summary</Label>
                <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Curriculum (one item per line)</Label>
                <Textarea value={form.curriculum} onChange={(e) => setForm({ ...form, curriculum: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} />
                  Free course
                </label>
                {!form.isFree && (
                  <Input
                    type="number"
                    min={0}
                    placeholder="Price (BDT)"
                    className="w-32"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button variant="gradient" className="w-full" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Course"}
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
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{c.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.domain.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.durationWeeks}w</td>
                <td className="px-4 py-3">
                  <Badge variant={c.isFree ? "success" : "default"}>{c.isFree ? "Free" : `৳${c.price}`}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(c)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(c.id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No courses yet.</td></tr>
            )}
          </tbody>
        </table>
        {items === null && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
      </Card>
    </div>
  );
}
