const banks = { url: "/media/hera-banks.png" };
const commodities = { url: "/media/hera-commodities.png" };
const defense = { url: "/media/hera-defense.png" };
const digitalTwin = { url: "/media/hera-digital-twin.png" };
const fisheries = { url: "/media/hera-fisheries.png" };
const hormuz = { url: "/media/hera-hormuz.png" };
const insurance = { url: "/media/hera-insurance.png" };
const ports = { url: "/media/hera-ports.png" };
const sar = { url: "/media/hera-sar.png" };
const shipping = { url: "/media/hera-shipping.png" };
const everySource = { url: "/media/seker-every-source.png" };

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