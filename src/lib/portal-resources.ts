export type ResourceTip = {
  id: string;
  serviceSlug: string;
  title: string;
  image: string;
  why: string;
  /** Short do-this-then-this list. */
  steps: string[];
  /** Fuller teaching copy. Not a repeat of the steps. */
  inDepth: string;
  cadence?: string;
  callAndyWhen?: string;
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

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
    image: photo("photo-1550998251-1e18917c975c"),
    why: "A dirty filter is the #1 reason A/C struggles in SoCal dust and wildfire season. It makes the system work harder, cool worse, and can freeze the coil.",
    inDepth:
      "The filter is the screen between your rooms and the equipment. In Orange County, dust and wildfire ash load it much faster than a mild climate. A clogged filter makes the blower work harder, so the coil gets too cold and can ice over. That is a comfort problem and a compressor problem. Match the size printed on the frame. A filter that is the wrong size lets dirty air sneak around the edges, so the coil still gets coated. A very thick, high-MERV filter is not automatically better. If the blower was not built for it, airflow drops and the same ice problem shows up.",
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
    image: photo("photo-1545649311-24d0ac00ae82"),
    why: "Condensers need air on all sides. Leaves, toys, and tight bushes make the compressor overheat — especially on 95°+ days.",
    inDepth:
      "The outdoor unit dumps the heat it pulled out of the house. It can only do that if air moves freely through the fins. On a 95 degree afternoon, a unit boxed in by bushes or buried in grass clippings runs hotter, longer, and louder. Sprinklers are a quiet killer: mineral water scales the coil and rusts the cabinet, so the same heat cannot get out. A gentle rinse from the outside in knocks dust off without folding the fins. A pressure washer bends those fins flat and blocks the air you were trying to free.",
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
    image: photo("photo-1747224317357-6e6985e52f42"),
    why: "Big setpoint swings waste energy and wear the compressor. Steady beats “crank it to 68 when you get home.”",
    inDepth:
      "A compressor is happiest holding a steady temperature, not chasing a huge drop the minute you walk in. In a SoCal house, 76 to 78 degrees during the day is a common range people can live with. Dropping the setpoint 10 degrees when you get home makes the system run flat out for hours and still may not catch the west-facing rooms. A 2 or 3 degree setback while you are out is enough. Afternoon sun through west windows is often a bigger load than the setpoint itself, which is why blinds beat another gadget. Flipping from heat to cool and back on the same day forces the system to reverse before it has settled.",
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
    image: photo("photo-1621905251189-08b45d6a269e"),
    why: "A few checks save a trip. Past that, guessing can turn a small leak into a dead compressor.",
    inDepth:
      "A filter, a breaker, and a look at the outdoor unit solve a surprising number of no-cool calls. Past that, the failure is usually inside the refrigerant circuit, the blower, or a safety control. Resetting a tripped breaker over and over hides a short or an overheating motor. Adding refrigerant on top of a leak does not fix the leak, and the compressor can fail from running without enough charge. Gas is the hard stop: if you smell it, leave and call the gas company before anyone starts guessing.",
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
    image: photo("photo-1550998251-1e18917c975c"),
    why: "May and June are cheaper and faster than the first 100° weekend. A clean coil and correct charge keep you from waiting in line.",
    inDepth:
      "The first hot weekend is when every neglected system fails at once, and the schedule fills up. A spring visit lets us wash the coil, check the charge, and measure the temperature split while you still have time to decide. The temperature split is the difference between air going in and air coming out. It tells you the system is actually moving heat, not just making noise. Tell us which rooms feel worst before we arrive. That is the real diagnostic. A new filter the week of the visit means we are not measuring a clogged screen and calling it a weak system.",
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
    image: photo("photo-1545649311-24d0ac00ae82"),
    why: "Ice usually means airflow or refrigerant — not “add freon and go.” Running it iced can wreck the compressor.",
    inDepth:
      "Ice on the copper lines or the indoor coil means the refrigerant is getting too cold because air is not moving across it, or because the charge is wrong. Keep running it and the compressor is pumping liquid, which it is not built to do. Turn cooling off and leave the fan on so room air melts the ice. That can take a few hours. Chipping it bends fins and can puncture a line. A fresh filter and open vents fix the airflow cases. If the ice comes back on a clean filter, the charge or the metering device is next, and that is a service call, not another bottle of refrigerant.",
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
    image: photo("photo-1513694203232-719a280e022f"),
    why: "You'd rather find a dead heater in October than at 5 a.m. in January.",
    inDepth:
      "Heaters sit idle all summer, so the first cold night is when a dead igniter, a stuck valve, or a filthy filter shows up. Raising the setpoint about 3 degrees is enough to prove warm air is coming out. Long bangs or a long wait before ignition are the furnace struggling to light, not a normal startup. A bedroom that stays cold while the hallway is fine is often a duct or a balancing problem. A bigger furnace will not fix a run that never reaches that room.",
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
    image: photo("photo-1581094794329-c8112a89af12"),
    why: "Restricted airflow overheats a furnace. Safety switches then shut it down — or worse, it cracks a heat exchanger over time.",
    inDepth:
      "A furnace needs air across the heat exchanger the same way an A/C needs air across the coil. Starve it and the metal overheats. Limit switches shut it down, and years of that cycle can crack the exchanger, which is how combustion gas gets into the house. A thicker filter than the system was built for does the same thing as a dirty one. Boxes stacked against the cabinet steal the air the burners need. A healthy gas flame is mostly blue. Yellow flame, soot, or headaches while the heat runs are reasons to stop using it. A carbon monoxide alarm means everyone leaves first.",
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
    image: photo("photo-1558002038-1055907df827"),
    why: "Heat pumps heat and cool. In our mild winters they shine — if the outdoor unit stays clear and the aux heat isn't stuck on.",
    inDepth:
      "A heat pump moves heat instead of making it with a flame. In a mild winter that is efficient, as long as the outdoor coil can breathe and defrost. A little steam on a cool morning is the defrost cycle, not a leak. A solid block of ice is not. Emergency or auxiliary heat is electric strip heat. It is there for a backup, and if it stays on for days you are paying a much higher rate for the same warmth. The indoor coil is the same one the A/C uses, so a dirty filter hurts both seasons.",
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
    image: photo("photo-1600607687939-ce8a6c25118c"),
    why: "Head units clog faster than a big return because the filters are small. Dirty heads drip, smell, and quit cooling a room.",
    inDepth:
      "A mini-split head pulls room air across a small coil and a small mesh filter. That filter loads in weeks, not months. When it clogs, the coil gets too cold, moisture drips inside the room, and the head starts to smell. Rinse the mesh and let it dry all the way before it goes back, or you put a wet pad on the coil. The louvers need a clear path across the room. A sofa in front of the head turns the airflow back on itself, so that room never catches up even when the filter is clean.",
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
    image: photo("photo-1504328345606-18bbc8c9d7d1"),
    why: "Everything sits in one box. Debris on the coil and a clogged drain will take out cooling for the whole house.",
    inDepth:
      "A package unit puts the blower, the coil, and the compressor in one cabinet, often on the roof. There is no second system to carry the house if that box stops. Leaves on the coil and a clogged condensate drain are the usual causes, and both take out cooling everywhere at once. Looking from the ground is the homeowner check: disconnect on, pad not sinking, trees not dumping on it. Walking a tile roof to peek is how roof leaks start. A water stain on the ceiling under a roof unit is a drain or a curb problem, and it gets worse on the next hot day.",
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
    image: photo("photo-1584622650111-993a426fbf0a"),
    why: "Moisture and cooking grease that stay inside become mold and a dirty coil. Fans only work if they actually vent outside.",
    inDepth:
      "A fan only helps if it moves moist or greasy air all the way outside. A bath fan that dumps into the attic just relocates the mold. Twenty minutes after a shower is about how long it takes to pull the steam out of the room, not just off the mirror. A range hood with a packed grease filter is a light and a noise, not ventilation. If the fan is loud and you feel nothing at the grille, the duct is often crushed or disconnected. That moisture ends up on windows and, eventually, on the air conditioner's coil.",
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
    image: photo("photo-1558618666-fcd25c85cd64"),
    why: "Leaky ducts dump cooled air into a hot attic. You pay twice and still have a hot bedroom.",
    inDepth:
      "Supply ducts are supposed to deliver cooled or heated air to a register. A disconnected or crushed run dumps that air into the attic or a crawl space, so you pay to condition a space you do not live in, and one bedroom stays wrong. Cloth tape that looks like duct tape dries out and falls off. Mastic or real foil tape is what holds. Shutting too many vents to \"push air\" to one room raises pressure in the ducts, makes them leak more, and makes the blower noisy. Black streaks at a register often mean dusty attic air is being pulled in, which is a leak or a return problem.",
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
    image: photo("photo-1503387762-592deb58ef4e"),
    why: "In Orange County, a thin attic is like running the A/C with the oven on. Insulation is often cheaper than a bigger unit.",
    inDepth:
      "The attic is the hottest part of the house on a summer afternoon. If the insulation is thinner than the ceiling joists and you can see the wood, a lot of that heat is coming straight through the ceiling. A bigger air conditioner is then asked to fight the attic all day. Sealing the big holes first, around the hatch and the flues, matters more than piling fluff on top of leaks. Insulation has to stay off non-IC can lights, off the air handler, and out of the soffit vents, or you create a fire or airflow problem while you are trying to save energy. An upstairs that is always about 5 degrees hotter is often this, not a unit that is too small.",
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
    image: photo("photo-1600585154340-be6161a56a0c"),
    why: "SoCal gets wildfire smoke and Santa Ana dust. A better filter helps — if the system can handle it. A too-tight filter can starve airflow.",
    inDepth:
      "Wildfire smoke and Santa Ana dust load a filter in days. A higher MERV filter catches more of it, but only if the blower can still move air. Too tight, and you get the same weak airflow and iced coil as a filthy cheap filter. Use the MERV rating we specified for your system, and change it more often during smoke weeks. Recirculating on the worst days keeps you from pulling that outdoor air in. A portable HEPA in a bedroom helps the people sleeping there. It does not clean the whole house or fix a system that is already struggling.",
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
    image: photo("photo-1576013551627-0cc20b96c2a7"),
    why: "These sit outside year-round. A dirty coil or low water flow makes them expensive to run and slow to heat.",
    inDepth:
      "A pool heat pump pulls heat from the outside air and moves it into the water. It needs two things: air through the coil, and water moving through the heat exchanger. Palm litter on the fins blocks the air. A dirty pool filter or a pump that is off blocks the water, so the unit runs and the pool does not gain degrees. Rinse the coil the same way you would an air conditioner, from the outside in, without a pressure washer. Ice on the coil while it is trying to heat is a flow or a charge problem, not something to scrape off.",
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
