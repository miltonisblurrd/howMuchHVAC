export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  summary: string;
  description: string;
  highlights: string[];
  benefits: string[];
  painPoints: { title: string; body: string }[];
  process: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  popularServiceSlugs: string[];
  relatedBlogSlugs: string[];
  image: string;
};

const defaultProcess = [
  {
    title: "Local intake",
    body: "Tell us the issue, your neighborhood, and any prior quotes ? we schedule with your area in mind.",
  },
  {
    title: "On-site diagnosis",
    body: "We inspect, explain findings in plain English, and show options before any commitment.",
  },
  {
    title: "Clear pricing",
    body: "Repair, upgrade, or replace ? priced transparently so you know how much and why.",
  },
  {
    title: "Clean delivery",
    body: "Professional workmanship, respectful of your home, with documentation you can keep.",
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    slug: "orange-county",
    name: "Orange County",
    region: "Orange County, CA",
    summary:
      "Our home base. From coastal communities to inland neighborhoods, How Much? delivers honest HVAC across Orange County.",
    description:
      "Orange County is where How Much? is rooted. We know the housing stock ? from older tracts to newer high-efficiency builds ? and we know how summer peaks punish undersized or neglected systems. Whether you?re inland baking in the afternoon or coastal dealing with marine layer moisture, you get the same standard: diagnose honestly, present options, zero pressure.",
    highlights: [
      "Fast local response",
      "Familiarity with OC home types",
      "Trusted by families across the county",
    ],
    benefits: [
      "Technicians who already know OC permitting and common layouts",
      "Faster scheduling across the county corridor",
      "Second opinions on quotes from big national brands",
    ],
    painPoints: [
      {
        title: "Afternoon heat that your AC can?t beat",
        body: "Inland OC spikes expose weak capacity, dirty coils, and leaky ducts fast.",
      },
      {
        title: "Quotes that jump straight to replacement",
        body: "Bring us the number. We?ll tell you if it?s fair ? or fear-based.",
      },
      {
        title: "Different comfort in every room",
        body: "Common in multi-story OC homes. Often ducts or zoning ? not a new condenser alone.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you serve all of Orange County?",
        answer:
          "Yes ? from the coast to inland cities. If you?re unsure, call the direct line and we?ll confirm coverage and timing.",
      },
      {
        question: "How quickly can you respond in OC?",
        answer:
          "OC is our home base, so we typically offer the fastest availability here ? especially for diagnostics in peak season.",
      },
    ],
    popularServiceSlugs: [
      "ac-repair-installation",
      "heat-pump",
      "ductwork",
      "ductless-mini-split",
    ],
    relatedBlogSlugs: [
      "how-much-does-ac-replacement-cost-orange-county",
      "repair-vs-replace-hvac",
      "signs-your-ac-is-failing",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    region: "Los Angeles County, CA",
    summary:
      "Transparent HVAC for LA homes that are tired of runarounds and inflated quotes. Clear options. Fair pricing.",
    description:
      "Los Angeles homeowners deal with everything from valley heat to older duplexes with creative ductwork. How Much? brings the same integrity-first process: no mystery fees, no high-pressure ?today only? pitches ? just diagnostics and options that respect your home and your budget.",
    highlights: [
      "Second opinions welcome",
      "Residential specialists",
      "Straightforward communication",
    ],
    benefits: [
      "Honest read on big-company replacement quotes",
      "Solutions for varied LA housing types",
      "Clear communication from estimate to install",
    ],
    painPoints: [
      {
        title: "Runaround from the last company",
        body: "Missed windows, vague answers, surprise add-ons ? we reverse that pattern.",
      },
      {
        title: "Inflated ?emergency? pricing",
        body: "Heat waves bring bad actors. Get a second opinion before you panic-buy.",
      },
      {
        title: "Older home, modern comfort needs",
        body: "We design around real constraints ? electrical, ducts, space ? not brochure fantasies.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you only do residential in LA?",
        answer:
          "Our focus is residential and light residential-adjacent work. Call us with the address and scope and we?ll confirm fit.",
      },
    ],
    popularServiceSlugs: [
      "ac-repair-installation",
      "heating",
      "indoor-air-quality",
      "ductwork",
    ],
    relatedBlogSlugs: ["repair-vs-replace-hvac", "second-opinion-hvac-quotes", "indoor-air-quality-basics"],
    image:
      "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "san-diego",
    name: "San Diego",
    region: "San Diego County, CA",
    summary:
      "Coastal comfort done right. We bring the same integrity-first HVAC approach to San Diego homeowners.",
    description:
      "San Diego?s mild climate is perfect for efficient systems ? and brutal on neglected ones when Santa Ana winds or heat spikes hit. We help SD homeowners choose heat pumps, ductless, and repairs that match coastal realities, with pricing you can trust.",
    highlights: [
      "Heat pump and coastal-ready systems",
      "Honest diagnostics",
      "Options without pressure",
    ],
    benefits: [
      "Guidance built for coastal / mild-climate efficiency",
      "Corrosion-aware equipment conversations",
      "Transparent upgrade paths",
    ],
    painPoints: [
      {
        title: "Salt air aging outdoor units",
        body: "Coastal installs need the right placement and expectations. We?ll be straight about lifespan.",
      },
      {
        title: "Underperforming ?mild climate? systems",
        body: "Mild most days doesn?t mean your aging unit can handle the spikes.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Are heat pumps a good fit in San Diego?",
        answer:
          "Often yes. We?ll size and compare against your current setup so the numbers make sense.",
      },
    ],
    popularServiceSlugs: ["heat-pump", "ductless-mini-split", "ac-repair-installation"],
    relatedBlogSlugs: ["heat-pumps-for-southern-california", "ductless-mini-splits-explained"],
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "long-beach",
    name: "Long Beach",
    region: "Los Angeles County, CA",
    summary:
      "Reliable A/C, heating, and air quality services for Long Beach homes and families.",
    description:
      "Long Beach mixes coastal moisture with dense neighborhoods and a wide range of home ages. How Much? helps LB families stay comfortable with honest diagnostics, clear options, and service that respects your time.",
    highlights: ["Local availability", "Clear pricing", "Family-first service"],
    benefits: [
      "Responsive scheduling for LB and nearby cities",
      "IAQ and humidity-aware recommendations",
      "No-pressure repair vs replace guidance",
    ],
    painPoints: [
      {
        title: "Sticky indoor air",
        body: "Coastal humidity plus weak airflow feels worse than the thermostat suggests.",
      },
      {
        title: "AC struggling in multi-family / older layouts",
        body: "We diagnose the system you have ? not the one a brochure assumes.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Can you do a second opinion in Long Beach?",
        answer: "Absolutely. Bring the quote and any photos ? clarity is the product.",
      },
    ],
    popularServiceSlugs: ["ac-repair-installation", "indoor-air-quality", "ductwork"],
    relatedBlogSlugs: ["indoor-air-quality-basics", "second-opinion-hvac-quotes"],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "anaheim",
    name: "Anaheim",
    region: "Orange County, CA",
    summary:
      "From repairs to full installs, Anaheim homeowners get transparent HVAC guidance they can trust.",
    description:
      "Anaheim?s inland heat puts real stress on cooling systems. Whether you need a quick repair or a full replacement with Good / Better / Best options, How Much? keeps the process transparent and the sales pressure at zero.",
    highlights: ["Licensed & insured", "Quality equipment", "No pressure sales"],
    benefits: [
      "Experience with inland heat-load realities",
      "Clear replacement packages when needed",
      "Maintenance plans that prevent August emergencies",
    ],
    painPoints: [
      {
        title: "AC can?t keep up after 2pm",
        body: "Classic inland symptom. We check capacity, airflow, and ducts before pushing equipment.",
      },
      {
        title: "Repeated service calls every summer",
        body: "If you?re patching the same system yearly, we?ll show the repair-vs-replace math.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you install in Anaheim same week?",
        answer:
          "Often yes in shoulder seasons; peak heat depends on equipment availability. Call direct for current lead times.",
      },
    ],
    popularServiceSlugs: ["ac-repair-installation", "package-unit", "ductwork"],
    relatedBlogSlugs: [
      "how-much-does-ac-replacement-cost-orange-county",
      "signs-your-ac-is-failing",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "irvine",
    name: "Irvine",
    region: "Orange County, CA",
    summary:
      "Efficient systems and clean installs for Irvine homes that expect professionalism.",
    description:
      "Irvine homeowners expect clean workmanship and modern efficiency. We deliver high-efficiency installs, ductless solutions for ADUs, and maintenance plans ? with communication that matches a professional standard.",
    highlights: [
      "High-efficiency options",
      "Detail-focused installs",
      "Respect for your home",
    ],
    benefits: [
      "ADU / bonus-room ductless expertise",
      "Quiet, efficient equipment options",
      "Documented scopes and tidy job sites",
    ],
    painPoints: [
      {
        title: "New ADU needs its own climate control",
        body: "Ductless mini-splits are often the cleanest answer ? designed for looks and performance.",
      },
      {
        title: "Want efficiency without a sales circus",
        body: "We?ll show operating expectations without the theatrics.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Can you coordinate around HOA rules?",
        answer:
          "We can work with placement constraints and documentation needs ? share your guidelines early.",
      },
    ],
    popularServiceSlugs: ["ductless-mini-split", "heat-pump", "ac-repair-installation"],
    relatedBlogSlugs: ["ductless-mini-splits-explained", "heat-pumps-for-southern-california"],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "santa-ana",
    name: "Santa Ana",
    region: "Orange County, CA",
    summary:
      "Honest HVAC service for Santa Ana ? diagnostics, repairs, and replacements explained clearly.",
    description:
      "Santa Ana families deserve straight answers in plain language. How Much? focuses on fair diagnostics, bilingual-friendly communication when needed, and options that fit real budgets ? not inflated packages.",
    highlights: ["Bilingual-friendly team", "Fair quotes", "Reliable follow-through"],
    benefits: [
      "Clear explanations without jargon overload",
      "Repair-first mindset when it saves you money",
      "Respectful service for busy households",
    ],
    painPoints: [
      {
        title: "Don?t understand the last tech?s explanation",
        body: "We?ll re-diagnose and translate findings into decisions you can make confidently.",
      },
      {
        title: "Budget is real ? replacement isn?t automatic",
        body: "Good / Better / Best only when replacement is truly on the table.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Can you review another company?s quote in Santa Ana?",
        answer: "Yes ? second opinions are a core part of how we work.",
      },
    ],
    popularServiceSlugs: ["ac-repair-installation", "heating", "ductwork"],
    relatedBlogSlugs: ["second-opinion-hvac-quotes", "repair-vs-replace-hvac"],
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "huntington-beach",
    name: "Huntington Beach",
    region: "Orange County, CA",
    summary:
      "Coastal comfort solutions for Huntington Beach homes dealing with heat, humidity, and aging systems.",
    description:
      "Huntington Beach living means salt air, marine layer, and the occasional heat spike. We help HB homeowners with coastal-aware equipment choices, IAQ options, and transparent upgrades that don?t feel like a hustle.",
    highlights: ["Coastal system know-how", "IAQ options", "Transparent upgrades"],
    benefits: [
      "Coastal placement and longevity guidance",
      "Humidity / air quality aware recommendations",
      "Clean, discreet installs",
    ],
    painPoints: [
      {
        title: "Outdoor unit corroding faster near the coast",
        body: "We?ll talk realistic lifespan and placement ? not pretend salt air doesn?t exist.",
      },
      {
        title: "Indoor air feels damp or stale",
        body: "Ventilation and filtration plans that match coastal living.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you service beach-adjacent homes?",
        answer: "Yes. Share access notes (gates, alleys) when you book so we arrive ready.",
      },
    ],
    popularServiceSlugs: ["heat-pump", "indoor-air-quality", "ac-repair-installation"],
    relatedBlogSlugs: ["indoor-air-quality-basics", "heat-pumps-for-southern-california"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "costa-mesa",
    name: "Costa Mesa",
    region: "Orange County, CA",
    summary:
      "Professional HVAC repair and installation for Costa Mesa homeowners who want straight answers.",
    description:
      "Costa Mesa sits between coastal and inland patterns ? systems see both. How Much? delivers consistent diagnostics, clear timelines, and workmanship you?d be comfortable recommending to a neighbor.",
    highlights: ["Same integrity, every job", "Clear timelines", "Quality workmanship"],
    benefits: [
      "Predictable communication",
      "Solid repair craftsmanship",
      "Upgrade options without pressure",
    ],
    painPoints: [
      {
        title: "Tired of no-shows and vague ETAs",
        body: "We set expectations and keep you updated ? operations is part of the product.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Can I book maintenance in Costa Mesa?",
        answer: "Yes ? seasonal tune-ups are available. Ask about reminders via the client portal demo.",
      },
    ],
    popularServiceSlugs: ["ac-repair-installation", "heating", "ductless-mini-split"],
    relatedBlogSlugs: ["seasonal-hvac-maintenance-checklist", "repair-vs-replace-hvac"],
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "fullerton",
    name: "Fullerton",
    region: "Orange County, CA",
    summary:
      "Trusted heating and cooling for Fullerton families ? fair options, lasting relationships.",
    description:
      "Fullerton families come back to How Much? because the process feels fair: honest findings, fair pricing, and techs who treat the house like it?s theirs. From tune-ups to full system work, we keep it straightforward.",
    highlights: ["Family-owned values", "Licensed technicians", "Honest recommendations"],
    benefits: [
      "Long-term maintenance relationships",
      "Family-friendly scheduling",
      "Clear education for first-time homeowners",
    ],
    painPoints: [
      {
        title: "First major HVAC decision as a homeowner",
        body: "We?ll slow down and explain ? no shame questions, no pressure.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you help with furnace and AC both?",
        answer: "Yes ? heating and cooling under one transparent process.",
      },
    ],
    popularServiceSlugs: ["heating", "gas-furnace", "ac-repair-installation"],
    relatedBlogSlugs: ["seasonal-hvac-maintenance-checklist", "repair-vs-replace-hvac"],
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "newport-beach",
    name: "Newport Beach",
    region: "Orange County, CA",
    summary:
      "Premium-feeling service without the games. Newport Beach HVAC with clarity and care.",
    description:
      "Newport Beach clients want discretion, clean work, and equipment that matches the home. You still get How Much? transparency ? no inflated ?luxury tax,? just excellent workmanship and clear options.",
    highlights: ["Discreet, clean work", "Top-tier equipment options", "White-glove communication"],
    benefits: [
      "High-end equipment paths when they make sense",
      "Quiet install practices",
      "Direct access communication",
    ],
    painPoints: [
      {
        title: "Don?t want a circus in the driveway",
        body: "We run organized job sites and communicate timing precisely.",
      },
      {
        title: "Want the best ? not the most expensive upsell",
        body: "?Best? means right-sized for your home. We?ll prove it.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Can you work around privacy / access preferences?",
        answer: "Yes ? note gate codes, preferred entrances, and quiet hours when booking.",
      },
    ],
    popularServiceSlugs: ["heat-pump", "ductless-mini-split", "indoor-air-quality"],
    relatedBlogSlugs: ["heat-pumps-for-southern-california", "ductless-mini-splits-explained"],
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "garden-grove",
    name: "Garden Grove",
    region: "Orange County, CA",
    summary:
      "Dependable HVAC for Garden Grove ? from tune-ups to full system replacements.",
    description:
      "Garden Grove homeowners get dependable How Much? service: maintenance that prevents breakdowns, repairs explained clearly, and replacements only when the math says so.",
    highlights: ["Maintenance ready", "Repair expertise", "Transparent pricing"],
    benefits: [
      "Proactive maintenance options",
      "Strong diagnostic repair work",
      "Fair replacement packages",
    ],
    painPoints: [
      {
        title: "System nickeled-and-dimed every season",
        body: "We?ll look at the whole picture and stop the surprise cycle.",
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: "Do you offer maintenance plans in Garden Grove?",
        answer: "Yes ? ask about seasonal visits when you book.",
      },
    ],
    popularServiceSlugs: ["ac-repair-installation", "heating", "ductwork"],
    relatedBlogSlugs: ["seasonal-hvac-maintenance-checklist", "signs-your-ac-is-failing"],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
];

export function getArea(slug: string) {
  return serviceAreas.find((a) => a.slug === slug);
}
