import { createFileRoute } from "@tanstack/react-router";
import { Activity, FileText, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format } from "date-fns";

export const Route = createFileRoute("/app/automations")({
  head: () => ({ meta: [{ title: "Activity — Nova" }] }),
  component: Automations,
});

type LogEntry = {
  id: number;
  form_id: string;
  user_id: string;
  action: string;
  created_at: string;
  form: { nom: string; adv_config: { isAppointment?: boolean } } | null;
};

const ACTION_CONFIG: Record<string, { label: string; color: string }> = {
  submit:  { label: "Form submitted",    color: "bg-brand-violet/10 text-brand-violet" },
  create:  { label: "Form created",      color: "bg-emerald-100 text-emerald-700" },
  update:  { label: "Form updated",      color: "bg-blue-100 text-blue-700" },
  delete:  { label: "Form deleted",      color: "bg-red-100 text-red-700" },
  confirm: { label: "Booking confirmed", color: "bg-emerald-100 text-emerald-700" },
  cancel:  { label: "Booking cancelled", color: "bg-red-100 text-red-700" },
};

function Automations() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ submissions: 0, bookings: 0, forms: 0 });

  useEffect(() => {
    async function load() {
      const [{ data: logData }, { count: submissions }, { count: bookings }, { count: forms }] = await Promise.all([
        supabase
          .from("audit_log")
          .select("id, form_id, user_id, action, created_at, form:forms(nom, adv_config)")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("form_entries").select("id", { count: "exact" }),
        supabase.from("form_entries").select("id", { count: "exact" }).not("rdv_date", "is", null),
        supabase.from("forms").select("id", { count: "exact" }).neq("statut", "Supprimé"),
      ]);
      setLogs((logData as unknown as LogEntry[]) ?? []);
      setStats({ submissions: submissions ?? 0, bookings: bookings ?? 0, forms: forms ?? 0 });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">All form submissions and booking events in real time</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-violet/15 to-brand-indigo/10 p-5">
          <div className="size-9 rounded-xl bg-brand-violet/10 grid place-items-center mb-3">
            <FileText className="size-4 text-brand-violet" />
          </div>
          <div className="font-display font-bold text-2xl">{stats.forms}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Active forms</div>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-pink/15 to-brand-violet/10 p-5">
          <div className="size-9 rounded-xl bg-brand-pink/10 grid place-items-center mb-3">
            <Activity className="size-4 text-brand-pink" />
          </div>
          <div className="font-display font-bold text-2xl">{stats.submissions}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Total submissions</div>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-orange/15 to-brand-pink/10 p-5">
          <div className="size-9 rounded-xl bg-brand-orange/10 grid place-items-center mb-3">
            <Calendar className="size-4 text-brand-orange" />
          </div>
          <div className="font-display font-bold text-2xl">{stats.bookings}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Total bookings</div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Activity className="size-4 text-brand-violet" />
          <span className="font-display font-semibold">Audit log</span>
          <span className="ml-auto text-xs text-muted-foreground">{logs.length} events</span>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map(log => {
              const actionCfg = ACTION_CONFIG[log.action] ?? { label: log.action, color: "bg-muted text-muted-foreground" };
              const isAppt = (log.form as { adv_config?: { isAppointment?: boolean } } | null)?.adv_config?.isAppointment;
              const formName = (log.form as { nom: string } | null)?.nom ?? log.form_id;
              return (
                <div key={log.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition">
                  <div className="size-9 rounded-xl bg-muted/50 grid place-items-center flex-shrink-0">
                    {isAppt ? <Calendar className="size-4 text-brand-violet" /> : <FileText className="size-4 text-brand-pink" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{formName}</div>
                    <div className="text-xs text-muted-foreground">by {log.user_id}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${actionCfg.color}`}>
                    {actionCfg.label}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
                    {format(new Date(log.created_at), "MMM d, HH:mm")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
