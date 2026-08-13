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
      "When your home stops cooling, you need answers—not a hard sell. How Much? is a family-owned HVAC company serving Southern California homeowners with clear diagnostics, honest repair-vs-replace options, and pricing you can actually understand. We walk you through what's broken, what can wait, and what a quality install looks like for your home—no mystery fees and no pressure to decide on the spot. Call Direct (714) 333-5953 and we'll help you get comfortable again with options that fit your budget and your house.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "Plain-English diagnostic before any repair recommendation",
      "Repair vs replace options with real cost ranges—not a single take-it-or-leave-it quote",
      "Quality installs sized for your home with manufacturer-backed equipment",
      "Respectful crews who protect floors, clean up, and leave documentation you can keep",
    ],
    benefits: [
      "Faster comfort when Orange County and SoCal heat spikes",
      "Clear pricing before work begins—so you're never guessing at the end",
      "Systems sized for your home—not oversized guesswork that short-cycles",
      "Clean job sites and crews who treat your house like a neighbor's",
      "Warranty and startup paperwork stored so you're not hunting for it later",
    ],
    painPoints: [
      {
        title: "AC blows warm air",
        body: "Warm airflow often means refrigerant, airflow, or compressor issues—not an automatic full replacement. We diagnose first so you don't pay for equipment you don't need.",
      },
      {
        title: "Short cycling or constant running",
        body: "Units that never shut off (or shut off too fast) drive up bills and wear out early. We find whether it's sizing, airflow, refrigerant, or controls—and fix the cause.",
      },
      {
        title: "Uneven rooms",
        body: "One freezing bedroom and one sauna usually points to ducts, sizing, or zoning—not \"just buy a bigger unit.\" We measure comfort room by room.",
      },
      {
        title: "Scary replacement quotes",
        body: "If another company jumped straight to a full system sell, get a second opinion before you sign. We'll tell you when a repair is the smarter move.",
      },
    ],
    process: [
      {
        title: "Listen & inspect",
        body: "We hear the symptoms, then diagnose the system—not run a sales script. Photos and measurements come before recommendations.",
      },
      {
        title: "Explain the findings",
        body: "You'll know what's broken, what's optional, and what waiting risks—in plain English, not jargon.",
      },
      {
        title: "Present options",
        body: "Repair path, mid-tier upgrade, or full replacement—with pricing rationale so you can choose without pressure.",
      },
      {
        title: "Deliver & document",
        body: "Clean install or repair, startup checks, and paperwork you can revisit anytime. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "How much does AC replacement cost in Orange County?",
        answer:
          "It depends on tonnage, efficiency, duct condition, and access. We provide personalized options after a diagnostic—not a Facebook-ad number. Call Direct (714) 333-5953 for a home visit and real ranges for your house.",
      },
      {
        question: "Can you repair instead of replace?",
        answer:
          "Often yes. If a repair is the smarter move for your equipment age and condition, we'll say so—even when that means a smaller job for us.",
      },
      {
        question: "How fast can you come out?",
        answer:
          "In peak heat we prioritize diagnostics and same-week installs when equipment is available. Call Direct (714) 333-5953 for the soonest slot that fits your home.",
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
    summary: "Reliable warmth for cooler nights—safely and efficiently.",
    description:
      "Southern California winters are mild until a cold snap hits and the heater won't start. How Much? is family-owned and focused on honest heating service for homeowners who want safety, even warmth, and clear options—not a pressure pitch. We diagnose ignition, airflow, and delivery issues first, then show repair, tune-up, or upgrade paths that fit your home and budget. Call Direct (714) 333-5953 when you want warmth you can trust—without mystery fees or rush tactics.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "Safety-first inspections before any comfort tweaks",
      "Efficient heating recommendations matched to your home—not a one-size pitch",
      "Transparent quotes with repair, tune-up, and upgrade paths—no pressure",
      "Clear guidance on when waiting is fine and when it's a risk",
    ],
    benefits: [
      "Safer operation with proper combustion and venting checks",
      "Even warmth without blasting one room and freezing another",
      "Fewer surprise breakdowns before the next cold snap",
      "Honest timing on repair vs upgrade so you don't replace too early—or too late",
      "Documentation you can keep for warranties and future service",
    ],
    painPoints: [
      {
        title: "Heater won't start",
        body: "Ignition, sensors, or airflow issues can look identical from the thermostat. Diagnostics matter so you don't replace parts (or the whole system) on a guess.",
      },
      {
        title: "Strange smells or noises",
        body: "Burning smells, rattles, or booming starts deserve a professional look ASAP—not another \"reset and hope\" cycle.",
      },
      {
        title: "High winter bills",
        body: "Aging heat systems and leaky ducts quietly drain money every cold snap. We show what's wasting energy and what's worth fixing.",
      },
      {
        title: "Cold spots in the house",
        body: "Often a balance, duct, or capacity issue—not just \"turn it up.\" We chase comfort room by room.",
      },
    ],
    process: [
      {
        title: "Safety check",
        body: "We start with combustion, venting, and the things that protect your family—before talking upgrades.",
      },
      {
        title: "Performance review",
        body: "Airflow, ignition, and heat delivery across rooms so we know what you actually feel at home.",
      },
      {
        title: "Options",
        body: "Repair, tune-up plan, or system upgrade—explained clearly with costs and trade-offs.",
      },
      {
        title: "Follow-through",
        body: "Work completed cleanly with documentation. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Do I need heating service in Southern California?",
        answer:
          "Yes—coastal and inland nights still stress aging systems, and safety checks matter even in mild winters. A short visit can catch issues before a holiday weekend emergency.",
      },
      {
        question: "Is a heat pump better than a furnace?",
        answer:
          "Sometimes. Climate, ductwork, and existing equipment decide. We'll show both paths when relevant and help you compare operating cost—not hype. Call Direct (714) 333-5953 to talk through your home.",
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
      "Gas furnaces need careful handling—especially when ignition fails or you smell something that doesn't feel right. How Much? is a family-owned team serving Southern California homeowners with safety-first furnace inspections, honest repair guidance, and clean installs when replacement truly makes sense. We explain what's urgent versus optional so you're never pushed into a new system out of fear. Call Direct (714) 333-5953 for furnace help from neighbors who put clarity before the close.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Combustion, venting, and safety checks before any repair pitch",
      "Honest repair vs replace guidance based on condition—not fear",
      "Clean, professional installs with a clear homeowner walkthrough",
      "Warranty implications explained so you know what you're choosing",
    ],
    benefits: [
      "CO and combustion safety prioritized on every visit",
      "Longer equipment life when tune-ups catch small issues early",
      "No upselling a replacement you don't need",
      "Reliable heat on cold mornings without the guesswork",
      "Paperwork and startup checks you can trust later",
    ],
    painPoints: [
      {
        title: "Pilot / ignition failures",
        body: "Repeated lockouts usually have a root cause—we find it instead of resetting forever and hoping it holds until the next cold night.",
      },
      {
        title: "Yellow flame or soot",
        body: "Combustion problems aren't DIY. Call for a safety inspection so your family isn't living with a known risk.",
      },
      {
        title: "Aging heat exchanger concerns",
        body: "Cracks are serious. We'll verify with a proper inspection—not scare tactics designed to force a same-day sale.",
      },
    ],
    process: [
      {
        title: "Safety inspection",
        body: "Combustion, venting, and heat exchanger review so we know the furnace is safe to run.",
      },
      {
        title: "Clear findings",
        body: "What's urgent vs what's optional—so you can decide without pressure.",
      },
      {
        title: "Repair or replace",
        body: "Options with warranty implications and cost rationale explained upfront.",
      },
      {
        title: "Commissioning",
        body: "Startup, testing, and homeowner walkthrough. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "How long do gas furnaces last?",
        answer:
          "Often 15–20 years with maintenance—but condition matters more than birthday. We judge performance and safety, not just age. Call Direct (714) 333-5953 for an honest assessment.",
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
      "Heat pumps are a smart fit for many Southern California homes—one system for most of the year's heating and cooling. How Much? is family-owned and helps homeowners cut through the marketing so you understand performance, operating costs, and whether a heat pump truly fits your ducts, electrical, and comfort goals. We present clear options with real-world expectations—no pressure and no mystery fees. Call Direct (714) 333-5953 when you're ready for honest guidance on an upgrade that should actually save you hassle.",
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "All-in-one heating and cooling guidance tailored to your home",
      "Energy-efficient options with operating-cost expectations—not just SEER stickers",
      "Clear financing and upgrade paths when replacement makes sense",
      "Sizing based on load, ducts, and electrical—not a catalog guess",
    ],
    benefits: [
      "One system for most of the year instead of juggling two aging boxes",
      "Strong efficiency in mild SoCal climates when equipment is sized right",
      "Smart thermostat pairing when it actually helps comfort and bills",
      "Transparent operating-cost expectations before you commit",
      "Clean installs with performance verification—not \"set and forget\"",
    ],
    painPoints: [
      {
        title: "Two aging systems to maintain",
        body: "Separate AC + furnace can mean double the repair risk. A heat pump can simplify—when your home is a good fit.",
      },
      {
        title: "Rising energy costs",
        body: "Older equipment burns money quietly. Efficiency upgrades should pencil out—we'll show the math before you spend.",
      },
      {
        title: "Confused by heat pump marketing",
        body: "Not every home is a perfect fit. We size and recommend based on reality: ducts, electrical, and how you actually live.",
      },
    ],
    process: [
      {
        title: "Home assessment",
        body: "Load, ducts, electrical, and comfort goals so recommendations match your house—not a brochure.",
      },
      {
        title: "Option modeling",
        body: "Equipment tiers with real-world expectations for comfort and operating cost.",
      },
      {
        title: "Install",
        body: "Clean swap, controls setup, and performance verification before we leave.",
      },
      {
        title: "Education",
        body: "How to run it efficiently day to day. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Do heat pumps work near the coast?",
        answer:
          "Yes—Southern California's mild climate is often ideal. Salt air and placement still matter for longevity, and we'll talk through those details on site. Call Direct (714) 333-5953 to schedule an assessment.",
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
      "Additions, garages, ADUs, and problem rooms often never stay comfortable with the main system alone. How Much? is a family-owned HVAC company that designs and installs ductless mini-splits for Southern California homeowners who want quiet, efficient, room-by-room comfort—without major duct demolition. We plan placement for looks and performance, then walk you through clear options and pricing with no pressure. Call Direct (714) 333-5953 when one space in your home deserves its own climate.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Room-by-room temperature control designed for how you use the space",
      "Minimal-disruption installs with a clear placement plan upfront",
      "High-efficiency brands sized so zones don't starve each other",
      "Remote and app basics at handoff so you're not figuring it out alone",
    ],
    benefits: [
      "Independent comfort for ADUs, additions, and home offices",
      "No major duct demolition to condition a single problem space",
      "Quiet, efficient operation you can live with day and night",
      "Flexible single or multi-zone designs that match your layout",
      "Honest scope so aesthetics and capacity are planned together",
    ],
    painPoints: [
      {
        title: "Garage / ADU has no ducts",
        body: "Extending central air is often expensive and ugly. Ductless is built for spaces that were never designed for a big trunk line.",
      },
      {
        title: "One room never gets comfortable",
        body: "A targeted head can fix the problem room without replacing the whole-house system—and without overcooling everywhere else.",
      },
      {
        title: "Worried it'll look industrial",
        body: "Placement and brand choice matter. We design for aesthetics as well as output so the unit doesn't dominate the room.",
      },
    ],
    process: [
      {
        title: "Zone design",
        body: "Which rooms, which heads, which outdoor unit—capacity matched so comfort stays even.",
      },
      {
        title: "Placement plan",
        body: "Quiet, effective, and visually clean before anyone drills a hole.",
      },
      {
        title: "Install",
        body: "Line sets, electrical, and commissioning done carefully and left tidy.",
      },
      {
        title: "Handoff",
        body: "Remote/app basics and maintenance tips. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Can one outdoor unit serve multiple rooms?",
        answer:
          "Yes—multi-zone systems are common. We'll match capacity so rooms don't starve each other. Call Direct (714) 333-5953 to plan zones for your home.",
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
      "When a package unit starts failing in the heat, access is harder and waiting often turns into an emergency. How Much? is family-owned and helps Southern California homeowners understand capacity, efficiency, and replacement options so you know exactly how much—and why. We assess curb, electrical, and whether a like-for-like swap beats converting system types, then present clear options without pressure. Call Direct (714) 333-5953 to plan a package unit repair or replacement on your timeline.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Accurate load and condition assessment before you buy equipment",
      "Trusted equipment options with clear efficiency tiers",
      "Clean removal and install with proper curb/adaptor handling",
      "Honest advice when a like-for-like swap beats a system-type conversion",
    ],
    benefits: [
      "All-in-one footprint that fits certain home and light-commercial layouts",
      "Clear replacement timelines so you're not stuck in emergency mode",
      "Proper curb and adaptor handling that protects airflow and longevity",
      "Pricing rationale you can compare—not a mystery \"rooftop special\"",
      "Startup verification so comfort is confirmed before we leave",
    ],
    painPoints: [
      {
        title: "Rooftop unit failing in heat",
        body: "Access is harder—waiting often means emergency pricing. Plan the swap with options while you still have choices.",
      },
      {
        title: "Weird package vs split quotes",
        body: "Not every home should convert system types. We'll tell you when a like-for-like package replacement is smarter and safer.",
      },
    ],
    process: [
      {
        title: "Site & curb check",
        body: "Access, electrical, and mounting realities that decide scope and timeline.",
      },
      {
        title: "Options",
        body: "Efficiency tiers and install scope with clear pricing rationale.",
      },
      {
        title: "Swap day",
        body: "Safe removal, set, connect, and test—left clean.",
      },
      {
        title: "Verify",
        body: "Airflow and comfort confirmation. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "How long does a package unit replacement take?",
        answer:
          "Many residential swaps are same-day once equipment is on site—access and electrical can extend that. Call Direct (714) 333-5953 and we'll give you a realistic window for your roof or pad.",
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
      "Proper ventilation matters as much as temperature—especially in tighter homes where stale air, odors, and moisture linger. How Much? is family-owned and helps Southern California homeowners evaluate airflow issues with practical fixes, not gadget stacks. We diagnose how air moves through your house, then recommend only what solves the real problem—clearly, honestly, and without pressure. Call Direct (714) 333-5953 when your home feels stuffy and you want fresher air that still supports comfort.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Airflow diagnostics that explain why rooms feel stale or uneven",
      "Practical upgrade recommendations—not a pile of unnecessary gadgets",
      "Better comfort room to room when air can actually move",
      "Clear separation between ventilation fixes and purification add-ons",
    ],
    benefits: [
      "Fresher indoor air without overcomplicating your system",
      "Better HVAC performance when airflow and returns are right",
      "Fewer mystery humidity and odor issues in baths, laundry, and kitchens",
      "Recommendations scoped to the problem you actually have",
      "A home that feels healthier without sacrificing comfort",
    ],
    painPoints: [
      {
        title: "Stale air / lingering odors",
        body: "Sealed homes trap contaminants. Ventilation strategies help—carefully—so you're not just masking smells with filters alone.",
      },
      {
        title: "Moisture problems",
        body: "Bathrooms, laundry, and kitchens need paths for moisture to leave. Ignoring that leads to comfort issues and worse air quality over time.",
      },
    ],
    process: [
      {
        title: "Airflow audit",
        body: "How air moves (or doesn't) through the home—returns, exhaust, and pressure imbalances included.",
      },
      {
        title: "Recommendations",
        body: "Only what solves the actual problem, explained in plain English.",
      },
      {
        title: "Install / adjust",
        body: "Fans, ducts, or balancing as needed—clean and documented.",
      },
      {
        title: "Validate",
        body: "Comfort and air movement check. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Is ventilation the same as air purification?",
        answer:
          "No. Ventilation moves air; purification treats it. Many homes need a mix—we won't stack gadgets without a reason. Call Direct (714) 333-5953 if you're unsure which problem you're actually solving.",
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
      "Leaky or poorly designed ducts waste money and comfort—even with a brand-new outdoor unit. How Much? is a family-owned HVAC company that inspects, seals, repairs, and redesigns duct systems for Southern California homeowners who want even temperatures and lower waste. We measure before we recommend, then show clear options without pressure to tear everything out. Call Direct (714) 333-5953 when your system runs hard but some rooms still never feel right.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    featured: true,
    expect: [
      "Leak detection and sealing prioritized by impact—not busywork",
      "Balanced airflow so bedrooms and living spaces feel closer in temperature",
      "Lower energy waste from conditioned air escaping into attic or crawlspace",
      "Honest scope: seal and balance first when that solves the problem",
    ],
    benefits: [
      "Even temperatures without buying a bigger condenser out of frustration",
      "Less wasted conditioned air into attic or crawlspace",
      "Quieter, more efficient system runtime when ducts aren't fighting the equipment",
      "Fewer \"new AC, same hot room\" disappointments",
      "Recommendations backed by inspection—not a one-line upsell",
    ],
    painPoints: [
      {
        title: "New AC still can't cool evenly",
        body: "If ducts are the bottleneck, a bigger outdoor unit won't fix comfort. We find restrictions, leaks, and balance issues first.",
      },
      {
        title: "Dusty rooms near returns",
        body: "Leakage and poor filtration paths pull attic dust into living space. Sealing the right places makes a visible difference.",
      },
      {
        title: "High bills + weak airflow",
        body: "Classic leaky-duct symptoms. We measure before we recommend so you're not guessing with insulation or a full system swap.",
      },
    ],
    process: [
      {
        title: "Inspect",
        body: "Visual and performance clues across the run—attic, crawl, and living-space symptoms included.",
      },
      {
        title: "Prioritize",
        body: "Seal, repair, or redesign—scoped honestly so you know what moves the needle.",
      },
      {
        title: "Execute",
        body: "Professional sealing and balancing with a clean job site.",
      },
      {
        title: "Retest",
        body: "Confirm rooms actually improved. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Should I replace ducts or just seal them?",
        answer:
          "Depends on material, layout, and damage. Many homes improve dramatically with sealing and balancing alone. Call Direct (714) 333-5953 for an inspection that separates must-fix from nice-to-have.",
      },
    ],
    relatedBlogSlugs: ["ductwork-problems-hot-cold-rooms", "indoor-air-quality-basics"],
    relatedFaqSlugs: ["second-opinions", "pricing-and-quotes"],
  },
  {
    slug: "insulation",
    name: "Insulation",
    shortName: "Insulation",
    summary: "Keep conditioned air where it belongs—inside your home.",
    description:
      "Insulation upgrades pair powerfully with HVAC work—especially when the attic turns into an oven every afternoon. How Much? is family-owned and helps Southern California homeowners improve comfort and reduce load on the system with targeted insulation recommendations, not blanket upsells. We explain how the building envelope affects sizing and bills so you can decide what to do first—clearly and without pressure. Call Direct (714) 333-5953 when good equipment still can't keep up with a leaky attic.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Attic and relevant area assessments tied to real comfort complaints",
      "Comfort and efficiency gains explained before any install",
      "Smarter long-term energy use when insulation and HVAC work together",
      "Targeted upgrades—not \"insulate everything\" as a default pitch",
    ],
    benefits: [
      "Less strain on AC and heat during SoCal heat spikes and cool nights",
      "More stable indoor temperatures room to room",
      "Better ROI when insulation is paired with the right HVAC upgrades",
      "Clear advice on whether insulation should come before a new system",
      "A home that holds comfort instead of fighting the weather all day",
    ],
    painPoints: [
      {
        title: "Attic is an oven",
        body: "Poor attic insulation makes every summer afternoon harder on your AC—and harder on your wallet—no matter how new the outdoor unit looks.",
      },
      {
        title: "Just upgraded HVAC, still uncomfortable",
        body: "Envelope issues can sabotage good equipment. Insulation closes the gap so your system isn't running flat-out for mediocre comfort.",
      },
    ],
    process: [
      {
        title: "Assess",
        body: "Where heat enters and escapes—and how that shows up in your rooms.",
      },
      {
        title: "Recommend",
        body: "Targeted upgrades—not blanket upsells—with clear priorities.",
      },
      {
        title: "Install",
        body: "Clean, to-spec insulation work that respects your home.",
      },
      {
        title: "Measure comfort",
        body: "Confirm the home feels better. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Should insulation come before a new AC?",
        answer:
          "Sometimes yes—reducing load can change the right system size. We'll advise based on your home, not a default sales order. Call Direct (714) 333-5953 to talk through sequencing.",
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
    summary: "Cleaner air for your family—filtration, purification, and more.",
    description:
      "Dust, allergies, and wildfire smoke weeks make indoor air feel personal—not theoretical. How Much? is a family-owned HVAC company that recommends IAQ improvements for Southern California homeowners based on your home and your goals, not a one-size upsell. We match filtration and purification to what your system can handle, explain trade-offs clearly, and skip anything that doesn't solve your problem. Call Direct (714) 333-5953 when you want cleaner air with honest options and no pressure.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Right-sized filtration options matched to your system's airflow",
      "Allergy- and comfort-focused solutions aimed at a clear goal",
      "Honest recommendations only—no gadget pile-on",
      "Filter schedules you'll actually be able to keep",
    ],
    benefits: [
      "Fewer allergy triggers when filtration is right for the home",
      "Less dust settling on surfaces when returns and filters work together",
      "No gadget pile-on—just what works for your target problem",
      "A plan before wildfire smoke weeks—not a scramble mid-event",
      "Compatibility with static pressure so comfort isn't sacrificed for \"higher MERV\"",
    ],
    painPoints: [
      {
        title: "Allergy season indoors",
        body: "Filters and airflow matter more than fancy boxes with blinking lights. We start with what your system can support well.",
      },
      {
        title: "Wildfire smoke weeks",
        body: "You need a plan before the sky turns orange—not during. We'll help you prepare filtration that fits your equipment.",
      },
      {
        title: "Upsold every IAQ product",
        body: "If it doesn't solve your problem, we won't recommend it. Period.",
      },
    ],
    process: [
      {
        title: "Understand the goal",
        body: "Allergies, dust, odors, smoke—pick the target so the fix stays focused.",
      },
      {
        title: "Match the fix",
        body: "Filtration, ventilation, or purification as needed—never all three by default.",
      },
      {
        title: "Install",
        body: "Compatible with your system's static pressure so airflow stays healthy.",
      },
      {
        title: "Maintain",
        body: "Filter schedules you'll actually keep. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Is a higher MERV filter always better?",
        answer:
          "Not if it chokes airflow. We match filtration to what your system can handle so comfort and air quality both improve. Call Direct (714) 333-5953 with your equipment details if you want a quick check.",
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
      "A correctly sized pool heat pump can keep evenings swimmable without shocking the utility bill. How Much? is family-owned and helps Southern California homeowners evaluate sizing, install quality, and operating expectations before they buy. We compare heat pump paths against aging gas heaters with real numbers—honest options, no pressure, and clear next steps. Call Direct (714) 333-5953 when you want a longer swim season and pricing that makes sense for how you actually use the pool.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=80",
    expect: [
      "Proper sizing guidance based on pool size, exposure, and usage",
      "Efficient heating options with operating expectations upfront",
      "Professional installation including pad, electrical, and plumbing connections",
      "Seasonal setpoint tips so you're not guessing after install day",
    ],
    benefits: [
      "Longer usable swim season for evenings and shoulder months",
      "More efficient than many gas heaters in mild SoCal climates",
      "Clear operating expectations before you buy—not after the first bill",
      "Equipment choices matched to how often you actually swim",
      "Clean install and tune so setpoints feel intuitive",
    ],
    painPoints: [
      {
        title: "Pool too cold after sundown",
        body: "A correctly sized heat pump keeps evenings usable without shocking the bill—or forcing you to fire a gas heater every night.",
      },
      {
        title: "Old gas heater inefficiency",
        body: "If you're tired of fuel costs, compare a heat pump path with real numbers for your pool and climate—not a generic brochure claim.",
      },
    ],
    process: [
      {
        title: "Pool & climate assess",
        body: "Size, exposure, and usage patterns that drive capacity and cost.",
      },
      {
        title: "Equipment options",
        body: "Capacity and efficiency tiers with honest operating expectations.",
      },
      {
        title: "Install",
        body: "Pad, electrical, and plumbing connections done cleanly.",
      },
      {
        title: "Tune",
        body: "Setpoints and seasonal tips. Licensed CA Lic #107-3814.",
      },
    ],
    faqs: [
      {
        question: "Are pool heat pumps worth it in OC?",
        answer:
          "For many households yes—especially with frequent evening use. We'll compare against your current heater honestly. Call Direct (714) 333-5953 to talk through sizing for your pool.",
      },
    ],
    relatedBlogSlugs: ["heat-pumps-for-southern-california"],
    relatedFaqSlugs: ["pricing-and-quotes", "financing-basics"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
