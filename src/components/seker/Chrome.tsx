import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { SekerLogo } from "./Logo";
import { industries } from "@/content/industries";

function IndustriesMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden sm:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 tracking-[0.2em] text-foreground/80 transition-colors hover:text-gold">
        INDUSTRIES <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
          <div className="rounded-lg border border-white/10 bg-navy/90 p-2 backdrop-blur">
            {industries.map((i) => (
              <Link key={i.slug} to="/industries/$slug" params={{ slug: i.slug }} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 transition-colors hover:bg-white/5">
                <span className="block text-[10px] uppercase tracking-[0.18em] text-foreground">{i.navName}</span>
                <span className="mt-1 block font-sans text-xs normal-case tracking-normal text-muted-foreground">{i.description}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
        <Link to="/" aria-label="SEKER — home" className="inline-flex">
          <SekerLogo className="h-9 w-auto text-foreground" />
        </Link>
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] sm:gap-6">
          <span className="hidden text-muted-foreground sm:inline">
            UTC <span className="text-foreground/80">{utc}</span>
          </span>
          <span className="flex items-center gap-2 text-cyan">
            <span className="blink-dot h-1.5 w-1.5 rounded-full bg-cyan" />
            LIVE
          </span>
          <IndustriesMenu />
          <Link to="/intelligence" className="hidden text-foreground/80 transition-colors hover:text-gold sm:inline">
            USE CASES
          </Link>
          <Link to="/careers" className="text-foreground/80 transition-colors hover:text-gold">
            CAREERS
          </Link>
          <Link to="/newsroom" className="text-foreground/80 transition-colors hover:text-gold">
            NEWSROOM
          </Link>
          <Link
            to="/access"
            className="border border-gold/60 bg-gold/90 px-4 py-2 text-[10px] tracking-[0.22em] text-navy-deep transition-colors hover:bg-gold"
          >
            PLATFORM LOGIN
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-deep px-6 py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <Link to="/" aria-label="SEKER — home" className="inline-flex">
          <SekerLogo className="h-6 w-auto text-gold opacity-60" />
        </Link>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {industries.map((i) => (
            <Link key={i.slug} to="/industries/$slug" params={{ slug: i.slug }} className="font-mono text-xs tracking-[0.2em] text-foreground/60 hover:text-gold">
              {i.navName.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className="flex gap-8">
          <Link to="/intelligence" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            USE CASES
          </Link>
          <Link to="/careers" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            CAREERS
          </Link>
          <Link to="/newsroom" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            NEWSROOM
          </Link>
        </div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          © 2026 SEKER SPACE INTELLIGENCE S.A. · LUXEMBOURG · SEKER-SPACE.COM
        </p>
      </div>
    </footer>
  );
}