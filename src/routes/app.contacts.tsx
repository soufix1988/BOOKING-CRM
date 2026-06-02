import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Calendar, FileText, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Nova" }] }),
  component: Contacts,
});

type Entry = {
  id: number;
  form_id: string;
  submitted_at: string;
  rdv_date: string | null;
  rdv_status: string | null;
  data: Record<string, string>;
  form: { nom: string } | null;
};

type Contact = {
  key: string;
  name: string;
  email: string | null;
  phone: string | null;
  entries: Entry[];
  lastActivity: string;
  bookings: number;
};

function extractField(data: Record<string, string>, keys: string[]): string | null {
  for (const k of keys) {
    const found = Object.entries(data).find(([key]) => key.toLowerCase().includes(k));
    if (found?.[1]) return String(found[1]);
  }
  return null;
}

function buildContacts(entries: Entry[]): Contact[] {
  const map = new Map<string, Contact>();

  for (const entry of entries) {
    const name = extractField(entry.data, ["nom", "name", "prenom", "first"]) ?? "Anonymous";
    const email = extractField(entry.data, ["email", "mail", "e-mail"]);
    const phone = extractField(entry.data, ["tel", "phone", "mobile", "portable"]);
    const key = email ?? `${name}-${entry.form_id}`;

    if (!map.has(key)) {
      map.set(key, { key, name, email, phone, entries: [], lastActivity: entry.submitted_at, bookings: 0 });
    }
    const c = map.get(key)!;
    c.entries.push(entry);
    if (entry.rdv_date) c.bookings++;
    if (entry.submitted_at > c.lastActivity) c.lastActivity = entry.submitted_at;
  }

  return Array.from(map.values()).sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
}

function ContactDetail({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-2xl shadow-card-soft w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center gap-4">
          <div className="size-12 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white font-bold text-lg flex-shrink-0">
            {contact.name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-lg truncate">{contact.name}</div>
            {contact.email && <div className="text-sm text-muted-foreground truncate">{contact.email}</div>}
          </div>
          <button onClick={onClose} className="size-9 rounded-xl hover:bg-muted grid place-items-center transition text-muted-foreground">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            {contact.email && (
              <div className="rounded-xl bg-muted/40 p-3 flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="rounded-xl bg-muted/40 p-3 flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate">{contact.phone}</span>
              </div>
            )}
            <div className="rounded-xl bg-muted/40 p-3 flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{contact.entries.length} submission{contact.entries.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{contact.bookings} booking{contact.bookings !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* History */}
          <div>
            <div className="font-semibold text-sm mb-3">Activity history</div>
            <div className="space-y-2">
              {contact.entries.map(entry => (
                <div key={entry.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{(entry.form as { nom: string } | null)?.nom ?? "Form"}</div>
                      {entry.rdv_date && (
                        <div className="text-xs text-brand-violet mt-0.5">
                          📅 {format(new Date(entry.rdv_date), "MMM d, yyyy")} at {entry.rdv_time}
                          {" · "}<span className={entry.rdv_status === "Confirmé" ? "text-emerald-600" : entry.rdv_status === "Annulé" ? "text-red-600" : "text-amber-600"}>
                            {entry.rdv_status === "Confirmé" ? "Confirmed" : entry.rdv_status === "Annulé" ? "Cancelled" : "Pending"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(entry.submitted_at), "MMM d")}
                    </div>
                  </div>
                  {Object.keys(entry.data ?? {}).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(entry.data).slice(0, 4).map(([k, v]) => (
                        <span key={k} className="text-xs bg-muted px-2 py-0.5 rounded-lg">
                          <span className="text-muted-foreground">{k}:</span> {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("form_entries")
        .select("id, form_id, submitted_at, rdv_date, rdv_status, data, form:forms(nom)")
        .order("submitted_at", { ascending: false });
      setContacts(buildContacts((data as unknown as Entry[]) ?? []));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || false;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {selected && <ContactDetail contact={selected} onClose={() => setSelected(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-1">{contacts.length} client{contacts.length !== 1 ? "s" : ""} from form submissions</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted/40 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No contacts yet</p>
            <p className="text-sm text-muted-foreground mt-1">Contacts appear automatically when clients submit your forms</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Activity</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.key}
                  onClick={() => setSelected(c)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-xs font-bold flex-shrink-0">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">
                    {c.email ? <a href={`mailto:${c.email}`} className="hover:text-foreground transition" onClick={e => e.stopPropagation()}>{c.email}</a> : "—"}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{c.phone ?? "—"}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="size-3" /> {c.entries.length}
                      </span>
                      {c.bookings > 0 && (
                        <span className="inline-flex items-center gap-1 text-brand-violet">
                          <Calendar className="size-3" /> {c.bookings}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(c.lastActivity), "MMM d, yyyy")}
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
