import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav } from "@/components/seker/Chrome";

const TITLE = "Platform Access | Seker Space Intelligence";
const DESC = "Sign in to the Seker HERA AI platform with your username and password.";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccessPage,
});

function AccessPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "granted">("idle");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "checking") return;
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password.");
      return;
    }
    setError("");
    setStatus("checking");
    // Mock authentication — will be connected to the platform later.
    window.setTimeout(() => setStatus("granted"), 1200);
  };

  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-36">
        {status === "granted" ? (
          <section className="w-full max-w-md rounded-xl border border-gold/30 bg-gold/[0.04] p-10 text-center">
            <p className="font-mono text-xs tracking-[0.2em] text-cyan">SESSION ACTIVE</p>
            <h1 className="mt-4 text-3xl font-light text-foreground">
              Welcome, {username.trim()}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              You are signed in to the HERA AI platform. The full workspace will appear here
              once the platform goes live.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setPassword("");
              }}
              className="mt-8 border border-gold/60 px-7 py-3 font-mono text-[11px] tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-navy-deep"
            >
              SIGN OUT
            </button>
          </section>
        ) : (
          <section className="w-full max-w-md">
            <div className="text-center">
              <p className="font-mono text-sm tracking-[0.2em] text-gold">HERA AI PLATFORM</p>
              <h1 className="mt-4 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Platform access
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Sign in with the credentials issued to your organisation.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-8">
              <label htmlFor="username" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                USERNAME
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full border border-white/15 bg-navy-deep px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
              <label htmlFor="password" className="mt-6 block font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-white/15 bg-navy-deep px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-gold"
              />
              {error && (
                <p role="alert" className="mt-4 font-mono text-xs tracking-[0.08em] text-alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "checking"}
                className="mt-8 w-full bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy-deep transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "checking" ? "AUTHENTICATING…" : "SIGN IN →"}
              </button>
              <p className="mt-6 text-center font-mono text-[11px] leading-relaxed tracking-[0.08em] text-muted-foreground">
                No credentials yet? Request access at{" "}
                <a href="mailto:info@seker-space.com" className="text-gold hover:underline select-all">
                  info@seker-space.com
                </a>
              </p>
            </form>
            <p className="mt-6 text-center">
              <Link to="/careers" className="font-mono text-xs tracking-[0.2em] text-gold hover:underline">
                ← BACK TO SEKER-SPACE.COM
              </Link>
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
