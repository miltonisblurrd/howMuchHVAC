export type Project = {
  slug: string;
  title: string;
  city: string;
  service: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  beforeImage: string;
  afterImage: string;
  brands: string[];
  year: number;
};

export const projects: Project[] = [
  {
    slug: "carrier-system-upgrade-anaheim",
    title: "Full System Upgrade to Carrier",
    city: "Anaheim",
    service: "A/C Repair & Installation",
    summary:
      "An aging outdoor unit was failing under summer load. We replaced it with a properly sized Carrier system and walked the homeowner through clear Good / Better / Best options.",
    challenge:
      "The existing condenser was inefficient, noisy, and struggling to keep up during peak afternoon heat.",
    solution:
      "We performed a full assessment, presented transparent options with pricing rationale, and installed a Carrier system matched to the home.",
    outcome:
      "Quieter operation, consistent cooling, and a homeowner who understood exactly what they paid for ? and why.",
    beforeImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    brands: ["Carrier"],
    year: 2025,
  },
  {
    slug: "ductless-adu-irvine",
    title: "Ductless Comfort for a New ADU",
    city: "Irvine",
    service: "Ductless Mini-Split",
    summary:
      "A new accessory dwelling unit needed independent climate control without major ductwork. A Mitsubishi ductless system delivered clean, zoned comfort.",
    challenge:
      "The ADU had no existing ducts and needed quiet, efficient heating and cooling on its own schedule.",
    solution:
      "We designed a Mitsubishi Electric mini-split layout for coverage and aesthetics, then installed with minimal disruption.",
    outcome:
      "Independent comfort for guests, strong efficiency, and a tidy install the homeowner was proud to show.",
    beforeImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    brands: ["Mitsubishi Electric"],
    year: 2025,
  },
  {
    slug: "second-opinion-long-beach",
    title: "Second Opinion Saved an Unnecessary Replacement",
    city: "Long Beach",
    service: "A/C Repair & Installation",
    summary:
      "Another company pushed a full replacement. Our diagnostic found a repairable issue ? and we fixed it without the upsell.",
    challenge:
      "Homeowner was told their system was 'shot' and needed immediate full replacement at a premium price.",
    solution:
      "We ran a thorough diagnostic, explained findings in plain English, and completed a targeted repair.",
    outcome:
      "System restored, thousands saved, and a long-term relationship built on trust.",
    beforeImage:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    brands: ["How Much? Diagnostic"],
    year: 2024,
  },
  {
    slug: "heat-pump-huntington-beach",
    title: "Heat Pump Conversion Near the Coast",
    city: "Huntington Beach",
    service: "Heat Pump",
    summary:
      "Homeowners wanted efficient year-round comfort. We recommended and installed a heat pump suited to coastal conditions.",
    challenge:
      "Aging split system with rising energy costs and uneven comfort between seasons.",
    solution:
      "We modeled operating expectations, presented financing-friendly options, and installed a high-efficiency heat pump.",
    outcome:
      "One system for heating and cooling, improved efficiency, and clearer monthly comfort costs.",
    beforeImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    brands: ["Carrier", "Google Nest"],
    year: 2025,
  },
  {
    slug: "duct-sealing-santa-ana",
    title: "Duct Sealing That Actually Changed Comfort",
    city: "Santa Ana",
    service: "Ductwork",
    summary:
      "Rooms never cooled evenly. Sealing and balancing the duct system transformed comfort without replacing the condenser.",
    challenge:
      "Hot and cold rooms despite a relatively new outdoor unit.",
    solution:
      "Full duct inspection, sealing leaks, and airflow balancing across registers.",
    outcome:
      "Even temperatures, less runtime, and money saved by fixing the real problem.",
    beforeImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    brands: ["How Much? Airflow"],
    year: 2024,
  },
  {
    slug: "iaq-upgrade-fullerton",
    title: "Indoor Air Quality Upgrade for a Family Home",
    city: "Fullerton",
    service: "Indoor Air Quality",
    summary:
      "Allergy concerns led to a right-sized filtration and IAQ plan ? no unnecessary gadgets, just what the home needed.",
    challenge:
      "Family wanted cleaner air but had been pitched overlapping products they didn't understand.",
    solution:
      "We assessed filtration, usage patterns, and recommended a practical IAQ package with clear benefits.",
    outcome:
      "Better air, clearer expectations, and a maintenance plan the family can stick with.",
    beforeImage:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    brands: ["Honeywell Home"],
    year: 2025,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
