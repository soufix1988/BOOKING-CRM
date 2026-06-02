import { createFileRoute } from "@tanstack/react-router";
import { Plus, Eye, ToggleLeft, ToggleRight } from "lucide-react";
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
  submissions?: number;
};

function Forms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("forms")
        .select("id, nom, statut, created_at, color")
        .order("created_at", { ascending: false });

      if (!data) { setLoading(false); return; }

      const withCounts = await Promise.all(
        data.map(async (f) => {
          const { count } = await supabase
            .from("form_entries")
            .select("id", { count: "exact" })
            .eq("form_id", f.id);
          return { ...f, submissions: count ?? 0 };
        })
      );
      setForms(withCounts);
      setLoading(false);
    }
    load();
  }, []);

  const isActive = (s: string) => s === "Actif" || s === "Active" || s === "Live";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">Build and manage your forms</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
          <Plus className="size-4" /> New form
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 h-40 animate-pulse" />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No forms yet. Create your first form.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => {
            const active = isActive(form.statut);
            return (
              <div key={form.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-card-soft transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-xl grid place-items-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: form.color ?? "#9cf566" }}
                    >
                      {form.nom[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm truncate max-w-[150px]">{form.nom}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(form.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active ? <ToggleRight className="size-3" /> : <ToggleLeft className="size-3" />}
                    {active ? "Live" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{form.submissions}</span> submissions</span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-border">
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted transition">
                    <Eye className="size-3.5" /> Preview
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-gradient-button text-primary-foreground hover:opacity-90 transition">
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
