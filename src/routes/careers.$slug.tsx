import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Footer, Nav } from "@/components/seker/Chrome";
import { applicantPrivacy, jobs, type Job } from "@/content/careers";

function plain(job: Job) {
  return job.sections
    .map((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? [])].join("\n"))
    .join("\n\n");
}

export const Route = createFileRoute("/careers/$slug")({
  loader: ({ params }) => {
    const job = jobs.find((j) => j.slug === params.slug && j.status === "open");
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    const job = loaderData?.job;
    if (!job) return { meta: [{ title: "Role not found | Seker Space Intelligence" }] };
    const title = `${job.title} (${job.id}) | Seker Space Intelligence`;
    const ld = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: plain(job),
      identifier: { "@type": "PropertyValue", name: "Seker Space Intelligence", value: job.id },
      datePosted: job.datePosted,
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "Seker Space Intelligence",
        sameAs: "https://seker-space.com",
      },
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: "Luxembourg", addressCountry: "LU" },
      },
    };
    return {
      meta: [
        { title },
        { name: "description", content: job.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: job.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center">
        <h1 className="text-3xl font-light text-foreground">This role is no longer open</h1>
        <Link to="/careers" className="mt-8 inline-block font-mono text-xs tracking-[0.2em] text-gold hover:underline">
          ← BACK TO ALL ROLES
        </Link>
      </main>
      <Footer />
    </div>
  ),
  component: JobPage,
});

function JobPage() {
  const { job } = Route.useLoaderData();
  const subject = encodeURIComponent(`${job.id} - ${job.title}`);
  const meta = [
    ["Location", job.location],
    ["Work arrangement", job.workArrangement],
    ["Employment type", job.employmentType],
    ["Reports to", job.reportsTo],
  ];
  return (
    <div className="min-h-screen bg-navy">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <Link to="/careers" className="font-mono text-xs tracking-[0.2em] text-gold hover:underline">
          ← BACK TO ALL ROLES
        </Link>
        <h1 className="mt-8 text-balance text-3xl font-light tracking-tight text-foreground sm:text-5xl">
          {job.title}
        </h1>
        <p className="mt-3 font-mono text-sm tracking-[0.2em] text-cyan">{job.id}</p>
        <dl className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-2">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">{k.toUpperCase()}</dt>
              <dd className="mt-1 text-sm text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        {job.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="text-xl font-normal text-gold sm:text-2xl">{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} className="mt-4 text-pretty leading-relaxed text-muted-foreground">{p}</p>
            ))}
            {s.bullets && (
              <ul className="mt-4 space-y-3">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed text-muted-foreground">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="mt-16 rounded-xl border border-gold/30 bg-gold/[0.04] p-8" aria-labelledby="apply">
          <h2 id="apply" className="text-2xl font-light text-foreground">Apply</h2>
          <a
            href={`mailto:info@seker-space.com?subject=${subject}`}
            className="mt-6 inline-block bg-gold px-7 py-3.5 font-mono text-[11px] tracking-[0.2em] text-navy-deep hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            APPLY FOR THIS ROLE →
          </a>
          <p className="mt-4 font-mono text-sm text-cyan">
            <span className="select-all">info@seker-space.com</span>
          </p>
        </section>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{applicantPrivacy}</p>
        <Link to="/careers" className="mt-10 inline-block font-mono text-xs tracking-[0.2em] text-gold hover:underline">
          ← BACK TO ALL ROLES
        </Link>
      </main>
      <Footer />
    </div>
  );
}
