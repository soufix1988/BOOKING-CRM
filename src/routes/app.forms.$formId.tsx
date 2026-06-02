import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft, Plus, Trash2, GripVertical, ChevronUp, ChevronDown,
  Calendar, FileText, Settings, Loader2, Save, Eye, X, Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/forms/$formId")({
  head: () => ({ meta: [{ title: "Form Editor — Nova" }] }),
  component: FormEditor,
});

type Form = {
  id: string;
  nom: string;
  statut: string;
  color: string;
  langue: string;
  theme: string;
  adv_config: {
    isAppointment?: boolean;
    aptDuration?: number;
    aptValidation?: string;
    aptStartTime?: string;
    aptEndTime?: string;
    aptDays?: string[];
  };
};

type Field = {
  id: number;
  form_id: string;
  label: string;
  type: string;
  options: string;
  requis: boolean;
  ordre: number;
  description: string;
};

type Entry = {
  id: number;
  submitted_at: string;
  rdv_date: string | null;
  rdv_time: string | null;
  rdv_status: string | null;
  data: Record<string, unknown>;
};

const FIELD_TYPES = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Multiple choice" },
  { value: "checkbox", label: "Checkbox" },
];

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f97316","#10b981","#3b82f6","#f59e0b","#ef4444","#14b8a6","#6d28d9"];

function FormEditor() {
  const { formId } = Route.useParams();
  const search = useSearch({ from: "/app/forms/$formId" }) as { tab?: string };
  const [tab, setTab] = useState<"fields" | "settings" | "entries">(
    (search.tab as "fields" | "settings" | "entries") ?? "fields"
  );
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingField, setAddingField] = useState(false);
  const [newField, setNewField] = useState({ label: "", type: "text", options: "", requis: false, description: "" });

  useEffect(() => {
    async function load() {
      const [{ data: formData }, { data: fieldsData }, { data: entriesData }] = await Promise.all([
        supabase.from("forms").select("*").eq("id", formId).single(),
        supabase.from("form_fields").select("*").eq("form_id", formId).order("ordre"),
        supabase.from("form_entries").select("*").eq("form_id", formId).order("submitted_at", { ascending: false }),
      ]);
      if (formData) setForm(formData as Form);
      setFields((fieldsData as Field[]) ?? []);
      setEntries((entriesData as Entry[]) ?? []);
      setLoading(false);
    }
    load();
  }, [formId]);

  async function saveSettings() {
    if (!form) return;
    setSaving(true);
    await supabase.from("forms").update({
      nom: form.nom,
      color: form.color,
      langue: form.langue,
      adv_config: form.adv_config,
    }).eq("id", formId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addField() {
    if (!newField.label.trim()) return;
    const ordre = fields.length + 1;
    const { data } = await supabase.from("form_fields").insert({
      form_id: formId,
      label: newField.label.trim(),
      type: newField.type,
      options: newField.options,
      requis: newField.requis,
      ordre,
      description: newField.description,
    }).select().single();
    if (data) setFields(prev => [...prev, data as Field]);
    setNewField({ label: "", type: "text", options: "", requis: false, description: "" });
    setAddingField(false);
  }

  async function deleteField(id: number) {
    await supabase.from("form_fields").delete().eq("id", id);
    setFields(prev => prev.filter(f => f.id !== id));
  }

  async function moveField(index: number, dir: -1 | 1) {
    const newFields = [...fields];
    const swap = index + dir;
    if (swap < 0 || swap >= newFields.length) return;
    [newFields[index], newFields[swap]] = [newFields[swap], newFields[index]];
    const updates = newFields.map((f, i) => ({ ...f, ordre: i + 1 }));
    setFields(updates);
    await Promise.all(updates.map(f => supabase.from("form_fields").update({ ordre: f.ordre }).eq("id", f.id)));
  }

  async function updateBookingStatus(entryId: number, status: string) {
    await supabase.from("form_entries").update({ rdv_status: status }).eq("id", entryId);
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, rdv_status: status } : e));
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );

  if (!form) return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <p className="text-muted-foreground">Form not found</p>
      <Link to="/app/forms" className="text-brand-violet text-sm mt-2 inline-block">← Back to forms</Link>
    </div>
  );

  const isAppt = form.adv_config?.isAppointment;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/app/forms" className="size-9 rounded-xl border border-border hover:bg-muted grid place-items-center transition flex-shrink-0">
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="size-10 rounded-xl grid place-items-center text-white font-bold flex-shrink-0" style={{ backgroundColor: form.color }}>
            {isAppt ? <Calendar className="size-5" /> : form.nom[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl truncate">{form.nom}</h1>
            <p className="text-xs text-muted-foreground">{isAppt ? "Booking form" : "Data collection form"} · {form.statut}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
        {([
          { key: "fields", label: "Fields", icon: FileText },
          { key: "settings", label: "Settings", icon: Settings },
          { key: "entries", label: `Entries (${entries.length})`, icon: Eye },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      {/* Fields tab */}
      {tab === "fields" && (
        <div className="space-y-3">
          {fields.length === 0 && !addingField && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <FileText className="size-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No fields yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add fields to start building your form</p>
            </div>
          )}

          {fields.map((field, i) => (
            <div key={field.id} className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => moveField(i, -1)} disabled={i === 0} className="hover:text-foreground text-muted-foreground disabled:opacity-30">
                  <ChevronUp className="size-4" />
                </button>
                <GripVertical className="size-4 text-muted-foreground/50" />
                <button onClick={() => moveField(i, 1)} disabled={i === fields.length - 1} className="hover:text-foreground text-muted-foreground disabled:opacity-30">
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{field.label}</span>
                  {field.requis && <span className="text-xs text-red-500 font-medium">Required</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span className="capitalize">{FIELD_TYPES.find(t => t.value === field.type)?.label ?? field.type}</span>
                  {field.options && <span>· {field.options}</span>}
                </div>
              </div>
              <button onClick={() => deleteField(field.id)} className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive grid place-items-center transition text-muted-foreground">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          {/* Add field form */}
          {addingField ? (
            <div className="rounded-2xl border border-brand-violet/30 bg-card p-5 space-y-4">
              <div className="font-medium text-sm">New field</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                  <input
                    autoFocus
                    value={newField.label}
                    onChange={e => setNewField(p => ({ ...p, label: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. Full name"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                  <select
                    value={newField.type}
                    onChange={e => setNewField(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              {(newField.type === "select" || newField.type === "radio") && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Options (comma separated)</label>
                  <input
                    value={newField.options}
                    onChange={e => setNewField(p => ({ ...p, options: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requis"
                  checked={newField.requis}
                  onChange={e => setNewField(p => ({ ...p, requis: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="requis" className="text-sm">Required field</label>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAddingField(false)} className="flex-1 py-2 rounded-xl border border-border text-sm hover:bg-muted transition">
                  <X className="size-4 inline mr-1" /> Cancel
                </button>
                <button onClick={addField} className="flex-1 py-2 rounded-xl bg-gradient-button text-primary-foreground text-sm font-medium hover:opacity-90 transition">
                  <Plus className="size-4 inline mr-1" /> Add field
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingField(true)}
              className="w-full rounded-2xl border border-dashed border-border hover:border-brand-violet/50 hover:bg-brand-violet/5 p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-brand-violet transition"
            >
              <Plus className="size-4" /> Add field
            </button>
          )}
        </div>
      )}

      {/* Settings tab */}
      {tab === "settings" && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Form name</label>
            <input
              value={form.nom}
              onChange={e => setForm(f => f ? { ...f, nom: e.target.value } : f)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => f ? { ...f, color: c } : f)}
                  className={`size-8 rounded-full transition ${form.color === c ? "ring-2 ring-offset-2 ring-ring scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Language</label>
            <select
              value={form.langue}
              onChange={e => setForm(f => f ? { ...f, langue: e.target.value } : f)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="fr">French</option>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Appointment booking</div>
                <div className="text-xs text-muted-foreground">Allow visitors to book a time slot</div>
              </div>
              <button
                onClick={() => setForm(f => f ? { ...f, adv_config: { ...f.adv_config, isAppointment: !f.adv_config?.isAppointment } } : f)}
                className={`relative w-11 h-6 rounded-full transition ${form.adv_config?.isAppointment ? "bg-brand-violet" : "bg-muted"}`}
              >
                <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${form.adv_config?.isAppointment ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            {form.adv_config?.isAppointment && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Slot duration (minutes)</label>
                  <select
                    value={form.adv_config?.aptDuration ?? 30}
                    onChange={e => setForm(f => f ? { ...f, adv_config: { ...f.adv_config, aptDuration: Number(e.target.value) } } : f)}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[15, 20, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Start time</label>
                    <input
                      type="time"
                      value={(form.adv_config as any)?.aptStartTime ?? "09:00"}
                      onChange={e => setForm(f => f ? { ...f, adv_config: { ...f.adv_config, aptStartTime: e.target.value } } : f)}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">End time</label>
                    <input
                      type="time"
                      value={(form.adv_config as any)?.aptEndTime ?? "18:00"}
                      onChange={e => setForm(f => f ? { ...f, adv_config: { ...f.adv_config, aptEndTime: e.target.value } } : f)}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Available days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => {
                      const days: string[] = (form.adv_config as any)?.aptDays ?? ["Monday","Tuesday","Wednesday","Thursday","Friday"];
                      const active = days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const next = active ? days.filter((d: string) => d !== day) : [...days, day];
                            setForm(f => f ? { ...f, adv_config: { ...f.adv_config, aptDays: next } } : f);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${active ? "bg-brand-violet text-white" : "border border-border hover:bg-muted"}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-button text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : <Save className="size-4" />}
            {saved ? "Saved!" : "Save settings"}
          </button>
        </div>
      )}

      {/* Entries tab */}
      {tab === "entries" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                    {isAppt && <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Appointment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                    </>}
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.submitted_at), "MMM d, yyyy HH:mm")}
                      </td>
                      {isAppt && <>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {entry.rdv_date ? `${format(new Date(entry.rdv_date), "MMM d")} at ${entry.rdv_time}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={entry.rdv_status ?? "En attente"}
                            onChange={e => updateBookingStatus(entry.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${
                              entry.rdv_status === "Confirmé" ? "bg-emerald-100 text-emerald-700" :
                              entry.rdv_status === "Annulé" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <option value="En attente">Pending</option>
                            <option value="Confirmé">Confirmed</option>
                            <option value="Annulé">Cancelled</option>
                          </select>
                        </td>
                      </>}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(entry.data ?? {}).map(([k, v]) => (
                            <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded-lg">
                              <span className="text-muted-foreground">{k}:</span> {String(v)}
                            </span>
                          ))}
                          {Object.keys(entry.data ?? {}).length === 0 && <span className="text-xs text-muted-foreground">No data</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
