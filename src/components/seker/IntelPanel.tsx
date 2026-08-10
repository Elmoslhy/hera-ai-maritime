import { useEffect, useState } from "react";

/** Compact left-hand intelligence summary for the hero — HERA AI fusion at a glance. */

function EyeMark() {
  return (
    <svg viewBox="0 0 120 60" className="h-12 w-full" aria-hidden>
      <defs>
        <radialGradient id="ip-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#123049" />
          <stop offset="60%" stopColor="#0d2135" />
          <stop offset="100%" stopColor="#071320" />
        </radialGradient>
      </defs>
      <path
        d="M6 30C24 8 96 8 114 30C96 52 24 52 6 30Z"
        fill="url(#ip-iris)"
        stroke="#c9a84c"
        strokeWidth="1.2"
        opacity="0.95"
      />
      <circle cx="60" cy="30" r="15" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.8" />
      <circle cx="60" cy="30" r="10" fill="none" stroke="#4dd9c0" strokeWidth="0.7" opacity="0.55">
        <animate attributeName="r" values="8;13;8" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="60" cy="30" r="5.4" fill="#040a12" />
      <path d="M56 26.6a5.4 5.4 0 0 1 3.2-2.2" stroke="#e9f2ff" strokeWidth="1" fill="none" opacity="0.8" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * 17}
            y1={30 + Math.sin(a) * 17}
            x2={60 + Math.cos(a) * 19.4}
            y2={30 + Math.sin(a) * 19.4}
            stroke="#c9a84c"
            strokeWidth="0.6"
            opacity={i % 3 === 0 ? 0.8 : 0.35}
          />
        );
      })}
    </svg>
  );
}

type Industry = {
  key: string;
  metric: string;
  metricLabel: string;
  insight: string;
  bars: [string, number][];
};

const INDUSTRIES: Industry[] = [
  {
    key: "DEFENCE",
    metric: "+38%",
    metricLabel: "DARK ACTIVITY FLAGGED",
    insight: "Sanctioned transfers surfaced before port arrival.",
    bars: [["Zone risk", 88], ["Ident. confidence", 96], ["Response lead", 74]],
  },
  {
    key: "ENERGY",
    metric: "2.1d",
    metricLabel: "EARLIER CARGO SIGNAL",
    insight: "Crude flows read from behaviour, not declarations.",
    bars: [["Flow accuracy", 93], ["Storage draw", 81], ["Route shift", 67]],
  },
  {
    key: "INSURANCE",
    metric: "−24%",
    metricLabel: "EXPOSURE MISPRICING",
    insight: "Underwriting priced on verified vessel behaviour.",
    bars: [["Claim signal", 79], ["Fraud flags", 85], ["Zone breach", 71]],
  },
  {
    key: "SUPPLY CHAIN",
    metric: "96%",
    metricLabel: "ETA RELIABILITY",
    insight: "Congestion and delay called days ahead of schedule.",
    bars: [["ETA precision", 96], ["Port dwell", 77], ["Reroute alert", 83]],
  },
  {
    key: "ENVIRONMENT",
    metric: "412",
    metricLabel: "ANOMALIES · 30 DAYS",
    insight: "Illegal discharge and IUU fishing attributed to a hull.",
    bars: [["Detection", 90], ["Attribution", 86], ["Evidence pack", 69]],
  },
];

export function IntelPanel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % INDUSTRIES.length), 4200);
    return () => clearInterval(id);
  }, []);
  const ind = INDUSTRIES[i];

  return (
    <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden w-[268px] -translate-y-1/2 lg:block">
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-[9px] tracking-[0.22em] text-gold">HERA AI · INSIGHTS</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] text-cyan">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            LIVE
          </span>
        </div>

        <div className="px-3 pt-3">
          <EyeMark />
        </div>

        <div className="flex flex-wrap gap-1 px-3 pt-3">
          {INDUSTRIES.map((x, xi) => (
            <span
              key={x.key}
              className={`rounded-sm border px-1.5 py-0.5 font-mono text-[7.5px] tracking-[0.14em] transition-colors ${
                xi === i
                  ? "border-gold/50 bg-gold/10 text-gold"
                  : "border-white/10 text-muted-foreground/60"
              }`}
            >
              {x.key}
            </span>
          ))}
        </div>

        <div key={ind.key} className="animate-fade-in px-3 pb-3 pt-3">
          <p className="font-mono text-3xl leading-none text-foreground">{ind.metric}</p>
          <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-muted-foreground">
            {ind.metricLabel}
          </p>
          <p className="text-pretty mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {ind.insight}
          </p>
        </div>

        <div className="space-y-2 border-t border-white/8 px-3 py-3">
          <p className="font-mono text-[8px] tracking-[0.22em] text-muted-foreground">
            DECISION SIGNALS
          </p>
          {ind.bars.map(([label, v]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-[74px] shrink-0 truncate font-mono text-[8px] tracking-[0.1em] text-muted-foreground">
                {label.toUpperCase()}
              </span>
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/8">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-cyan/70 to-gold transition-[width] duration-700"
                  style={{ width: `${v}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right font-mono text-[8px] text-foreground/80">{v}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 px-3 py-2.5 font-mono text-[8px] tracking-[0.16em] text-muted-foreground">
          AI FUSED · HUMAN VERIFIED
        </div>
      </div>
    </div>
  );
}
