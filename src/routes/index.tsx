import { createFileRoute } from "@tanstack/react-router";
import { Footer, Nav, ScrollProgress } from "@/components/seker/Chrome";
import { AnalyticsSection } from "@/components/seker/Analytics";
import { DashboardSection } from "@/components/seker/Dashboard";
import { DescentSection } from "@/components/seker/Descent";
import { InsightsSection } from "@/components/seker/Insights";
import {
  ConstellationSection,
  ContactSection,
  HeroSection,
  LaunchSection,
  OceanSection,
  ProblemSection,
} from "@/components/seker/Sections";

const TITLE = "SEKER · Verified Maritime Intelligence from Orbit";
const DESCRIPTION =
  "HERA AI fuses AIS, SAR, RF and optical signals in orbit to deliver verified, tamper-proof maritime intelligence. EU sovereign. Launching 2026.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
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
        <LaunchSection />
        <ConstellationSection />
        <DescentSection />
        <OceanSection />
        <ProblemSection />
        <DashboardSection />
        <AnalyticsSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
