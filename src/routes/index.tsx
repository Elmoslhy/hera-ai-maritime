import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { DashboardSection } from "@/components/seker/Dashboard";
import { DescentSection } from "@/components/seker/Descent";
import {
  ConstellationSection,
  ContactSection,
  GetItSection,
  HeroSection,
  IndustriesSection,
  ProblemSection,
} from "@/components/seker/Sections";

const TITLE = "SEKER | Maritime intelligence you can act on";
const DESCRIPTION =
  "Intelligence on every vessel at sea, for defense, insurance, commodity trading, ports and fisheries. Built on SEKER's own data fusion in Luxembourg.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-navy">
      <ScrollProgress />
      <Nav />
      <main>
        <HeroSection />
        <ProblemSection />
        <DescentSection />
        <DashboardSection />
        <GetItSection />
        <IndustriesSection />
        <ConstellationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
