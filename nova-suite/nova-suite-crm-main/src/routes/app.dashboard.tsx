import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Nova" }] }),
  component: Dashboard,
});

const STATS = [
  { l: "Total Revenue", v: "$24,780", c: "+12.4%", g: "from-brand-violet/15 to-brand-indigo/10" },
  { l: "New Customers", v: "1,250", c: "+8.1%", g: "from-brand-pink/15 to-brand-violet/10" },
  { l: "Total Bookings", v: "3,200", c: "+22.0%", g: "from-brand-orange/15 to-brand-pink/10" },
  { l: "Conversion", v: "4.85%", c: "+0.6%", g: "from-brand-indigo/15 to-brand-violet/10" },
];

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Welcome back, Alex 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your business today</p>
        </div>
        <div className="text-xs text-muted-foreground px-3 py-2 rounded-full border border-border bg-card">
          May 12 — May 19, 2026
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.l} className={`rounded-2xl border border-border bg-gradient-to-br ${s.g} p-5`}>
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-display font-bold text-2xl mt-1">{s.v}</div>
            <div className="text-xs text-emerald-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="size-3" /> {s.c}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-semibold">Revenue Overview</span>
            <span className="text-sm text-muted-foreground">$24,780</span>
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
              className="relative size-28 rounded-full"
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
          <span className="font-display font-semibold">Recent Activity</span>
          <a href="#" className="text-sm text-brand-violet inline-flex items-center gap-1">View all <ArrowUpRight className="size-3" /></a>
        </div>
        <div className="space-y-2">
          {[
            { n: "Sarah Chen", t: "Booked discovery call", time: "2m ago" },
            { n: "Marcus Rivera", t: "Submitted intake form", time: "12m ago" },
            { n: "Yuki Tanaka", t: "Signed proposal · $4,200", time: "1h ago" },
            { n: "Priya Raman", t: "Joined newsletter", time: "3h ago" },
          ].map((a) => (
            <div key={a.n} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition">
              <div className="size-10 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-sm font-bold">
                {a.n[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{a.n}</div>
                <div className="text-xs text-muted-foreground">{a.t}</div>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
