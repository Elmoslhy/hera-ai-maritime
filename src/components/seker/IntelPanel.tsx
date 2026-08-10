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

const SOURCES: [string, number][] = [
  ["AIS", 96],
  ["THERMAL IR", 84],
  ["RF", 78],
  ["SAR", 71],
];

const FEED = [
  ["AIS GAP", "resolved by RF · 41s", "text-cyan"],
  ["SPOOF", "identity corrected", "text-alert"],
  ["DARK SHIP", "named · IR + SAR", "text-gold"],
];

export function IntelPanel() {
  return (
    <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden w-[268px] -translate-y-1/2 lg:block">
      <div className="overflow-hidden rounded-sm border border-gold/25 bg-[#060d18]/70 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-gold/15 px-3 py-2">
          <span className="font-mono text-[9px] tracking-[0.22em] text-gold">HERA AI · FUSION</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] text-cyan">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            LIVE
          </span>
        </div>

        <div className="px-3 pt-3">
          <EyeMark />
        </div>

        <div className="flex items-end justify-between px-3 pb-3 pt-2">
          <div>
            <p className="font-mono text-3xl leading-none text-foreground">
              98.4<span className="text-sm text-muted-foreground">%</span>
            </p>
            <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-muted-foreground">
              IDENTIFICATION ACCURACY
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg leading-none text-cyan">45<span className="text-[10px]">ms</span></p>
            <p className="mt-1 font-mono text-[8px] tracking-[0.18em] text-muted-foreground">P50 LATENCY</p>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/8 px-3 py-3">
          <p className="font-mono text-[8px] tracking-[0.22em] text-muted-foreground">SIGNAL CONTRIBUTION</p>
          {SOURCES.map(([label, v]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-[62px] shrink-0 font-mono text-[8px] tracking-[0.14em] text-muted-foreground">
                {label}
              </span>
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/8">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-cyan/70 to-gold"
                  style={{ width: `${v}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right font-mono text-[8px] text-foreground/80">{v}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 border-t border-white/8 px-3 py-3">
          <p className="font-mono text-[8px] tracking-[0.22em] text-muted-foreground">RESOLVED · LAST HOUR</p>
          {FEED.map(([k, v, tone]) => (
            <div key={k} className="flex items-baseline justify-between gap-2 font-mono text-[9px]">
              <span className={`tracking-[0.14em] ${tone}`}>{k}</span>
              <span className="truncate text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
