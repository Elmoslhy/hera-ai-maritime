import { useEffect, useRef } from "react";

type Trace = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  born: number;
  life: number;
  size: number;
  sea: number;
};

/** A presentation-only trail; the native pointer and all page controls stay intact. */
export function PointerTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(any-pointer: fine)");
    const colors = getComputedStyle(document.documentElement);
    const gold = colors.getPropertyValue("--color-gold").trim();
    const cyan = colors.getPropertyValue("--color-cyan").trim();
    const foam = colors.getPropertyValue("--foreground").trim();
    let traces: Trace[] = [];
    let previous: { x: number; y: number; time: number } | null = null;
    let frame = 0;
    let width = 0;
    let height = 0;
    let sea = 0;
    let lastWake = 0;

    const enabled = () => !motion.matches && finePointer.matches && !document.hidden;
    const clear = () => {
      traces = [];
      previous = null;
      cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, width, height);
    };
    const environment = () => {
      const descent = document.getElementById("descent");
      if (!descent) return;
      const bounds = descent.getBoundingClientRect();
      const progress = -bounds.top / Math.max(1, bounds.height - height);
      sea = Math.max(0, Math.min(1, (progress - 0.06) / 0.26));
      canvas.dataset.environment = sea === 0 ? "space" : sea === 1 ? "sea" : "transition";
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      environment();
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      traces = traces.filter((trace) => now - trace.born < trace.life);
      for (const trace of traces) {
        const age = (now - trace.born) / trace.life;
        const fade = (1 - age) ** 2;
        const x = trace.x + trace.vx * age;
        const y = trace.y + trace.vy * age;
        context.save();
        context.translate(x, y);
        context.rotate(trace.angle);
        if (trace.sea < 1) {
          context.globalAlpha = fade * (1 - trace.sea) * 0.85;
          context.fillStyle = trace.size > 1.5 ? gold : foam;
          context.beginPath();
          context.arc(0, 0, trace.size * (1 - age * 0.65), 0, Math.PI * 2);
          context.fill();
          if (trace.size > 1.9) {
            context.strokeStyle = gold;
            context.lineWidth = 0.65;
            context.beginPath();
            context.moveTo(-4 * fade, 0);
            context.lineTo(4 * fade, 0);
            context.moveTo(0, -4 * fade);
            context.lineTo(0, 4 * fade);
            context.stroke();
          }
        }
        if (trace.sea > 0) {
          context.globalAlpha = fade * trace.sea * 0.55;
          context.strokeStyle = cyan;
          context.lineWidth = 1;
          const spread = 3 + age * 19;
          const tail = 6 + age * 16;
          context.beginPath();
          context.moveTo(-tail, -spread);
          context.quadraticCurveTo(-tail * 0.45, -spread * 0.6, 0, 0);
          context.quadraticCurveTo(-tail * 0.45, spread * 0.6, -tail, spread);
          context.stroke();
          context.globalAlpha = fade * trace.sea * 0.65;
          context.fillStyle = foam;
          context.beginPath();
          context.arc(-tail * 0.5, 0, 0.9 * fade, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
      frame = traces.length ? requestAnimationFrame(draw) : 0;
    };

    const move = (event: PointerEvent) => {
      if (!enabled() || event.pointerType === "touch") return;
      const target = event.target;
      if (target instanceof Element && target.closest("a, button, input, textarea, select, [role='button']")) {
        previous = null;
        return;
      }
      const now = performance.now();
      const current = { x: event.clientX, y: event.clientY, time: now };
      if (!previous || now - previous.time > 160) {
        previous = current;
        return;
      }
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) return;
      const angle = Math.atan2(dy, dx);
      const count = Math.min(9, Math.ceil(distance / 5));
      for (let i = 0; i < count; i++) {
        const fraction = (i + 1) / count;
        const scatter = (Math.random() - 0.5) * 9 * (1 - sea);
        // Space scatters fine sparks; water leaves spaced, widening wake crests.
        if (sea > 0.5 && now - lastWake < 24) break;
        traces.push({
          x: previous.x + dx * fraction - Math.sin(angle) * scatter,
          y: previous.y + dy * fraction + Math.cos(angle) * scatter,
          vx: -Math.cos(angle) * (5 + Math.random() * 10),
          vy: -Math.sin(angle) * 7 + (Math.random() - 0.5) * 9,
          angle,
          born: now,
          life: 650 + Math.random() * 350 + sea * 220,
          size: 0.7 + Math.random() * 1.6,
          sea,
        });
        if (sea > 0.5) lastWake = now;
      }
      traces = traces.slice(-160);
      previous = current;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const scroll = () => { environment(); previous = null; };
    resize();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", clear);
    document.documentElement.addEventListener("pointerleave", clear);
    document.addEventListener("visibilitychange", clear);
    motion.addEventListener("change", clear);
    finePointer.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", clear);
      document.documentElement.removeEventListener("pointerleave", clear);
      document.removeEventListener("visibilitychange", clear);
      motion.removeEventListener("change", clear);
      finePointer.removeEventListener("change", clear);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-trail pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}