import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { format, addDays, startOfDay, isBefore, parseISO, addMinutes } from "date-fns";

export const Route = createFileRoute("/f/$formId")({
  head: () => ({ meta: [{ title: "Form" }] }),
  component: PublicForm,
});

type Form = {
  id: string;
  nom: string;
  statut: string;
  color: string;
  langue: string;
  adv_config: {
    isAppointment?: boolean;
    aptDuration?: number;
    aptStartTime?: string;
    aptEndTime?: string;
    aptDays?: string[];
  };
};

type Field = {
  id: number;
  label: string;
  type: string;
  options: string;
  requis: boolean;
  ordre: number;
  description: string;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function generateSlots(startTime: string, endTime: string, duration: number): string[] {
  if (!startTime || !endTime || !duration) return [];
  const slots: string[] = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let cur = sh * 60 + (sm || 0);
  const end = eh * 60 + (em || 0);
  while (cur + duration <= end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cur += duration;
  }
  return slots;
}

function PublicForm() {
  const { formId } = Route.useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  // Appointment state
  const [calOffset, setCalOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [{ data: formData }, { data: fieldsData }] = await Promise.all([
        supabase.from("forms").select("id, nom, statut, color, langue, adv_config").eq("id", formId).single(),
        supabase.from("form_fields").select("id, label, type, options, requis, ordre, description").eq("form_id", formId).order("ordre"),
      ]);
      if (formData) setForm(formData as Form);
      if (fieldsData) setFields(fieldsData as Field[]);
      setLoading(false);
    }
    load();
  }, [formId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    // Validate required fields
    for (const f of fields) {
      if (f.requis && !values[f.label]?.trim()) {
        setError(`"${f.label}" is required.`);
        return;
      }
    }
    if (form.adv_config?.isAppointment && (!selectedDate || !selectedTime)) {
      setError("Please select a date and time for your appointment.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const insertPayload: Record<string, unknown> = {
      form_id: formId,
      data: values,
    };
    if (form.adv_config?.isAppointment && selectedDate && selectedTime) {
      insertPayload.rdv_date = selectedDate;
      insertPayload.rdv_time = selectedTime;
      insertPayload.rdv_status = "En attente";
    }

    const { error: dbError } = await supabase.from("form_entries").insert(insertPayload);
    if (dbError) {
      setError("Failed to submit. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!form || form.statut !== "Live") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="size-16 rounded-2xl bg-muted mx-auto mb-4 grid place-items-center">
            <Calendar className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-bold text-xl">Form not available</h1>
          <p className="text-muted-foreground text-sm mt-2">This form is not currently accepting submissions.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="size-20 rounded-full bg-emerald-100 mx-auto mb-5 grid place-items-center">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>
          <h1 className="font-bold text-2xl">
            {form.adv_config?.isAppointment ? "Booking confirmed!" : "Thank you!"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {form.adv_config?.isAppointment
              ? `Your appointment on ${format(parseISO(selectedDate!), "MMMM d, yyyy")} at ${selectedTime} has been received. We'll confirm shortly.`
              : "Your response has been submitted successfully."}
          </p>
        </div>
      </div>
    );
  }

  const accentColor = form.color || "#6366f1";
  const isAppt = form.adv_config?.isAppointment;
  const duration = form.adv_config?.aptDuration ?? 30;
  const startTime = form.adv_config?.aptStartTime ?? "09:00";
  const endTime = form.adv_config?.aptEndTime ?? "18:00";
  const aptDays = form.adv_config?.aptDays ?? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Build 7-day calendar starting from today + offset
  const today = startOfDay(new Date());
  const calDays = Array.from({ length: 7 }, (_, i) => addDays(today, calOffset * 7 + i));
  const slots = selectedDate ? generateSlots(startTime, endTime, duration) : [];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="size-14 rounded-2xl mx-auto mb-4 grid place-items-center shadow-md"
            style={{ background: accentColor }}
          >
            <Calendar className="size-6 text-white" />
          </div>
          <h1 className="font-bold text-2xl">{form.nom}</h1>
          {isAppt && (
            <p className="text-sm text-muted-foreground mt-1">
              <Clock className="size-3 inline mr-1" />{duration} min session
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Regular fields */}
          {fields.map(field => {
            const options = field.options ? field.options.split(",").map(o => o.trim()).filter(Boolean) : [];
            return (
              <div key={field.id} className="space-y-1.5">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.requis && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}

                {field.type === "textarea" ? (
                  <textarea
                    required={field.requis}
                    rows={3}
                    value={values[field.label] ?? ""}
                    onChange={e => setValues(v => ({ ...v, [field.label]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/40 resize-none"
                    placeholder={`Enter ${field.label.toLowerCase()}…`}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.requis}
                    value={values[field.label] ?? ""}
                    onChange={e => setValues(v => ({ ...v, [field.label]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                  >
                    <option value="">Choose…</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : field.type === "radio" ? (
                  <div className="space-y-2">
                    {options.map(o => (
                      <label key={o} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 cursor-pointer transition">
                        <input
                          type="radio"
                          name={field.label}
                          value={o}
                          required={field.requis}
                          checked={values[field.label] === o}
                          onChange={() => setValues(v => ({ ...v, [field.label]: o }))}
                          className="accent-brand-violet"
                        />
                        <span className="text-sm">{o}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={values[field.label] === "true"}
                      onChange={e => setValues(v => ({ ...v, [field.label]: String(e.target.checked) }))}
                      className="accent-brand-violet size-4"
                    />
                    <span className="text-sm">{field.label}</span>
                  </label>
                ) : (
                  <input
                    type={field.type}
                    required={field.requis}
                    value={values[field.label] ?? ""}
                    onChange={e => setValues(v => ({ ...v, [field.label]: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                    placeholder={`Enter ${field.label.toLowerCase()}…`}
                  />
                )}
              </div>
            );
          })}

          {/* Appointment picker */}
          {isAppt && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <span className="font-medium text-sm">Select a date</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setCalOffset(c => c - 1); setSelectedDate(null); setSelectedTime(null); }}
                    disabled={calOffset <= 0}
                    className="size-8 rounded-lg border border-border grid place-items-center hover:bg-muted disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCalOffset(c => c + 1); setSelectedDate(null); setSelectedTime(null); }}
                    className="size-8 rounded-lg border border-border grid place-items-center hover:bg-muted transition"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 grid grid-cols-7 gap-1">
                {calDays.map(day => {
                  const dayName = DAY_NAMES[day.getDay()];
                  const enabled = aptDays.includes(dayName) && !isBefore(day, today);
                  const dateStr = format(day, "yyyy-MM-dd");
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={!enabled}
                      onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); }}
                      className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition ${
                        isSelected
                          ? "text-white font-bold"
                          : enabled
                          ? "hover:bg-muted"
                          : "opacity-30 cursor-not-allowed"
                      }`}
                      style={isSelected ? { background: accentColor } : {}}
                    >
                      <span className="text-muted-foreground mb-1">{format(day, "EEE")}</span>
                      <span className={`font-semibold ${isSelected ? "text-white" : ""}`}>{format(day, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="px-4 pb-4 border-t border-border pt-4">
                  <div className="text-sm font-medium mb-3">
                    Available slots — {format(parseISO(selectedDate), "MMMM d, yyyy")}
                  </div>
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No slots available for this day.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 rounded-xl text-sm border transition ${
                            selectedTime === slot
                              ? "text-white border-transparent font-medium"
                              : "border-border hover:bg-muted"
                          }`}
                          style={selectedTime === slot ? { background: accentColor } : {}}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl text-white font-medium text-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: accentColor }}
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {isAppt ? "Book appointment" : "Submit"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by <span className="font-semibold">Nova</span>
        </p>
      </div>
    </div>
  );
}
