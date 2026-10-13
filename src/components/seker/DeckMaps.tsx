import type { ReactNode } from "react";

/* Deck-only scenario maps, drawn 1:1 with stage pixels (1060 x 560). */
export const MAP_W = 1060;
export const MAP_H = 560;

const GOLD = "#c9a84c", CYAN = "#4dd9c0", RED = "#ff4d4d", WHITE = "#eef2f7", GREY = "#8fa2b8";

function At({ s, n, children }: { s: number; n: number; children: ReactNode }) {
  if (s < n) return null;
  return <g className="deck-map-in">{children}</g>;
}
function Tag({ x, y, t, tone = GOLD, anchor = "start" }: { x: number; y: number; t: string; tone?: string; anchor?: "start" | "end" | "middle" }) {
  const w = t.length * 12.4 + 40;
  const x0 = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  return (
    <g>
      <rect x={x0} y={y - 20} width={w} height={36} rx={4} fill="#060c15" fillOpacity={0.9} stroke={tone} strokeOpacity={0.6} />
      <circle cx={x0 + 16} cy={y - 2} r={5} fill={tone} />
      <text x={x0 + 30} y={y + 5} fill={tone} fontSize={20} fontFamily="Space Mono, monospace">{t}</text>
    </g>
  );
}
function Ship({ x, y, r = 0, c = CYAN, s = 1.6 }: { x: number; y: number; r?: number; c?: string; s?: number }) {
  return <polygon points="0,-9 6,8 -6,8" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={c} />;
}
function Br({ x, y, z = 34 }: { x: number; y: number; z?: number }) {
  const h = z / 2, l = 10;
  return <path d={`M${x - h},${y - h + l}V${y - h}H${x - h + l} M${x + h - l},${y - h}H${x + h}V${y - h + l} M${x + h},${y + h - l}V${y + h}H${x + h - l} M${x - h + l},${y + h}H${x - h}V${y + h - l}`} fill="none" stroke={GOLD} strokeWidth={2.5} />;
}
function Reticle({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={RED} strokeWidth={2.5} fill="none">
      <circle cx={x} cy={y} r={30} />
      <path d={`M${x - 46},${y}H${x - 22} M${x + 22},${y}H${x + 46} M${x},${y - 46}V${y - 22} M${x},${y + 22}V${y + 46}`} />
    </g>
  );
}
function Pulse({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={CYAN} />
      <circle cx={x} cy={y} r={12} fill="none" stroke={CYAN} strokeWidth={2} className="deck-map-pulse" style={{ transformOrigin: `${x}px ${y}px` }} />
      <circle cx={x} cy={y} r={26} fill="none" stroke={CYAN} strokeWidth={1} strokeDasharray="4 5" opacity={0.6} />
    </g>
  );
}
function Port({ x, y, label, c = WHITE }: { x: number; y: number; label?: string; c?: string }) {
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={16} height={16} fill="none" stroke={c} strokeWidth={2} />
      {label && <text x={x} y={y + 34} fill={c} fontSize={20} textAnchor="middle" fontFamily="Space Mono, monospace">{label}</text>}
    </g>
  );
}
function Footprint({ pts }: { pts: string }) {
  return <polygon points={pts} fill={CYAN} fillOpacity={0.08} stroke={CYAN} strokeOpacity={0.7} strokeWidth={1.5} />;
}
function Base({ left = true, right = true }: { left?: boolean; right?: boolean }) {
  return (
    <>
      <rect width={MAP_W} height={MAP_H} fill="#060c15" />
      <defs>
        <pattern id="dm-grid" width="53" height="56" patternUnits="userSpaceOnUse">
          <path d="M53 0H0V56" fill="none" stroke="#ffffff" strokeOpacity={0.05} />
        </pattern>
      </defs>
      <rect width={MAP_W} height={MAP_H} fill="url(#dm-grid)" />
      {left && <path d="M0 0H200C170 80 120 160 90 260C70 340 40 420 0 470Z" fill="#ffffff" fillOpacity={0.06} stroke="#ffffff" strokeOpacity={0.1} />}
      {right && <path d="M1060 0V560H930C960 470 900 380 940 290C970 210 900 100 930 0Z" fill="#ffffff" fillOpacity={0.06} stroke="#ffffff" strokeOpacity={0.1} />}
    </>
  );
}

function Defense({ s }: { s: number }) {
  return (
    <>
      <Base left={false} />
      <At s={s} n={0}>
        <path d="M0 330 C250 300 500 360 940 300" stroke={GOLD} strokeWidth={2} fill="none" />
        <text x={40} y={312} fill={GOLD} fontSize={20} fontFamily="Space Mono, monospace">CABLE</text>
        <path d="M0 470 C300 440 600 470 940 420" stroke={GREY} strokeWidth={3} fill="none" />
        <text x={40} y={452} fill={GREY} fontSize={20} fontFamily="Space Mono, monospace">PIPELINE</text>
        <path d="M120 80 L360 260" stroke={CYAN} strokeWidth={2.5} fill="none" />
        <path d={s >= 2 ? "M360 260 L420 318" : "M360 260 L420 318 L470 338 L520 318 L570 340 L620 322"} stroke={CYAN} strokeWidth={2.5} fill="none" />
        <Ship x={620} y={322} r={100} />
        <Tag x={150} y={150} t="11 KN TO 1.4 KN" tone={CYAN} />
      </At>
      <At s={s} n={1}>
        <path d="M0 300 C250 270 500 330 940 270 L940 330 C500 390 250 330 0 360Z" fill={GOLD} fillOpacity={0.06} stroke={GOLD} strokeDasharray="8 8" strokeWidth={1.5} />
        <Tag x={40} y={540} t="GEOLOCATION AND ALL-WEATHER PASS REQUESTED" />
      </At>
      <At s={s} n={2}>
        <path d="M420 318 L470 338 L520 318 L570 340 L620 322" stroke={GREY} strokeWidth={2.5} strokeDasharray="8 7" fill="none" />
        <Tag x={430} y={400} t="AIS GAP 47 MIN" tone={GREY} />
        <Pulse x={620} y={322} />
        <Footprint pts="470,220 800,240 790,420 460,400" />
        <Br x={620} y={322} />
        <Br x={720} y={360} z={28} />
      </At>
      <At s={s} n={3}>
        <path d="M380 342 C500 350 600 340 760 318" stroke={RED} strokeWidth={4} strokeDasharray="12 8" fill="none" />
        <text x={560} y={372} fill={RED} fontSize={20} fontFamily="Space Mono, monospace">9 KM</text>
        <Tag x={560} y={150} t="OWNER CHANGED TWO MONTHS AGO" tone={RED} />
      </At>
      <At s={s} n={4}>
        <Reticle x={620} y={322} />
        <Tag x={640} y={240} t="CORRIDOR RISK 88/100" tone={RED} />
      </At>
      <At s={s} n={5}>
        <path d="M820 0 C780 200 860 380 800 560" stroke={WHITE} strokeOpacity={0.6} strokeDasharray="10 8" strokeWidth={2} fill="none" />
        <text x={830} y={540} fill={WHITE} fontSize={20} fontFamily="Space Mono, monospace" opacity={0.7}>TERRITORIAL</text>
        <Tag x={40} y={40} t="RECORD SENT TO THE OPERATIONS CENTRE" tone={CYAN} />
      </At>
    </>
  );
}

const DAYS: [number, number][] = [[150, 440], [240, 400], [330, 370], [420, 330], [510, 300], [600, 280], [690, 250], [780, 210], [870, 170]];
function Insurance({ s }: { s: number }) {
  const route = "M80 470 " + DAYS.map(([x, y]) => `L${x} ${y}`).join(" ") + " L960 130";
  return (
    <>
      <Base />
      <At s={s} n={0}>
        <path d={route} stroke={CYAN} strokeWidth={2.5} fill="none" />
        <Port x={80} y={470} label="PORT A" />
        <Port x={960} y={130} label="PORT B" />
        {DAYS.map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r={5} fill={CYAN} />
            <text x={x} y={y + 34} fill={WHITE} fontSize={20} textAnchor="middle" fontFamily="Space Mono, monospace">{k + 1}</text>
          </g>
        ))}
        <g transform="translate(600 210)" stroke={GOLD} strokeWidth={2.5} fill="none">
          <path d="M-22 6a14 14 0 0 1 4-26a18 18 0 0 1 34 6a11 11 0 0 1 0 20Z" />
          <path d="M-2 10l-8 16h10l-8 16" />
        </g>
        <Tag x={300} y={140} t="LOG: SEVERE STORM" />
      </At>
      <At s={s} n={1}>
        {DAYS.map(([x, y], k) => (
          <rect key={k} x={x - 45} y={y - 45} width={90} height={90} fill={CYAN} fillOpacity={k === 5 ? 0.12 : 0.05} />
        ))}
      </At>
      <At s={s} n={2}>
        <Tag x={640} y={340} t="SEA STATE 3.1 M MAX" tone={CYAN} />
        <text x={340} y={330} fill={CYAN} fontSize={20} fontFamily="Space Mono, monospace" transform="rotate(-20 340 330)">13 KN</text>
      </At>
      <At s={s} n={3}>
        <circle cx={420} cy={330} r={11} fill="none" stroke={GOLD} strokeWidth={3} />
        <text x={414} y={337} fill={GOLD} fontSize={20} fontFamily="Space Mono, monospace">⚓</text>
        <Tag x={460} y={470} t="UNREPORTED 19 H STOP, DRAUGHT DOWN 0.6 M" tone={GOLD} />
      </At>
      <At s={s} n={4}>
        <Reticle x={420} y={330} />
        <Tag x={120} y={250} t="VOYAGE INCONSISTENCY 77/100" tone={RED} />
      </At>
      <At s={s} n={5}>
        <Tag x={500} y={40} t="RECONSTRUCTION SENT TO CLAIMS" tone={CYAN} />
      </At>
    </>
  );
}

function Commodity({ s }: { s: number }) {
  return (
    <>
      <Base />
      <At s={s} n={0}>
        <g transform="translate(960 300)" fill="none" stroke={WHITE} strokeWidth={2}>
          <rect x={-14} y={-24} width={10} height={40} /><rect x={2} y={-34} width={10} height={50} /><path d="M-24 16H24" />
        </g>
        <text x={960} y={350} fill={WHITE} fontSize={20} textAnchor="middle" fontFamily="Space Mono, monospace">REFINERY</text>
        <path d="M640 330 L900 300" stroke={CYAN} strokeWidth={2.5} fill="none" />
        <Ship x={900} y={300} r={80} />
        <Tag x={580} y={420} t="DECLARED: LOADED AT SEA" />
      </At>
      <At s={s} n={1}>
        <path d="M640 330 C520 380 420 300 330 250 C260 210 220 200 190 200" stroke={CYAN} strokeOpacity={0.7} strokeWidth={2} strokeDasharray="8 8" fill="none" />
        <Tag x={420} y={190} t="60 DAYS" tone={CYAN} />
      </At>
      <At s={s} n={2}>
        <Port x={150} y={200} label="TERMINAL" />
        <path d="M330 250 C260 210 220 200 190 200" stroke={GREY} strokeWidth={4} strokeDasharray="4 8" fill="none" />
        <Pulse x={190} y={200} />
        <Tag x={220} y={110} t="DARK 52 H" tone={GREY} />
      </At>
      <At s={s} n={3}>
        <Tag x={60} y={300} t="DRAUGHT UP 5.8 M" tone={GOLD} />
        <Ship x={520} y={350} r={-60} c={WHITE} />
        <Ship x={546} y={340} r={-60} />
        <Tag x={500} y={490} t="STS" tone={GOLD} />
        <Br x={533} y={346} z={60} />
      </At>
      <At s={s} n={4}>
        <Reticle x={150} y={200} />
        <circle cx={520} cy={350} r={26} fill="none" stroke={RED} strokeWidth={2.5} />
        <Tag x={60} y={40} t="ORIGIN INDICATOR 79/100" tone={RED} />
      </At>
      <At s={s} n={5}>
        <Tag x={500} y={40} t="BOTH CARGOES ADDED TO THE STS LEDGER" tone={CYAN} anchor="start" />
      </At>
    </>
  );
}

const CALLS: [number, number][] = [[120, 480], [190, 430], [270, 400], [350, 360], [430, 340], [510, 320], [590, 300], [670, 290], [750, 280], [830, 280]];
function Ports({ s }: { s: number }) {
  return (
    <>
      <Base left={false} />
      <At s={s} n={0}>
        <path d={"M60 520 " + CALLS.map(([x, y]) => `L${x} ${y}`).join(" ") + " L920 280"} stroke={WHITE} strokeOpacity={0.45} strokeDasharray="6 8" strokeWidth={2} fill="none" />
        {CALLS.map(([x, y], k) => <rect key={k} x={x - 6} y={y - 6} width={12} height={12} fill="none" stroke={WHITE} strokeOpacity={0.7} strokeWidth={1.5} />)}
        <Port x={940} y={280} label="PORT" c={GOLD} />
        <Tag x={60} y={60} t="PRE-ARRIVAL NOTICE: 10 CALLS" />
      </At>
      <At s={s} n={1}>
        <path d="M60 520 L120 480 L190 430 L270 400 L350 360 L430 340" stroke={CYAN} strokeWidth={2.5} fill="none" />
        <path d="M640 230 L750 270 L830 275 L920 280" stroke={CYAN} strokeWidth={2.5} fill="none" />
      </At>
      <At s={s} n={2}>
        <path d="M430 340 C470 260 520 190 560 150 C600 170 620 200 640 230" stroke={GREY} strokeWidth={3} strokeDasharray="6 8" fill="none" />
        <Port x={560} y={140} label="" c={GREY} />
        <Tag x={150} y={200} t="BROADCAST GAP 3 DAYS" tone={GREY} />
      </At>
      <At s={s} n={3}>
        <Pulse x={560} y={140} />
        <Tag x={600} y={110} t="DRAUGHT UP 4.1 M" tone={GOLD} />
      </At>
      <At s={s} n={4}>
        <Reticle x={560} y={140} />
        <Tag x={500} y={440} t="DECLARATION MISMATCH 81/100" tone={RED} />
      </At>
      <At s={s} n={5}>
        <Tag x={300} y={530} t="PRE-ARRIVAL SHEET SENT TO PORT SECURITY" tone={CYAN} />
      </At>
    </>
  );
}

function Fisheries({ s }: { s: number }) {
  return (
    <>
      <Base left={false} right={s >= 3} />
      <At s={s} n={0}>
        <path d="M80 420 L130 360 L180 410 L230 350 L280 400 L330 340 L380 380 L420 330" stroke={CYAN} strokeWidth={2.5} fill="none" />
        <Ship x={420} y={330} r={40} />
        <Tag x={80} y={480} t="AIS OFF 14 H" tone={CYAN} />
        <path d="M120 120 L380 230 L500 290" stroke={WHITE} strokeWidth={2.5} fill="none" />
        <Ship x={500} y={290} r={115} c={WHITE} />
      </At>
      <At s={s} n={1}>
        <circle cx={440} cy={320} r={110} fill="none" stroke={GOLD} strokeDasharray="8 8" strokeWidth={2} />
        <circle cx={520} cy={290} r={130} fill="none" stroke={GOLD} strokeDasharray="8 8" strokeWidth={2} />
      </At>
      <At s={s} n={2}>
        <Footprint pts="400,240 600,250 590,380 390,370" />
        <Br x={478} y={312} z={36} />
        <Br x={520} y={312} z={36} />
        <Tag x={560} y={200} t="30 M APART, AT LEAST 4 H" tone={CYAN} />
      </At>
      <At s={s} n={3}>
        <path d="M520 312 C650 340 800 300 920 260" stroke={WHITE} strokeWidth={2} strokeDasharray="8 8" fill="none" />
        <Port x={930} y={255} label="" c={WHITE} />
        <Tag x={720} y={160} t="PORT CALL IN 2 DAYS" tone={WHITE} />
        <Tag x={560} y={460} t="LANDING DECLARED NO TRANSSHIPMENT" tone={GOLD} />
      </At>
      <At s={s} n={4}>
        <Reticle x={499} y={312} />
        <Tag x={60} y={60} t="TRANSSHIPMENT INDICATOR 84/100" tone={RED} />
      </At>
      <At s={s} n={5}>
        <Tag x={200} y={530} t="REGISTER ENTRY AND TRIP ORIGIN REPORT SENT" tone={CYAN} />
      </At>
    </>
  );
}

const MAPS: Record<string, (p: { s: number }) => ReactNode> = {
  defense: Defense,
  insurance: Insurance,
  "commodity-trading": Commodity,
  ports: Ports,
  fisheries: Fisheries,
};

export function DeckScenarioMap({ slug, stage }: { slug: string; stage: number }) {
  const M = MAPS[slug];
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W} height={MAP_H} className="block" role="img" aria-label={`Scenario map, stage ${stage + 1}`}>
      <style>{`
        .deck-map-in { animation: dm-in .6s ease-out both; }
        .deck-map-pulse { animation: dm-pulse 1.8s ease-out infinite; }
        @keyframes dm-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dm-pulse { from { transform: scale(.6); opacity: 1 } to { transform: scale(2.4); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) { .deck-map-in, .deck-map-pulse { animation: none } }
        @media print { .deck-map-in { animation: none } }
      `}</style>
      <M s={stage} />
    </svg>
  );
}
