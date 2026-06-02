import { createFileRoute } from "@tanstack/react-router";
import { Plus, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Nova" }] }),
  component: Bookings,
});

type Booking = {
  id: number;
  rdv_date: string | null;
  rdv_time: string | null;
  rdv_status: string;
  submitted_at: string;
  data: Record<string, string>;
  form: { nom: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  "Confirmé": { label: "Confirmed", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  "Annulé": { label: "Cancelled", icon: XCircle, color: "text-red-600 bg-red-100" },
  "En attente": { label: "Pending", icon: AlertCircle, color: "text-amber-600 bg-amber-100" },
};

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("form_entries")
        .select("id, rdv_date, rdv_time, rdv_status, submitted_at, data, form:forms(nom)")
        .not("rdv_date", "is", null)
        .order("rdv_date", { ascending: false });
      setBookings((data as unknown as Booking[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = bookings.filter((b) => filter === "all" || b.rdv_status === filter);

  const counts = {
    all: bookings.length,
    "En attente": bookings.filter((b) => b.rdv_status === "En attente").length,
    "Confirmé": bookings.filter((b) => b.rdv_status === "Confirmé").length,
    "Annulé": bookings.filter((b) => b.rdv_status === "Annulé").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} total appointments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
          <Plus className="size-4" /> New booking
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "En attente", "Confirmé", "Annulé"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === s
                ? "bg-gradient-button text-primary-foreground shadow-glow"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {s === "all" ? "All" : STATUS_CONFIG[s]?.label ?? s}{" "}
            <span className="ml-1 opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const name = (b.data?.name ?? b.data?.nom ?? b.data?.prenom ?? "Anonymous") as string;
            const status = STATUS_CONFIG[b.rdv_status] ?? { label: b.rdv_status, icon: AlertCircle, color: "text-muted-foreground bg-muted" };
            const StatusIcon = status.icon;
            const formName = (b.form as { nom: string } | null)?.nom ?? "Booking";

            return (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-brand-violet/20 to-brand-indigo/10 grid place-items-center flex-shrink-0">
                  <Clock className="size-5 text-brand-violet" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{formName}</span>
                    {b.rdv_date && (
                      <span className="flex items-center gap-1">
                        · {format(new Date(b.rdv_date), "MMM d, yyyy")}
                        {b.rdv_time && ` at ${b.rdv_time}`}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.color}`}>
                  <StatusIcon className="size-3" />
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
