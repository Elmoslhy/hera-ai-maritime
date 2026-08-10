import { useState } from "react";
import { z } from "zod";
import satelliteNetwork from "@/assets/satellite-network.jpg";
import ocean from "@/assets/ocean.jpg";
import vessels from "@/assets/vessels.jpg";
import { SekerLogo } from "./Logo";
import { HeroHud, HeroScene } from "./HeroScene";
import { IntelPanel } from "./IntelPanel";
import { CountUp, Reveal, SectionBackground } from "./primitives";

export function HeroSection() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-navy-deep" />
      <HeroScene />
      <HeroHud />
      <IntelPanel />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Reveal>
          <SekerLogo className="mx-auto w-[min(72vw,460px)] text-foreground" />
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="text-balance mt-8 text-3xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
            Maritime intelligence
            <br />
            <span className="font-normal">you can act on.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <span className="text-gold">HERA AI</span> turns fragmented maritime signals into
            verified, decision-ready intelligence — strengthened by our own space infrastructure.
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <a
            href="#contact"
            className="mt-10 inline-block bg-gold px-8 py-4 font-mono text-[11px] tracking-[0.22em] text-navy-deep transition-opacity hover:opacity-90"
          >
            REQUEST API ACCESS →
          </a>
        </Reveal>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/70">
          SCROLL TO EXPLORE
        </span>
        <svg
          width="20"
          height="46"
          viewBox="0 0 22 52"
          fill="none"
          aria-hidden
          className="animate-bounce text-foreground/50"
        >
          <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1" />
          <circle cx="11" cy="10" r="2" fill="currentColor" />
          <path d="M5 40l6 5 6-5" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M5 46l6 5 6-5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

export function LaunchSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* full-screen video background */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          poster={vessels}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero-video.webm" type='video/webm; codecs="vp9"' />
        </video>
        <div className="absolute inset-0 bg-navy/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_0%,rgba(9,18,31,0.85)_80%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <Reveal>
          <p className="text-eyebrow text-gold/80">EU Sovereign · Real Time</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="text-balance mt-7 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Launching with
            <br />
            <span className="text-gold">HERA AI</span>
          </h2>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="text-pretty mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            The trusted maritime intelligence platform Europe has been waiting for.
          </p>
        </Reveal>
        <Reveal delay={0.36}>
          <div className="mt-14 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-cyan">
            <span className="h-px w-10 bg-cyan/40" />
            LAUNCHING 2026
            <span className="h-px w-10 bg-cyan/40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CHIPS = ["AIS-T", "AIS-S", "SAR", "RF", "OPT", "TIR", "PROPRIETARY SENSORS"];

export function ConstellationSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6">
      <SectionBackground src={satelliteNetwork} alt="Satellite constellation" overlay="bg-navy/70" />
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <Reveal>
          <p className="text-eyebrow text-gold">The Intelligence Layer</p>
        </Reveal>
        <Reveal delay={0.12}>
          <h2 className="mt-6 text-balance text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Intelligence you can trust
            <span className="mt-2 block">Strengthened from orbit.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="text-pretty mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Our proprietary space infrastructure keeps making the intelligence layer sharper — the
            platform, not the sensor, is the product.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-cyan/25 bg-cyan/5 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-cyan"
              >
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const ALERTS = [
  {
    head: "AIS Spoofing ×3 YoY",
    body: "AIS tampering and GPS jamming are used to evade sanctions. Current platforms detect it slowly and incompletely.",
  },
  {
    head: "$100B+ annual sanctions evasion",
    body: "Enforcement agencies have unlimited appetite for verified maritime intelligence. No adequate tool exists.",
  },
  {
    head: "Zero EU sovereign providers",
    body: "At any scale, in any jurisdiction, today.",
  },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden bg-navy-deep px-6 py-28">
      <SectionBackground src={ocean} alt="Moonlit dark sea" overlay="bg-navy-deep/92" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-eyebrow text-gold">The Problem</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-balance mt-6 text-3xl font-light tracking-tight text-foreground sm:text-5xl">
              Maritime decisions rest on broken intelligence.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <blockquote className="mt-8 border-l border-gold/40 pl-6">
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                76% of all EU trade by weight moves by sea — yet a growing shadow fleet of over
                3,300 vessels operates outside the system, moving billions in sanctioned cargo
                through AIS manipulation, GPS jamming, and identity fraud. The intelligence layer
                meant to stop this is fragmented, foreign-controlled, and failing.
              </p>
              <cite className="mt-4 block font-mono text-[10px] not-italic tracking-[0.18em] text-muted-foreground/70">
                EUROSTAT 2024 · ANU/CEPR 2025 · WINDWARD Q3 2025
              </cite>
            </blockquote>
          </Reveal>
          <div className="mt-10 space-y-5">
            {ALERTS.map((a, i) => (
              <Reveal key={a.head} delay={0.3 + i * 0.08}>
                <div className="flex gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alert" />
                  <p className="font-mono text-[11px] leading-relaxed tracking-[0.06em] text-muted-foreground">
                    <span className="text-foreground">{a.head}</span> — {a.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <StatBlock value={<CountUp to={54} prefix="$" suffix="B" className="font-mono text-4xl text-gold" />} label="Global MDA market by 2030" />
          <StatBlock value={<CountUp to={18} suffix="%" className="font-mono text-4xl text-cyan" />} label="Sector CAGR 2024–2030" />
          <StatBlock value={<CountUp to={3} prefix="×" className="font-mono text-4xl text-alert" />} label="YoY growth in AIS spoofing" />
          <StatBlock value={<span className="font-mono text-4xl text-foreground">Zero</span>} label="EU sovereign providers today" />
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="bg-navy px-6 py-10">
      <Reveal>
        {value}
        <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.18em] text-muted-foreground">
          {label.toUpperCase()}
        </p>
      </Reveal>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-navy px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-center text-3xl font-light tracking-tight text-foreground sm:text-5xl">
            Get in touch.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-center font-mono text-sm tracking-[0.14em] text-cyan">
            <span className="select-all">info@seker-space.com</span>
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().min(1, "Company is required").max(120),
  email: z.string().trim().email("Enter a valid work email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const fieldClass =
  "w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-gold/60";
const labelClass =
  "mb-2 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground";

function ContactForm() {
  const [values, setValues] = useState({ name: "", company: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website }),
      });
      if (!res.ok) throw new Error("request failed");
      setValues({ name: "", company: "", email: "", message: "" });
      setWebsite("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-10 space-y-5 text-left">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute h-px w-px overflow-hidden opacity-0"
        style={{ position: "absolute", left: "-9999px" }}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="c-name">NAME</label>
          <input id="c-name" className={fieldClass} value={values.name} onChange={set("name")} maxLength={100} placeholder="Jane Doe" />
          {errors.name && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="c-company">COMPANY</label>
          <input id="c-company" className={fieldClass} value={values.company} onChange={set("company")} maxLength={120} placeholder="Organisation" />
          {errors.company && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.company}</p>}
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="c-email">WORK EMAIL</label>
        <input id="c-email" type="email" className={fieldClass} value={values.email} onChange={set("email")} maxLength={255} placeholder="jane@company.com" />
        {errors.email && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.email}</p>}
      </div>
      <div>
        <label className={labelClass} htmlFor="c-message">MESSAGE</label>
        <textarea id="c-message" rows={5} className={fieldClass} value={values.message} onChange={set("message")} maxLength={1000} placeholder="What decisions are you trying to make?" />
        {errors.message && <p className="mt-1.5 font-mono text-[10px] text-alert">{errors.message}</p>}
      </div>
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "SENDING…" : "REQUEST INTELLIGENCE BRIEF →"}
        </button>
        {status === "sent" && (
          <p className="font-mono text-[10px] tracking-[0.18em] text-cyan">
            Thank you. We will be in touch.
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-[10px] tracking-[0.18em] text-alert">
            Something went wrong. Please email info@seker-space.com directly.
          </p>
        )}
      </div>
    </form>
  );
}