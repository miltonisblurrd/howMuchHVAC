export type ServiceArea = {
  slug: string;
  name: string;
  region: "Orange County, CA" | "Los Angeles County, CA" | "San Diego County, CA";
  regionKey: "oc" | "la" | "sd";
  summary: string;
  description: string;
  localStory: string;
  climateNote: string;
  housingNote: string;
  highlights: { title: string; body: string }[];
  benefits: string[];
  painPoints: { title: string; body: string }[];
  process: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  popularServiceSlugs: string[];
  relatedBlogSlugs: string[];
  image: string;
  isHub?: boolean;
};

type CitySeed = {
  slug: string;
  name: string;
  regionKey: "oc" | "la" | "sd";
  vibe: string;
  climate: string;
  housing: string;
  featuredPain?: string;
  image?: string;
  isHub?: boolean;
};

const regionLabel = {
  oc: "Orange County, CA",
  la: "Los Angeles County, CA",
  sd: "San Diego County, CA",
} as const;

const regionImages = {
  oc: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  la: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  sd: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
} as const;

const defaultProcess = [
  {
    title: "Local Intake",
    body: "Tell us the issue, your neighborhood, and any prior quotes. We schedule with your city and traffic patterns in mind.",
  },
  {
    title: "On-Site Diagnosis",
    body: "We inspect, explain findings in plain English, and show options before any commitment.",
  },
  {
    title: "Clear Pricing",
    body: "Repair, upgrade, or replace — priced transparently so you know how much and why.",
  },
  {
    title: "Clean Delivery",
    body: "Professional workmanship, respectful of your home, with documentation you can keep in your client portal.",
  },
];

function makeCity(seed: CitySeed): ServiceArea {
  const region = regionLabel[seed.regionKey];
  const hub = Boolean(seed.isHub);

  return {
    slug: seed.slug,
    name: seed.name,
    region,
    regionKey: seed.regionKey,
    isHub: hub,
    summary: hub
      ? `Family-owned HVAC across ${seed.name} — honest diagnostics, fair options, and clear pricing for homeowners who want answers, not pressure.`
      : `Trusted HVAC in ${seed.name}: repair, install, maintenance, and second opinions from How Much? Air & Home Improvements.`,
    description: hub
      ? `How Much? serves ${seed.name} with licensed, insured HVAC work built around integrity. ${seed.vibe} Whether you need a same-day diagnosis, a second look at a big quote, or a full system replacement, you get options first — then a deal that makes sense for your home and budget.`
      : `Looking for HVAC in ${seed.name}? How Much? Air & Home Improvements is the family-owned team homeowners call when they want honest answers. ${seed.vibe} We diagnose carefully, explain every option in plain English, and never push a replacement you do not need.`,
    localStory: `Homeowners in ${seed.name} deal with ${seed.climate.toLowerCase()} On top of that, ${seed.housing.toLowerCase()} Andy and the How Much? crew take the time to understand your house, your comfort goals, and your budget — then build a plan you can actually trust.`,
    climateNote: seed.climate,
    housingNote: seed.housing,
    highlights: [
      {
        title: `Clear Scheduling In ${seed.name}`,
        body: `We plan visits around local traffic and your calendar, so you know when we are coming and what happens next — no vague “sometime this week” windows.`,
      },
      {
        title: "Options First, Always",
        body: "Repair, improve, or replace — we walk you through what each path means for comfort, cost, and longevity before you decide.",
      },
      {
        title: "Licensed Crew In Your Home",
        body: "Family-owned, insured, and respectful of your space. You get real technicians who explain findings in plain English.",
      },
    ],
    benefits: [
      `Technicians who understand ${seed.name} homes and common system layouts`,
      "Transparent pricing before work begins — no mystery fees",
      "Second opinions on scary quotes from big national brands",
      "Clean job sites, startup checks, and paperwork you can keep",
      "A client portal path so you can track status, messages, and documents",
      "Direct access to Andy when you need a straight answer fast",
    ],
    painPoints: [
      {
        title: seed.featuredPain || "AC That Cannot Keep Up When It Matters",
        body: `In ${seed.name}, weak cooling shows up fast. We find whether it is refrigerant, airflow, ducts, sizing, or a tired system — before anyone talks replacement.`,
      },
      {
        title: "A Quote That Jumped Straight To Full Replacement",
        body: "Bring us the number. We will tell you if it is fair — or fear-based — and what lower-cost paths still make sense.",
      },
      {
        title: "Uneven Rooms And Mystery Hot Spots",
        body: "Often ducts, returns, zoning, or insulation — not just a bigger condenser. We diagnose the whole comfort picture.",
      },
      {
        title: "Breakdowns During Peak Heat Or Cold Snaps",
        body: `When ${seed.name} weather spikes, you need a team that answers, explains, and gets you comfortable without the runaround.`,
      },
    ],
    process: defaultProcess,
    faqs: [
      {
        question: `Do you serve ${seed.name}?`,
        answer: `Yes. How Much? provides HVAC repair, installation, maintenance, and second opinions in ${seed.name} and nearby ${region.replace(", CA", "")} communities. Call the direct line if you want to confirm timing for your neighborhood.`,
      },
      {
        question: `How fast can you get to ${seed.name}?`,
        answer: `Availability depends on season and demand, but we prioritize clear scheduling and honest ETAs. If you need help today, call Andy direct — we will tell you what is realistic.`,
      },
      {
        question: `Can I get a second opinion on an HVAC quote in ${seed.name}?`,
        answer:
          "Absolutely. Bring the proposal. We will walk the system, explain what is necessary versus optional, and help you avoid overbuying.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. How Much? Air & Home Improvements is licensed and insured in California (CA Lic #107-3814), with 15+ years of experience serving Southern California families.",
      },
      {
        question: "What happens after I request a quote online?",
        answer:
          "Your request is saved to our lead system and our team follows up with next steps. You will also get a path into the client portal so you can track your visit, messages, and documents in one place.",
      },
    ],
    popularServiceSlugs: [
      "ac-repair-installation",
      "heating",
      "ductless-mini-split",
      "ductwork",
      "heat-pump",
    ],
    relatedBlogSlugs: [
      "how-much-does-ac-replacement-cost-orange-county",
      "second-opinion-hvac-quotes",
      "seasonal-hvac-maintenance-checklist",
      "signs-your-ac-is-failing",
    ],
    image: seed.image || regionImages[seed.regionKey],
  };
}

const citySeeds: CitySeed[] = [
  // Orange County hubs + majors
  {
    slug: "orange-county",
    name: "Orange County",
    regionKey: "oc",
    isHub: true,
    vibe: "This is our home base — from coastal marine layer mornings to inland afternoon heat.",
    climate: "Coastal humidity near the beach and sharper inland heat spikes through summer.",
    housing: "older tracts, newer high-efficiency builds, and lots of two-story homes with uneven upstairs comfort.",
    featuredPain: "Afternoon Heat Your AC Cannot Beat",
  },
  {
    slug: "anaheim",
    name: "Anaheim",
    regionKey: "oc",
    vibe: "Anaheim families need systems that survive summer peaks and keep kids comfortable after school.",
    climate: "Warm inland days and busy neighborhoods where downtime is not an option.",
    housing: "a mix of mid-century homes, remodeled properties, and systems that have been patched for years.",
  },
  {
    slug: "irvine",
    name: "Irvine",
    regionKey: "oc",
    vibe: "Irvine homeowners expect clean workmanship, clear communication, and systems that match modern efficiency goals.",
    climate: "Hot, dry stretches that punish undersized or poorly maintained systems.",
    housing: "planned communities, tighter envelopes, and many homes that benefit from precise sizing and duct evaluation.",
  },
  {
    slug: "santa-ana",
    name: "Santa Ana",
    regionKey: "oc",
    vibe: "In Santa Ana, we focus on practical fixes first and big replacements only when the math is honest.",
    climate: "Warm summers and older equipment that gets pushed hard.",
    housing: "established neighborhoods with a wide range of system ages and duct conditions.",
  },
  {
    slug: "huntington-beach",
    name: "Huntington Beach",
    regionKey: "oc",
    vibe: "Coastal comfort matters here — salt air, marine layer, and homes that need reliable year-round HVAC.",
    climate: "Marine layer moisture and ocean air that can be tough on outdoor equipment.",
    housing: "coastal homes, remodeled properties, and systems that need corrosion-aware care.",
  },
  {
    slug: "costa-mesa",
    name: "Costa Mesa",
    regionKey: "oc",
    vibe: "Costa Mesa sits between coast and inland heat — your system has to handle both.",
    climate: "Mild mornings that turn into warm afternoons, especially inland of the beach cities.",
    housing: "a blend of older homes and updated properties with mixed duct quality.",
  },
  {
    slug: "fullerton",
    name: "Fullerton",
    regionKey: "oc",
    vibe: "Fullerton homeowners want straightforward service from a team that explains the work before it starts.",
    climate: "Warm North OC summers that expose weak condensers and dirty coils fast.",
    housing: "family neighborhoods with a lot of aging systems ready for an honest evaluation.",
  },
  {
    slug: "newport-beach",
    name: "Newport Beach",
    regionKey: "oc",
    vibe: "In Newport Beach, careful install quality and respect for the home matter as much as the equipment.",
    climate: "Coastal conditions with marine air and humidity swings.",
    housing: "higher-end and remodeled homes where clean workmanship is non-negotiable.",
  },
  {
    slug: "garden-grove",
    name: "Garden Grove",
    regionKey: "oc",
    vibe: "Garden Grove is about dependable comfort — tune-ups, repairs, and replacements done without games.",
    climate: "Central OC heat that rewards proactive maintenance.",
    housing: "practical family homes where surprise repair cycles get expensive fast.",
  },
  {
    slug: "orange",
    name: "Orange",
    regionKey: "oc",
    vibe: "From Old Towne to the hills, Orange homeowners get the same How Much? standard: diagnose, explain, decide together.",
    climate: "Warm inland pockets and cooler evenings that stress both cooling and heating seasons.",
    housing: "historic and modern homes side by side, each with different duct and equipment needs.",
  },
  {
    slug: "tustin",
    name: "Tustin",
    regionKey: "oc",
    vibe: "Tustin families call us for clear options — especially when another company pushed a full system too fast.",
    climate: "Inland warmth with busy summer cooling demand.",
    housing: "established tracts and newer developments with varied system efficiency.",
  },
  {
    slug: "mission-viejo",
    name: "Mission Viejo",
    regionKey: "oc",
    vibe: "Mission Viejo homes need reliable upstairs comfort and systems that keep up on hotter South OC days.",
    climate: "Warmer inland South County afternoons.",
    housing: "multi-story planned-community homes where duct balance and returns matter.",
  },
  {
    slug: "lake-forest",
    name: "Lake Forest",
    regionKey: "oc",
    vibe: "Lake Forest service means honest diagnostics and installs that respect your time and property.",
    climate: "Warm, dry stretches common across South Orange County.",
    housing: "family neighborhoods with a mix of original and upgraded HVAC systems.",
  },
  {
    slug: "yorba-linda",
    name: "Yorba Linda",
    regionKey: "oc",
    vibe: "Yorba Linda homeowners expect thorough explanations and equipment that matches larger, sun-exposed homes.",
    climate: "Hotter inland North OC conditions.",
    housing: "larger lots and homes that often need careful load calculation, not guesswork.",
  },
  {
    slug: "brea",
    name: "Brea",
    regionKey: "oc",
    vibe: "In Brea, we keep it simple: show up, diagnose right, and give you options you can understand.",
    climate: "Warm North County summers.",
    housing: "suburban homes with aging condensers and duct systems that need a real look.",
  },
  {
    slug: "buena-park",
    name: "Buena Park",
    regionKey: "oc",
    vibe: "Buena Park families want affordable comfort without the scare tactics.",
    climate: "Warm days that push older AC units hard.",
    housing: "practical homes where repair-versus-replace decisions need to be honest.",
  },
  {
    slug: "westminster",
    name: "Westminster",
    regionKey: "oc",
    vibe: "Westminster service from How Much? means clear communication and clean work.",
    climate: "Central OC warmth with seasonal humidity swings near the coast.",
    housing: "established neighborhoods with a wide range of system ages.",
  },
  {
    slug: "fountain-valley",
    name: "Fountain Valley",
    regionKey: "oc",
    vibe: "Fountain Valley homeowners get careful diagnostics and installs that do not disrupt the whole house.",
    climate: "Mild-to-warm coastal-influenced weather.",
    housing: "family homes that benefit from maintenance before peak season hits.",
  },
  {
    slug: "cypress",
    name: "Cypress",
    regionKey: "oc",
    vibe: "Cypress is close enough for quick local service and careful follow-through.",
    climate: "Warm summers typical of Northwest OC.",
    housing: "suburban homes where quiet, clean HVAC work matters.",
  },
  {
    slug: "la-habra",
    name: "La Habra",
    regionKey: "oc",
    vibe: "La Habra homeowners call us when they want a straight answer on repair or replace.",
    climate: "Warm North OC conditions.",
    housing: "established homes with systems that may need duct or airflow attention.",
  },
  {
    slug: "placentia",
    name: "Placentia",
    regionKey: "oc",
    vibe: "In Placentia, we focus on dependable comfort and no-pressure recommendations.",
    climate: "Warm inland days through summer.",
    housing: "family neighborhoods with mixed equipment ages.",
  },
  {
    slug: "laguna-niguel",
    name: "Laguna Niguel",
    regionKey: "oc",
    vibe: "Laguna Niguel homes need coastal-aware installs and careful attention to upstairs comfort.",
    climate: "Coastal influence with warmer inland hills.",
    housing: "multi-level homes common across South County planned communities.",
  },
  {
    slug: "san-clemente",
    name: "San Clemente",
    regionKey: "oc",
    vibe: "San Clemente service means respecting coastal homes and keeping systems reliable year-round.",
    climate: "Ocean air, marine layer, and mild winters with warm spells.",
    housing: "coastal properties that need clean, careful outdoor equipment care.",
  },
  {
    slug: "san-juan-capistrano",
    name: "San Juan Capistrano",
    regionKey: "oc",
    vibe: "In San Juan Capistrano, we pair old-fashioned honesty with modern HVAC know-how.",
    climate: "South County warmth with coastal influence.",
    housing: "a mix of older character homes and newer builds.",
  },
  {
    slug: "aliso-viejo",
    name: "Aliso Viejo",
    regionKey: "oc",
    vibe: "Aliso Viejo homeowners want efficient systems and technicians who communicate clearly.",
    climate: "Warm South OC afternoons.",
    housing: "planned-community homes where proper airflow and returns are critical.",
  },
  {
    slug: "dana-point",
    name: "Dana Point",
    regionKey: "oc",
    vibe: "Dana Point comfort means coastal durability and installs done with care.",
    climate: "Marine air and humidity that can stress outdoor units.",
    housing: "coastal homes that benefit from quality equipment and clean workmanship.",
  },
  {
    slug: "rancho-santa-margarita",
    name: "Rancho Santa Margarita",
    regionKey: "oc",
    vibe: "RSM homes often need strong cooling capacity and honest guidance on aging systems.",
    climate: "Warmer inland South County heat.",
    housing: "family homes and multi-story layouts with upstairs comfort challenges.",
  },
  {
    slug: "seal-beach",
    name: "Seal Beach",
    regionKey: "oc",
    vibe: "Seal Beach service is local, careful, and built for coastal living.",
    climate: "Cool marine mornings and salty coastal air.",
    housing: "beach-adjacent homes that need respectful, tidy HVAC work.",
  },
  {
    slug: "los-alamitos",
    name: "Los Alamitos",
    regionKey: "oc",
    vibe: "Los Alamitos homeowners get clear diagnostics and fair pricing from a family-owned crew.",
    climate: "Northwest OC warmth with coastal influence.",
    housing: "compact neighborhoods where clean, quiet installs matter.",
  },

  // Los Angeles County
  {
    slug: "los-angeles",
    name: "Los Angeles",
    regionKey: "la",
    isHub: true,
    vibe: "LA is huge — we serve major communities with the same honest process, not a different story on every block.",
    climate: "Microclimates from basin heat to cooler coastal pockets.",
    housing: "everything from older bungalows to modern builds, each needing a real load and duct look.",
    featuredPain: "Quotes That Ignore How Your Specific LA Home Actually Runs",
  },
  {
    slug: "long-beach",
    name: "Long Beach",
    regionKey: "la",
    vibe: "Long Beach homeowners trust How Much? for coastal-aware service and straight talk.",
    climate: "Coastal humidity and warm spells that push aging systems.",
    housing: "a wide mix of homes and buildings with varied duct and equipment conditions.",
  },
  {
    slug: "pasadena",
    name: "Pasadena",
    regionKey: "la",
    vibe: "Pasadena homes need careful diagnostics — especially older properties with unique layouts.",
    climate: "Warm San Gabriel Valley days and cooler nights.",
    housing: "historic and remodeled homes where one-size HVAC advice falls short.",
  },
  {
    slug: "glendale",
    name: "Glendale",
    regionKey: "la",
    vibe: "In Glendale, we focus on clear options for hills, flats, and everything in between.",
    climate: "Warm valley conditions with elevation changes that affect comfort.",
    housing: "multi-level homes and older systems that need honest evaluation.",
  },
  {
    slug: "burbank",
    name: "Burbank",
    regionKey: "la",
    vibe: "Burbank families want reliable cooling and technicians who show up prepared.",
    climate: "Warm San Fernando Valley-adjacent summers.",
    housing: "suburban homes with high summer runtime on AC equipment.",
  },
  {
    slug: "torrance",
    name: "Torrance",
    regionKey: "la",
    vibe: "Torrance service means practical South Bay comfort without the sales theater.",
    climate: "Coastal-influenced weather with warm inland pockets.",
    housing: "family homes that benefit from maintenance and clear repair paths.",
  },
  {
    slug: "santa-monica",
    name: "Santa Monica",
    regionKey: "la",
    vibe: "Santa Monica homes deserve careful installs and equipment that handles coastal air.",
    climate: "Cool marine influence with humidity and salt air considerations.",
    housing: "coastal and remodeled properties where workmanship quality shows.",
  },
  {
    slug: "culver-city",
    name: "Culver City",
    regionKey: "la",
    vibe: "Culver City homeowners call us for modern comfort fixes explained without jargon.",
    climate: "Mild-to-warm Westside conditions.",
    housing: "updated homes and ADU-style projects that often need ductless or right-sized systems.",
  },
  {
    slug: "inglewood",
    name: "Inglewood",
    regionKey: "la",
    vibe: "In Inglewood, we keep the process simple: diagnose, explain, and price it honestly.",
    climate: "Warm basin days that put real load on cooling systems.",
    housing: "established homes where repair-versus-replace needs a fair look.",
  },
  {
    slug: "downey",
    name: "Downey",
    regionKey: "la",
    vibe: "Downey families want dependable HVAC and a team that respects their time.",
    climate: "Warm Southeast LA summers.",
    housing: "suburban homes with systems that often need airflow and maintenance attention.",
  },
  {
    slug: "whittier",
    name: "Whittier",
    regionKey: "la",
    vibe: "Whittier service from How Much? is straightforward and homeowner-first.",
    climate: "Warm inland-leaning conditions.",
    housing: "family neighborhoods with a mix of original and upgraded HVAC.",
  },
  {
    slug: "norwalk",
    name: "Norwalk",
    regionKey: "la",
    vibe: "Norwalk homeowners get clear recommendations and clean work from a family-owned crew.",
    climate: "Warm summers typical of Southeast LA County.",
    housing: "practical homes where surprise repair costs add up quickly.",
  },
  {
    slug: "west-covina",
    name: "West Covina",
    regionKey: "la",
    vibe: "In West Covina, heat is real — your AC plan should be too.",
    climate: "Hotter San Gabriel Valley summers.",
    housing: "homes that often need stronger cooling capacity and honest duct checks.",
  },
  {
    slug: "pomona",
    name: "Pomona",
    regionKey: "la",
    vibe: "Pomona service means helping you stay comfortable when inland heat hits hard.",
    climate: "Hot inland days that expose weak systems fast.",
    housing: "varied housing stock with aging outdoor units and duct challenges.",
  },
  {
    slug: "el-monte",
    name: "El Monte",
    regionKey: "la",
    vibe: "El Monte homeowners trust us for fair diagnostics and no-pressure options.",
    climate: "Warm San Gabriel Valley conditions.",
    housing: "established homes that benefit from maintenance and clear repair planning.",
  },
  {
    slug: "carson",
    name: "Carson",
    regionKey: "la",
    vibe: "Carson families call How Much? when they want reliable HVAC without the runaround.",
    climate: "Warm South Bay / basin mix.",
    housing: "suburban homes with mixed system ages and duct conditions.",
  },
  {
    slug: "lakewood",
    name: "Lakewood",
    regionKey: "la",
    vibe: "Lakewood is classic family-home HVAC — tune it, fix it, or replace it for the right reasons.",
    climate: "Warm summers with steady cooling demand.",
    housing: "tract homes where duct sealing and returns often make a big comfort difference.",
  },
  {
    slug: "cerritos",
    name: "Cerritos",
    regionKey: "la",
    vibe: "Cerritos homeowners expect tidy work and clear communication from start to finish.",
    climate: "Warm Southeast LA County weather.",
    housing: "well-kept family homes that deserve careful, respectful service.",
  },
  {
    slug: "redondo-beach",
    name: "Redondo Beach",
    regionKey: "la",
    vibe: "Redondo Beach comfort means coastal-aware equipment care and clean installs.",
    climate: "Marine layer and ocean air.",
    housing: "beach-area homes and remodels where quality workmanship matters.",
  },
  {
    slug: "manhattan-beach",
    name: "Manhattan Beach",
    regionKey: "la",
    vibe: "In Manhattan Beach, we bring careful craftsmanship and honest recommendations.",
    climate: "Cool coastal climate with humidity and salt exposure.",
    housing: "coastal properties that need precise, tidy HVAC work.",
  },
  {
    slug: "hawthorne",
    name: "Hawthorne",
    regionKey: "la",
    vibe: "Hawthorne service is about getting you comfortable fast — with options you can trust.",
    climate: "Warm basin conditions.",
    housing: "practical homes where fair repair pricing makes a real difference.",
  },
  {
    slug: "bellflower",
    name: "Bellflower",
    regionKey: "la",
    vibe: "Bellflower homeowners get family-owned HVAC with clear next steps.",
    climate: "Warm Southeast LA summers.",
    housing: "suburban homes with aging systems ready for an honest evaluation.",
  },
  {
    slug: "santa-clarita",
    name: "Santa Clarita",
    regionKey: "la",
    vibe: "Santa Clarita heat is no joke — systems need proper sizing and honest maintenance plans.",
    climate: "Hotter valley summers and cooler winters.",
    housing: "newer communities and larger homes that need correct load calculations.",
  },
  {
    slug: "glendora",
    name: "Glendora",
    regionKey: "la",
    vibe: "Glendora homeowners call us for foothill comfort and straight answers.",
    climate: "Warm San Gabriel Valley days.",
    housing: "family homes with a mix of original and upgraded HVAC systems.",
  },
  {
    slug: "arcadia",
    name: "Arcadia",
    regionKey: "la",
    vibe: "In Arcadia, we pair careful diagnostics with installs that respect beautiful homes.",
    climate: "Warm valley conditions.",
    housing: "larger and remodeled homes where quiet, clean workmanship counts.",
  },

  // San Diego County
  {
    slug: "san-diego",
    name: "San Diego",
    regionKey: "sd",
    isHub: true,
    vibe: "San Diego is more than perfect weather — inland heat and coastal air still punish weak HVAC systems.",
    climate: "Coastal mild zones and much hotter inland communities in the same metro.",
    housing: "everything from coastal condos to inland family homes with very different system needs.",
    featuredPain: "Coastal Homes And Inland Heat Treated Like The Same Problem",
  },
  {
    slug: "chula-vista",
    name: "Chula Vista",
    regionKey: "sd",
    vibe: "Chula Vista families want reliable cooling and a team that explains the work before tools come out.",
    climate: "Warmer South Bay conditions.",
    housing: "growing neighborhoods with mixed system ages and strong summer demand.",
  },
  {
    slug: "oceanside",
    name: "Oceanside",
    regionKey: "sd",
    vibe: "Oceanside service means coastal-aware HVAC and honest repair-versus-replace guidance.",
    climate: "Marine air with warm inland pockets nearby.",
    housing: "coastal and inland-leaning homes across North County.",
  },
  {
    slug: "escondido",
    name: "Escondido",
    regionKey: "sd",
    vibe: "Escondido heat is real — undersized or neglected systems show it quickly.",
    climate: "Hotter inland North County summers.",
    housing: "family homes that often need stronger cooling capacity and duct attention.",
  },
  {
    slug: "carlsbad",
    name: "Carlsbad",
    regionKey: "sd",
    vibe: "Carlsbad homeowners expect clean installs and clear communication.",
    climate: "Coastal North County conditions with warm spells.",
    housing: "updated homes and coastal properties that need careful workmanship.",
  },
  {
    slug: "el-cajon",
    name: "El Cajon",
    regionKey: "sd",
    vibe: "In El Cajon, we help homeowners beat inland heat without buying the wrong system.",
    climate: "Hot inland East County summers.",
    housing: "homes that often struggle with capacity, airflow, and aging condensers.",
  },
  {
    slug: "vista",
    name: "Vista",
    regionKey: "sd",
    vibe: "Vista service from How Much? is practical, honest, and built for North County living.",
    climate: "Warm inland-leaning North County weather.",
    housing: "family neighborhoods with mixed HVAC ages and duct conditions.",
  },
  {
    slug: "san-marcos",
    name: "San Marcos",
    regionKey: "sd",
    vibe: "San Marcos homeowners call us for efficient systems and no-pressure recommendations.",
    climate: "Warm North County days.",
    housing: "newer communities and established homes side by side.",
  },
  {
    slug: "encinitas",
    name: "Encinitas",
    regionKey: "sd",
    vibe: "Encinitas comfort means coastal care and installs done with respect for the home.",
    climate: "Marine layer and ocean air.",
    housing: "coastal homes and remodels that need tidy, high-quality work.",
  },
  {
    slug: "la-mesa",
    name: "La Mesa",
    regionKey: "sd",
    vibe: "La Mesa homeowners want clear diagnostics when summer heat climbs inland from the coast.",
    climate: "Warmer than the immediate coast, especially in summer.",
    housing: "established homes with systems that need honest seasonal prep.",
  },
  {
    slug: "santee",
    name: "Santee",
    regionKey: "sd",
    vibe: "Santee heat rewards proactive maintenance and correctly sized equipment.",
    climate: "Hot inland East County conditions.",
    housing: "family homes where upstairs comfort and airflow often need attention.",
  },
  {
    slug: "poway",
    name: "Poway",
    regionKey: "sd",
    vibe: "Poway homeowners get thorough evaluations and options that match larger inland homes.",
    climate: "Warm-to-hot inland North County weather.",
    housing: "larger homes that need careful load calculation and duct review.",
  },
  {
    slug: "national-city",
    name: "National City",
    regionKey: "sd",
    vibe: "National City service is straightforward: fix what is broken, explain what is next, price it fairly.",
    climate: "Warm South Bay conditions.",
    housing: "practical homes where clear repair paths matter most.",
  },
  {
    slug: "coronado",
    name: "Coronado",
    regionKey: "sd",
    vibe: "Coronado homes deserve careful coastal HVAC work and premium attention to detail.",
    climate: "Island/coastal marine conditions.",
    housing: "coastal properties where clean, careful installs are essential.",
  },
  {
    slug: "chula-vista-eastlake",
    name: "Eastlake (Chula Vista)",
    regionKey: "sd",
    vibe: "Eastlake homes often need strong cooling performance and clear guidance on system upgrades.",
    climate: "Warmer inland South County heat.",
    housing: "newer planned-community homes with multi-story comfort challenges.",
  },
];

export const serviceAreas: ServiceArea[] = citySeeds.map(makeCity);

/** Top cities for nav mega-menu (not the full directory). */
const navFeaturedAreaSlugs = [
  "orange-county",
  "los-angeles",
  "san-diego",
  "anaheim",
  "irvine",
  "santa-ana",
  "huntington-beach",
  "long-beach",
  "pasadena",
  "torrance",
  "newport-beach",
  "costa-mesa",
  "fullerton",
  "mission-viejo",
  "glendale",
  "santa-monica",
  "carlsbad",
  "oceanside",
  "chula-vista",
  "tustin",
] as const;

export function getNavFeaturedAreas() {
  return navFeaturedAreaSlugs
    .map((slug) => getArea(slug))
    .filter((a): a is ServiceArea => Boolean(a));
}

export function getArea(slug: string) {
  return serviceAreas.find((a) => a.slug === slug);
}

export function getAreasByRegion(regionKey: ServiceArea["regionKey"]) {
  return serviceAreas.filter((a) => a.regionKey === regionKey);
}

export function getNearbyAreas(slug: string, limit = 8) {
  const current = getArea(slug);
  if (!current) return serviceAreas.filter((a) => a.slug !== slug).slice(0, limit);
  const sameRegion = serviceAreas.filter(
    (a) => a.regionKey === current.regionKey && a.slug !== slug,
  );
  return sameRegion.slice(0, limit);
}
