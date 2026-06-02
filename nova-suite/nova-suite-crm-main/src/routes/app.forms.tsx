import { createFileRoute } from "@tanstack/react-router";
import { Plus, FormInput, Eye, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/app/forms")({
  head: () => ({ meta: [{ title: "Forms — Nova" }] }),
  component: Forms,
});

const FORMS = [
  { t: "Lead intake form", s: 1248, c: 18.4, status: "Live" },
  { t: "Client onboarding", s: 312, c: 42.1, status: "Live" },
  { t: "Event registration", s: 875, c: 28.7, status: "Live" },
  { t: "Customer feedback", s: 96, c: 12.3, status: "Draft" },
];

function Forms() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Forms</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag-and-drop forms with logic, payments and instant CRM sync.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm shadow-glow">
          <Plus className="size-4" /> New form
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FORMS.map((f, i) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card p-5 hover:shadow-card-soft transition">
            <div className="flex items-start justify-between">
              <div className={`size-11 rounded-xl grid place-items-center bg-gradient-to-br ${
                i % 3 === 0 ? "from-brand-violet to-brand-indigo" : i % 3 === 1 ? "from-brand-pink to-brand-violet" : "from-brand-orange to-brand-pink"
              }`}>
                <FormInput className="size-5 text-white" />
              </div>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
            </div>
            <div className="mt-4 font-display font-semibold">{f.t}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                f.status === "Live" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
              }`}>{f.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-border">
              <div>
                <div className="text-xs text-muted-foreground">Submissions</div>
                <div className="font-display font-bold text-lg">{f.s.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Conv. rate</div>
                <div className="font-display font-bold text-lg">{f.c}%</div>
              </div>
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-border text-sm hover:bg-muted transition">
              <Eye className="size-4" /> Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
