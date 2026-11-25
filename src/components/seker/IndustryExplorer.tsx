import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getIndustry } from "@/content/industries";
import { cargoClaimCase, originCase, preArrivalCase, transshipmentCase, cableCorridorCase, darkTransferDefenseCase, useCases } from "@/content/intelligence";
import { SignatureSection } from "./IndustrySections";

const ORDER = ["commodity-trading", "defense", "insurance", "ports", "banks", "fisheries", "shipping-security", "search-and-rescue"];
const allCases = [...useCases, cargoClaimCase, originCase, preArrivalCase, transshipmentCase, cableCorridorCase, darkTransferDefenseCase];

const gold = "border border-gold/60 bg-gold/90 px-6 py-3 font-mono text-xs tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const outline = "border border-gold/60 px-6 py-3 font-mono text-xs tracking-[0.22em] text-gold transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export function IndustryExplorer() {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const list = ORDER.map((s) => getIndustry(s)!).filter(Boolean);
  const i = list[sel]!;
  const r = i.rebuild;
  const uc = allCases.find((c) => c.id === i.useCaseIds[0]);

  const onKey = (e: KeyboardEvent) => {
    let n = sel;
    if (e.key === "ArrowRight") n = (sel + 1) % list.length;
    else if (e.key === "ArrowLeft") n = (sel - 1 + list.length) % list.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = list.length - 1;
    else return;
    e.preventDefault();
    setSel(n);
    tabs.current[n]?.focus();
    tabs.current[n]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div className="mt-14">
      <div role="tablist" aria-label="Industries" onKeyDown={onKey} className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:px-0">
        {list.map((x, n) => (
          <button
            key={x.slug}
            ref={(el) => { tabs.current[n] = el; }}
            role="tab"
            type="button"
            id={`ind-tab-${x.slug}`}
            aria-selected={sel === n}
            aria-controls="ind-panel"
            tabIndex={sel === n ? 0 : -1}
            onClick={() => setSel(n)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${sel === n ? "border-gold bg-gold/10 text-gold" : "border-white/20 text-foreground/60 hover:text-foreground"}`}
          >
            {x.navName}
          </button>
        ))}
      </div>

      <div className="grid">
        <AnimatePresence initial={false}>
          <motion.div
            key={i.slug}
            id="ind-panel"
            role="tabpanel"
            aria-labelledby={`ind-tab-${i.slug}`}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="col-start-1 row-start-1 mt-6 min-w-0"
          >
            <div className="grid gap-8 rounded-lg border border-white/10 bg-navy-deep/80 p-6 sm:p-8 lg:grid-cols-2">
              <div className="min-w-0">
                <h3 className="text-balance text-2xl font-light leading-tight text-foreground sm:text-4xl">
                  {i.headline[0]} <span className="text-gold">{i.headline[1]}</span>
                </h3>
                <p className="mt-5 font-light text-foreground/80">{i.body}</p>
                {r && (
                  <ul className="mt-6 space-y-4">
                    {r.missions.slice(0, 4).map((m) => (
                      <li key={m.title} className="flex gap-3">
                        <span className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                        <div className="min-w-0">
                          <p className="text-foreground">{m.title}</p>
                          <p className="text-sm font-light text-muted-foreground">{m.need}</p>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">{m.deliverable}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {uc && <p className="text-balance mt-8 text-xl font-light text-gold sm:text-2xl">{uc.question}</p>}
              </div>
              <div className="min-w-0 [&_.max-w-7xl]:max-w-none [&_section]:!bg-transparent [&_section]:!p-0">
                {r && <SignatureSection sig={r.signature} axis={r.chartAxis} />}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/industries/$slug" params={{ slug: i.slug }} className={outline}>See how it works →</Link>
              <Link to="/" hash="contact" className={gold}>{i.closing?.button ?? "DISCUSS YOUR USE CASE"} →</Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
