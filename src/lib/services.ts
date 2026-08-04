export type ServiceFaq = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  summary: string;
  description: string;
  image: string;
  featured?: boolean;
  expect: string[];
  benefits: string[];
  painPoints: { title: string; body: string }[];
  process: { title: string; body: string }[];
  faqs: ServiceFaq[];
  relatedBlogSlugs: string[];
  relatedFaqSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "ac-repair-installation",
    name: "A/C Repair & Installation",
    shortName: "A/C",
    summary: "Cooling that works when Southern California heat hits hard.",
    description:
      "From same-day diagnostics to full system replacements, we keep your home comfortable with clear options and honest pricing ? no mystery fees.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "Diagnostic clarity before any repair",
      "Repair vs replace options you can understand",
      "Quality installs with manufacturer-backed equipment",
    ],
    benefits: [
      "Faster comfort restoration when heat spikes",
      "Clear pricing before work begins",
      "Systems sized for your home ? not guesswork",
      "Clean job sites and respectful crews",
      "Warranty documentation stored for you",
    ],
    painPoints: [
      {
        title: "AC blows warm air",
        body: "Warm airflow often means refrigerant, airflow, or compressor issues ? not always a full replacement.",
      },
      {
        title: "Short cycling or constant running",
        body: "Units that never shut off (or shut off too fast) waste money and wear out early.",
      },
      {
        title: "Uneven rooms",
        body: "One freezing bedroom and one sauna usually points to ducts, sizing, or zoning ? not just ?buy a bigger unit.?",
      },
      {
        title: "Scary replacement quotes",
        body: "If another company jumped straight to a full system sell, get a second opinion before you sign.",
      },
    ],
    process: [
      {
        title: "Listen & inspect",
        body: "We hear the symptoms, then diagnose the system ? not the sales script.",
      },
      {
        title: "Explain the findings",
        body: "Photos and plain English. You?ll know what?s broken and what?s optional.",
      },
      {
        title: "Present options",
        body: "Repair path, mid-tier upgrade, or full replacement ? with pricing rationale.",
      },
      {
        title: "Deliver & document",
        body: "Clean install or repair, startup checks, and paperwork you can revisit in the portal.",
      },
    ],
    faqs: [
      {
        question: "How much does AC replacement cost in Orange County?",
        answer:
          "It depends on tonnage, efficiency, duct condition, and access. We provide personalized options after a diagnostic ? not a Facebook-ad number.",
      },
      {
        question: "Can you repair instead of replace?",
        answer:
          "Often yes. If a repair is the smarter move, we'll say so ? even if that means a smaller job.",
      },
      {
        question: "How fast can you come out?",
        answer:
          "In peak heat we prioritize diagnostics and same-week installs when equipment is available. Call the direct line for the soonest slot.",
      },
    ],
    relatedBlogSlugs: [
      "how-much-does-ac-replacement-cost-orange-county",
      "repair-vs-replace-hvac",
      "signs-your-ac-is-failing",
    ],
    relatedFaqSlugs: ["pricing-and-quotes", "second-opinions"],
  },
  {
    slug: "heating",
    name: "Heating Systems",
    shortName: "Heating",
    summary: "Reliable warmth for cooler nights ? safely and efficiently.",
    description:
      "Whether your heater is struggling or you're ready for an upgrade, we diagnose issues clearly and present options that fit your home and budget.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "Safety-first inspections",
      "Efficient system recommendations",
      "Transparent quotes with no pressure",
    ],
    benefits: [
      "Safer operation with proper combustion checks",
      "Even warmth without blasting one room",
      "Lower surprise repair risk before winter",
      "Clear guidance on repair vs upgrade timing",
    ],
    painPoints: [
      {
        title: "Heater won?t start",
        body: "Ignition, sensors, or airflow issues can look identical from the thermostat ? diagnostics matter.",
      },
      {
        title: "Strange smells or noises",
        body: "Burning smells, rattles, or booming starts deserve a professional look ASAP.",
      },
      {
        title: "High winter bills",
        body: "Aging heat systems and leaky ducts quietly drain money every cold snap.",
      },
      {
        title: "Cold spots in the house",
        body: "Often a balance, duct, or capacity issue ? not just ?turn it up.?",
      },
    ],
    process: [
      { title: "Safety check", body: "We start with the things that protect your family." },
      { title: "Performance review", body: "Airflow, ignition, and heat delivery across rooms." },
      { title: "Options", body: "Repair, tune-up plan, or system upgrade ? explained clearly." },
      { title: "Follow-through", body: "Work completed cleanly with documentation." },
    ],
    faqs: [
      {
        question: "Do I need heating service in Southern California?",
        answer:
          "Yes ? coastal and inland nights still stress aging systems, and safety checks matter even in mild winters.",
      },
      {
        question: "Is a heat pump better than a furnace?",
        answer:
          "Sometimes. Climate, ductwork, and existing equipment decide. We'll show both paths when relevant.",
      },
    ],
    relatedBlogSlugs: ["repair-vs-replace-hvac", "seasonal-hvac-maintenance-checklist"],
    relatedFaqSlugs: ["maintenance-plans", "pricing-and-quotes"],
  },
  {
    slug: "gas-furnace",
    name: "Gas Furnace",
    shortName: "Gas Furnace",
    summary: "Furnace service, repair, and replacement done right.",
    description:
      "Gas furnaces need careful handling. We inspect, repair, and install with attention to safety, efficiency, and long-term reliability.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Combustion and safety checks",
      "Honest repair vs replace guidance",
      "Clean, professional installs",
    ],
    benefits: [
      "CO and combustion safety prioritized",
      "Longer equipment life with proper tune-ups",
      "No upselling a replacement you don?t need",
    ],
    painPoints: [
      {
        title: "Pilot / ignition failures",
        body: "Repeated lockouts usually have a root cause ? we find it instead of resetting forever.",
      },
      {
        title: "Yellow flame or soot",
        body: "Combustion problems aren?t DIY. Call for a safety inspection.",
      },
      {
        title: "Aging heat exchanger concerns",
        body: "Cracks are serious. We'll verify with a proper inspection ? not fear tactics.",
      },
    ],
    process: [
      { title: "Safety inspection", body: "Combustion, venting, and heat exchanger review." },
      { title: "Clear findings", body: "What?s urgent vs what?s optional." },
      { title: "Repair or replace", body: "Options with warranty implications explained." },
      { title: "Commissioning", body: "Startup, testing, and homeowner walkthrough." },
    ],
    faqs: [
      {
        question: "How long do gas furnaces last?",
        answer:
          "Often 15?20 years with maintenance ? but condition matters more than birthday. We judge performance and safety, not just age.",
      },
    ],
    relatedBlogSlugs: ["repair-vs-replace-hvac", "seasonal-hvac-maintenance-checklist"],
    relatedFaqSlugs: ["maintenance-plans", "second-opinions"],
  },
  {
    slug: "heat-pump",
    name: "Heat Pump",
    shortName: "Heat Pump",
    summary: "Year-round comfort with efficient heating and cooling.",
    description:
      "Heat pumps are a smart fit for many SoCal homes. We'll help you understand performance, operating costs, and whether a heat pump is right for you.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "All-in-one heating and cooling guidance",
      "Energy-efficient options",
      "Clear financing and upgrade paths",
    ],
    benefits: [
      "One system for most of the year",
      "Strong efficiency in mild climates",
      "Smart thermostat pairing when it helps",
      "Transparent operating-cost expectations",
    ],
    painPoints: [
      {
        title: "Two aging systems to maintain",
        body: "Separate AC + furnace can mean double the repair risk. A heat pump can simplify.",
      },
      {
        title: "Rising energy costs",
        body: "Older equipment burns money quietly. Efficiency upgrades should pencil out ? we'll show the math.",
      },
      {
        title: "Confused by heat pump marketing",
        body: "Not every home is a perfect fit. We size and recommend based on reality.",
      },
    ],
    process: [
      { title: "Home assessment", body: "Load, ducts, electrical, and comfort goals." },
      { title: "Option modeling", body: "Equipment tiers with real-world expectations." },
      { title: "Install", body: "Clean swap, controls setup, and performance verification." },
      { title: "Education", body: "How to run it efficiently day to day." },
    ],
    faqs: [
      {
        question: "Do heat pumps work near the coast?",
        answer:
          "Yes ? Southern California?s mild climate is often ideal. Salt air and placement still matter for longevity.",
      },
    ],
    relatedBlogSlugs: [
      "heat-pumps-for-southern-california",
      "how-much-does-ac-replacement-cost-orange-county",
    ],
    relatedFaqSlugs: ["pricing-and-quotes", "financing-basics"],
  },
  {
    slug: "ductless-mini-split",
    name: "Ductless Mini-Split",
    shortName: "Mini-Split",
    summary: "Zoned comfort without ripping out your walls.",
    description:
      "Perfect for additions, garages, ADUs, and rooms that never stay comfortable. We design and install ductless systems that look clean and run quiet.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Room-by-room temperature control",
      "Minimal disruption installs",
      "High-efficiency brands you trust",
    ],
    benefits: [
      "Independent comfort for ADUs and additions",
      "No major duct demolition",
      "Quiet, efficient operation",
      "Flexible single or multi-zone designs",
    ],
    painPoints: [
      {
        title: "Garage / ADU has no ducts",
        body: "Extending central air is often expensive and ugly. Ductless is built for this.",
      },
      {
        title: "One room never gets comfortable",
        body: "A targeted head can fix the problem room without replacing the whole house system.",
      },
      {
        title: "Worried it?ll look industrial",
        body: "Placement and brand choice matter. We design for aesthetics as well as output.",
      },
    ],
    process: [
      { title: "Zone design", body: "Which rooms, which heads, which outdoor unit." },
      { title: "Placement plan", body: "Quiet, effective, and visually clean." },
      { title: "Install", body: "Line sets, electrical, and commissioning." },
      { title: "Handoff", body: "Remote/app basics and maintenance tips." },
    ],
    faqs: [
      {
        question: "Can one outdoor unit serve multiple rooms?",
        answer:
          "Yes ? multi-zone systems are common. We'll match capacity so rooms don?t starve each other.",
      },
    ],
    relatedBlogSlugs: ["ductless-mini-splits-explained", "heat-pumps-for-southern-california"],
    relatedFaqSlugs: ["pricing-and-quotes"],
  },
  {
    slug: "package-unit",
    name: "Package Unit",
    shortName: "Package Unit",
    summary: "Rooftop and outdoor package systems for homes and light commercial.",
    description:
      "When your package unit is aging or failing, we assess capacity, efficiency, and replacement options so you know exactly how much ? and why.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Accurate load and condition assessment",
      "Trusted equipment partners",
      "Clean removal and install",
    ],
    benefits: [
      "All-in-one footprint for certain home layouts",
      "Clear replacement timelines",
      "Proper curb/adaptor handling",
    ],
    painPoints: [
      {
        title: "Rooftop unit failing in heat",
        body: "Access is harder ? waiting often means emergency pricing. Plan the swap with options.",
      },
      {
        title: "Weird package vs split quotes",
        body: "Not every home should convert system types. We'll tell you when a like-for-like is smarter.",
      },
    ],
    process: [
      { title: "Site & curb check", body: "Access, electrical, and mounting realities." },
      { title: "Options", body: "Efficiency tiers and install scope." },
      { title: "Swap day", body: "Safe removal, set, connect, and test." },
      { title: "Verify", body: "Airflow and comfort confirmation." },
    ],
    faqs: [
      {
        question: "How long does a package unit replacement take?",
        answer:
          "Many residential swaps are same-day once equipment is on site ? access and electrical can extend that.",
      },
    ],
    relatedBlogSlugs: ["repair-vs-replace-hvac", "how-much-does-ac-replacement-cost-orange-county"],
    relatedFaqSlugs: ["pricing-and-quotes", "second-opinions"],
  },
  {
    slug: "ventilation",
    name: "Ventilation",
    shortName: "Ventilation",
    summary: "Fresh air flow that supports comfort and air quality.",
    description:
      "Proper ventilation matters as much as temperature. We evaluate airflow issues and recommend practical improvements for healthier indoor air.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Airflow diagnostics",
      "Practical upgrade recommendations",
      "Better comfort room to room",
    ],
    benefits: [
      "Fresher indoor air without overcomplicating",
      "Better system performance when airflow is right",
      "Fewer mystery humidity and odor issues",
    ],
    painPoints: [
      {
        title: "Stale air / lingering odors",
        body: "Sealed homes trap contaminants. Ventilation strategies help ? carefully.",
      },
      {
        title: "Moisture problems",
        body: "Bathrooms, laundry, and kitchens need paths for moisture to leave.",
      },
    ],
    process: [
      { title: "Airflow audit", body: "How air moves (or doesn?t) through the home." },
      { title: "Recommendations", body: "Only what solves the actual problem." },
      { title: "Install / adjust", body: "Fans, ducts, or balancing as needed." },
      { title: "Validate", body: "Comfort and air movement check." },
    ],
    faqs: [
      {
        question: "Is ventilation the same as air purification?",
        answer:
          "No. Ventilation moves air; purification treats it. Many homes need a mix ? we won?t stack gadgets without a reason.",
      },
    ],
    relatedBlogSlugs: ["indoor-air-quality-basics", "ductwork-problems-hot-cold-rooms"],
    relatedFaqSlugs: ["maintenance-plans"],
  },
  {
    slug: "ductwork",
    name: "Ductwork",
    shortName: "Ductwork",
    summary: "Sealed, balanced ducts that make your system actually perform.",
    description:
      "Leaky or poorly designed ducts waste money and comfort. We inspect, seal, repair, and redesign duct systems for better efficiency.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: ["Leak detection and sealing", "Balanced airflow", "Lower energy waste"],
    benefits: [
      "Even temperatures without buying a new condenser",
      "Less wasted conditioned air into attic/crawlspace",
      "Quieter, more efficient system runtime",
    ],
    painPoints: [
      {
        title: "New AC still can?t cool evenly",
        body: "If ducts are the bottleneck, a bigger outdoor unit won?t fix comfort.",
      },
      {
        title: "Dusty rooms near returns",
        body: "Leakage and poor filtration paths pull attic dust into living space.",
      },
      {
        title: "High bills + weak airflow",
        body: "Classic leaky-duct symptoms. We measure before we recommend.",
      },
    ],
    process: [
      { title: "Inspect", body: "Visual + performance clues across the run." },
      { title: "Prioritize", body: "Seal, repair, or redesign ? scoped honestly." },
      { title: "Execute", body: "Professional sealing and balancing." },
      { title: "Retest", body: "Confirm rooms actually improved." },
    ],
    faqs: [
      {
        question: "Should I replace ducts or just seal them?",
        answer:
          "Depends on material, layout, and damage. Many homes improve dramatically with sealing and balancing alone.",
      },
    ],
    relatedBlogSlugs: ["ductwork-problems-hot-cold-rooms", "indoor-air-quality-basics"],
    relatedFaqSlugs: ["second-opinions", "pricing-and-quotes"],
  },
  {
    slug: "insulation",
    name: "Insulation",
    shortName: "Insulation",
    summary: "Keep conditioned air where it belongs ? inside your home.",
    description:
      "Insulation upgrades pair powerfully with HVAC work. We help you improve comfort and reduce the load on your system.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Attic and relevant area assessments",
      "Comfort and efficiency gains",
      "Smarter long-term energy use",
    ],
    benefits: [
      "Less strain on AC and heat",
      "More stable indoor temperatures",
      "Better ROI when paired with HVAC upgrades",
    ],
    painPoints: [
      {
        title: "Attic is an oven",
        body: "Poor attic insulation makes every summer afternoon harder on your AC.",
      },
      {
        title: "Just upgraded HVAC, still uncomfortable",
        body: "Envelope issues can sabotage good equipment. Insulation closes the gap.",
      },
    ],
    process: [
      { title: "Assess", body: "Where heat enters and escapes." },
      { title: "Recommend", body: "Targeted upgrades ? not blanket upsells." },
      { title: "Install", body: "Clean, to-spec insulation work." },
      { title: "Measure comfort", body: "Confirm the home feels better." },
    ],
    faqs: [
      {
        question: "Should insulation come before a new AC?",
        answer:
          "Sometimes yes ? reducing load can change the right system size. We'll advise based on your home.",
      },
    ],
    relatedBlogSlugs: [
      "seasonal-hvac-maintenance-checklist",
      "how-much-does-ac-replacement-cost-orange-county",
    ],
    relatedFaqSlugs: ["pricing-and-quotes"],
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor Air Quality",
    shortName: "Air Quality",
    summary: "Cleaner air for your family ? filtration, purification, and more.",
    description:
      "From filters to purification solutions, we recommend IAQ improvements based on your home, not a one-size upsell.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Right-sized filtration options",
      "Allergy and comfort focused solutions",
      "Honest recommendations only",
    ],
    benefits: [
      "Fewer allergy triggers when filtration is right",
      "Less dust settling on surfaces",
      "No gadget pile-on ? just what works",
    ],
    painPoints: [
      {
        title: "Allergy season indoors",
        body: "Filters and airflow matter more than fancy boxes with blinking lights.",
      },
      {
        title: "Wildfire smoke weeks",
        body: "You need a plan before the sky turns orange ? not during.",
      },
      {
        title: "Upsold every IAQ product",
        body: "If it doesn?t solve your problem, we won?t recommend it.",
      },
    ],
    process: [
      { title: "Understand the goal", body: "Allergies, dust, odors, smoke ? pick the target." },
      { title: "Match the fix", body: "Filtration, ventilation, or purification as needed." },
      { title: "Install", body: "Compatible with your system?s static pressure." },
      { title: "Maintain", body: "Filter schedules that you?ll actually keep." },
    ],
    faqs: [
      {
        question: "Is a higher MERV filter always better?",
        answer:
          "Not if it chokes airflow. We match filtration to what your system can handle.",
      },
    ],
    relatedBlogSlugs: ["indoor-air-quality-basics", "seasonal-hvac-maintenance-checklist"],
    relatedFaqSlugs: ["maintenance-plans"],
  },
  {
    slug: "pool-heat-pump",
    name: "Pool Heat Pump",
    shortName: "Pool Heat Pump",
    summary: "Extend your swim season with efficient pool heating.",
    description:
      "Pool heat pumps can be a smart, efficient way to keep water comfortable. We help you evaluate sizing, install quality, and operating expectations.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Proper sizing guidance",
      "Efficient heating options",
      "Professional installation",
    ],
    benefits: [
      "Longer usable swim season",
      "More efficient than many gas heaters in mild climates",
      "Clear operating expectations before you buy",
    ],
    painPoints: [
      {
        title: "Pool too cold after sundown",
        body: "A correctly sized heat pump keeps evenings usable without shocking the bill.",
      },
      {
        title: "Old gas heater inefficiency",
        body: "If you?re tired of fuel costs, compare a heat pump path with real numbers.",
      },
    ],
    process: [
      { title: "Pool & climate assess", body: "Size, exposure, and usage patterns." },
      { title: "Equipment options", body: "Capacity and efficiency tiers." },
      { title: "Install", body: "Pad, electrical, plumbing connections." },
      { title: "Tune", body: "Setpoints and seasonal tips." },
    ],
    faqs: [
      {
        question: "Are pool heat pumps worth it in OC?",
        answer:
          "For many households yes ? especially with frequent evening use. We'll compare against your current heater honestly.",
      },
    ],
    relatedBlogSlugs: ["heat-pumps-for-southern-california"],
    relatedFaqSlugs: ["pricing-and-quotes", "financing-basics"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
