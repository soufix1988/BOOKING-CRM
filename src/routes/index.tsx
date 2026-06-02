import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles, Calendar, Users, FormInput, ArrowRight, Check, Star,
  Zap, Shield, BarChart3, Workflow, MessageSquare, CreditCard,
  PlayCircle, ChevronRight, Mail, Phone, Bell, TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nova — CRM, Booking & Forms in one premium platform" },
      { name: "description", content: "Nova unifies CRM, smart booking, and a no-code forms builder. Run your entire customer lifecycle from one beautifully crafted workspace." },
      { property: "og:title", content: "Nova — CRM, Booking & Forms in one premium platform" },
      { property: "og:description", content: "Nova unifies CRM, smart booking, and a no-code forms builder in one premium workspace." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <LogoCloud />
      <Features />
      <Workspace />
      <Modules />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------- NAV ---------- */
function Nav() {
  const links = ["Product", "Features", "Solutions", "Pricing", "Resources"];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-gradient-button shadow-glow grid place-items-center">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Nova</span>
        </a>
        <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l}>
              <a href="#" className="hover:text-foreground transition-colors">{l}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground">Log in</a>
          <a href="/login" className="px-4 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
            Start free
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative bg-hero">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      {/* Floating ornaments */}
      <FloatingIcons />
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-xs text-muted-foreground mb-8 animate-fade-up">
          <span className="size-1.5 rounded-full bg-brand-violet animate-pulse" />
          New · AI-powered scheduling is here
          <ChevronRight className="size-3" />
        </div>
        <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight animate-fade-up">
          The all-in-one platform <br />
          to <span className="text-gradient">grow your business</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Streamline your CRM, bookings, and forms in one beautifully crafted workspace.
          Replace 6 tools with Nova — and ship customer experiences your team is proud of.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <a href="/login" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-button text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition">
            Start free trial
            <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
          </a>
          <a href="#" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border bg-card/80 backdrop-blur hover:bg-card transition">
            <PlayCircle className="size-4" /> Book a demo
          </a>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-brand-violet" /> No credit card required</span>
          <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-brand-violet" /> 14-day free trial</span>
          <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-brand-violet" /> Cancel anytime</span>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function FloatingIcons() {
  const items = [
    { icon: Mail, cls: "top-32 left-[6%] animate-float-slow", grad: "from-brand-pink to-brand-orange", label: "11" },
    { icon: MessageSquare, cls: "top-52 left-[10%] animate-float-medium", grad: "from-brand-violet to-brand-indigo", label: "10" },
    { icon: Calendar, cls: "top-72 left-[4%] animate-float-slow", grad: "from-brand-indigo to-brand-violet", label: "21" },
    { icon: BarChart3, cls: "top-44 right-[6%] animate-float-medium", grad: "from-brand-violet to-brand-pink" },
    { icon: TrendingUp, cls: "top-64 right-[12%] animate-float-slow", grad: "from-brand-orange to-brand-pink" },
    { icon: Bell, cls: "top-80 right-[5%] animate-float-medium", grad: "from-brand-indigo to-brand-violet" },
  ];
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none">
      {items.map((it, i) => (
        <div key={i} className={`absolute ${it.cls}`}>
          <div className={`relative size-14 rounded-2xl bg-gradient-to-br ${it.grad} shadow-card-soft grid place-items-center backdrop-blur`}>
            <it.icon className="size-6 text-white" />
            {it.label && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-foreground text-background text-[10px] font-bold grid place-items-center">
                {it.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mt-20 mx-auto max-w-5xl animate-fade-up" style={{ animationDelay: "0.3s" }}>
      <div className="absolute -inset-8 bg-gradient-to-br from-brand-violet/30 via-brand-pink/20 to-brand-orange/20 blur-3xl rounded-[3rem]" />
      <div className="relative rounded-3xl border border-border bg-card shadow-card-soft overflow-hidden">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-muted/40">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-yellow-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
          <div className="mx-auto text-xs text-muted-foreground">app.nova.io/dashboard</div>
        </div>
        <div className="grid grid-cols-12 min-h-[420px]">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-border bg-muted/30 p-4 hidden md:block">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-7 rounded-lg bg-gradient-button" />
              <span className="font-display font-bold text-sm">Nova</span>
            </div>
            <ul className="space-y-1 text-sm">
              {[
                { i: BarChart3, l: "Dashboard", active: true },
                { i: Users, l: "Contacts" },
                { i: Calendar, l: "Bookings" },
                { i: FormInput, l: "Forms" },
                { i: Workflow, l: "Automations" },
                { i: CreditCard, l: "Billing" },
              ].map((m) => (
                <li key={m.l}>
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${m.active ? "bg-gradient-button text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                    <m.i className="size-4" /> {m.l}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
          {/* Main */}
          <main className="col-span-12 md:col-span-9 p-6 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-lg">Welcome back, Alex 👋</h3>
                <p className="text-xs text-muted-foreground">Here's what's happening with your business today</p>
              </div>
              <div className="text-xs text-muted-foreground">May 12 — May 19, 2026</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { l: "Total Revenue", v: "$24,780", c: "+12.4%", g: "from-brand-violet/15 to-brand-indigo/10" },
                { l: "New Customers", v: "1,250", c: "+8.1%", g: "from-brand-pink/15 to-brand-violet/10" },
                { l: "Total Bookings", v: "3,200", c: "+22.0%", g: "from-brand-orange/15 to-brand-pink/10" },
                { l: "Conversion", v: "4.85%", c: "+0.6%", g: "from-brand-indigo/15 to-brand-violet/10" },
              ].map((s) => (
                <div key={s.l} className={`rounded-2xl border border-border bg-gradient-to-br ${s.g} p-4`}>
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                  <div className="font-display font-bold text-xl mt-1">{s.v}</div>
                  <div className="text-[11px] text-emerald-600 mt-1">{s.c}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-4">
              <div className="lg:col-span-3 rounded-2xl border border-border p-4 bg-background">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Revenue Overview</span>
                  <span className="text-xs text-muted-foreground">$24,780</span>
                </div>
                <FakeChart />
              </div>
              <div className="lg:col-span-2 rounded-2xl border border-border p-4 bg-background">
                <div className="text-sm font-medium mb-3">Top Channels</div>
                <div className="flex items-center gap-4">
                  <DonutChart />
                  <ul className="text-xs space-y-1.5 text-muted-foreground">
                    <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-violet" /> Organic 46%</li>
                    <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-pink" /> Paid 28%</li>
                    <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-orange" /> Referral 17%</li>
                    <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand-indigo" /> Social 9%</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FakeChart() {
  const bars = [40, 65, 50, 78, 60, 90, 72, 88, 95, 70, 85, 100];
  return (
    <div className="flex items-end gap-2 h-32">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-brand-indigo to-brand-violet/50" style={{ height: `${b}%` }} />
      ))}
    </div>
  );
}

function DonutChart() {
  return (
    <div className="relative size-24 rounded-full"
      style={{ background: "conic-gradient(var(--brand-violet) 0 46%, var(--brand-pink) 46% 74%, var(--brand-orange) 74% 91%, var(--brand-indigo) 91% 100%)" }}>
      <div className="absolute inset-3 rounded-full bg-background grid place-items-center">
        <span className="text-xs font-display font-bold">100%</span>
      </div>
    </div>
  );
}

/* ---------- LOGOS ---------- */
function LogoCloud() {
  const logos = ["Acme", "Lumen", "Northwind", "Vertex", "Quantica", "Helios", "Pulse"];
  return (
    <section className="border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Trusted by 12,000+ modern teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
          {logos.map((l) => (
            <span key={l} className="font-display font-bold text-xl text-muted-foreground">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function Features() {
  const items = [
    { icon: Users, t: "Smart CRM", d: "A unified contact timeline with deals, notes, and AI-suggested next actions.", g: "from-brand-violet to-brand-indigo" },
    { icon: Calendar, t: "Booking Engine", d: "Branded booking pages with availability, payments and reminders built-in.", g: "from-brand-pink to-brand-violet" },
    { icon: FormInput, t: "Forms Builder", d: "Drag-and-drop forms with logic, payments and instant CRM sync.", g: "from-brand-orange to-brand-pink" },
    { icon: Workflow, t: "Automations", d: "Visual workflows trigger emails, SMS, tasks — no code required.", g: "from-brand-indigo to-brand-violet" },
    { icon: BarChart3, t: "Insights", d: "Real-time revenue, pipeline and channel attribution dashboards.", g: "from-brand-violet to-brand-pink" },
    { icon: Shield, t: "Enterprise-grade", d: "SOC 2, GDPR, SSO and granular roles. Your data, locked tight.", g: "from-brand-indigo to-brand-orange" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-medium text-brand-violet uppercase tracking-widest">Everything you need</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">
          One platform. <span className="text-gradient">Zero juggling.</span>
        </h2>
        <p className="text-muted-foreground mt-4">
          Stop stitching together five tools. Nova brings CRM, scheduling, forms and automation under one elegant roof.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.t} className="group relative rounded-3xl border border-border bg-card p-7 hover:shadow-card-soft transition-all hover:-translate-y-1">
            <div className={`size-12 rounded-2xl bg-gradient-to-br ${it.g} grid place-items-center mb-5 shadow-glow`}>
              <it.icon className="size-5 text-white" />
            </div>
            <h3 className="font-display font-semibold text-xl">{it.t}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.d}</p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-violet opacity-0 group-hover:opacity-100 transition">
              Learn more <ArrowRight className="size-3.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- WORKSPACE SECTION ---------- */
function Workspace() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs font-medium text-brand-violet uppercase tracking-widest">Built for speed</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 leading-tight">
            A workspace that <span className="text-gradient">feels alive</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Every pixel was crafted to remove friction. Lightning-fast keyboard navigation,
            real-time collaboration, and AI that anticipates your next move.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { i: Zap, t: "Sub-second response", d: "Every action under 100ms — even on huge datasets." },
              { i: Workflow, t: "Visual automations", d: "Drag, drop and ship workflows in minutes." },
              { i: MessageSquare, t: "Unified inbox", d: "Email, SMS and chat in one beautifully sorted thread." },
            ].map((b) => (
              <li key={b.t} className="flex gap-4">
                <div className="size-10 rounded-xl bg-gradient-button grid place-items-center shrink-0 shadow-glow">
                  <b.i className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-semibold">{b.t}</div>
                  <div className="text-sm text-muted-foreground">{b.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 bg-gradient-to-tr from-brand-violet/30 via-brand-pink/20 to-brand-orange/20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl border border-border bg-card shadow-card-soft p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Pipeline</div>
                <div className="font-display font-bold text-2xl">$184,250</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">+18.4%</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Leads", v: 42, c: "from-brand-violet to-brand-indigo" },
                { l: "Qualified", v: 28, c: "from-brand-pink to-brand-violet" },
                { l: "Closed", v: 14, c: "from-brand-orange to-brand-pink" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border p-3">
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                  <div className="font-display font-bold text-lg">{s.v}</div>
                  <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${s.c}`} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { n: "Sarah Chen", t: "Booked discovery call", time: "2m" },
                { n: "Marcus Rivera", t: "Submitted intake form", time: "12m" },
                { n: "Yuki Tanaka", t: "Signed proposal · $4,200", time: "1h" },
              ].map((a) => (
                <div key={a.n} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="size-9 rounded-full bg-gradient-to-br from-brand-violet to-brand-pink grid place-items-center text-white text-sm font-bold">
                    {a.n[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.n}</div>
                    <div className="text-xs text-muted-foreground">{a.t}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- MODULES ---------- */
function Modules() {
  const mods = [
    { t: "CRM", d: "Pipelines, deals, and AI-enriched contact profiles.", icon: Users },
    { t: "Booking", d: "Calendar sync, group events, payments, reminders.", icon: Calendar },
    { t: "Forms", d: "Logic, payments, signatures, file uploads.", icon: FormInput },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="text-center mb-14">
        <span className="text-xs font-medium text-brand-violet uppercase tracking-widest">Three modules. One brain.</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">Choose your starting point</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {mods.map((m, i) => (
          <div key={m.t} className="relative rounded-3xl border border-border overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${i === 0 ? "from-brand-violet/15 to-brand-indigo/5" : i === 1 ? "from-brand-pink/15 to-brand-violet/5" : "from-brand-orange/15 to-brand-pink/5"}`} />
            <div className="relative p-8">
              <div className="size-14 rounded-2xl bg-gradient-button grid place-items-center shadow-glow mb-6">
                <m.icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-2xl">{m.t}</h3>
              <p className="text-muted-foreground mt-2">{m.d}</p>
              <ul className="mt-6 space-y-2">
                {["Unlimited records", "Custom fields", "API & webhooks", "Native integrations"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-brand-violet" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="mt-8 inline-flex items-center gap-1.5 font-medium text-brand-violet">
                Explore {m.t} <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const t = [
    { n: "Amelia Carter", r: "COO, Lumen Studio", q: "Nova replaced HubSpot, Calendly and Typeform. Our ops team got their week back.", g: "from-brand-violet to-brand-pink" },
    { n: "Daniel Okonkwo", r: "Founder, Vertex", q: "The forms builder alone is worth it. Add the CRM and booking? Unreal value.", g: "from-brand-pink to-brand-orange" },
    { n: "Priya Raman", r: "Head of Sales, Pulse", q: "Pipeline visibility we never had. AI suggestions actually move deals forward.", g: "from-brand-indigo to-brand-violet" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="text-center mb-14">
        <span className="text-xs font-medium text-brand-violet uppercase tracking-widest">Loved by teams</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">
          Rated <span className="text-gradient">4.9 / 5</span> across 2,400 reviews
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {t.map((tt) => (
          <figure key={tt.n} className="rounded-3xl border border-border bg-card p-7 hover:shadow-card-soft transition">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-brand-orange text-brand-orange" />
              ))}
            </div>
            <blockquote className="text-foreground leading-relaxed">"{tt.q}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <div className={`size-10 rounded-full bg-gradient-to-br ${tt.g} grid place-items-center text-white font-bold`}>
                {tt.n[0]}
              </div>
              <div>
                <div className="font-display font-semibold text-sm">{tt.n}</div>
                <div className="text-xs text-muted-foreground">{tt.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- PRICING ---------- */
function Pricing() {
  const plans = [
    { n: "Starter", p: "$19", d: "For solos getting going.", f: ["1 user", "500 contacts", "Booking page", "Basic forms"], cta: "Start free" },
    { n: "Growth", p: "$59", d: "For growing teams.", f: ["5 users", "10k contacts", "Automations", "Payments in forms", "Priority support"], cta: "Start free trial", featured: true },
    { n: "Scale", p: "Custom", d: "For larger orgs.", f: ["Unlimited users", "SSO & SCIM", "Dedicated CSM", "Custom SLA"], cta: "Talk to sales" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="text-center mb-14">
        <span className="text-xs font-medium text-brand-violet uppercase tracking-widest">Pricing</span>
        <h2 className="font-display font-bold text-4xl md:text-5xl mt-3">Simple, scales with you</h2>
        <p className="text-muted-foreground mt-3">No hidden fees. Cancel any time.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((pl) => (
          <div key={pl.n} className={`relative rounded-3xl p-8 border ${pl.featured ? "border-transparent bg-gradient-to-br from-brand-violet to-brand-indigo text-white shadow-glow scale-[1.02]" : "border-border bg-card"}`}>
            {pl.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-orange text-white text-[11px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <h3 className="font-display font-bold text-xl">{pl.n}</h3>
            <p className={`text-sm mt-1 ${pl.featured ? "text-white/80" : "text-muted-foreground"}`}>{pl.d}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display font-bold text-5xl">{pl.p}</span>
              {pl.p.startsWith("$") && <span className={pl.featured ? "text-white/70" : "text-muted-foreground"}>/mo</span>}
            </div>
            <ul className="mt-6 space-y-3">
              {pl.f.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className={`size-4 ${pl.featured ? "text-white" : "text-brand-violet"}`} /> {f}
                </li>
              ))}
            </ul>
            <a href="/login" className={`mt-8 block text-center px-5 py-3 rounded-full font-medium transition ${pl.featured ? "bg-white text-brand-violet hover:bg-white/90" : "bg-gradient-button text-primary-foreground hover:opacity-90"}`}>
              {pl.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-28">
      <div className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-brand-indigo via-brand-violet to-brand-pink shadow-glow">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight">
            Ready to ship customer experiences <br className="hidden md:block" /> your team is proud of?
          </h2>
          <p className="text-white/80 mt-6 max-w-xl mx-auto">
            Join 12,000+ teams running their CRM, bookings and forms on Nova.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/login" className="px-6 py-3.5 rounded-full bg-white text-brand-violet font-medium hover:bg-white/90 transition inline-flex items-center gap-2">
              Start free trial <ArrowRight className="size-4" />
            </a>
            <a href="#" className="px-6 py-3.5 rounded-full border border-white/30 text-white hover:bg-white/10 transition">
              Talk to sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const cols = [
    { t: "Product", l: ["Features", "Pricing", "Changelog", "Roadmap"] },
    { t: "Company", l: ["About", "Customers", "Careers", "Press"] },
    { t: "Resources", l: ["Docs", "Guides", "API", "Status"] },
    { t: "Legal", l: ["Privacy", "Terms", "Security", "DPA"] },
  ];
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-6 gap-10">
        <div className="md:col-span-2">
          <a href="#" className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-gradient-button grid place-items-center">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Nova</span>
          </a>
          <p className="text-sm text-muted-foreground mt-4 max-w-xs">
            The all-in-one platform for CRM, booking and forms. Built for modern teams.
          </p>
          <div className="flex gap-3 mt-5 text-muted-foreground">
            <Mail className="size-4" />
            <Phone className="size-4" />
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.t}>
            <div className="font-display font-semibold text-sm mb-3">{c.t}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 Nova Inc. All rights reserved.</span>
          <span>Made with care, by people who hate switching tabs.</span>
        </div>
      </div>
    </footer>
  );
}
