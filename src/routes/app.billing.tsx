import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download, Check } from "lucide-react";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — Nova" }] }),
  component: Billing,
});

const INVOICES = [
  { id: "INV-1042", d: "May 1, 2026", a: "$59.00", s: "Paid" },
  { id: "INV-1031", d: "Apr 1, 2026", a: "$59.00", s: "Paid" },
  { id: "INV-1020", d: "Mar 1, 2026", a: "$59.00", s: "Paid" },
  { id: "INV-1009", d: "Feb 1, 2026", a: "$59.00", s: "Paid" },
];

function Billing() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your plan, payment method and invoices.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-brand-indigo via-brand-violet to-brand-pink p-7 text-white shadow-glow">
          <div className="text-xs uppercase tracking-widest text-white/80">Current plan</div>
          <div className="font-display font-bold text-3xl mt-2">Growth</div>
          <div className="text-white/80 text-sm mt-1">$59 / month · renews June 30, 2026</div>
          <div className="grid grid-cols-2 gap-2 mt-6 text-sm">
            {["5 users", "10k contacts", "Automations", "Payments in forms"].map((f) => (
              <div key={f} className="inline-flex items-center gap-2">
                <Check className="size-4" /> {f}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <button className="px-4 py-2 rounded-full bg-white text-brand-violet font-medium text-sm hover:bg-white/90">Upgrade plan</button>
            <button className="px-4 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10">Manage</button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="font-display font-semibold mb-3">Payment method</div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
            <div className="size-10 rounded-lg bg-muted grid place-items-center">
              <CreditCard className="size-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">Visa ending 4242</div>
              <div className="text-xs text-muted-foreground">Expires 09 / 28</div>
            </div>
            <button className="text-sm text-brand-violet">Update</button>
          </div>
          <div className="text-xs text-muted-foreground mt-3">Billed to alex@nova.io</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-display font-semibold">Invoices</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3">Invoice</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((i) => (
              <tr key={i.id} className="border-t border-border hover:bg-muted/30 transition">
                <td className="px-5 py-3 font-medium">{i.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{i.d}</td>
                <td className="px-5 py-3">{i.a}</td>
                <td className="px-5 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">{i.s}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-muted-foreground hover:text-foreground" aria-label="Download invoice"><Download className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
