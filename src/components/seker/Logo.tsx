export function SekerLogo({
  className = "",
  tone = "currentColor",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg viewBox="0 0 240 76" className={className} fill="none" aria-label="SEKER">
      <path
        d="M40 34C60 12 180 12 200 34"
        stroke={tone}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="120" cy="18.6" r="3" fill={tone} />
      <text
        x="120"
        y="66"
        textAnchor="middle"
        fill={tone}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "34px",
          fontWeight: 300,
          letterSpacing: "0.38em",
        }}
      >
        SEKER
      </text>
    </svg>
  );
}