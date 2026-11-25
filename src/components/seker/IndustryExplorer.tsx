import { useState } from "react";
import { motion, useReducedMotionConfig } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { industries } from "@/content/industries";
import { cableCorridorCase, cargoClaimCase, originCase, preArrivalCase, transshipmentCase, useCases } from "@/content/intelligence";
import { SignatureSection } from "./IndustrySections";

const order = ["commodity-trading", "defense", "insurance", "ports", "banks", "fisheries", "shipping-security", "search-and-rescue"];
const entries = order.flatMap((slug) => {
  const industry = industries.find((item) => item.slug === slug);
  return industry?.rebuild ? [industry] : [];
});
const cases = [...useCases, originCase, cargoClaimCase, preArrivalCase, transshipmentCase, cableCorridorCase];

export function IndustryExplorer() {
  const [selected, setSelected] = useState("commodity-trading");
  const reducedMotion = useReducedMotionConfig();

  return (
    <Tabs value={selected} onValueChange={setSelected} className="industry-explorer mt-14 min-w-0">
      <div className="overflow-x-auto p-1">
        <TabsList aria-label="Maritime industries" className="h-auto w-max justify-start gap-1 rounded-none bg-transparent p-0">
          {entries.map((industry) => (
            <TabsTrigger
              key={industry.slug}
              value={industry.slug}
              className="min-h-12 border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-gold"
              onFocus={(event) => event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
            >
              {industry.navName}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="mt-6 grid min-w-0">
        {entries.map((industry) => {
          const rebuild = industry.rebuild;
          if (!rebuild) return null;
          const active = industry.slug === selected;
          const question = cases.find((item) => item.id === industry.useCaseIds[0])?.question;
          return (
            <TabsContent key={industry.slug} value={industry.slug} forceMount inert={!active}
              className="col-start-1 row-start-1 mt-0 min-w-0 data-[state=inactive]:invisible data-[state=inactive]:pointer-events-none">
              <motion.div initial={false} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }}>
                <div className="grid min-w-0 gap-10 overflow-hidden rounded-lg border border-border bg-card p-6 lg:grid-cols-2 lg:p-8">
                  <div className="min-w-0">
                    <h3 className="text-balance text-2xl leading-tight sm:text-3xl">{industry.headline.join(" ")}</h3>
                    <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{industry.body}</p>
                    <p className="mt-8 text-eyebrow">What you get</p>
                    <ul className="mt-4 divide-y divide-border">
                      {rebuild.missions.slice(0, 4).map((mission) => (
                        <li key={mission.title} className="py-4 first:pt-0">
                          <p className="font-semibold text-foreground">{mission.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{mission.need}</p>
                          <p className="mt-2 text-sm text-gold">{mission.deliverable}</p>
                        </li>
                      ))}
                    </ul>
                    {question && <p className="mt-7 text-xl font-semibold leading-snug text-foreground sm:text-2xl">{question}</p>}
                  </div>
                  <div className="industry-explorer-visual min-w-0">
                    <SignatureSection sig={rebuild.signature} axis={rebuild.chartAxis} />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button asChild variant="outline" className="min-h-12 whitespace-normal rounded-full px-6 py-3 text-base">
                    <Link to="/industries/$slug" params={{ slug: industry.slug }}>See how it works →</Link>
                  </Button>
                  {industry.closing && (
                    <Button asChild className="min-h-12 whitespace-normal rounded-full px-6 py-3 text-base">
                      <Link to="/" hash="contact">{industry.closing.button} →</Link>
                    </Button>
                  )}
                </div>
              </motion.div>
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}