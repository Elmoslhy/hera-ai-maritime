const PATHS = [
  "M-50 520 C 300 440, 520 600, 820 470 S 1300 380, 1700 450",
  "M-50 300 C 260 360, 600 220, 900 300 S 1400 420, 1700 330",
  "M-50 680 C 380 640, 700 720, 1050 620 S 1450 560, 1700 600",
  "M200 860 C 500 760, 800 820, 1100 740 S 1500 700, 1700 720",
];

export function VesselTracks() {
  return (
    <svg
      aria-hidden
      className="vessel-tracks pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <ellipse cx="1250" cy="-120" rx="900" ry="380" fill="none" stroke="var(--color-gold)" strokeOpacity="0.12" strokeWidth="1" />
      {PATHS.map((d, i) => (
        <g key={i}>
          <path id={`vt-${i}`} d={d} fill="none" stroke="var(--color-gold)" strokeOpacity="0.32" strokeWidth="1" strokeDasharray="4 8" />
          <circle r="3" fill="var(--color-gold)" className="vt-dot">
            <animateMotion dur={`${26 + i * 7}s`} repeatCount="indefinite" begin={`-${i * 5}s`}>
              <mpath href={`#vt-${i}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
}
