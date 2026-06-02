import { createFileRoute } from "@tanstack/react-router";
import { Plus, Calendar, Clock, Video } from "lucide-react";

export const Route = createFileRoute("/app/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Nova" }] }),
  component: Bookings,
});

const TODAY = [
  { t: "09:00", title: "Discovery call · Sarah Chen", dur: "30 min", type: "Video" },
  { t: "11:30", title: "Strategy review · Vertex team", dur: "60 min", type: "Video" },
  { t: "14:00", title: "Onboarding · Yuki Tanaka", dur: "45 min", type: "Video" },
  { t: "16:30", title: "Quarterly sync · Pulse", dur: "30 min", type: "Video" },
];

function Bookings() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">Your calendar, branded booking pages, reminders and payments.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm shadow-glow">
          <Plus className="size-4" /> New event type
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-semibold">Today's schedule</div>
            <span className="text-sm text-muted-foreground">Tue, Jun 02</span>
          </div>
          <div className="space-y-3">
            {TODAY.map((e) => (
              <div key={e.t} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:shadow-card-soft transition">
                <div className="text-center w-16">
                  <div className="font-display font-bold text-lg">{e.t}</div>
                  <div className="text-xs text-muted-foreground">{e.dur}</div>
                </div>
                <div className="h-12 w-1 rounded-full bg-gradient-button" />
                <div className="flex-1">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                    <Video className="size-3" /> {e.type} call
                  </div>
                </div>
                <button className="text-sm px-3 py-1.5 rounded-full border border-border hover:bg-muted">Join</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="font-display font-semibold mb-3">Event types</div>
            <ul className="space-y-2 text-sm">
              {[
                { t: "Discovery call", d: "30 min", c: "from-brand-violet to-brand-indigo" },
                { t: "Strategy session", d: "60 min", c: "from-brand-pink to-brand-violet" },
                { t: "Quick chat", d: "15 min", c: "from-brand-orange to-brand-pink" },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition">
                  <div className={`size-9 rounded-lg bg-gradient-to-br ${x.c} grid place-items-center`}>
                    <Calendar className="size-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{x.t}</div>
                    <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="size-3" /> {x.d}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-violet/10 to-brand-pink/5 p-5">
            <div className="font-display font-semibold">This week</div>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div><div className="text-2xl font-display font-bold">28</div><div className="text-muted-foreground text-xs">Bookings</div></div>
              <div><div className="text-2xl font-display font-bold">$3,180</div><div className="text-muted-foreground text-xs">Revenue</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
