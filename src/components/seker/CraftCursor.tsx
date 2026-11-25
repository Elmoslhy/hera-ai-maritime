import { useEffect, useRef } from "react";

const CONTROLS = "a, button, input, textarea, select, label, [role='button']";

/** Steerable cursor: a gold satellite in space that becomes a cyan vessel in the sea. */
export function CraftCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const satRef = useRef<SVGSVGElement>(null);
  const shipRef = useRef<SVGSVGElement>(null);
  const plasmaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const sat = satRef.current;
    const ship = shipRef.current;
    const plasma = plasmaRef.current;
    if (!el || !sat || !ship || !plasma) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(any-pointer: fine)");
    const root = document.documentElement;
    let x = -100, y = -100, tx = -100, ty = -100;
    let heading = -Math.PI / 4, target = heading;
    let visible = false, overControl = false, frame = 0, sea = 0, reentry = 0;

    const enabled = () => !motion.matches && fine.matches;
    const sync = () => root.classList.toggle("craft-cursor-on", enabled());
    const environment = () => {
      const d = document.getElementById("descent");
      if (!d) return;
      const b = d.getBoundingClientRect();
      const p = -b.top / Math.max(1, b.height - window.innerHeight);
      sea = Math.max(0, Math.min(1, (p - 0.06) / 0.26));
      // Re-entry intensity peaks mid-descent (sea ≈ 0.5) and fades at both ends.
      reentry = Math.max(0, 1 - Math.abs(sea - 0.5) * 2.4);
      sat.style.opacity = String(1 - sea);
      ship.style.opacity = String(sea);
      // Heat glow: gold in orbit, burning amber-white at peak re-entry.
      sat.style.filter =
        reentry > 0.05
          ? `drop-shadow(0 0 ${6 + reentry * 14}px rgba(255, ${Math.round(150 - reentry * 70)}, 40, ${0.6 + reentry * 0.4}))`
          : "";
      plasma.style.opacity = String(reentry * (visible ? 1 : 0));
      el.dataset.environment = sea === 0 ? "space" : sea === 1 ? "sea" : "transition";
      // Re-entry shake must keep animating even when the pointer is idle.
      if (reentry > 0.05 && !frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.45;
      y += (ty - y) * 0.45;
      let diff = target - heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      heading += diff * 0.18;
      // Atmospheric buffeting: the craft tumbles while burning through re-entry.
      const now = performance.now();
      const tumble = reentry * (Math.sin(now / 90) * 0.22 + Math.sin(now / 47) * 0.1);
      const shake = reentry * 1.6;
      const jx = (Math.random() - 0.5) * shake;
      const jy = (Math.random() - 0.5) * shake;
      const scale = (overControl ? 0.55 : 1) * (1 + reentry * 0.12);
      el.style.transform = `translate3d(${x + jx}px, ${y + jy}px, 0) rotate(${heading + Math.PI / 2 + tumble}rad) scale(${scale})`;
      el.style.opacity = visible && !overControl ? "1" : "0";
      if (reentry > 0.05) {
        // Plasma streak trails behind the craft, opposite the heading.
        const len = 26 + reentry * 46;
        plasma.style.height = `${len}px`;
        plasma.style.transform = "translate(-1.5px, 14px)";
      }
      const settled =
        reentry < 0.05 && Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(diff) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (!enabled() || e.pointerType === "touch") return;
      const dx = e.clientX - tx, dy = e.clientY - ty;
      if (visible && Math.hypot(dx, dy) > 1.5) target = Math.atan2(dy, dx);
      if (!visible) { x = e.clientX; y = e.clientY; }
      tx = e.clientX; ty = e.clientY;
      visible = true;
      overControl = e.target instanceof Element && !!e.target.closest(CONTROLS);
      kick();
    };
    const hide = () => { visible = false; kick(); };

    sync();
    environment();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", environment, { passive: true });
    window.addEventListener("resize", environment);
    window.addEventListener("blur", hide);
    root.addEventListener("pointerleave", hide);
    motion.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("craft-cursor-on");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", environment);
      window.removeEventListener("resize", environment);
      window.removeEventListener("blur", hide);
      root.removeEventListener("pointerleave", hide);
      motion.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="craft-cursor pointer-events-none fixed left-0 top-0 z-[70] opacity-0 transition-opacity duration-150"
      style={{ width: 0, height: 0 }}
    >
      {/* Plasma streak: trails behind the craft during atmospheric re-entry */}
      <div
        ref={plasmaRef}
        className="absolute left-0 top-0 w-[3px] rounded-full opacity-0 transition-opacity duration-200"
        style={{
          transformOrigin: "center top",
          background:
            "linear-gradient(to bottom, rgba(255,240,200,0.95), rgba(255,160,60,0.7) 35%, rgba(255,80,40,0.35) 70%, transparent)",
          filter: "blur(1px)",
        }}
      />
      {/* Satellite, nose pointing up (heading direction) */}
      <svg ref={satRef} width="44" height="44" viewBox="-22 -22 44 44" className="absolute -left-[22px] -top-[22px] text-gold drop-shadow-[0_0_6px_var(--color-gold)] transition-opacity duration-300">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="-20" y="-4" width="12" height="8" fill="currentColor" fillOpacity="0.25" />
          <rect x="8" y="-4" width="12" height="8" fill="currentColor" fillOpacity="0.25" />
          <path d="M-16 -4v8M-12 -4v8M12 -4v8M16 -4v8M-20 0h12M8 0h12" strokeWidth="0.5" />
          <path d="M-8 0h3M5 0h3" />
          <rect x="-5" y="-6" width="10" height="12" rx="1" fill="currentColor" fillOpacity="0.85" />
          <circle cx="0" cy="-8.5" r="2.2" fill="currentColor" />
          <path d="M-2 6l-1 3h6l-1-3" />
        </g>
      </svg>
      {/* Vessel, top-down, bow pointing up */}
      <svg ref={shipRef} width="44" height="44" viewBox="-22 -22 44 44" className="absolute -left-[22px] -top-[22px] text-cyan opacity-0 drop-shadow-[0_0_6px_var(--color-cyan)] transition-opacity duration-300">
        <path d="M0 -19C5 -12 6 -6 6 2V15C6 17 5 18 3 18H-3C-5 18 -6 17 -6 15V2C-6 -6 -5 -12 0 -19Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.1" />
        <rect x="-3.5" y="7" width="7" height="6" rx="1" fill="currentColor" />
        <path d="M-3 -6h6M-3 -1h6M-3 4h6" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="0" cy="-13" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
