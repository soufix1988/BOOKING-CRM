import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, Phone, MoreHorizontal, Filter } from "lucide-react";

export const Route = createFileRoute("/app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Nova" }] }),
  component: Contacts,
});

const CONTACTS = [
  { n: "Sarah Chen", e: "sarah@lumen.co", c: "Lumen Studio", s: "Customer", v: "$4,200" },
  { n: "Marcus Rivera", e: "marcus@vertex.io", c: "Vertex", s: "Lead", v: "$0" },
  { n: "Yuki Tanaka", e: "yuki@pulse.app", c: "Pulse", s: "Customer", v: "$8,900" },
  { n: "Priya Raman", e: "priya@helios.co", c: "Helios", s: "Qualified", v: "$2,400" },
  { n: "Daniel Okonkwo", e: "dan@quantica.io", c: "Quantica", s: "Customer", v: "$12,100" },
  { n: "Amelia Carter", e: "amelia@northwind.co", c: "Northwind", s: "Lead", v: "$0" },
];

const TONE: Record<string, string> = {
  Customer: "bg-emerald-500/10 text-emerald-600",
  Lead: "bg-brand-violet/10 text-brand-violet",
  Qualified: "bg-brand-orange/10 text-brand-orange",
};

function Contacts() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer relationships in one place.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm hover:bg-muted transition">
            <Filter className="size-4" /> Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm shadow-glow">
            <Plus className="size-4" /> New contact
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3 hidden md:table-cell">Company</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3 hidden lg:table-cell">Lifetime value</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {CONTACTS.map((c) => (
              <tr key={c.e} className="border-t border-border hover:bg-muted/30 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-xs font-bold">
                      {c.n[0]}
                    </div>
                    <div>
                      <div className="font-medium">{c.n}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Mail className="size-3" /> {c.e}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">{c.c}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TONE[c.s]}`}>{c.s}</span>
                </td>
                <td className="px-5 py-3 hidden lg:table-cell font-medium">{c.v}</td>
                <td className="px-5 py-3 text-right">
                  <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
