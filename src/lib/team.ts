export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  bio: string[];
  image: string;
  specialties: string[];
  yearsWithCompany?: number;
  funFact?: string;
  leadership?: boolean;
};

export const team: TeamMember[] = [
  {
    slug: "andy",
    name: "Andy",
    role: "Founder & Lead Technician",
    shortBio:
      "Family man, licensed pro, and the reason How Much? exists ? transparent HVAC without the games.",
    bio: [
      "Andy built How Much? after years watching homeowners get the runaround ? inflated quotes, pressure tactics, and techs who wouldn?t explain the ?why.?",
      "He?s a husband and dad first. That shows up on job sites: respect for your home, honesty with your budget, and options you can actually understand.",
      "When he?s not diagnosing a stubborn condenser, he?s with his kids ? and yeah, he?s happy for you to see the family side of the brand. It?s who we are.",
    ],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Diagnostics", "System design", "Second opinions", "Customer education"],
    yearsWithCompany: 15,
    funFact: "Will happily talk heat pumps at a barbecue.",
    leadership: true,
  },
  {
    slug: "marcus-chen",
    name: "Marcus Chen",
    role: "Operations Manager",
    shortBio: "Keeps schedules tight, crews prepared, and homeowners in the loop.",
    bio: [
      "Marcus runs the day-to-day so jobs start on time and finish clean. If you?ve ever gotten a clear ETA text before we arrive ? that?s the standard he protects.",
      "He came up on the tools before moving into operations, so he knows what ?realistic? looks like on a real install day.",
    ],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Scheduling", "Quality control", "Crew coordination"],
    yearsWithCompany: 6,
    funFact: "Color-codes the whiteboard like it?s a competitive sport.",
    leadership: true,
  },
  {
    slug: "sofia-reyes",
    name: "Sofia Reyes",
    role: "Client Experience Lead",
    shortBio: "Your go-to for quotes, portal updates, and making the process feel human.",
    bio: [
      "Sofia makes sure every homeowner knows what?s next ? estimates, appointments, and those ?what does this option mean?? questions.",
      "She?s building the client experience How Much? is known for: clear, calm, and never pushy.",
    ],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Client communication", "Estimates", "Portal experience"],
    yearsWithCompany: 4,
    funFact: "Can translate HVAC jargon into normal human in under 10 seconds.",
    leadership: true,
  },
  {
    slug: "derek-hollins",
    name: "Derek Hollins",
    role: "Senior Install Technician",
    shortBio: "Precision installs, clean job sites, and startups done right.",
    bio: [
      "Derek leads install days ? removal, set, brazing, electrical coordination, and commissioning. Detail is the whole job.",
      "Homeowners notice the drop cloths and the walkthrough at the end. That?s intentional.",
    ],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    specialties: ["System installs", "Heat pumps", "Commissioning"],
    yearsWithCompany: 8,
    funFact: "Measures twice. Then measures again.",
  },
  {
    slug: "jayden-park",
    name: "Jayden Park",
    role: "Service Technician",
    shortBio: "Diagnostics specialist who finds the real problem ? not the easy upsell.",
    bio: [
      "Jayden lives for the puzzles: intermittent faults, weird airflow, systems that ?should? work but don?t. He documents findings so you can see the logic.",
      "If a $180 part fixes it, he?ll say that ? loud and clear.",
    ],
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Repair diagnostics", "Maintenance", "Electrical troubleshooting"],
    yearsWithCompany: 5,
    funFact: "Brings a backup meter. And a backup for the backup.",
  },
  {
    slug: "elena-vasquez",
    name: "Elena Vasquez",
    role: "Service Technician",
    shortBio: "Maintenance pro and IAQ-minded tech who keeps systems healthy year-round.",
    bio: [
      "Elena runs tune-ups like they matter ? because they do. Filters, coils, drains, safety checks, and honest ?fix this before summer? advice.",
      "She?s often the first person families meet for seasonal care plans.",
    ],
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Maintenance", "Indoor air quality", "Customer education"],
    yearsWithCompany: 3,
    funFact: "Has a favorite condensate pan photo. Don?t ask.",
  },
  {
    slug: "chris-nguyen",
    name: "Chris Nguyen",
    role: "Apprentice Technician",
    shortBio: "Learning the How Much? way: explain everything, pressure nothing.",
    bio: [
      "Chris is building skill the right way ? under senior techs, with a focus on communication and craftsmanship.",
      "If you see him on a job, he?s there to support a clean, thorough visit.",
    ],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    specialties: ["Install support", "Maintenance assist", "Site prep"],
    yearsWithCompany: 1,
    funFact: "Takes better before/after photos than half the marketing world.",
  },
];

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}

export function getLeadership() {
  return team.filter((m) => m.leadership);
}
