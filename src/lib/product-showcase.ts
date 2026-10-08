export type ShowcaseCard = { title: string; body: string; image: string };
export type ShowcasePart = { title: string; body: string };

export type ProductShowcase = {
  title: string;
  intro: string;
  cards: ShowcaseCard[];
  partsTitle?: string;
  partsIntro?: string;
  parts?: ShowcasePart[];
};

function shot(slug: string, slot: "left" | "center" | "right") {
  return `/products/scenes/${slug}-${slot}.jpg`;
}

const showcases: Record<string, ProductShowcase> = {
  "diy-5th-generation": {
    title: "Heat and cool one room without opening the walls",
    intro:
      "This is the system for a room the rest of the house never quite gets right. A bedroom that bakes, a garage you actually sit in, an addition with no duct. The line set shows up already charged, so the hard part of a mini-split is already done.",
    cards: [
      {
        title: "Warm when the morning is not",
        body: "It keeps heating when it is down to -13 F outside, and it keeps cooling when the yard hits 122 F. You feel that on the first cold night and the first week of September, not on a spec sheet.",
        image: shot("diy-5th-generation", "left"),
      },
      {
        title: "The temperature where you are sitting",
        body: "One head, one room, one setting. You are not bargaining with a hallway thermostat that thinks the whole house is the living room. Five sizes run from a bedroom up to about 1,550 square feet. If the room is bigger than that, or you need a second head, this is the wrong box and we will say so.",
        image: shot("diy-5th-generation", "center"),
      },
      {
        title: "Quiet enough to sleep next to",
        body: "The indoor unit is what you live with. It should disappear once the lights are off. After a power blink it comes back on the settings you left, including the louver, instead of waiting for someone to reprogram it in the dark.",
        image: shot("diy-5th-generation", "right"),
      },
    ],
  },
  "diy-select": {
    title: "A smaller system for a room that just needs its own air",
    intro:
      "Select is the straightforward single-zone kit. Same idea as the 5th generation: a charged line set, one head, one outdoor unit. It is the one we point people to when the room is simple and they do not need the longer feature list.",
    cards: [
      {
        title: "That one room, finally",
        body: "A guest room over the garage, a home office that was an afterthought, a sunroom the central system never reaches. Select heats and cools that space on its own, so you stop opening windows and running a space heater in the same afternoon.",
        image: shot("diy-select", "left"),
      },
      {
        title: "You can hang it, or we can",
        body: "The line set is already charged. A careful homeowner can mount the head, run the line, and power it. If you would rather not be on a ladder with a torque wrench, How Much? does the same install and stands behind it. Either way you are not paying for a vacuum pump and a refrigerant scale on day one.",
        image: shot("diy-select", "center"),
      },
      {
        title: "Leave the rest of the house alone",
        body: "The ducts, the furnace, and the thermostat stay as they are. You are adding a zone, not replacing the system that already works for the rooms that were built with it.",
        image: shot("diy-select", "right"),
      },
    ],
  },
  "diy-easy-pro": {
    title: "More than one room, still one outdoor unit",
    intro:
      "Easy Pro is the kit for a house that has two or three problem rooms, not one. Each head gets its own line set and its own temperature. The outdoor unit is sized to the number of zones, and the line lengths have to match it.",
    cards: [
      {
        title: "The kids' room and yours do not match",
        body: "One person sleeps cold. One works from a hot office. A single hallway thermostat will not settle that argument. Each head on Easy Pro has its own setpoint, so the rooms stop sharing a compromise.",
        image: shot("diy-easy-pro", "left"),
      },
      {
        title: "The outdoor unit has to fit the runs",
        body: "A small three-zone condenser does not get the same total line length as a six-zone. Andy checks the path from each head to the pad before anyone orders line set. A kit that cannot reach the third room is an expensive mistake.",
        image: shot("diy-easy-pro", "center"),
      },
      {
        title: "Close a door and keep your air",
        body: "That is the whole point of zones. The bedroom can be cool with the door shut. The living room can stay where everyone else wants it. You are not conditioning empty rooms to make one of them comfortable.",
        image: shot("diy-easy-pro", "right"),
      },
    ],
  },
  "diy-outtasight-ceiling-cassette": {
    title: "Air from the ceiling, walls left alone",
    intro:
      "A wall head is the wrong shape for some rooms. Art, windows, cabinets, a bed pushed to the only solid wall. The cassette sits in the ceiling and throws air out across the room, with the same pre-charged connection as the wall kits.",
    cards: [
      {
        title: "The wall you did not want to give up",
        body: "If the only place a wall unit fits is above the sofa or across a window, do not force it. The cassette uses the ceiling. The room still gets its own zone, and it still does not need ducts.",
        image: shot("diy-outtasight-ceiling-cassette", "left"),
      },
      {
        title: "Flush, not hanging in the sightline",
        body: "From the floor you see a square grille, not a box on the wall. It needs a ceiling that can take it: joist direction, a clear path for the line, and enough depth. We look at that before the cassette is ordered, because a beautiful grille in the wrong ceiling is a remodel.",
        image: shot("diy-outtasight-ceiling-cassette", "center"),
      },
      {
        title: "A dinner table that is not under a draft from the wall",
        body: "Air comes from above and spreads. People sitting around a table are not getting hit from one side. That is why this one shows up in dining rooms and open living spaces more than in narrow bedrooms.",
        image: shot("diy-outtasight-ceiling-cassette", "right"),
      },
    ],
  },
  "advantage-5th-generation": {
    title: "The same generation of equipment, set by a tech",
    intro:
      "Advantage is not the homeowner kit. A licensed install sets the line and the charge. You get the 5th generation equipment without spending a Saturday on a ladder. That is the job How Much? does.",
    cards: [
      {
        title: "You wanted the equipment, not the project",
        body: "Some people like the DIY line set. A lot of people want the room done and someone to call if it is not right. Advantage is that path. We size the room, mount both pieces, and start it.",
        image: shot("advantage-5th-generation", "left"),
      },
      {
        title: "One room, sized to that room",
        body: "Tonnage comes from the space, the sun, and the insulation. A west-facing addition is not the same load as a bedroom on the north side, even when the square footage matches. We do not pick the size from the photo on this page.",
        image: shot("advantage-5th-generation", "center"),
      },
      {
        title: "Someone stays until it is actually cooling",
        body: "Startup is part of the install. Temperature split, the drain, the outdoor pad, and the control all get checked before we call it done. Manufacturer coverage stays with the equipment. The workmanship stays with How Much?",
        image: shot("advantage-5th-generation", "right"),
      },
    ],
  },
  "olympus-e-star": {
    title: "A quiet single room, installed properly",
    intro:
      "Olympus E Star is a contractor-installed single-zone mini-split. One head, one outdoor unit, sized to the room you are tired of fighting. It is the system we put in when the room deserves a careful install more than a weekend kit.",
    cards: [
      {
        title: "The room you sit in, not the hallway",
        body: "Point it at the chair, the bed, the desk. The remote reads the air where you are holding it, and the unit chases that spot instead of the temperature up at the ceiling. You stop getting up to stand under the vent.",
        image: shot("olympus-e-star", "left"),
      },
      {
        title: "Built to be lived next to",
        body: "A mini-split only works if you can forget it is there. Olympus is the quieter, more finished end of this lineup. We place the head so it is not blowing on a pillow, and we set the outdoor unit where it is not outside a bedroom window.",
        image: shot("olympus-e-star", "center"),
      },
      {
        title: "Asleep, with the compressor somewhere else",
        body: "The loud piece is outside. Inside you get air, not a window unit rattling in the sash. If a refrigerant leak shows up, the sensor on the air handler says so. You should not find that out as a warm room three months later.",
        image: shot("olympus-e-star", "right"),
      },
    ],
  },
  "olympus-multi-zone": {
    title: "Several rooms. One pad. No new ducts.",
    intro:
      "Olympus multi-zone is how a house gets room-by-room comfort without tearing into the attic. Each room gets a head. They share one outdoor unit. The zone count and the line lengths have to match that condenser, or the last room suffers.",
    cards: [
      {
        title: "A nursery does not have to match the office",
        body: "Sleep, work, and a guest room want different air. Multi-zone lets you close the door. The rest of the house is not dragged along to fix one room, and you are not running window units to fake it.",
        image: shot("olympus-multi-zone", "left"),
      },
      {
        title: "One outdoor unit, if the lines reach",
        body: "The condenser is the part the neighbors see, and it should be one cabinet, not a row of them. That only works when every head can get a legal line length back to the pad. We measure the paths. We do not promise five rooms and then discover the third is too far.",
        image: shot("olympus-multi-zone", "center"),
      },
      {
        title: "Shut the door. Keep your setpoint.",
        body: "Each head has its own control. The home office can stay cool through a call. The bedroom can be warmer. You are paying to condition the rooms you use, at the temperature the person in that room actually wants.",
        image: shot("olympus-multi-zone", "right"),
      },
    ],
  },
  "universal-split-r454b": {
    title: "Whole-house heat and cool, on the ducts you have",
    intro:
      "Universal is a central heat pump. The outdoor unit and the air handler are separate, and they tie into ductwork that can actually move the air. R-454B is the refrigerant this generation is built around. Tonnage is a site decision.",
    cards: [
      {
        title: "One system for the rooms that share ducts",
        body: "If the house was built with ducts and the ducts are sound, you do not need a head in every room. A heat pump covers heating and cooling from the equipment you already understand: a thermostat, registers, a filter.",
        image: shot("universal-split-r454b", "left"),
      },
      {
        title: "The ducts get a vote",
        body: "A new condenser on tired, crushed, or undersized ducts just moves the complaint from the equipment to the vents. We look at airflow before anyone spends the money. If the ducts cannot carry the tonnage, the quote says that.",
        image: shot("universal-split-r454b", "center"),
      },
      {
        title: "Heat without a second appliance",
        body: "A heat pump is the path when you want one system for both seasons. If the house is staying on gas heat, the honest answer is a furnace and a coil, not this box. We will tell you which one you are actually buying.",
        image: shot("universal-split-r454b", "right"),
      },
    ],
  },
  "universal-packaged-heat-pump": {
    title: "One cabinet, on the roof or the pad",
    intro:
      "A packaged heat pump puts heating and cooling in a single box. It is the swap for a house that already has a package unit, a curb, and ducts that land in one place. You are not splitting the system into an attic coil and a backyard condenser.",
    cards: [
      {
        title: "The house that was built this way",
        body: "Slab homes and a lot of low-pitch roofs were never meant to hide an air handler in a closet. The package unit is the equipment those houses already have a spot for. Replacing it with a split means inventing a mechanical room you do not have.",
        image: shot("universal-packaged-heat-pump", "left"),
      },
      {
        title: "The curb has to match",
        body: "The new cabinet only drops onto the old curb when the opening, the duct connections, and the electrical agree. We measure those before it is ordered. A unit that almost fits is a crane day nobody budgeted.",
        image: shot("universal-packaged-heat-pump", "center"),
      },
      {
        title: "Heat and cool from the same box",
        body: "You are not maintaining a furnace in the closet and a condenser on the pad. Filter, drain, and the cabinet are the service points. How Much? sets it and shows you where those are before we leave.",
        image: shot("universal-packaged-heat-pump", "right"),
      },
    ],
  },
  "geocool-inverter-series": {
    title: "Use the ground, if the ground can take it",
    intro:
      "GeoCool is a geothermal heat pump. The heat comes from a loop in the ground, not from an outdoor coil fighting the afternoon air. It is the right machine when a loop already exists or when the lot can honestly hold one. It is the wrong machine when someone just wants a normal heat pump.",
    cards: [
      {
        title: "The yard stays quiet",
        body: "There is no condenser screaming next to a bedroom window, because the exchange is in the loop. The house still gets ducts, a thermostat, and real heating and cooling. The equipment people hear is not sitting on the side yard.",
        image: shot("geocool-inverter-series", "left"),
      },
      {
        title: "The loop decides, not the brochure",
        body: "Soil, lot size, and whether a loop is already in the ground decide if this is possible. An inverter geothermal unit cannot invent a loop. If the lot cannot take one, we will say no and quote a system that fits the house you have.",
        image: shot("geocool-inverter-series", "center"),
      },
      {
        title: "Steady, because the ground is",
        body: "Outside air swings from a cold morning to a hot afternoon. The ground does not. That is why this system holds capacity when an air-source unit is working the hardest. It is also why it is a bigger decision than a condenser swap.",
        image: shot("geocool-inverter-series", "right"),
      },
    ],
  },
  "versapro-gas-furnaces": {
    title: "Gas heat, sized to the house that wants to keep it",
    intro:
      "A furnace is the right answer when the house heats with gas and that is staying. Input, airflow, and the vent decide the unit. The coil and the outdoor piece have to match it if cooling is part of the same job.",
    cards: [
      {
        title: "Heat you can feel at the floor",
        body: "People who grew up with a furnace notice when the replacement is timid. We size the input to the house and the ducts, not to the smallest box that will light. A furnace that short-cycles never warms the rooms at the end of the run.",
        image: shot("versapro-gas-furnaces", "left"),
      },
      {
        title: "The vent and the coil have to agree",
        body: "A new furnace on an old flue, or under a coil that does not match, is how a simple swap becomes a callback. We look at the venting, the return, and the outdoor unit together. If only the furnace is dying, we do not invent a full system you do not need.",
        image: shot("versapro-gas-furnaces", "center"),
      },
      {
        title: "The rest of the night stays quiet",
        body: "Once it is sized and the airflow is right, a furnace should come on, heat the house, and go off. You should not hear it hunting. We check temperature rise before we call the job done.",
        image: shot("versapro-gas-furnaces", "right"),
      },
    ],
  },
  "versapro-2nd-generation": {
    title: "A straight central system for a ducted house",
    intro:
      "VersaPro is the condenser and air handler pair we quote when the house has ducts, a normal electrical service, and a pad or a roof that can take an outdoor unit. It is the workhorse split, not a specialty.",
    cards: [
      {
        title: "The house you already live in",
        body: "Registers, a filter, a thermostat on the wall. VersaPro replaces that system when the old one is done, without asking you to learn a head in every room. Upstairs and down only work if the ducts were built to serve both. We check that.",
        image: shot("versapro-2nd-generation", "left"),
      },
      {
        title: "Matched on purpose",
        body: "The outdoor unit, the coil, and the air handler are a set. Mixing leftovers from the old system is how you get a compressor that runs and a house that does not cool. Andy confirms the tonnage after he sees the house. Two to five ton is the usual range. The photo does not pick it.",
        image: shot("versapro-2nd-generation", "center"),
      },
      {
        title: "A thermostat you already understand",
        body: "Set it and leave it. There is no app you have to keep alive for the house to be comfortable. If you want scheduling later, we add a stat that actually talks to this equipment. We do not sell you a screen the system cannot use.",
        image: shot("versapro-2nd-generation", "right"),
      },
    ],
  },
  "central-ducted-hyper-heat-2nd-generation": {
    title: "Ducted heat that still shows up on a cold night",
    intro:
      "Hyper heat is the ducted heat pump for a house that wants to leave gas behind, or never had it, and still needs real heat when the night drops. It uses the ducts you have. It is chosen when heating output in cold weather is the reason you are replacing the system.",
    cards: [
      {
        title: "January morning, heat at the register",
        body: "A standard heat pump can feel finished right when you need it. Hyper heat is the one we spec when the house still has to wake up warm. You should feel it at the register, not have to explain to a guest why the system is 'trying.'",
        image: shot("central-ducted-hyper-heat-2nd-generation", "left"),
      },
      {
        title: "Still a ducted house",
        body: "This is not a wall head in the living room with space heaters down the hall. The ducts have to move the air. If they cannot, a better compressor will not fix the back bedroom. We say that before the unit is ordered.",
        image: shot("central-ducted-hyper-heat-2nd-generation", "center"),
      },
      {
        title: "One system through the seasons",
        body: "Cooling in September and heat on the cold nights come from the same equipment. You are not keeping a furnace as a backup unless the house truly needs one. If it does, we will quote that instead of pretending this covers it.",
        image: shot("central-ducted-hyper-heat-2nd-generation", "right"),
      },
    ],
  },
  "signature-series": {
    title: "The step up, when the difference is real",
    intro:
      "Signature is the higher central split in this family. Same job as VersaPro: a ducted house, a matched coil, a thermostat. The reason to buy it is the equipment itself. Andy puts the two next to each other so the price is a difference you can see, not a label.",
    cards: [
      {
        title: "A living room you can hold a conversation in",
        body: "The upgrade people actually notice is sound and how evenly the house holds. Signature is the one we bring when the current system is loud, short-cycles, or the rooms at the end of the duct never catch up.",
        image: shot("signature-series", "left"),
      },
      {
        title: "Not a badge on the same box",
        body: "If Signature and VersaPro would perform the same way in your house, we will tell you to buy VersaPro. The step up has to earn the quote. Tonnage, ducts, and electrical still decide the size. The series decides the equipment.",
        image: shot("signature-series", "center"),
      },
      {
        title: "The bedroom at the end of the run",
        body: "That room is where a marginal system shows itself. Signature is aimed at houses where you want that room to land on the same setpoint as the thermostat, without a space heater in January or a fan in the doorway in August.",
        image: shot("signature-series", "right"),
      },
    ],
  },
  "pre-charged-evaporator-coils": {
    title: "A new coil, when the rest of the system can stay",
    intro:
      "Sometimes the outdoor unit is fine and the coil is the part that failed. A pre-charged evaporator coil replaces that piece without turning the job into a whole new house of equipment. It still has to match the furnace or air handler and the condenser. A pre-charge saves a step. It does not forgive a mismatch.",
    cards: [
      {
        title: "Air that actually leaves the vents",
        body: "A tired coil is often why the system runs and the rooms do not change. You feel it as weak airflow and a thermostat that never quite gets there. A matched coil gives the blower something to work with.",
        image: shot("pre-charged-evaporator-coils", "left"),
      },
      {
        title: "Match the cabinet you already own",
        body: "Width, refrigerant, and the outdoor unit all have to agree. We do not pull a coil off a truck because the height looked close. If the furnace or the condenser is the real failure, a new coil on top of it is wasted money, and the quote will say so.",
        image: shot("pre-charged-evaporator-coils", "center"),
      },
      {
        title: "The closet goes back to being a closet",
        body: "This is a shorter job than a full system when the diagnosis is honest. We swap the coil, check the drain, and prove the supply air before we leave. You should not be living around an open air handler.",
        image: shot("pre-charged-evaporator-coils", "right"),
      },
    ],
  },
  "versapro-2nd-gen-packaged-unit": {
    title: "Swap the cabinet. Keep the ducts.",
    intro:
      "This is the VersaPro package unit: heating and cooling in one box, for a rooftop curb or a concrete pad. It replaces a package unit. It does not turn a package house into a split.",
    cards: [
      {
        title: "Built for the slab and the flat roof",
        body: "If your air already comes from one cabinet outside, that is the system to replace. The living room does not need a new architecture. It needs a cabinet that can keep up with the afternoon and still heat in the morning.",
        image: shot("versapro-2nd-gen-packaged-unit", "left"),
      },
      {
        title: "Opening, pad, and power",
        body: "We measure the curb or the pad, the duct connection, and the breaker before the unit is ordered. A cabinet that is right on paper and wrong by two inches is a different job. You should hear that on the quote, not on install day.",
        image: shot("versapro-2nd-gen-packaged-unit", "center"),
      },
      {
        title: "Inside stays cool when the patio is not",
        body: "Southern California afternoons are the test. The package unit has to hold the house with the doors shut and the sun on the glass. We size it to that, then we start it and check the rooms, not just the cabinet.",
        image: shot("versapro-2nd-gen-packaged-unit", "right"),
      },
    ],
  },
  "mrbreeze-bladeless-fan": {
    title: "Move the air you already paid to cool",
    intro:
      "A bladeless fan is a room fan. It does not remove heat from the house, and it will not replace an air conditioner. It is the right add-on when a corner stays still even though the system is running, and the wrong purchase when the room is actually hot.",
    cards: [
      {
        title: "The corner the vent never reaches",
        body: "You can have a working system and still sit in a dead spot. The fan pushes the air you already cooled into that corner. If the room is hot because the system cannot keep up, we will tell you to buy a mini-split instead of a fan.",
        image: shot("mrbreeze-bladeless-fan", "left"),
      },
      {
        title: "A plug, not a line set",
        body: "It sits in the room and uses a normal outlet. No refrigerant, no pad, no tonnage. We will place it where the air path is open. A fan shoved behind a sofa does nothing.",
        image: shot("mrbreeze-bladeless-fan", "center"),
      },
      {
        title: "Quiet enough to leave on",
        body: "The reason to choose this shape is the room you are sitting in. You should be able to read, or leave it running while the real system cycles, without a blade fan ticking in your ear.",
        image: shot("mrbreeze-bladeless-fan", "right"),
      },
    ],
  },
  "coolblade-hvls-fan": {
    title: "A big, slow fan for a room with height",
    intro:
      "CoolBlade is a high-volume fan for a shop, a garage, or a tall open room. It moves a lot of air without spinning like a house fan. Ceiling height and structure decide if it can hang there. An eight-foot ceiling gets a different fan.",
    cards: [
      {
        title: "A shop you can stand in after lunch",
        body: "Big rooms stratify. The air at your head is hotter than the air you think the building has. A large slow fan mixes that so the space is usable. It is still not an air conditioner. If you need the shop cold, this is the helper, not the system.",
        image: shot("coolblade-hvls-fan", "left"),
      },
      {
        title: "Diameter follows the floor, not the photo",
        body: "Too small and it looks busy while the corners stay still. Too big and it is in the way of a door, a lift, or a light. We measure the slab and the joists. The fan only gets ordered when the structure can carry it.",
        image: shot("coolblade-hvls-fan", "center"),
      },
      {
        title: "Hung, wired, and out of your way",
        body: "How Much? mounts it to structure and lands it on a proper circuit. You should be able to walk under it and work. A fan that makes you duck is the wrong diameter, and we will not install that.",
        image: shot("coolblade-hvls-fan", "right"),
      },
    ],
  },
  "heatwise-electric-tank-water-heater": {
    title: "Hot water that is already there",
    intro:
      "A tank is a simple promise. Someone turns a tap, and the water is hot because it was heated while nobody was waiting. HeatWise is the electric tank we sell when the panel can carry it and the gallons match the people who actually live in the house.",
    cards: [
      {
        title: "The second shower stays hot",
        body: "The failure people remember is the shower that fades halfway through. Stored gallons are what prevent that, if the tank was sized for how this house overlaps. Two showers and a dishwasher in the same half hour is a different tank than a house where everyone staggers.",
        image: shot("heatwise-electric-tank-water-heater", "left"),
      },
      {
        title: "Set it once",
        body: "The dial is on the tank. You pick a temperature and the elements hold the water there. There is no app between you and a shower, and no one in the house has to learn a schedule to wash a pan at night. If you want it hotter or cooler, it is one control, in the room where the tank lives. How Much? sets it where most families leave it, then shows you the dial before we go.",
        image: shot("heatwise-electric-tank-water-heater", "center"),
      },
      {
        title: "Still quiet in year eight",
        body: "Tanks die from the inside. Scale on the elements, sediment on the bottom, and a drain you cannot turn. This one is lined so water is not sitting on bare steel, an anode takes the corrosion, and the drain is brass so a flush is still possible later.",
        image: shot("heatwise-electric-tank-water-heater", "right"),
      },
    ],
    partsTitle: "What is actually in the tank",
    partsIntro:
      "The comfort is the hot shower. The lifespan is these parts. They are why we sell this tank instead of a plain cylinder with a plastic valve.",
    parts: [
      {
        title: "Enameled interior",
        body: "A glass-like lining keeps the water off the steel, so the tank is not rusting from the first fill.",
      },
      {
        title: "Rare-earth anode",
        body: "The rod corrodes on purpose. When it is spent, you replace the rod. You do not replace the tank.",
      },
      {
        title: "Self-cleaning flow",
        body: "Incoming water is directed so sediment keeps moving instead of baking into a layer on the bottom.",
      },
      {
        title: "Ceramic elements",
        body: "The coating resists the mineral crust that makes an old element work harder for the same hot water.",
      },
      {
        title: "Brass drain valve",
        body: "Metal you can still turn a few years from now, when it is time to flush. Plastic valves are what seize.",
      },
    ],
  },
  "mini-stat": {
    title: "A wall control that matches the system",
    intro:
      "The Mini-Stat is a thermostat. It does not make hot or cold air. It belongs on equipment that can use it, and it replaces a control that is confusing, dead, or just ugly on the wall.",
    cards: [
      {
        title: "Set it on the way out",
        body: "The control should be where a hand already reaches, and it should do one job clearly. Mini-Stat is the simple wall stat for a compatible system. If your equipment cannot talk to it, we will not sell it to you.",
        image: shot("mini-stat", "left"),
      },
      {
        title: "The wires you already have",
        body: "When the cable in the wall is the right one, this replaces the old stat on that cable. We confirm the system first, land the wires, and leave it running the way you live. You should not inherit a factory schedule.",
        image: shot("mini-stat", "center"),
      },
      {
        title: "Still there when the phone is in the other room",
        body: "A wall control does not need an account. Someone can change the temperature without finding a login. That is the point of this one, next to the smart stat, which is a different product.",
        image: shot("mini-stat", "right"),
      },
    ],
  },
  "smart-thermostat": {
    title: "Change the house before you walk in",
    intro:
      "The smart stat is for scheduling and for changing the temperature when you are not home. It only belongs on equipment that speaks its language. If yours does not, we will say so and sell you a stat that works.",
    cards: [
      {
        title: "The house is already right when you get there",
        body: "Leave it set back while you are out. Bring it to temperature before you pull in, instead of walking into a hot living room and waiting. The schedule should match how you actually live, and we leave the first one in place.",
        image: shot("smart-thermostat", "left"),
      },
      {
        title: "The phone and the wall",
        body: "Remote changes are the feature. The wall control is the backup for a dead phone or a guest who does not have the app. Setup is the wiring plus the account, in one visit, on equipment we already confirmed.",
        image: shot("smart-thermostat", "center"),
      },
      {
        title: "A morning that started without you",
        body: "The useful version of a smart stat is not a gadget. It is a house that is comfortable when you walk into the kitchen. On compatible equipment it can also pair with Alexa. We confirm that pairing on site, not as a promise on this page.",
        image: shot("smart-thermostat", "right"),
      },
    ],
  },
  monoblock: {
    title: "One cabinet, through the wall",
    intro:
      "A monoblock puts the whole heat pump in a single box. There is no separate outdoor condenser to hide and no line set between two pieces. It needs a wall that can take the sleeve, and a room that matches what that cabinet can actually do.",
    cards: [
      {
        title: "The studio, the ADU, the room with no pad",
        body: "Some spaces cannot take a split. No place for a condenser, no attic, a wall that is the whole mechanical plan. The monoblock uses that wall. Inside you get heat and cool. Outside you get a grille, not a second machine.",
        image: shot("monoblock", "left"),
      },
      {
        title: "The wall is the install",
        body: "Sleeve, structure, and a clear path for air on the outside decide if this fits. We measure the wall before the unit is ordered. A cabinet that is right for the room and wrong for the stucco is not a shortcut.",
        image: shot("monoblock", "center"),
      },
      {
        title: "A guest house that can be its own temperature",
        body: "The main house keeps its system. The ADU or the back studio gets its own. You stop trying to stretch a duct that was never meant to reach, and you stop putting a window unit in a wall you just finished.",
        image: shot("monoblock", "right"),
      },
    ],
  },
  travelcool: {
    title: "Cool the coach, not the house",
    intro:
      "TravelCool is a rooftop unit for an RV or trailer. It sits on a roof opening and runs from the coach. It is the wrong product for a residential duct system, and we will not quote it as one.",
    cards: [
      {
        title: "The dinette, after the sun has been on the roof",
        body: "A camper heats up fast and cools down slow if the rooftop unit is tired. This replaces that unit so the inside of the coach is usable when you stop, not an hour later.",
        image: shot("travelcool", "left"),
      },
      {
        title: "The hole in the roof decides",
        body: "The existing opening and the roof structure have to match. We measure the hole. We do not guess it from a model year. Power comes from the coach, shore power included, not from a house panel.",
        image: shot("travelcool", "center"),
      },
      {
        title: "Checked before it goes back on the road",
        body: "Seal, fasteners, and a run test happen while the trailer is still here. You should leave with a coach that holds temperature, not a unit that looked right from the ladder.",
        image: shot("travelcool", "right"),
      },
    ],
  },
  "compact-refrigeration-system": {
    title: "Hold the box cold. That is the whole job.",
    intro:
      "This is a small refrigeration system for a cold room or a light commercial space. It is not a house air conditioner and it is not a kitchen fridge. The box volume, how often the door opens, and what you put inside decide the unit.",
    cards: [
      {
        title: "The door opens all morning",
        body: "A cold room that gets used is a different load than a box that stays shut. Product, door time, and insulation change the size. We measure the box. We do not size it from the room around it.",
        image: shot("compact-refrigeration-system", "left"),
      },
      {
        title: "The condenser has to live somewhere",
        body: "The evaporator goes in the cold space. The condenser needs air, a place to reject heat, and a path that is not dumping that heat into the prep area. If the site cannot do that, a different layout gets quoted.",
        image: shot("compact-refrigeration-system", "center"),
      },
      {
        title: "It has to hold, not just get cold once",
        body: "Startup is a temperature that stays put after the door has been opened and closed. We confirm the box holds before we call it done. A system that flashes cold and then climbs is not finished.",
        image: shot("compact-refrigeration-system", "right"),
      },
    ],
  },
};

export function getProductShowcase(slug: string): ProductShowcase {
  const showcase = showcases[slug];
  if (!showcase) {
    throw new Error(`Missing product showcase for ${slug}`);
  }
  return showcase;
}
