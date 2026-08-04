export type PortalUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  address: string;
};

export type PortalProject = {
  id: string;
  userId: string;
  title: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Estimate Ready";
  service: string;
  city: string;
  startedAt: string;
  updatedAt: string;
  nextAppointment?: string;
  summary: string;
  timeline: { date: string; title: string; detail: string }[];
  options?: {
    name: string;
    price: string;
    description: string;
    recommended?: boolean;
  }[];
  documents: { id: string; name: string; type: string; date: string }[];
  photos: { label: string; url: string }[];
  warranty?: string;
};

export type PortalMessage = {
  id: string;
  userId: string;
  from: "client" | "howmuch";
  author: string;
  body: string;
  at: string;
};

export const demoUsers: PortalUser[] = [
  {
    id: "u1",
    email: "demo@trusthowmuch.com",
    password: "howmuch",
    name: "Jordan Hale",
    address: "1284 Orchard Ave, Anaheim, CA",
  },
  {
    id: "u2",
    email: "maria@example.com",
    password: "howmuch",
    name: "Maria Santos",
    address: "44 Pacific View, Huntington Beach, CA",
  },
];

export const portalProjects: PortalProject[] = [
  {
    id: "p1",
    userId: "u1",
    title: "Carrier A/C System Replacement",
    status: "In Progress",
    service: "A/C Repair & Installation",
    city: "Anaheim",
    startedAt: "2026-07-12",
    updatedAt: "2026-08-02",
    nextAppointment: "2026-08-06 ? 9:00 AM",
    summary:
      "Full outdoor/indoor system replacement with clear Good / Better / Best options. Install scheduled for final commissioning.",
    timeline: [
      {
        date: "Jul 12",
        title: "Diagnostic visit",
        detail: "System evaluated. Shared findings and photos in portal.",
      },
      {
        date: "Jul 14",
        title: "Options presented",
        detail: "Three transparent packages with pricing rationale.",
      },
      {
        date: "Jul 18",
        title: "Option selected",
        detail: "Better package approved. Equipment ordered.",
      },
      {
        date: "Aug 6",
        title: "Install day",
        detail: "Crew arriving for removal, install, and startup.",
      },
    ],
    options: [
      {
        name: "Good",
        price: "$9,850",
        description: "Solid efficiency, reliable cooling, standard warranty.",
      },
      {
        name: "Better",
        price: "$12,400",
        description: "Higher efficiency, quieter operation, extended warranty.",
        recommended: true,
      },
      {
        name: "Best",
        price: "$15,900",
        description: "Top-tier efficiency, smart controls, premium comfort features.",
      },
    ],
    documents: [
      { id: "d1", name: "Diagnostic Report.pdf", type: "Report", date: "Jul 12" },
      { id: "d2", name: "Estimate ? Better Package.pdf", type: "Estimate", date: "Jul 14" },
      { id: "d3", name: "Scope of Work.pdf", type: "Scope", date: "Jul 18" },
    ],
    photos: [
      {
        label: "Existing outdoor unit",
        url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80",
      },
      {
        label: "Proposed install area",
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    warranty: "10-year parts (manufacturer) ? 2-year labor (How Much?)",
  },
  {
    id: "p2",
    userId: "u1",
    title: "Spring Maintenance Tune-Up",
    status: "Completed",
    service: "Maintenance",
    city: "Anaheim",
    startedAt: "2026-04-03",
    updatedAt: "2026-04-03",
    summary: "Seasonal tune-up completed. Filters replaced, system performance verified.",
    timeline: [
      {
        date: "Apr 3",
        title: "Maintenance completed",
        detail: "Full checklist completed. Next visit recommended in 6 months.",
      },
    ],
    documents: [
      { id: "d4", name: "Maintenance Checklist.pdf", type: "Report", date: "Apr 3" },
      { id: "d5", name: "Invoice #10492.pdf", type: "Invoice", date: "Apr 3" },
    ],
    photos: [],
    warranty: "Maintenance visit warranty: 30 days on adjustments",
  },
  {
    id: "p3",
    userId: "u2",
    title: "Ductless Mini-Split ? Guest Suite",
    status: "Estimate Ready",
    service: "Ductless Mini-Split",
    city: "Huntington Beach",
    startedAt: "2026-07-28",
    updatedAt: "2026-08-01",
    summary:
      "Estimate ready for a Mitsubishi ductless system serving the guest suite. Review options and approve when ready.",
    timeline: [
      {
        date: "Jul 28",
        title: "Site visit",
        detail: "Measured rooms, discussed placement and aesthetics.",
      },
      {
        date: "Aug 1",
        title: "Estimate delivered",
        detail: "Options uploaded with equipment specs and timeline.",
      },
    ],
    options: [
      {
        name: "Single Zone",
        price: "$5,200",
        description: "One indoor head for the primary guest room.",
      },
      {
        name: "Dual Zone",
        price: "$7,850",
        description: "Guest room + office coverage.",
        recommended: true,
      },
    ],
    documents: [
      { id: "d6", name: "Mini-Split Estimate.pdf", type: "Estimate", date: "Aug 1" },
    ],
    photos: [
      {
        label: "Proposed indoor location",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
];

export const portalMessages: PortalMessage[] = [
  {
    id: "m1",
    userId: "u1",
    from: "howmuch",
    author: "Andy ? How Much?",
    body: "Jordan ? your Better package equipment is confirmed. We'll see you Aug 6 at 9am. Any gate codes we should know?",
    at: "2026-08-02T10:12:00",
  },
  {
    id: "m2",
    userId: "u1",
    from: "client",
    author: "Jordan Hale",
    body: "Gate code is 4412. Please protect the side yard plants if you can ? thank you!",
    at: "2026-08-02T11:05:00",
  },
  {
    id: "m3",
    userId: "u1",
    from: "howmuch",
    author: "How Much? Crew",
    body: "Noted. We'll use drop cloths and keep the path clear. Excited to get you cooling again.",
    at: "2026-08-02T11:20:00",
  },
  {
    id: "m4",
    userId: "u2",
    from: "howmuch",
    author: "Andy ? How Much?",
    body: "Maria ? your dual-zone estimate is ready in Projects. Happy to hop on a call if you want to walk through the options.",
    at: "2026-08-01T16:40:00",
  },
];

export function getUserProjects(userId: string) {
  return portalProjects.filter((p) => p.userId === userId);
}

export function getPortalProject(id: string) {
  return portalProjects.find((p) => p.id === id);
}

export function getUserMessages(userId: string) {
  return portalMessages.filter((m) => m.userId === userId);
}
