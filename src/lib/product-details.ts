export type ProductSpec = { label: string; value: string };

export type ProductDetail = {
  summary: string;
  sizes: string[];
  specs: ProductSpec[];
  points: string[];
};

const notSure = "Not sure yet";

export const productDetails: Record<string, ProductDetail> = {
  "diy-5th-generation": {
    summary:
      "A single-zone mini-split a homeowner can install with a pre-charged line set. How Much? can also install it for you.",
    sizes: ["9,000 BTU", "12,000 BTU", "18,000 BTU", "24,000 BTU", "36,000 BTU", notSure],
    specs: [
      { label: "Style", value: "Single-zone ductless" },
      { label: "Refrigerant", value: "R-454B" },
      { label: "Line set", value: "Pre-charged quick connect" },
    ],
    points: [
      "Heats and cools one room or zone without new ducts.",
      "The line set arrives charged, so the install does not start with a vacuum pump.",
      "Andy can sell the equipment, install it, or both.",
    ],
  },
  "diy-select": {
    summary:
      "A simpler single-zone DIY mini-split for a room that needs its own heat and cool.",
    sizes: ["9,000 BTU", "12,000 BTU", "18,000 BTU", "24,000 BTU", notSure],
    specs: [
      { label: "Style", value: "Single-zone ductless" },
      { label: "Line set", value: "Pre-charged quick connect" },
    ],
    points: [
      "Built for one space, not a whole-house duct system.",
      "You can install it yourself or have How Much? do the work.",
    ],
  },
  "diy-easy-pro": {
    summary:
      "A DIY multi-room mini-split for homes that want more than one head on a single outdoor unit.",
    sizes: ["2 zones", "3 zones", "4 zones", notSure],
    specs: [
      { label: "Style", value: "Multi-zone ductless" },
      { label: "Line set", value: "Pre-charged quick connect" },
    ],
    points: [
      "One outdoor unit can serve more than one room.",
      "Each head has its own temperature.",
    ],
  },
  "diy-outtasight-ceiling-cassette": {
    summary:
      "A ceiling cassette for a room where a wall head would be in the way. Air comes from the ceiling instead.",
    sizes: ["9,000 BTU", "12,000 BTU", "18,000 BTU", notSure],
    specs: [
      { label: "Style", value: "Ceiling cassette" },
      { label: "Line set", value: "Pre-charged quick connect" },
    ],
    points: [
      "Sits in the ceiling so the wall stays clear.",
      "Still a ductless system, with its own zone.",
    ],
  },
  "advantage-5th-generation": {
    summary:
      "The contractor-installed version of the 5th generation mini-split. Same family of equipment, set by a tech.",
    sizes: ["9,000 BTU", "12,000 BTU", "18,000 BTU", "24,000 BTU", "36,000 BTU", notSure],
    specs: [
      { label: "Style", value: "Single-zone ductless" },
      { label: "Install", value: "Contractor installed" },
    ],
    points: [
      "How Much? sizes and mounts this one.",
      "A fit when you want the equipment without doing the install yourself.",
    ],
  },
  "olympus-e-star": {
    summary: "A single-zone Olympus mini-split for a room that needs its own system.",
    sizes: ["9,000 BTU", "12,000 BTU", "18,000 BTU", "24,000 BTU", "36,000 BTU", notSure],
    specs: [{ label: "Style", value: "Single-zone ductless" }],
    points: ["One indoor head, one outdoor unit.", "How Much? can install it or sell the equipment."],
  },
  "olympus-multi-zone": {
    summary: "An Olympus system with more than one indoor head on a shared outdoor unit.",
    sizes: ["2 zones", "3 zones", "4 zones", "5 zones", notSure],
    specs: [{ label: "Style", value: "Multi-zone ductless" }],
    points: ["Several rooms, one outdoor unit.", "Each room keeps its own control."],
  },
  "universal-split-r454b": {
    summary:
      "A central heat pump that connects to the ducts you already have. The outdoor unit and the air handler are separate.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [
      { label: "Style", value: "Central split heat pump" },
      { label: "Refrigerant", value: "R-454B" },
    ],
    points: [
      "Uses the home's existing ductwork when the ducts are in good shape.",
      "Andy confirms the tonnage after he sees the house.",
    ],
  },
  "universal-packaged-heat-pump": {
    summary: "A packaged heat pump with the heating and cooling in one cabinet, usually on a pad or the roof.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [{ label: "Style", value: "Packaged heat pump" }],
    points: ["One cabinet instead of a split system.", "A common swap for an old package unit."],
  },
  "geocool-inverter-series": {
    summary: "A geothermal heat pump that uses the ground loop instead of outside air.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "Geothermal heat pump" }],
    points: [
      "Only makes sense when the home can support a ground loop.",
      "Size is confirmed on site. There is no guess-the-tonnage button for this one.",
    ],
  },
  "versapro-gas-furnaces": {
    summary: "A gas furnace for homes that heat with gas and want a straight replacement or a new install.",
    sizes: ["40,000 BTU", "60,000 BTU", "80,000 BTU", "100,000 BTU", notSure],
    specs: [{ label: "Style", value: "Gas furnace" }],
    points: ["Pairs with a coil and a condenser, or stands in for the furnace you have now."],
  },
  "versapro-2nd-generation": {
    summary: "A central condenser and air handler pair for a standard split system.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [{ label: "Style", value: "Central split system" }],
    points: ["Built for ducted homes.", "Tonnage is matched to the house, not picked from a photo."],
  },
  "central-ducted-hyper-heat-2nd-generation": {
    summary: "A ducted heat pump meant to keep heating when the outside temperature drops.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [{ label: "Style", value: "Ducted cold-climate heat pump" }],
    points: ["Uses the ducts you have.", "Chosen when heating output in cold weather matters."],
  },
  "signature-series": {
    summary: "The higher-end central split family. Same job as a standard system, with the Signature equipment.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [{ label: "Style", value: "Central split system" }],
    points: ["A step up in the central lineup.", "Andy walks the difference against VersaPro before anyone orders it."],
  },
  "pre-charged-evaporator-coils": {
    summary: "A pre-charged indoor coil for a central system that needs a new coil, not a whole new house of equipment.",
    sizes: ["Match my air handler", notSure],
    specs: [{ label: "Style", value: "Evaporator coil" }],
    points: ["The coil has to match the furnace or air handler and the outdoor unit."],
  },
  "versapro-2nd-gen-packaged-unit": {
    summary: "An all-in-one packaged unit for a rooftop or a concrete pad.",
    sizes: ["2 ton", "3 ton", "4 ton", "5 ton", notSure],
    specs: [{ label: "Style", value: "Packaged unit" }],
    points: ["Replaces a package unit without splitting the system into two pieces."],
  },
  "mrbreeze-bladeless-fan": {
    summary: "A bladeless fan for a room. It moves air. It is not a substitute for an air conditioner.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "Bladeless fan" }],
    points: ["A comfort add-on, not a heating and cooling system."],
  },
  "coolblade-hvls-fan": {
    summary: "A large high-volume fan for a shop, garage, or open room.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "HVLS fan" }],
    points: ["Diameter depends on the ceiling height and the size of the room."],
  },
  "heatwise-electric-tank-water-heater": {
    summary:
      "An electric tank that holds hot water ready, so the shower is hot before you step in. How Much? matches the gallons to the household and checks the panel before anything is ordered.",
    sizes: [notSure],
    specs: [
      { label: "Style", value: "Electric storage tank" },
      { label: "Tank warranty", value: "10 years" },
      { label: "Parts warranty", value: "10 years" },
      { label: "Listing", value: "UL and AHRI" },
    ],
    points: [
      "Stored hot water, so the tap is already hot. This is not a tankless unit, and it does not heat or cool the rooms.",
      "The tank interior is enameled, a rare-earth anode takes the corrosion, and the elements are ceramic-coated so scale does not bake on as fast.",
      "A brass drain valve is there for the day you flush sediment. Plastic valves are what seize.",
      "Manufacturer coverage is 10 years on the tank, 10 years on the parts, and 1 year on labor. How Much? stands behind the install.",
    ],
  },
  "mini-stat": {
    summary: "A compact thermostat for a Mr. Cool system that needs a simple wall control.",
    sizes: ["This thermostat", notSure],
    specs: [{ label: "Style", value: "Thermostat" }],
    points: ["A control, not a heating and cooling system by itself."],
  },
  "smart-thermostat": {
    summary: "A smart thermostat for scheduling and remote control of a compatible system.",
    sizes: ["This thermostat", notSure],
    specs: [{ label: "Style", value: "Smart thermostat" }],
    points: ["Useful when the equipment can talk to it. Andy confirms compatibility."],
  },
  monoblock: {
    summary: "A compact all-in-one heat pump for a tight space that cannot take a split system.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "Monoblock heat pump" }],
    points: ["One cabinet. No separate outdoor condenser and indoor coil to place."],
  },
  travelcool: {
    summary: "A rooftop unit for an RV. It is built for the road, not for a house.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "RV rooftop unit" }],
    points: ["For a camper or RV roof opening, not a residential duct system."],
  },
  "compact-refrigeration-system": {
    summary: "A small refrigeration system for a cold room or a light commercial space.",
    sizes: [notSure],
    specs: [{ label: "Style", value: "Compact refrigeration" }],
    points: ["Sized to the box it is cooling. That is a site measurement, not a menu guess."],
  },
};

export function getProductDetail(slug: string) {
  return productDetails[slug];
}

export type StoryBit = { title: string; body: string };
export type ProductStory = {
  installTitle: string;
  installBody: string;
  steps: StoryBit[];
  facts: StoryBit[];
  bands: StoryBit[];
  faqs: { question: string; answer: string }[];
};

const diyStory: ProductStory = {
  installTitle: "The line set shows up already charged",
  installBody:
    "The indoor head and the outdoor unit connect with a pre-charged line set. You are not pulling a vacuum or weighing in refrigerant on the driveway. How Much? can still do the whole install if you would rather not.",
  steps: [
    { title: "Set the head", body: "Mount the indoor unit on a solid wall, high enough to throw air across the room." },
    { title: "Run the line", body: "The line set is already charged. The fittings close the circuit without a vacuum pump." },
    { title: "Power it", body: "Once it is wired and the outdoor unit is set, the system is ready to heat and cool that zone." },
  ],
  facts: [
    { title: "Pressure tested", body: "The pre-charged valve assembly is rated to handle 921 PSI and checked for leaks." },
    { title: "Listed equipment", body: "The valve control is certified under UL 207 and CSA C22.2 No. 140.3. Intertek file 5029931." },
    { title: "R-454B", body: "This generation uses R-454B, the refrigerant these current DIY systems are built around." },
    { title: "No vacuum step", body: "The charge is already in the line set, so the install skips the vacuum and the gauge set." },
  ],
  bands: [
    {
      title: "Heat when it is 13 below",
      body: "The system is built to keep heating in outdoor temperatures down to -13 F, and to keep cooling when it is as hot as 122 F outside.",
    },
    {
      title: "One zone, up to about 1,550 square feet",
      body: "Five single-zone sizes cover a bedroom through a large open room. Multi-zone equipment is a different model when you need more than one head.",
    },
    {
      title: "The coil is coated for the weather",
      body: "The outdoor coil uses a gold-colored fin coating so salt air and damp weather do not eat it as fast as bare aluminum.",
    },
    {
      title: "It watches for a refrigerant leak",
      body: "An A2L sensor on the air handler sounds an alarm if it detects a leak, so the problem is not a surprise months later.",
    },
    {
      title: "Control it from the couch or the car",
      body: "The system works with Amazon Alexa and Google Assistant, and with the phone app, so the temperature can change before you walk in.",
    },
    {
      title: "It remembers after the power blinks",
      body: "After an outage it restarts on the settings you left, including the louver position, instead of waiting for someone to reprogram it.",
    },
  ],
  faqs: [
    {
      question: "What changed from the previous DIY generation?",
      answer: "This generation uses R-454B. Earlier DIY systems used R-410A.",
    },
    {
      question: "Does the box include the wire between the indoor and outdoor units?",
      answer: "A bundled system includes the communication wire so the two pieces can talk to each other.",
    },
    {
      question: "Can I do this myself?",
      answer: "The line set is made for a homeowner install. How Much? will also mount it, run it, and stand behind the work if you want that.",
    },
    {
      question: "How many rooms can one outdoor unit cover?",
      answer: "A single-zone system covers one space. Multi-zone condensers in this family support anywhere from 2 to 6 indoor heads, depending on the model.",
    },
  ],
};

const stories: Record<string, ProductStory> = {
  "diy-5th-generation": diyStory,
  "diy-select": {
    ...diyStory,
    installTitle: "A smaller DIY system, same charged line set",
    bands: diyStory.bands.slice(0, 4),
  },
  "diy-easy-pro": {
    ...diyStory,
    installTitle: "More than one room on one outdoor unit",
    installBody:
      "Easy Pro is the multi-room version. Each head gets its own line set, still pre-charged, and its own temperature. The outdoor unit is sized to the number of zones.",
    faqs: [
      ...diyStory.faqs.slice(0, 3),
      {
        question: "How far can the line sets run?",
        answer: "It depends on the condenser. A small three-zone 18,000 BTU condenser supports about 123 feet total. The largest six-zone condenser supports a much longer combined run. Andy checks the layout before anyone orders line set.",
      },
    ],
  },
  "diy-outtasight-ceiling-cassette": {
    ...diyStory,
    installTitle: "The head lives in the ceiling",
    installBody:
      "Same pre-charged connection as the wall units, but the indoor piece is a cassette that sits flush in the ceiling. Use it when a wall head would land on art, a window, or a cabinet.",
    bands: [
      {
        title: "No wall space required",
        body: "Air comes from the ceiling, so the walls stay clear. It still does not need ducts.",
      },
      ...diyStory.bands.slice(0, 3),
    ],
  },
  "advantage-5th-generation": {
    installTitle: "This one is a tech install",
    installBody:
      "Advantage is the same generation of equipment, but it is not a homeowner kit. A licensed tech sets the charge and the line set. That is the job How Much? does.",
    steps: [
      { title: "We size the room", body: "Tonnage comes from the space, the sun, and the insulation, not from a guess on a website." },
      { title: "We set both pieces", body: "Indoor head, outdoor unit, line set, and power, done to the listing." },
      { title: "We start it and stay", body: "You get a running system and someone to call if it is not right." },
    ],
    facts: [
      { title: "Not a DIY kit", body: "Advantage is installed by a technician. The DIY line is the one with the homeowner line set." },
      { title: "R-454B", body: "Current 5th generation equipment uses R-454B." },
      { title: "Single zone", body: "One indoor head for one space, in several BTU sizes." },
      { title: "How Much? does the work", body: "Andy?s crew mounts it, wires it, and checks the temperature split before they leave." },
    ],
    bands: diyStory.bands.slice(0, 4),
    faqs: [
      {
        question: "Is Advantage a do-it-yourself system?",
        answer: "No. It needs a licensed install. The DIY models are the ones built for a homeowner line set.",
      },
      ...diyStory.faqs.slice(0, 2),
    ],
  },
};

const centralStory: ProductStory = {
  installTitle: "It ties into the ducts you already have",
  installBody:
    "A central system only works if the ducts, the electrical, and the pad or roof can take it. How Much? checks those before a unit is ordered, then sets the equipment and starts it.",
  steps: [
    { title: "Measure the house", body: "Load, ducts, and electrical decide the tonnage. The photo on this page does not." },
    { title: "Set the equipment", body: "Outdoor unit, indoor coil or air handler, line set, and drain, in that order." },
    { title: "Prove it runs", body: "Temperatures, pressures, and the thermostat are checked before the job is called done." },
  ],
  facts: [
    { title: "Ducted", body: "This is a whole-home system, not a single wall head." },
    { title: "Sized on site", body: "2 to 5 ton is the usual range. The right one is picked after a look at the house." },
    { title: "How Much? installs it", body: "Sale and install stay with the same company." },
    { title: "Price after the visit", body: "Good, Better, and Best are priced once Andy has seen the job." },
  ],
  bands: [
    {
      title: "The ducts have to be able to move the air",
      body: "A new condenser on tired ducts just moves the problem. We say so before anyone spends the money.",
    },
    {
      title: "Heat and cool from one system",
      body: "A heat pump covers both. A furnace-and-coil pair is the path when the house is staying on gas heat.",
    },
    {
      title: "Warranty stays with the equipment",
      body: "Manufacturer coverage is part of the quote. How Much? also stands behind the install.",
    },
  ],
  faqs: [
    {
      question: "Can this replace what I have now?",
      answer: "Often yes, if the ducts and the electrical can support the new size. That is what the first visit is for.",
    },
    {
      question: "Do I pick the tonnage here?",
      answer: "You can tell us what you think you need. Andy confirms it. Ordering the wrong tonnage is an expensive mistake.",
    },
  ],
};

const otherStories: Record<string, ProductStory> = {
  "olympus-e-star": {
    ...centralStory,
    installTitle: "One room, a proper mini-split install",
    installBody: "Olympus is a single-zone mini-split How Much? installs. One head, one outdoor unit, sized to that room.",
    facts: [
      { title: "Single zone", body: "One indoor head for one space." },
      { title: "Tech install", body: "This is not the homeowner line-set kit." },
      { title: "Several sizes", body: "From a small bedroom unit up to a large room." },
      { title: "How Much? sets it", body: "Mount, line set, power, and startup." },
    ],
  },
  "olympus-multi-zone": {
    ...centralStory,
    installTitle: "Several rooms, one outdoor unit",
    installBody:
      "Each room gets a head and its own control. They share one outdoor unit. The line lengths and the zone count have to match that condenser, so the layout is measured before anything is ordered.",
    facts: [
      { title: "Multi-zone", body: "Several indoor heads, one outdoor unit. This is not a ducted central system." },
      { title: "Each room", body: "Close the door and keep that room's setpoint. The other heads stay where they were." },
      { title: "Line length matters", body: "A head that is too far from the pad will not get a full line set. We measure the paths." },
      { title: "How Much? sets it", body: "Mount, line set, power, and startup stay with the same crew." },
    ],
  },
  "universal-split-r454b": { ...centralStory, installTitle: "A central heat pump on R-454B" },
  "universal-packaged-heat-pump": {
    ...centralStory,
    installTitle: "One cabinet, on the pad or the roof",
    installBody: "A packaged heat pump puts the heating and cooling in a single box. It replaces an old package unit without splitting the system in two.",
  },
  "geocool-inverter-series": {
    ...centralStory,
    installTitle: "Only if the ground loop is real",
    installBody: "GeoCool uses the ground, not the outside air. It is the right machine when a loop already exists or when one can be built. It is the wrong machine when someone just wants a normal heat pump.",
    facts: [
      { title: "Geothermal", body: "Heat comes from a ground loop, not a standard outdoor coil." },
      { title: "Site specific", body: "Loop length and soil decide if this is even possible." },
      { title: "Not a mini-split", body: "This is a central geothermal system." },
      { title: "How Much? will say no", body: "If the lot cannot take a loop, we will tell you and quote a different system." },
    ],
  },
  "versapro-gas-furnaces": {
    ...centralStory,
    installTitle: "A gas furnace, sized in BTU not tons",
    installBody: "Input, airflow, and the vent decide the furnace. We match it to the coil and the outdoor unit if those are part of the job.",
  },
  "versapro-2nd-generation": centralStory,
  "central-ducted-hyper-heat-2nd-generation": {
    ...centralStory,
    installTitle: "Built to keep heating when it gets cold",
    installBody: "Hyper heat is the ducted heat pump for houses that still need real heat on cold nights, without giving up the ducts they already have.",
  },
  "signature-series": {
    ...centralStory,
    installTitle: "The step up in the central lineup",
    installBody: "Signature is the higher equipment in this family. Andy will show it next to VersaPro so the price difference is a real difference, not a label.",
  },
  "pre-charged-evaporator-coils": {
    ...centralStory,
    installTitle: "A new coil, not a new house of equipment",
    installBody: "The coil has to match the furnace or air handler and the outdoor unit. A pre-charged coil saves a step. It does not forgive a mismatch.",
  },
  "versapro-2nd-gen-packaged-unit": {
    ...centralStory,
    installTitle: "Swap the package unit, keep the ducts",
    installBody: "The new cabinet lands on the existing curb or pad when the opening and the electrical allow it. We measure both before it is ordered.",
  },
  "mrbreeze-bladeless-fan": {
    installTitle: "It moves air. It does not cool the house.",
    installBody: "A bladeless fan is a comfort add-on for a room. If the room is actually hot, you need a mini-split or a central system, and we will say that.",
    steps: [
      { title: "Pick the room", body: "One fan covers a sitting area, not a whole floor." },
      { title: "Place it", body: "It needs a clear path and a normal outlet." },
      { title: "Use it with the real system", body: "It helps the air-conditioned air reach the corner. It is not the air conditioner." },
    ],
    facts: [
      { title: "Fan, not HVAC", body: "No refrigerant, no line set, no tonnage." },
      { title: "One room", body: "Sized for a living space, not a warehouse." },
      { title: "Simple power", body: "Plugs in. No new circuit in a normal room." },
      { title: "How Much? can pair it", body: "We will tell you if a mini-split is the actual fix." },
    ],
    bands: [
      { title: "Quiet air movement", body: "Useful when a room feels still even though the system is running." },
    ],
    faqs: [
      { question: "Will this replace my AC?", answer: "No. It circulates air. It does not remove heat from the house." },
    ],
  },
  "coolblade-hvls-fan": {
    installTitle: "A big fan for a big room",
    installBody: "High-volume fans belong in shops, garages, and tall rooms. Diameter and ceiling height have to match, or the fan is either useless or in the way.",
    steps: [
      { title: "Measure the ceiling", body: "Height and structure decide if a fan this size can hang there." },
      { title: "Pick the diameter", body: "The blade span follows the floor area, not a catalog photo." },
      { title: "Hang and power it", body: "How Much? mounts it to structure and lands it on a proper circuit." },
    ],
    facts: [
      { title: "HVLS", body: "A large, slow fan that moves a lot of air." },
      { title: "Not for an 8-foot ceiling", body: "These need height. A low room gets a different fan." },
      { title: "Shop or garage", body: "Built for open volume, not a bedroom." },
      { title: "Installed, not shipped and forgotten", body: "We hang it. You do not." },
    ],
    bands: [{ title: "Air movement for a work space", body: "It makes a hot shop usable. It still is not an air conditioner." }],
    faqs: [{ question: "Can this go in a house?", answer: "Only in a tall open room. Most houses want the bladeless fan or a mini-split instead." }],
  },
  "heatwise-electric-tank-water-heater": {
    installTitle: "The old tank comes out the same day",
    installBody:
      "Most of these swaps are a straight trade: the old tank, the pan, and the connections, then a new tank in the same footprint. The part that actually changes the price is the electrical. If the breaker and the wire cannot carry the element, we fix that before the tank is ordered, not after it is sitting in the garage.",
    steps: [
      {
        title: "Count who uses hot water at once",
        body: "Two showers and a dishwasher in the same half hour need more stored gallons than a house where everyone staggers. We size it to that morning, not to the label on the old tank.",
      },
      {
        title: "Open the panel",
        body: "An electric tank wants a dedicated circuit. If the panel is full, or the wire is undersized, that work is part of the quote. A tank on a tired circuit is how elements fail early.",
      },
      {
        title: "Set it, fill it, and stay for the first heat",
        body: "Pan, shutoff, relief valve, and the brass drain all get checked for leaks. We do not leave while it is still filling and call that done.",
      },
    ],
    facts: [
      { title: "UL listed", body: "Listed for electrical safety, so the tank can go through a normal inspection." },
      { title: "10-year tank", body: "The tank itself is covered for 10 years. That is the warranty that matters if it starts to weep." },
      { title: "10-year parts", body: "Elements, controls, and the rest of the parts are covered for 10 years." },
      { title: "AHRI rated", body: "Certified to the industry rating. Manufacturer labor coverage is 1 year, and How Much? stands behind the install." },
    ],
    bands: [],
    faqs: [
      {
        question: "Is this tankless?",
        answer:
          "No. It stores a tank of hot water and holds it at temperature. Tankless is a different machine, with different gas or electrical needs, and we will say so if that is actually the better fit.",
      },
      {
        question: "Will it run out if the whole house showers at once?",
        answer:
          "A tank can run out if it is undersized. That is why the gallon choice follows how many people overlap, not a guess from the photo. If the house needs more than a tank can honestly hold, we will tell you before you buy it.",
      },
      {
        question: "What do I have to do to keep it?",
        answer:
          "Flush it once in a while so sediment does not sit on the bottom. The drain valve is brass so that job is still possible a few years from now. The anode rod is the part that corrodes on purpose. When it is spent, it gets replaced, and the tank does not.",
      },
    ],
  },
  "mini-stat": {
    installTitle: "A wall control for a compatible system",
    installBody: "The Mini-Stat is a thermostat, not a heater or an air conditioner. It only belongs on equipment that can use it.",
    steps: [
      { title: "Confirm the system", body: "Andy checks that this stat talks to the unit you have." },
      { title: "Land the wires", body: "The stat replaces the old control on the same cable when the cable is right." },
      { title: "Set the schedule", body: "We leave it running the way you actually live, not on a factory default." },
    ],
    facts: [
      { title: "Control only", body: "It does not make hot or cold air by itself." },
      { title: "Compatibility first", body: "Not every system accepts every stat." },
      { title: "One wall", body: "A single control for the zone it is wired to." },
      { title: "How Much? wires it", body: "We do not hand you a box and a wiring diagram." },
    ],
    bands: [],
    faqs: [{ question: "Will this work on any mini-split?", answer: "No. It has to match the equipment. We check before it is sold." }],
  },
  "smart-thermostat": {
    installTitle: "A stat you can reach from the phone",
    installBody: "Scheduling and remote changes, on equipment that supports them. If your system cannot talk to it, we will not sell it to you.",
    steps: [
      { title: "Match the equipment", body: "The stat and the system have to speak the same language." },
      { title: "Connect it", body: "Wall wiring plus the app, done in one visit." },
      { title: "Leave a schedule", body: "You should not have to build the schedule from a blank screen after we leave." },
    ],
    facts: [
      { title: "Remote control", body: "Change the temperature when you are not home." },
      { title: "Not universal", body: "Compatibility is checked first." },
      { title: "App plus wall", body: "You still have a control on the wall if the phone is dead." },
      { title: "How Much? sets it up", body: "Install includes the account and the first schedule." },
    ],
    bands: [],
    faqs: [{ question: "Does it work with Alexa?", answer: "On compatible equipment, yes. We confirm the pairing on site." }],
  },
  monoblock: {
    ...centralStory,
    installTitle: "One box, through the wall",
    installBody: "A monoblock puts the whole heat pump in a single cabinet, so there is no separate outdoor condenser to hide. It needs a wall that can take it and a room that matches its output.",
  },
  travelcool: {
    installTitle: "An RV roof, not a house",
    installBody: "TravelCool sits on a camper or trailer roof opening. It is the wrong product for a residential duct system, and we will not quote it as one.",
    steps: [
      { title: "Confirm the roof opening", body: "The existing hole and the roof structure have to match." },
      { title: "Set the unit", body: "Seal, fasten, and power it from the coach, not from a house panel." },
      { title: "Run it", body: "Cooling is checked before the trailer goes back on the road." },
    ],
    facts: [
      { title: "RV rooftop", body: "Built for a coach, not a stucco house." },
      { title: "Opening size matters", body: "We measure the hole. We do not guess it." },
      { title: "12-volt and shore power", body: "The coach electrical has to support it." },
      { title: "How Much? can set it", body: "If the roof is right, we install it." },
    ],
    bands: [],
    faqs: [{ question: "Can this cool my house?", answer: "No. It is an RV unit. A house needs a mini-split or a central system." }],
  },
  "compact-refrigeration-system": {
    installTitle: "Sized to the box, not the building",
    installBody: "This is a small refrigeration system for a cold room or light commercial space. The box volume, the door openings, and the product load decide the unit.",
    steps: [
      { title: "Measure the box", body: "Cubic feet and how often the door opens matter more than the room around it." },
      { title: "Match the unit", body: "The condenser and the evaporator have to fit the space and the temperature you need." },
      { title: "Start it cold", body: "We confirm it holds temperature before we call it done." },
    ],
    facts: [
      { title: "Refrigeration", body: "This holds a cold room. It is not a house air conditioner." },
      { title: "Load matters", body: "Product, door time, and insulation change the size." },
      { title: "Commercial use", body: "Built for a small cold space, not a living room." },
      { title: "How Much? installs it", body: "We set it and prove the box holds." },
    ],
    bands: [],
    faqs: [{ question: "Is this for my kitchen fridge?", answer: "No. It is a compact refrigeration system for a cold room, not a household refrigerator." }],
  },
};

export function getProductStory(slug: string): ProductStory {
  return stories[slug] ?? otherStories[slug] ?? centralStory;
}
