import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserDisplayName } from "../lib/auth";
import { format } from "date-fns";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Nova" }] }),
  component: Dashboard,
});

type RecentEntry = {
  id: number;
  submitted_at: string;
  data: Record<string, string>;
  form: { nom: string } | null;
};

type DashboardStats = {
  totalForms: number;
  totalEntries: number;
  pendingBookings: number;
  conversionRate: string;
};

function Dashboard() {
  const { user } = Route.useRouteContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [formsRes, entriesRes, bookingsRes] = await Promise.all([
        supabase.from("forms").select("id", { count: "exact" }),
        supabase.from("form_entries").select("id", { count: "exact" }),
        supabase.from("form_entries").select("id", { count: "exact" }).eq("rdv_status", "En attente"),
      ]);

      const total = entriesRes.count ?? 0;
      const pending = bookingsRes.count ?? 0;

      setStats({
        totalForms: formsRes.count ?? 0,
        totalEntries: total,
        pendingBookings: pending,
        conversionRate: total > 0 ? ((pending / total) * 100).toFixed(1) + "%" : "0%",
      });

      const { data: recentData } = await supabase
        .from("form_entries")
        .select("id, submitted_at, data, form:forms(nom)")
        .order("submitted_at", { ascending: false })
        .limit(5);

      if (recentData) setRecent(recentData as unknown as RecentEntry[]);
      setLoading(false);
    }
    load();
  }, []);

  const displayName = getUserDisplayName(user).split(" ")[0];

  const STATS = stats
    ? [
        { l: "Active Forms", v: String(stats.totalForms), c: "", g: "from-brand-violet/15 to-brand-indigo/10" },
        { l: "Total Submissions", v: String(stats.totalEntries), c: "", g: "from-brand-pink/15 to-brand-violet/10" },
        { l: "Pending Bookings", v: String(stats.pendingBookings), c: "", g: "from-brand-orange/15 to-brand-pink/10" },
        { l: "Booking Rate", v: stats.conversionRate, c: "", g: "from-brand-indigo/15 to-brand-violet/10" },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your business today</p>
        </div>
        <div className="text-xs text-muted-foreground px-3 py-2 rounded-full border border-border bg-card">
          {format(new Date(), "MMM d, yyyy")}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-muted/40 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.l} className={`rounded-2xl border border-border bg-gradient-to-br ${s.g} p-5`}>
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display font-bold text-2xl mt-1">{s.v}</div>
              {s.c && (
                <div className="text-xs text-emerald-600 mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="size-3" /> {s.c}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-semibold">Submissions Overview</span>
          </div>
          <div className="flex items-end gap-2 h-44">
            {[40, 65, 50, 78, 60, 90, 72, 88, 95, 70, 85, 100].map((b, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-indigo to-brand-violet/50" style={{ height: `${b}%` }} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="font-display font-semibold mb-4">Top Channels</div>
          <div className="flex items-center gap-5">
            <div
              className="relative size-28 rounded-full flex-shrink-0"
              style={{ background: "conic-gradient(var(--brand-violet) 0 46%, var(--brand-pink) 46% 74%, var(--brand-orange) 74% 91%, var(--brand-indigo) 91% 100%)" }}
            >
              <div className="absolute inset-3 rounded-full bg-card grid place-items-center text-sm font-display font-bold">100%</div>
            </div>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-violet" /> Organic 46%</li>
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-pink" /> Paid 28%</li>
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-orange" /> Referral 17%</li>
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-indigo" /> Social 9%</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-semibold">Recent Submissions</span>
          <a href="/app/forms" className="text-sm text-brand-violet inline-flex items-center gap-1">View all <ArrowUpRight className="size-3" /></a>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>
        ) : (
          <div className="space-y-2">
            {recent.map((entry) => {
              const name = (entry.data?.name ?? entry.data?.nom ?? entry.data?.prenom ?? "Anonymous") as string;
              const formName = (entry.form as { nom: string } | null)?.nom ?? "Form";
              const timeAgo = format(new Date(entry.submitted_at), "MMM d, HH:mm");
              return (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition">
                  <div className="size-10 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-sm font-bold flex-shrink-0">
                    {String(name)[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{name}</div>
                    <div className="text-xs text-muted-foreground truncate">Submitted: {formName}</div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
