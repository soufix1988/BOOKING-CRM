import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";

export const Route = createFileRoute("/app/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Nova" }] }),
  component: Bookings,
});

type Booking = {
  id: number;
  rdv_date: string;
  rdv_time: string | null;
  rdv_status: string;
  submitted_at: string;
  data: Record<string, string>;
  form: { id: string; nom: string; adv_config: { aptDuration?: number } } | null;
};

const STATUS = {
  "Confirmé":  { label: "Confirmed", icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-700" },
  "En attente":{ label: "Pending",   icon: AlertCircle,  cls: "bg-amber-100 text-amber-700" },
  "Annulé":    { label: "Cancelled", icon: XCircle,      cls: "bg-red-100 text-red-700" },
};

function getClientName(data: Record<string, string>) {
  return data?.nom || data?.name || data?.prenom || data?.["Nom"] || data?.["Name"] || "Anonymous";
}

function getClientEmail(data: Record<string, string>) {
  return data?.email || data?.["Email"] || null;
}

function dayLabel(dateStr: string) {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isPast(d)) return format(d, "EEEE, MMM d") + " (past)";
  return format(d, "EEEE, MMM d");
}

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("form_entries")
        .select("id, rdv_date, rdv_time, rdv_status, submitted_at, data, form:forms(id, nom, adv_config)")
        .not("rdv_date", "is", null)
        .order("rdv_date", { ascending: true })
        .order("rdv_time", { ascending: true });
      setBookings((data as unknown as Booking[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    await supabase.from("form_entries").update({ rdv_status: status }).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, rdv_status: status } : b));
    setUpdating(null);
  }

  const filtered = bookings.filter(b =>
    filter === "all" || b.rdv_status === filter
  );

  // Group by date
  const grouped = filtered.reduce<Record<string, Booking[]>>((acc, b) => {
    const key = b.rdv_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const counts = {
    all: bookings.length,
    "En attente": bookings.filter(b => b.rdv_status === "En attente").length,
    "Confirmé": bookings.filter(b => b.rdv_status === "Confirmé").length,
    "Annulé": bookings.filter(b => b.rdv_status === "Annulé").length,
  };

  const todayBookings = bookings.filter(b => isToday(parseISO(b.rdv_date)));
  const confirmedToday = todayBookings.filter(b => b.rdv_status === "Confirmé").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">{bookings.length} total appointments</p>
        </div>
        <Link
          to="/app/forms"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition"
        >
          <Calendar className="size-4" /> Manage booking forms
        </Link>
      </div>

      {/* Today summary */}
      {todayBookings.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-brand-violet/10 to-brand-indigo/5 border border-brand-violet/20 p-5 flex items-center gap-5">
          <div className="size-12 rounded-2xl bg-gradient-button grid place-items-center flex-shrink-0 shadow-glow">
            <Calendar className="size-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="font-display font-semibold">Today's schedule</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {todayBookings.length} appointment{todayBookings.length !== 1 ? "s" : ""} · {confirmedToday} confirmed
            </div>
          </div>
          <div className="text-right hidden sm:block">
            {todayBookings.slice(0, 3).map(b => (
              <div key={b.id} className="text-xs text-muted-foreground">
                {b.rdv_time} — {getClientName(b.data)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { label: "All", key: "all", color: "from-brand-violet/15 to-brand-indigo/10" },
          { label: "Pending", key: "En attente", color: "from-amber-500/15 to-amber-500/5" },
          { label: "Confirmed", key: "Confirmé", color: "from-emerald-500/15 to-emerald-500/5" },
          { label: "Cancelled", key: "Annulé", color: "from-red-500/15 to-red-500/5" },
        ] as const).map(({ label, key, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-2xl border p-4 text-left transition ${
              filter === key ? "border-brand-violet/40 shadow-sm" : "border-border hover:border-border/80"
            } bg-gradient-to-br ${color}`}
          >
            <div className="text-2xl font-display font-bold">{counts[key]}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Booking list grouped by date */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No bookings found</p>
          <p className="text-sm text-muted-foreground mt-1">Bookings appear here when clients fill your appointment forms</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayBookings]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-sm font-semibold ${isToday(parseISO(date)) ? "text-brand-violet" : "text-foreground"}`}>
                  {dayLabel(date)}
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}</span>
              </div>

              <div className="space-y-2">
                {dayBookings.map(b => {
                  const name = getClientName(b.data);
                  const email = getClientEmail(b.data);
                  const status = STATUS[b.rdv_status as keyof typeof STATUS] ?? STATUS["En attente"];
                  const StatusIcon = status.icon;
                  const formName = (b.form as { nom: string } | null)?.nom ?? "Booking";
                  const duration = (b.form as { adv_config?: { aptDuration?: number } } | null)?.adv_config?.aptDuration;
                  const isUpdating = updating === b.id;

                  return (
                    <div key={b.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4 hover:shadow-card-soft transition">
                      {/* Time */}
                      <div className="w-16 text-center flex-shrink-0">
                        <div className="font-display font-bold text-sm">{b.rdv_time ?? "—"}</div>
                        {duration && <div className="text-xs text-muted-foreground">{duration}min</div>}
                      </div>

                      {/* Divider */}
                      <div className="w-px h-10 bg-border flex-shrink-0" />

                      {/* Client info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-xs font-bold flex-shrink-0">
                          {name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {email && <>{email} · </>}{formName}
                          </div>
                        </div>
                      </div>

                      {/* Status + actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.cls}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>

                        {/* Quick actions */}
                        {b.rdv_status !== "Confirmé" && (
                          <button
                            onClick={() => updateStatus(b.id, "Confirmé")}
                            disabled={isUpdating}
                            title="Confirm"
                            className="size-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 grid place-items-center transition"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        {b.rdv_status !== "Annulé" && (
                          <button
                            onClick={() => updateStatus(b.id, "Annulé")}
                            disabled={isUpdating}
                            title="Cancel"
                            className="size-8 rounded-full bg-red-100 hover:bg-red-200 text-red-700 grid place-items-center transition"
                          >
                            <XCircle className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
