import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type SaasUser } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Nova" }] }),
  component: Contacts,
});

function Contacts() {
  const [contacts, setContacts] = useState<SaasUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("saas_users")
        .select("id, email, nom, prenom, created_at")
        .order("created_at", { ascending: false });
      setContacts((data as SaasUser[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.email?.toLowerCase().includes(q) ||
      c.nom?.toLowerCase().includes(q) ||
      c.prenom?.toLowerCase().includes(q)
    );
  });

  function initials(c: SaasUser) {
    return [c.prenom?.[0], c.nom?.[0]].filter(Boolean).join("").toUpperCase() || c.email?.[0]?.toUpperCase() || "?";
  }

  function fullName(c: SaasUser) {
    return [c.prenom, c.nom].filter(Boolean).join(" ") || c.email || c.id;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">{contacts.length} total users</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-sm hover:bg-muted transition">
            <Filter className="size-4" /> Filter
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
            <Plus className="size-4" /> New contact
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full px-3.5 py-2 rounded-xl border border-input bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
          />
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No contacts found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium hidden md:table-cell">Email</th>
                <th className="px-5 py-3 text-left font-medium hidden lg:table-cell">Joined</th>
                <th className="px-5 py-3 text-left font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-xs font-bold flex-shrink-0">
                        {initials(c)}
                      </div>
                      <div>
                        <div className="font-medium">{fullName(c)}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{c.email}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">
                    {c.created_at ? format(new Date(c.created_at), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-violet/10 text-brand-violet">
                      User
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
