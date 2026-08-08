import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { SekerLogo } from "./Logo";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[1.5px] origin-left bg-gold"
    />
  );
}

function useUtcClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Nav() {
  const utc = useUtcClock();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? "border-b border-white/5 bg-navy/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <SekerLogo className="h-7 w-auto text-foreground" />
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] sm:gap-6">
          <span className="hidden text-muted-foreground sm:inline">
            UTC <span className="text-foreground/80">{utc}</span>
          </span>
          <span className="flex items-center gap-2 text-cyan">
            <span className="blink-dot h-1.5 w-1.5 rounded-full bg-cyan" />
            LIVE
          </span>
          <a
            href="#contact"
            className="border border-gold/60 bg-gold/90 px-4 py-2 text-[10px] tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
          >
            API ACCESS
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-deep px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <SekerLogo className="h-6 w-auto text-gold opacity-60" />
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          © 2026 SEKER SPACE INTELLIGENCE S.A. · LUXEMBOURG · SEKER-SPACE.COM
        </p>
      </div>
    </footer>
  );
}