import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Nav } from "@/components/seker/Chrome";
import { careersIntro, jobFamilies, jobs, speculative } from "@/content/careers";

const TITLE = "Careers | Seker Space Intelligence";
const DESC = careersIntro.slice(0, 155);

export const Route = createFileRoute("/careers/")({
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
  component: CareersPage,
});

function CareersPage() {
  const open = jobs.filter((j) => j.status === "open");
  const families = jobFamilies
    .map((f) => ({ ...f, roles: open.filter((j) => j.family === f.key) }))
    .filter((f) => f.roles.length > 0);
  const subject = encodeURIComponent(`${speculative.id} - ${speculative.title}`);

  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-36">
        <p className="text-eyebrow text-gold">Careers</p>
        <h1 className="mt-5 text-balance text-4xl font-light tracking-tight text-foreground sm:text-6xl">
          Careers at Seker
        </h1>
        <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground">
          {careersIntro}
        </p>

        {families.map((f) => (
          <section key={f.key} className="mt-20" aria-labelledby={`fam-${f.key}`}>
            <h2 id={`fam-${f.key}`} className="text-2xl font-light text-foreground sm:text-3xl">
              {f.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {f.roles.map((j) => (
                <article
                  key={j.id}
                  className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <p className="font-mono text-xs tracking-[0.2em] text-cyan">{j.id}</p>
                  <h3 className="mt-3 text-xl font-normal text-foreground">{j.title}</h3>
                  <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-[0.08em] text-muted-foreground">
                    {j.location} · {j.workArrangement} · {j.employmentType}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{j.summary}</p>
                  <Link
                    to="/careers/$slug"
                    params={{ slug: j.slug }}
                    className="mt-6 self-start font-mono text-xs tracking-[0.2em] text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                  >
                    VIEW ROLE →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-20 rounded-xl border border-gold/30 bg-gold/[0.04] p-8" aria-labelledby="spec">
          <p className="font-mono text-xs tracking-[0.2em] text-cyan">{speculative.id}</p>
          <h2 id="spec" className="mt-3 text-2xl font-light text-foreground">{speculative.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{speculative.text}</p>
          <a
            href={`mailto:info@seker-space.com?subject=${subject}`}
            className="mt-6 inline-block bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy-deep hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            APPLY →
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
