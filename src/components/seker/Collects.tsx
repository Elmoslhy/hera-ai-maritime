import { Reveal } from "./primitives";
import { collectsSection as s } from "@/content/intelligence";

export function CollectsSection() {
  return (
    <section className="bg-navy px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal><p className="text-eyebrow text-gold">{s.eyebrow}</p></Reveal>
        <div className="mt-8 space-y-3">
          {s.rows.map((r, n) => (
            <Reveal key={r.label} delay={n * 0.08}>
              <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-navy/70 p-5 backdrop-blur sm:flex-row sm:items-start sm:gap-8">
                <div className="flex shrink-0 items-center gap-2 sm:w-72">
                  <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                  <span className="font-mono text-xs tracking-[0.2em] text-gold">{r.label}</span>
                </div>
                <p className="min-w-0 text-sm font-light text-foreground/85">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
