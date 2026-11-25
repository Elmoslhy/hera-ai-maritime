import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { SekerLogo } from "./Logo";
import { industries } from "@/content/industries";

// Shared treatment for the current page in the header: gold label plus a gold rule under it.
const NAV_RULE =
  "relative after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:bg-gold after:content-[''] after:transition-[width] after:duration-300";

function navState(active: boolean) {
  return active
    ? "text-gold after:w-full"
    : "text-foreground/80 after:w-0 hover:text-gold hover:after:w-full";
}

function navLinkClass(active: boolean) {
  return `${NAV_RULE} hidden transition-colors sm:inline-block ${navState(active)}`;
}

// TanStack Router merges these over the base props, so the active page gets the gold treatment.
const NAV_ACTIVE = { "aria-current": "page" as const, className: navLinkClass(true) };
const NAV_INACTIVE = { className: navLinkClass(false) };

const LOGIN_BASE =
  "hidden border border-gold/60 px-4 py-2 text-[10px] tracking-[0.22em] text-navy-deep transition-colors sm:inline-block";
const LOGIN_ACTIVE = {
  "aria-current": "page" as const,
  className: `${LOGIN_BASE} bg-gold ring-2 ring-offset-2 ring-offset-navy ring-gold`,
};
const LOGIN_INACTIVE = { className: `${LOGIN_BASE} bg-gold/90 hover:bg-gold` };

function useCurrentPath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function IndustriesMenu() {
  const [open, setOpen] = useState(false);
  const path = useCurrentPath();
  const onIndustry = path.startsWith("/industries");
  return (
    <div className="relative hidden sm:block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 tracking-[0.2em] transition-colors ${NAV_RULE} ${navState(onIndustry || open)}`}
      >
        INDUSTRIES <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
          <div className="rounded-lg border border-white/10 bg-navy/90 p-2 backdrop-blur">
            <a href="/#industries" onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-white/5">All industries</a>
            {industries.map((i) => {
              const active = path === `/industries/${i.slug}`;
              return (
              <Link
                key={i.slug}
                to="/industries/$slug"
                params={{ slug: i.slug }}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-3 transition-colors hover:bg-white/5 ${active ? "bg-white/5" : ""}`}
              >
                <span className={`block text-[10px] uppercase tracking-[0.18em] ${active ? "text-gold" : "text-foreground"}`}>{i.navName}</span>
                <span className="mt-1 block font-sans text-xs normal-case tracking-normal text-muted-foreground">{i.description}</span>
              </Link>
              );
            })}
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
          <Link to="/intelligence" activeProps={NAV_ACTIVE} inactiveProps={NAV_INACTIVE}>
            HERA AI
          </Link>
          <Link to="/constellation" activeProps={NAV_ACTIVE} inactiveProps={NAV_INACTIVE}>
            SEKER-1 · SEKER-2
          </Link>
          <IndustriesMenu />
          <Link to="/company" activeProps={NAV_ACTIVE} inactiveProps={NAV_INACTIVE}>
            COMPANY
          </Link>
          <Link to="/careers" activeProps={NAV_ACTIVE} inactiveProps={NAV_INACTIVE}>
            CAREERS
          </Link>
          <Link to="/newsroom" activeProps={NAV_ACTIVE} inactiveProps={NAV_INACTIVE}>
            NEWSROOM
          </Link>
          <Link to="/access" activeProps={LOGIN_ACTIVE} inactiveProps={LOGIN_INACTIVE}>
            PLATFORM LOGIN
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);
  const close = () => setOpen(false);
  const path = useCurrentPath();
  const mobileItem = (active: boolean) =>
    `relative block border-b border-white/5 py-4 font-mono text-xs tracking-[0.2em] ${
      active
        ? "text-gold after:absolute after:-left-3 after:top-1/2 after:h-4 after:w-[2px] after:-translate-y-1/2 after:bg-gold after:content-['']"
        : "text-foreground/90 hover:text-gold"
    }`;
  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center border border-gold/60 text-gold"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {open && createPortal(
        <div className="fixed inset-x-0 bottom-0 top-[68px] z-50 overflow-y-auto bg-navy-deep/95 px-6 pb-10 backdrop-blur-md sm:hidden">
          <Link to="/intelligence" onClick={close} activeProps={{ "aria-current": "page" }} className={`${mobileItem(path === "/intelligence")} mt-4`}>HERA AI</Link>
          <Link to="/constellation" onClick={close} activeProps={{ "aria-current": "page" }} className={mobileItem(path === "/constellation")}>SEKER-1 · SEKER-2</Link>
          <p className="pt-6 font-mono text-[10px] tracking-[0.22em] text-gold">INDUSTRIES</p>
          <a href="/#industries" onClick={close} className={mobileItem(false)}>ALL INDUSTRIES</a>
          {industries.map((i) => (
            <Link
              key={i.slug}
              to="/industries/$slug"
              params={{ slug: i.slug }}
              onClick={close}
              activeProps={{ "aria-current": "page" }}
              className={mobileItem(path === `/industries/${i.slug}`)}
            >
              {i.navName.toUpperCase()}
            </Link>
          ))}
          <p className="pt-8 font-mono text-[10px] tracking-[0.22em] text-gold">SEKER</p>
          <Link to="/company" onClick={close} activeProps={{ "aria-current": "page" }} className={mobileItem(path === "/company")}>COMPANY</Link>
          <Link to="/careers" onClick={close} activeProps={{ "aria-current": "page" }} className={mobileItem(path.startsWith("/careers"))}>CAREERS</Link>
          <Link to="/newsroom" onClick={close} activeProps={{ "aria-current": "page" }} className={mobileItem(path.startsWith("/newsroom"))}>NEWSROOM</Link>
          <Link
            to="/access"
            onClick={close}
            activeProps={{ "aria-current": "page" }}
            className={`mt-8 block border border-gold/60 px-4 py-3 text-center font-mono text-xs tracking-[0.22em] text-navy-deep ${
              path === "/access" ? "bg-gold ring-1 ring-gold/50" : "bg-gold/90"
            }`}
          >
            PLATFORM LOGIN
          </Link>
        </div>,
        document.body,
      )}
    </div>
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
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link to="/intelligence" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            HERA AI
          </Link>
          <Link to="/constellation" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            SEKER-1 · SEKER-2
          </Link>
          <Link to="/company" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            COMPANY
          </Link>
          <Link to="/careers" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            CAREERS
          </Link>
          <Link to="/newsroom" className="font-mono text-xs tracking-[0.2em] text-foreground/80 hover:text-gold">
            NEWSROOM
          </Link>
        </div>
        <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.18em] text-muted-foreground break-words sm:max-w-none">
          EU-DEVELOPED · EU-OWNED IP · EU-BASED OPERATIONS · EU DATA RESIDENCY
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          © 2026 SEKER SPACE INTELLIGENCE S.À R.L. · LUXEMBOURG · SEKER-SPACE.COM
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          Registered office: 68, avenue de la Liberté, L-1930 Luxembourg
        </p>
      </div>
    </footer>
  );
}