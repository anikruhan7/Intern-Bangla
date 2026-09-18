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

type EventRow = {
  id: number;
  title: string;
  description: string;
  mode: "online" | "offline";
  startAt: string;
  registrationUrl: string | null;
};

type EventForm = { title: string; description: string; mode: "online" | "offline"; startAt: string; registrationUrl: string };

const emptyForm: EventForm = { title: "", description: "", mode: "online", startAt: "", registrationUrl: "" };

export default function EventsAdminPage() {
  const [items, setItems] = useState<EventRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get<EventRow[]>("/event").then(setItems).catch((err) =>
      setError(err instanceof ApiError ? err.message : "Failed to load events."),
    );
  }

  useEffect(load, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(item: EventRow) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      mode: item.mode,
      startAt: item.startAt.slice(0, 16),
      registrationUrl: item.registrationUrl ?? "",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        mode: form.mode,
        startAt: new Date(form.startAt).toISOString(),
        ...(form.registrationUrl ? { registrationUrl: form.registrationUrl } : {}),
      };
      if (editingId) {
        await api.patch(`/event/${editingId}`, payload);
      } else {
        await api.post("/event", payload);
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save event.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/event/${id}`);
      setItems((i) => i?.filter((row) => row.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete event.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">Workshops, webinars, and meetups.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" onClick={openCreate}>
              <Plus size={16} /> New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Event" : "New Event"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Mode</Label>
                  <Select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as "online" | "offline" })}>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date &amp; Time</Label>
                  <Input type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Registration URL (optional)</Label>
                <Input value={form.registrationUrl} onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button variant="gradient" className="w-full" disabled={saving} onClick={save}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
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
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Starts</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3">
                  <Badge variant={e.mode === "online" ? "default" : "secondary"}>{e.mode}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(e.startAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(e)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => remove(e.id)} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items?.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No events yet.</td></tr>
            )}
          </tbody>
        </table>
        {items === null && <p className="p-6 text-sm text-muted-foreground">Loading…</p>}
      </Card>
    </div>
  );
}
