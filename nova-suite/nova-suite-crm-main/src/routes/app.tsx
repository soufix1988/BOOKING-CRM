import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Sparkles, BarChart3, Users, Calendar, FormInput, Workflow, CreditCard,
  Search, Bell, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Nova — Workspace" },
      { name: "description", content: "Your Nova workspace: CRM, bookings, forms and automations." },
    ],
  }),
  component: AppLayout,
});

const NAV = [
  { to: "/app/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/app/contacts", label: "Contacts", icon: Users },
  { to: "/app/bookings", label: "Bookings", icon: Calendar },
  { to: "/app/forms", label: "Forms", icon: FormInput },
  { to: "/app/automations", label: "Automations", icon: Workflow },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
] as const;

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-gradient-button grid place-items-center shadow-glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Nova</span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-gradient-button text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
            <Settings className="size-4" /> Settings
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <LogOut className="size-4" /> Sign out
          </Link>
          <div className="flex items-center gap-3 p-2 mt-2 rounded-xl">
            <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-sm font-bold">
              A
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">Alex Morgan</div>
              <div className="text-muted-foreground">alex@nova.io</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              placeholder="Search contacts, bookings, forms…"
              className="w-full pl-9 pr-3 py-2 rounded-full bg-muted/60 text-sm border border-transparent focus:bg-card focus:border-border outline-none transition"
            />
          </div>
          <button className="relative size-9 rounded-full bg-muted/60 hover:bg-muted grid place-items-center transition" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-pink" />
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
