import { createFileRoute } from "@tanstack/react-router";
import { Plus, Workflow, Zap, Power } from "lucide-react";

export const Route = createFileRoute("/app/automations")({
  head: () => ({ meta: [{ title: "Automations — Nova" }] }),
  component: Automations,
});

const FLOWS = [
  { t: "Welcome new contact", d: "When contact created → send welcome email → wait 2d → assign to sales", runs: 4280, on: true },
  { t: "Booking reminder", d: "1 hour before booking → SMS reminder → email confirmation", runs: 2150, on: true },
  { t: "Abandoned form follow-up", d: "Form not submitted in 24h → send nudge → create task", runs: 312, on: false },
  { t: "Payment received", d: "Stripe payment → tag customer → send receipt → notify Slack", runs: 1120, on: true },
];

function Automations() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Automations</h1>
          <p className="text-sm text-muted-foreground mt-1">Visual workflows that trigger emails, SMS and tasks — no code required.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm shadow-glow">
          <Plus className="size-4" /> New workflow
        </button>
      </div>

      <div className="space-y-3">
        {FLOWS.map((f) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-5 hover:shadow-card-soft transition">
            <div className="size-12 rounded-2xl bg-gradient-button grid place-items-center shrink-0 shadow-glow">
              <Workflow className="size-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-display font-semibold">{f.t}</div>
                {f.on ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 inline-flex items-center gap-1">
                    <Zap className="size-3" /> Active
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Paused</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 truncate">{f.d}</div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-display font-bold">{f.runs.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">runs / 30d</div>
            </div>
            <button className={`size-10 rounded-full grid place-items-center transition ${
              f.on ? "bg-gradient-button text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`} aria-label="Toggle">
              <Power className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
