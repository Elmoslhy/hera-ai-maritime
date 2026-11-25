import banks from "@/assets/hera/hera-banks.png.asset.json";
import commodities from "@/assets/hera/hera-commodities.png.asset.json";
import defense from "@/assets/hera/hera-defense.png.asset.json";
import digitalTwin from "@/assets/hera/hera-digital-twin.png.asset.json";
import fisheries from "@/assets/hera/hera-fisheries.png.asset.json";
import hormuz from "@/assets/hera/hera-hormuz.png.asset.json";
import insurance from "@/assets/hera/hera-insurance.png.asset.json";
import ports from "@/assets/hera/hera-ports.png.asset.json";
import sar from "@/assets/hera/hera-sar.png.asset.json";
import shipping from "@/assets/hera/hera-shipping.png.asset.json";
import everySource from "@/assets/hera/seker-every-source.png.asset.json";

export const heraAppImage = { src: hormuz.url, alt: "HERA AI app showing a Strait of Hormuz vessel map, activity totals and a vessel intelligence profile" };
export const heraTwinImage = { src: digitalTwin.url, alt: "HERA AI digital twin dashboard showing global chokepoints, Strait of Hormuz activity and vessel intelligence" };
export const sekerSourceImage = { src: everySource.url, alt: "Seker diagram showing ship registry, AIS, satellite imagery, port sources and sanctions lists fused into one vessel record with a confidence score" };

export const industryImages: Record<string, { src: string; alt: string }> = {
  "commodity-trading": { src: commodities.url, alt: "HERA AI commodities dashboard showing cargo estimates, voyages, ship-to-ship transfers and trading activity charts" },
  defense: { src: defense.url, alt: "HERA AI defense and coast guard dashboard showing vessels under watch, dark activity indicators and maritime risk charts" },
  insurance: { src: insurance.url, alt: "HERA AI insurance dashboard showing vessel exposure, claims indicators and risk distribution charts" },
  ports: { src: ports.url, alt: "HERA AI ports dashboard showing expected arrivals, vessel particulars and pilot boarding risk" },
  banks: { src: banks.url, alt: "HERA AI banks and compliance dashboard showing vessel due diligence, sanctions screening and exposure charts" },
  fisheries: { src: fisheries.url, alt: "HERA AI fisheries dashboard showing fishing vessel activity, meetings at sea and monitoring indicators" },
  "shipping-security": { src: shipping.url, alt: "HERA AI shipping and ship security dashboard showing fleet monitoring, vessel alerts and voyage risk charts" },
  "search-and-rescue": { src: sar.url, alt: "HERA AI search and rescue dashboard showing verified vessel identity, search indicators and response information" },
};