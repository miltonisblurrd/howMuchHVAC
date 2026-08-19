export type ResourceTip = {
  id: string;
  serviceSlug: string;
  title: string;
  why: string;
  steps: string[];
  cadence?: string;
  callAndyWhen?: string;
};

export const RESOURCE_CATEGORIES = [
  { slug: "home-basics", name: "Home basics" },
  { slug: "ac-repair-installation", name: "A/C" },
  { slug: "heating", name: "Heating" },
  { slug: "gas-furnace", name: "Gas furnace" },
  { slug: "heat-pump", name: "Heat pump" },
  { slug: "ductless-mini-split", name: "Mini-split" },
  { slug: "package-unit", name: "Package unit" },
  { slug: "ventilation", name: "Ventilation" },
  { slug: "ductwork", name: "Ductwork" },
  { slug: "insulation", name: "Insulation" },
  { slug: "indoor-air-quality", name: "Indoor air" },
  { slug: "pool-heat-pump", name: "Pool heat pump" },
] as const;

export const resourceTips: ResourceTip[] = [
  {
    id: "filters-30-days",
    serviceSlug: "home-basics",
    title: "Change or clean your air filter",
    why: "A dirty filter is the #1 reason A/C struggles in SoCal dust and wildfire season. It makes the system work harder, cool worse, and can freeze the coil.",
    cadence: "Every 30 days",
    steps: [
      "Turn the system off at the thermostat.",
      "Slide the filter out of the return grille or air handler. Note the airflow arrow.",
      "If it's disposable, replace it. If it's washable, rinse from the clean side, let it dry fully, then put it back.",
      "Match the size printed on the frame (example: 16×25×1). A wrong size leaks dirty air around the edges.",
      "Turn the system back on and feel for steady airflow at a vent.",
    ],
    callAndyWhen: "You can't find the filter, it looks wet or moldy, or airflow is still weak after a new one.",
  },
  {
    id: "outdoor-unit-clear",
    serviceSlug: "home-basics",
    title: "Keep the outdoor unit breathing",
    why: "Condensers need air on all sides. Leaves, toys, and tight bushes make the compressor overheat — especially on 95°+ days.",
    cadence: "Monthly in summer",
    steps: [
      "Give the unit about 2 feet of clear space on every side.",
      "Gently rinse the fins with a hose from the outside in. Don't bend them with a pressure washer.",
      "Clear grass clippings after mowing. They pack into the coil fast.",
      "Keep sprinklers from spraying the unit — that rusts and scales the coil.",
    ],
    callAndyWhen: "The unit is shaking, icing, or the breaker trips after a hot afternoon.",
  },
  {
    id: "thermostat-socal",
    serviceSlug: "home-basics",
    title: "Set the thermostat for our climate",
    why: "Big setpoint swings waste energy and wear the compressor. Steady beats “crank it to 68 when you get home.”",
    cadence: "Set it and leave it",
    steps: [
      "Pick a daytime cooling setpoint you can live with (many SoCal homes sit around 76–78°).",
      "Use a 2–3° setback when you're out — not 10°.",
      "Close blinds on west windows in the afternoon. That cuts the load more than any gadget.",
      "Don't switch rapidly between heat and cool on the same day. Let the system rest a few minutes.",
    ],
    callAndyWhen: "Rooms never catch up, or the thermostat and the room temperature don't match.",
  },
  {
    id: "when-to-call",
    serviceSlug: "home-basics",
    title: "Know when DIY stops",
    why: "A few checks save a trip. Past that, guessing can turn a small leak into a dead compressor.",
    steps: [
      "Check the filter and the outdoor disconnect / breaker first.",
      "Look at the outdoor unit: is it running? Iced? Buried in debris?",
      "If you smell gas, leave the house and call the gas company, then Andy.",
      "Don't keep resetting a tripped breaker. That's a safety signal.",
    ],
    callAndyWhen: "Warm air, ice on copper lines, water under the air handler, burning smells, or the system won't stay on.",
  },
  {
    id: "ac-pre-summer",
    serviceSlug: "ac-repair-installation",
    title: "A/C tune-up before the first heat wave",
    why: "May and June are cheaper and faster than the first 100° weekend. A clean coil and correct charge keep you from waiting in line.",
    cadence: "Once a year (spring)",
    steps: [
      "Book a checkup before Memorial Day if you can.",
      "Replace the filter the week of the visit so we see true airflow.",
      "Note which rooms feel worst — that's the diagnostic, not a sales script.",
      "Ask us to show you the before/after coil and the temperature split.",
    ],
    callAndyWhen: "Last summer it barely kept up, or another company jumped straight to “replace everything.”",
  },
  {
    id: "ac-ice",
    serviceSlug: "ac-repair-installation",
    title: "If the A/C ices up",
    why: "Ice usually means airflow or refrigerant — not “add freon and go.” Running it iced can wreck the compressor.",
    steps: [
      "Turn cooling off. Set the fan to On so the ice can melt (a few hours).",
      "Change the filter. Check that vents aren't shut in most rooms.",
      "Don't chip ice with a tool. Let it melt.",
      "When it's clear, try cooling again. If ice returns, stop and call.",
    ],
    callAndyWhen: "Ice comes back, or you see oil stains on copper (possible leak).",
  },
  {
    id: "heating-fall-check",
    serviceSlug: "heating",
    title: "Test heat on the first cool night",
    why: "You'd rather find a dead heater in October than at 5 a.m. in January.",
    cadence: "Every fall",
    steps: [
      "Switch to heat and raise the setpoint 3°. You should feel warm air within a few minutes.",
      "Listen for unusual bangs or long ignition delays.",
      "If you have a furnace, confirm the filter is clean — heat needs airflow too.",
      "Walk bedrooms. Cold rooms often mean ducts or balancing, not a bigger furnace.",
    ],
    callAndyWhen: "No heat, a rotten-egg smell, or the furnace starts then shuts off.",
  },
  {
    id: "furnace-filter-safety",
    serviceSlug: "gas-furnace",
    title: "Furnace filter and safety basics",
    why: "Restricted airflow overheats a furnace. Safety switches then shut it down — or worse, it cracks a heat exchanger over time.",
    cadence: "Every 30–60 days in winter",
    steps: [
      "Replace the filter on schedule. Don't “upgrade” to a super-thick filter unless the system was designed for it.",
      "Keep storage 3 feet from the furnace. Boxes choke combustion air.",
      "If the carbon monoxide alarm chirps, get everyone out and call 911, then us.",
      "Never tape over a blocked flue or vent to “stop a draft.”",
    ],
    callAndyWhen: "Yellow (not blue) burner flame, soot, or headaches when the heat runs.",
  },
  {
    id: "heat-pump-both-seasons",
    serviceSlug: "heat-pump",
    title: "Live with a heat pump (both seasons)",
    why: "Heat pumps heat and cool. In our mild winters they shine — if the outdoor unit stays clear and the aux heat isn't stuck on.",
    cadence: "Season change",
    steps: [
      "On cool mornings, a little steam at the outdoor unit can be defrost. That's normal.",
      "Don't pile leaves against it in fall. Defrost needs airflow.",
      "If emergency/aux heat is on for days, you're paying strip-heat rates. Call us.",
      "Keep the same filter habit as A/C — the coil is shared.",
    ],
    callAndyWhen: "It blows lukewarm in heat mode, or the outdoor unit ices into a solid block.",
  },
  {
    id: "minisplit-filters",
    serviceSlug: "ductless-mini-split",
    title: "Clean mini-split indoor filters",
    why: "Head units clog faster than a big return because the filters are small. Dirty heads drip, smell, and quit cooling a room.",
    cadence: "Every 2–4 weeks",
    steps: [
      "Open the front panel. Slide the mesh filters out.",
      "Vacuum or rinse. Dry completely before they go back.",
      "Wipe the blades so dust doesn't blow into the room.",
      "Keep furniture from blocking the sweep. They need a clear throw.",
    ],
    callAndyWhen: "A head drips indoors, smells musty after cleaning, or one room's head never starts.",
  },
  {
    id: "package-unit-roof",
    serviceSlug: "package-unit",
    title: "Package unit on the roof or pad",
    why: "Everything sits in one box. Debris on the coil and a clogged drain will take out cooling for the whole house.",
    cadence: "Twice a year",
    steps: [
      "From the ground: confirm the disconnect isn't off and the pad isn't sinking.",
      "Don't walk a tile roof to “just peek” — that's how leaks start.",
      "Keep trees from dumping leaves onto the unit.",
      "If you see water stains on the ceiling under a roof unit, call before the next heat wave.",
    ],
    callAndyWhen: "The whole house lost comfort at once, or you hear the unit short-cycling on the roof.",
  },
  {
    id: "ventilation-bath-range",
    serviceSlug: "ventilation",
    title: "Run bath and range fans long enough",
    why: "Moisture and cooking grease that stay inside become mold and a dirty coil. Fans only work if they actually vent outside.",
    cadence: "Every use",
    steps: [
      "Bath fan: on during showers and 20 minutes after.",
      "Range hood: on before you start the burner, off a few minutes after.",
      "Clean grease filters monthly. A packed filter is just a noisy light.",
      "If the fan is loud and moves no air, the duct may be crushed or dumped in the attic.",
    ],
    callAndyWhen: "Windows sweat, the attic smells stale, or a fan vents into the attic instead of out.",
  },
  {
    id: "ducts-leaks",
    serviceSlug: "ductwork",
    title: "Spot leaky or crushed ducts",
    why: "Leaky ducts dump cooled air into a hot attic. You pay twice and still have a hot bedroom.",
    cadence: "Once a year (look)",
    steps: [
      "In the attic or crawl: look for disconnected runs and crushed flex.",
      "Feel for air blowing at takeoffs that isn't a register.",
      "Don't use cloth “duct tape” on ducts. It fails. Mastic or proper foil tape lasts.",
      "Closed doors and shut vents in too many rooms raise static and noise.",
    ],
    callAndyWhen: "One room never comforts, or you see black stripes at register edges (dust pulling in).",
  },
  {
    id: "insulation-attic",
    serviceSlug: "insulation",
    title: "Attic insulation and your A/C bill",
    why: "In Orange County, a thin attic is like running the A/C with the oven on. Insulation is often cheaper than a bigger unit.",
    cadence: "Check every few years",
    steps: [
      "From the attic hatch, look at joist depth. If you can see the wood clearly, you're probably under-insulated.",
      "Keep insulation off can lights that aren't IC-rated, and keep a path to the furnace/air handler.",
      "Seal big attic bypasses (gaps around flues and hatches) before adding fluff.",
      "Don't bury the air handler or block soffit vents.",
    ],
    callAndyWhen: "Upstairs is always 5° hotter, or another quote said “you just need a bigger system.”",
  },
  {
    id: "iaq-smoke",
    serviceSlug: "indoor-air-quality",
    title: "Smoke, dust, and allergy days",
    why: "SoCal gets wildfire smoke and Santa Ana dust. A better filter helps — if the system can handle it. A too-tight filter can starve airflow.",
    cadence: "As the air quality changes",
    steps: [
      "On spare-the-air / smoke days, recirculate (don't pull heavy outdoor air if you have an option).",
      "Upgrade filter MERV only as high as we spec'd for your blower.",
      "Replace filters more often during smoke weeks — they load in days, not months.",
      "A portable HEPA in the bedroom is a good extra. It doesn't replace a healthy system.",
    ],
    callAndyWhen: "Someone in the house has worse symptoms when the HVAC runs, or you want a real IAQ plan (not a gadget pile).",
  },
  {
    id: "pool-heat-pump-care",
    serviceSlug: "pool-heat-pump",
    title: "Pool heat pump care",
    why: "These sit outside year-round. A dirty coil or low water flow makes them expensive to run and slow to heat.",
    cadence: "Monthly in swim season",
    steps: [
      "Keep the coil clear of palm litter and grass.",
      "Confirm the pump and filter are running when the heater is on — no flow, no heat.",
      "Rinse the coil gently. Don't use a pressure washer on the fins.",
      "In winter, follow the manufacturer's cover / disconnect notes if you winterize.",
    ],
    callAndyWhen: "It runs but the pool doesn't gain degrees, or ice forms on the coil in heat mode.",
  },
];

export function tipsForSlug(slug: string) {
  return resourceTips.filter((t) => t.serviceSlug === slug);
}
