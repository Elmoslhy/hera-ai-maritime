import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { SecondLookSection } from "@/components/seker/DroneFilm";
import { DashboardSection } from "@/components/seker/Dashboard";
import { DescentSection } from "@/components/seker/Descent";
import {
  ConstellationSection,
  ContactSection,
  GetItSection,
  HeroSection,
  IndustriesSection,
  ProblemSection,
  ProofSection,
  WhyNowSection,
} from "@/components/seker/Sections";

const TITLE = "SEKER | Independent maritime intelligence";
const DESCRIPTION =
  "The truth about every ship at sea: who it is, who owns it, where it has been and what it is doing. Checked against independent data, with a confidence score on every answer.";

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
        <WhyNowSection />
        <DescentSection />
        <DashboardSection />
        <GetItSection />
        <IndustriesSection />
        <ConstellationSection />
        <SecondLookSection />
        <ProofSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
