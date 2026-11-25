type Props = { thermal: number; rf: number; fused: number };

function Frame({
  label,
  sub,
  tone,
  opacity,
  children,
}: {
  label: string;
  sub: string;
  tone: "cyan" | "gold" | "alert";
  opacity: number;
  children: React.ReactNode;
}) {
  const toneCls = tone === "gold" ? "text-gold border-gold/40" : tone === "alert" ? "text-alert border-alert/40" : "text-cyan border-cyan/40";
  return (
    <div
      style={{ opacity, transform: `translateY(${(1 - opacity) * 12}px)` }}
      className="w-[150px] rounded-md border border-white/10 bg-navy/80 p-2 backdrop-blur-sm transition-[opacity,transform] duration-300 sm:w-[178px]"
    >
      <div className={`mb-1.5 flex items-center justify-between border-b pb-1 font-mono text-[8px] tracking-[0.2em] ${toneCls}`}>
        <span>{label}</span>
        <span className="text-muted-foreground">{sub}</span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-black/70">{children}</div>
    </div>
  );
}

/** Thermal infrared imager — grayscale sea with a hot hull signature. */
function ThermalImage() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="tir-hot" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="28%" stopColor="#ffc458" />
          <stop offset="58%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#3a0d3f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tir-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141c33" />
          <stop offset="100%" stopColor="#241238" />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill="url(#tir-sea)" />
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={i} x={(i * 29) % 120} y={(i * 17) % 90} width="7" height="4" fill="#3b2a5a" opacity="0.5" />
      ))}
      {/* hull body, warm */}
      <ellipse cx="62" cy="47" rx="30" ry="8" fill="#8a5a2a" opacity="0.85" />
      <ellipse cx="62" cy="47" rx="22" ry="5" fill="#c08a3a" opacity="0.9" />
      {/* engine bloom */}
      <ellipse cx="80" cy="47" rx="16" ry="12" fill="url(#tir-hot)" className="animate-[thermal-breathe_2.6s_ease-in-out_infinite]" />
      <circle cx="80" cy="47" r="3" fill="#fff8e2" />
      {/* iso contour + callout */}
      <ellipse cx="80" cy="47" rx="11" ry="8" fill="none" stroke="#ffc458" strokeWidth="0.4" strokeDasharray="2 2" />
      <line x1="80" y1="47" x2="104" y2="20" stroke="#ffc458" strokeWidth="0.4" />
      <text x="72" y="17" fill="#ffc458" fontSize="6" fontFamily="monospace">+41°C</text>
      <text x="6" y="84" fill="#9db0c9" fontSize="5" fontFamily="monospace">TIR 8-12µm</text>
    </svg>
  );
}

/** RF emitter imager — bearing lines and spectrum blips locating the transmitter. */
function RfImage() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <rect width="120" height="90" fill="#050d16" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 13 + 6} x2="120" y2={i * 13 + 6} stroke="#4dd9c0" strokeWidth="0.2" opacity="0.18" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 14 + 6} y1="0" x2={i * 14 + 6} y2="90" stroke="#4dd9c0" strokeWidth="0.2" opacity="0.18" />
      ))}
      {/* bearing lines from two passes intersecting on the emitter */}
      <line x1="2" y1="4" x2="70" y2="50" stroke="#4dd9c0" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
      <line x1="118" y1="8" x2="70" y2="50" stroke="#4dd9c0" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
      {/* emitter rings */}
      <circle cx="70" cy="50" r="7" fill="none" stroke="#4dd9c0" strokeWidth="0.6" className="animate-[rf-ring_3.3s_ease-out_infinite]" />
      <circle cx="70" cy="50" r="14" fill="none" stroke="#4dd9c0" strokeWidth="0.4" opacity="0.5" className="animate-[rf-ring_3.3s_ease-out_infinite]" />
      <circle cx="70" cy="50" r="2.2" fill="#4dd9c0" />
      {/* spectrum strip */}
      {Array.from({ length: 26 }).map((_, i) => {
        const h = 3 + ((i * 37) % 11) + (i === 14 ? 14 : 0);
        return <rect key={i} x={4 + i * 4.4} y={84 - h} width="2.4" height={h} fill={i === 14 ? "#c9a84c" : "#4dd9c0"} opacity={i === 14 ? 1 : 0.45} />;
      })}
      <text x="6" y="12" fill="#4dd9c0" fontSize="5" fontFamily="monospace">X-BAND 9.41GHz</text>
    </svg>
  );
}

/** Fusion view — thermal signature and RF bearing collapsed into one position. */
function FusedImage() {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full" aria-hidden>
      <rect width="120" height="90" fill="#071019" />
      <ellipse cx="60" cy="46" rx="26" ry="7" fill="#c08a3a" opacity="0.35" />
      <ellipse cx="72" cy="46" rx="12" ry="9" fill="#ff8a3a" opacity="0.35" />
      <circle cx="66" cy="46" r="16" fill="none" stroke="#4dd9c0" strokeWidth="0.4" strokeDasharray="2 3" opacity="0.7" />
      <circle cx="60" cy="46" r="26" fill="none" stroke="#c9a84c" strokeWidth="0.6" strokeDasharray="5 6" />
      <line x1="60" y1="20" x2="60" y2="30" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="60" y1="62" x2="60" y2="72" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="34" y1="46" x2="44" y2="46" stroke="#c9a84c" strokeWidth="0.8" />
      <line x1="76" y1="46" x2="86" y2="46" stroke="#c9a84c" strokeWidth="0.8" />
      <circle cx="60" cy="46" r="2" fill="#c9a84c" />
      <text x="6" y="12" fill="#c9a84c" fontSize="5" fontFamily="monospace">TIR + RF FUSED</text>
      <text x="6" y="84" fill="#4dd9c0" fontSize="5" fontFamily="monospace">34°21.4′N 023°08.9′E</text>
      <text x="82" y="84" fill="#c9a84c" fontSize="5" fontFamily="monospace">97%</text>
    </svg>
  );
}

export function SensorImagers({ thermal, rf, fused }: Props) {
  return (
    <div className="pointer-events-none flex flex-col gap-2">
      <Frame label="THERMAL" sub="TIR" tone="alert" opacity={thermal}>
        <ThermalImage />
      </Frame>
      <Frame label="RF EMITTERS" sub="RF" tone="cyan" opacity={rf}>
        <RfImage />
      </Frame>
      <Frame label="HERA AI" sub="FUSED" tone="gold" opacity={fused}>
        <FusedImage />
      </Frame>
    </div>
  );
}
