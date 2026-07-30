import earth from "@/assets/earth-globe.png";
import satellite from "@/assets/satellite-real.png";

type Orbit = { tiltX: number; tiltZ: number; size: number; duration: number; delay: number; sat: number };

const ORBITS: Orbit[] = [
  { tiltX: 74, tiltZ: -18, size: 100, duration: 34, delay: 0, sat: 74 },
  { tiltX: 66, tiltZ: 26, size: 112, duration: 46, delay: -12, sat: 58 },
  { tiltX: 80, tiltZ: 6, size: 92, duration: 28, delay: -20, sat: 46 },
];

// vessel pings on the ocean, in % of the globe box
const VESSELS = [
  { x: 30, y: 44, delay: 0 },
  { x: 62, y: 33, delay: 1.4 },
  { x: 71, y: 58, delay: 2.6 },
  { x: 24, y: 66, delay: 3.4 },
  { x: 47, y: 74, delay: 4.2 },
  { x: 78, y: 46, delay: 5.1 },
];

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* starfield */}
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {Array.from({ length: 160 }).map((_, i) => {
          const x = (i * 211.7) % 1600;
          const y = (i * 97.3) % 900;
          return <circle key={i} cx={x} cy={y} r={i % 9 === 0 ? 1.5 : 0.7} fill="#eef2f7" opacity={i % 3 ? 0.28 : 0.65} />;
        })}
      </svg>

      {/* globe + orbits stage */}
      <div className="absolute left-1/2 top-1/2 h-[min(78vh,700px)] w-[min(78vh,700px)] -translate-x-1/2 -translate-y-[48%] [perspective:1400px]">
        {/* atmosphere glow */}
        <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(77,217,192,0.22),transparent_62%)] blur-2xl" />

        {/* earth */}
        <div className="absolute inset-[10%] animate-[globe-breathe_18s_ease-in-out_infinite]">
          <img src={earth} alt="Earth seen from orbit" width={1280} height={1280} className="h-full w-full object-contain opacity-[0.88]" />
          {/* night terminator */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_36%,transparent_28%,rgba(9,18,31,0.78)_76%)]" />

          {/* vessel pings */}
          {VESSELS.map((v, i) => (
            <div key={i} className="absolute h-2 w-2" style={{ left: `${v.x}%`, top: `${v.y}%` }}>
              <span
                className="absolute inset-0 rounded-full border border-cyan/70"
                style={{ animation: `vessel-ping 4.2s ease-out ${v.delay}s infinite` }}
              />
              <span className="absolute inset-[3px] rounded-full bg-cyan shadow-[0_0_10px_rgba(77,217,192,0.9)]" />
            </div>
          ))}

          {/* capture beams from orbit down to the vessels */}
          {[
            { x: 62, y: 33, sx: 78, sy: -14, delay: "0s" },
            { x: 30, y: 44, sx: 14, sy: -10, delay: "3.4s" },
          ].map((b, i) => (
            <svg key={i} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" style={{ animation: `sweep-fade 8s ease-in-out ${b.delay} infinite` }} aria-hidden>
              <defs>
                <linearGradient id={`beam-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4dd9c0" stopOpacity="0" />
                  <stop offset="100%" stopColor="#4dd9c0" stopOpacity="0.22" />
                </linearGradient>
              </defs>
              <polygon points={`${b.sx} ${b.sy}, ${b.sx + 0.6} ${b.sy}, ${b.x + 2} ${b.y + 1}, ${b.x - 2} ${b.y + 1}`} fill={`url(#beam-${i})`} />
              <line x1={b.sx} y1={b.sy} x2={b.x} y2={b.y} stroke="#4dd9c0" strokeWidth="0.25" strokeDasharray="1.5 2" opacity="0.75" />
            </svg>
          ))}
        </div>

        {/* orbit rings + satellites (flattened 2D ellipses) */}
        {ORBITS.map((o, i) => {
          const flat = o.flatten;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: `${o.size}%`,
                height: `${o.size}%`,
                transform: `translate(-50%,-50%) rotate(${o.tiltZ}deg) scaleY(${flat})`,
              }}
            >
              <div className="absolute inset-0 rounded-full border border-white/[0.14]" />
              <div
                className="absolute inset-0"
                style={{ animation: `orbit-spin ${o.duration}s linear ${o.delay}s infinite` }}
              >
                <div className="absolute left-1/2 top-0">
                  <img
                    src={satellite}
                    alt=""
                    aria-hidden
                    style={{
                      width: o.sat,
                      transform: `translate(-50%,-50%) scaleY(${1 / flat}) rotate(${-o.tiltZ}deg)`,
                    }}
                    className="max-w-none drop-shadow-[0_0_22px_rgba(77,217,192,0.4)]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,rgba(9,18,31,0.7),rgba(9,18,31,0.28)_40%,transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(9,18,31,0.55)_75%)]" />
    </div>
  );
}

export function HeroHud() {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden w-[300px] -translate-y-1/2 space-y-4 lg:block">
      <div className="rounded-md border border-white/10 bg-navy/70 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em]">
          <span className="text-cyan">HERA AI · FUSION</span>
          <span className="text-muted-foreground">FUSING</span>
        </div>
        <p className="mt-4 font-mono text-sm text-foreground">M/V ARGEST</p>
        <p className="font-mono text-[10px] text-muted-foreground">35.81N · 14.49E</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["AIS-T", "AIS-S", "RF", "SAR", "TIR"].map((c) => (
            <span key={c} className="rounded border border-cyan/30 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em] text-cyan/80">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-4 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
          POSITION CONFIDENCE <span className="text-gold">98%</span>
        </p>
        <div className="mt-1.5 h-[3px] w-full rounded-full bg-white/10">
          <div className="h-full w-[98%] rounded-full bg-gold" />
        </div>
        <p className="mt-3 font-mono text-[9px] tracking-[0.18em] text-muted-foreground">CROSS-CHECKING SOURCES…</p>
      </div>

      <div className="rounded-md border border-white/10 bg-navy/70 p-4 backdrop-blur-sm">
        <p className="font-mono text-[9px] tracking-[0.22em] text-gold">THE SENSOR LAYER</p>
        <ul className="mt-3 space-y-2.5">
          {[
            ["AIS-T", "identity claim", true],
            ["AIS-S", "position claim", true],
            ["RF", "true location · emissions", false],
            ["SAR", "hull image · all-weather", false],
            ["TIR", "heat · proof of activity", false],
          ].map(([k, v, on]) => (
            <li key={k as string} className="flex items-center gap-3">
              <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-cyan" : "bg-gold/60"}`} />
              <span className="w-14 font-mono text-[10px] tracking-[0.16em] text-foreground">{k}</span>
              <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
