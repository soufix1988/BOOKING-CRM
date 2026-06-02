import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Eye, Settings, Calendar, FileText, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/forms")({
  head: () => ({ meta: [{ title: "Forms — Nova" }] }),
  component: Forms,
});

type Form = {
  id: string;
  nom: string;
  statut: string;
  created_at: string;
  color: string;
  adv_config: { isAppointment?: boolean; aptDuration?: number };
  submissions?: number;
};

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f97316","#10b981","#3b82f6","#f59e0b","#ef4444","#14b8a6","#6d28d9"];

function NewFormModal({ onClose, onCreated }: { onClose: () => void; onCreated: (f: Form) => void }) {
  const [nom, setNom] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [isAppointment, setIsAppointment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!nom.trim()) { setError("Name is required"); return; }
    setLoading(true);
    const id = `F_${Date.now()}`;
    const { data, error: err } = await supabase.from("forms").insert({
      id,
      nom: nom.trim(),
      color,
      statut: "Actif",
      langue: "fr",
      adv_config: isAppointment ? { isAppointment: true, aptDuration: 30, aptValidation: "auto" } : {},
    }).select().single();
    if (err) { setError(err.message); setLoading(false); return; }
    onCreated({ ...data as Form, submissions: 0 });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-2xl shadow-card-soft w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl">New form</h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-muted grid place-items-center"><X className="size-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Form name</label>
            <input
              autoFocus
              value={nom}
              onChange={e => setNom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Contact form, Booking request…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`size-8 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-ring scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-brand-violet/10 grid place-items-center">
                <Calendar className="size-4 text-brand-violet" />
              </div>
              <div>
                <div className="text-sm font-medium">Appointment booking</div>
                <div className="text-xs text-muted-foreground">Enable date/time slot selection</div>
              </div>
            </div>
            <button
              onClick={() => setIsAppointment(!isAppointment)}
              className={`relative w-11 h-6 rounded-full transition ${isAppointment ? "bg-brand-violet" : "bg-muted"}`}
            >
              <span className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${isAppointment ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-button text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Create form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("forms")
      .select("id, nom, statut, created_at, color, adv_config")
      .neq("statut", "Supprimé")
      .order("created_at", { ascending: false });
    if (!data) { setLoading(false); return; }
    const withCounts = await Promise.all(
      data.map(async (f) => {
        const { count } = await supabase.from("form_entries").select("id", { count: "exact" }).eq("form_id", f.id);
        return { ...f, submissions: count ?? 0 };
      })
    );
    setForms(withCounts as Form[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const isActive = (s: string) => s === "Actif";

  async function toggleStatus(form: Form) {
    const newStatus = isActive(form.statut) ? "Inactif" : "Actif";
    await supabase.from("forms").update({ statut: newStatus }).eq("id", form.id);
    setForms(prev => prev.map(f => f.id === form.id ? { ...f, statut: newStatus } : f));
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {showModal && (
        <NewFormModal
          onClose={() => setShowModal(false)}
          onCreated={(f) => { setForms(prev => [f, ...prev]); setShowModal(false); }}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">{forms.length} form{forms.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition"
        >
          <Plus className="size-4" /> New form
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl border border-border bg-card p-5 h-44 animate-pulse" />)}
        </div>
      ) : forms.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <div className="size-14 rounded-2xl bg-brand-violet/10 grid place-items-center mx-auto mb-4">
            <FileText className="size-7 text-brand-violet" />
          </div>
          <p className="font-semibold">No forms yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first form to start collecting data</p>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
            <Plus className="size-4" /> New form
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => {
            const active = isActive(form.statut);
            const isAppt = form.adv_config?.isAppointment;
            return (
              <div key={form.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-card-soft transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl grid place-items-center text-white font-bold text-base flex-shrink-0" style={{ backgroundColor: form.color }}>
                      {isAppt ? <Calendar className="size-5" /> : form.nom[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm truncate max-w-[140px]">{form.nom}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        {isAppt && <><Calendar className="size-3" /> Booking · </>}
                        {format(new Date(form.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(form)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition ${active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {active ? "Live" : "Off"}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{form.submissions}</span> submissions</span>
                  {isAppt && form.adv_config?.aptDuration && (
                    <span><span className="font-semibold text-foreground">{form.adv_config.aptDuration}min</span> slots</span>
                  )}
                </div>

                <div className="flex gap-2 pt-1 border-t border-border">
                  <Link
                    to="/app/forms/$formId"
                    params={{ formId: form.id }}
                    search={{ tab: "entries" }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted transition"
                  >
                    <Eye className="size-3.5" /> Entries
                  </Link>
                  <Link
                    to="/app/forms/$formId"
                    params={{ formId: form.id }}
                    search={{ tab: "fields" }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-gradient-button text-primary-foreground hover:opacity-90 transition"
                  >
                    <Settings className="size-3.5" /> Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
