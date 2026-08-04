export type AdminUser = {
  id: string;
  email: string;
  password: string;
  name: string;
};

export type Invoice = {
  id: string;
  number: string;
  client: string;
  project: string;
  city: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue" | "Draft";
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
};

export type ScheduledJob = {
  id: string;
  title: string;
  client: string;
  city: string;
  tech: string;
  when: string;
  type: "Diagnostic" | "Install" | "Maintenance" | "Follow-up";
  status: "Confirmed" | "En route" | "Needs confirm";
};

export type AdminMessage = {
  id: string;
  from: string;
  preview: string;
  channel: "Portal" | "SMS" | "Email";
  at: string;
  unread: boolean;
};

export type Lead = {
  id: string;
  name: string;
  city: string;
  service: string;
  source: "Website" | "Ads" | "Referral" | "Google";
  status: "New" | "Contacted" | "Quoted" | "Won" | "Lost";
  value: number;
  createdAt: string;
};

export const adminUser: AdminUser = {
  id: "admin1",
  email: "andy@trusthowmuch.com",
  password: "howmuch",
  name: "Andy",
};

export const kpis = {
  monthRevenue: 84250,
  monthRevenueChange: 12.4,
  outstanding: 18640,
  overdue: 4200,
  jobsThisWeek: 14,
  jobsCompletedMonth: 31,
  newLeads: 18,
  closeRate: 42,
  avgTicket: 2718,
  googleRating: 5.0,
  reviewCount: 298,
};

export const invoices: Invoice[] = [
  {
    id: "inv1",
    number: "HM-10492",
    client: "Jordan Hale",
    project: "Carrier A/C Replacement",
    city: "Anaheim",
    amount: 12400,
    status: "Unpaid",
    issuedAt: "2026-07-28",
    dueAt: "2026-08-11",
  },
  {
    id: "inv2",
    number: "HM-10488",
    client: "Maria Santos",
    project: "Dual-Zone Mini-Split",
    city: "Huntington Beach",
    amount: 7850,
    status: "Paid",
    issuedAt: "2026-07-20",
    dueAt: "2026-08-03",
    paidAt: "2026-07-29",
  },
  {
    id: "inv3",
    number: "HM-10481",
    client: "Ken Phung",
    project: "Spring Maintenance",
    city: "Fullerton",
    amount: 189,
    status: "Paid",
    issuedAt: "2026-07-12",
    dueAt: "2026-07-26",
    paidAt: "2026-07-12",
  },
  {
    id: "inv4",
    number: "HM-10475",
    client: "Christina Guerrero",
    project: "IAQ + Filter Upgrade",
    city: "Santa Ana",
    amount: 1460,
    status: "Overdue",
    issuedAt: "2026-07-01",
    dueAt: "2026-07-15",
  },
  {
    id: "inv5",
    number: "HM-10499",
    client: "Christopher Mejia",
    project: "Heat Pump Install",
    city: "Irvine",
    amount: 15900,
    status: "Draft",
    issuedAt: "2026-08-03",
    dueAt: "2026-08-17",
  },
  {
    id: "inv6",
    number: "HM-10470",
    client: "Maribel Pineda",
    project: "AC Repair",
    city: "Garden Grove",
    amount: 420,
    status: "Paid",
    issuedAt: "2026-06-28",
    dueAt: "2026-07-12",
    paidAt: "2026-06-30",
  },
];

export const schedule: ScheduledJob[] = [
  {
    id: "j1",
    title: "Carrier install ? commissioning",
    client: "Jordan Hale",
    city: "Anaheim",
    tech: "Derek Hollins",
    when: "Thu Aug 6 ? 9:00 AM",
    type: "Install",
    status: "Confirmed",
  },
  {
    id: "j2",
    title: "No-cool diagnostic",
    client: "Luis Ortega",
    city: "Santa Ana",
    tech: "Jayden Park",
    when: "Thu Aug 6 ? 1:30 PM",
    type: "Diagnostic",
    status: "Confirmed",
  },
  {
    id: "j3",
    title: "Seasonal tune-up",
    client: "Amy Cho",
    city: "Irvine",
    tech: "Elena Vasquez",
    when: "Fri Aug 7 ? 10:00 AM",
    type: "Maintenance",
    status: "Needs confirm",
  },
  {
    id: "j4",
    title: "Mini-split estimate walkthrough",
    client: "Maria Santos",
    city: "Huntington Beach",
    tech: "Andy",
    when: "Fri Aug 7 ? 2:00 PM",
    type: "Follow-up",
    status: "Confirmed",
  },
  {
    id: "j5",
    title: "Duct sealing follow-up",
    client: "Ken Phung",
    city: "Fullerton",
    tech: "Jayden Park",
    when: "Sat Aug 8 ? 9:30 AM",
    type: "Follow-up",
    status: "En route",
  },
];

export const adminMessages: AdminMessage[] = [
  {
    id: "am1",
    from: "Jordan Hale",
    preview: "Gate code is 4412. Please protect the side yard plants if you can.",
    channel: "Portal",
    at: "Aug 2 ? 11:05 AM",
    unread: true,
  },
  {
    id: "am2",
    from: "Maria Santos",
    preview: "Can we do dual-zone instead of single? Happy to hop on a call.",
    channel: "Portal",
    at: "Aug 1 ? 4:52 PM",
    unread: true,
  },
  {
    id: "am3",
    from: "New lead ? Ads",
    preview: "AC not cooling in Anaheim ? requested quote from landing page.",
    channel: "Email",
    at: "Aug 4 ? 9:14 AM",
    unread: true,
  },
  {
    id: "am4",
    from: "Christina Guerrero",
    preview: "Invoice reminder ? said she?ll pay this week.",
    channel: "SMS",
    at: "Aug 3 ? 3:20 PM",
    unread: false,
  },
  {
    id: "am5",
    from: "Derek ? Crew",
    preview: "Equipment for Hale job confirmed on truck for Thursday.",
    channel: "SMS",
    at: "Aug 3 ? 6:05 PM",
    unread: false,
  },
];

export const leads: Lead[] = [
  {
    id: "l1",
    name: "Priya Nair",
    city: "Irvine",
    service: "Heat Pump",
    source: "Ads",
    status: "New",
    value: 14000,
    createdAt: "Aug 4",
  },
  {
    id: "l2",
    name: "Tom Bradley",
    city: "Anaheim",
    service: "A/C Repair",
    source: "Google",
    status: "Contacted",
    value: 450,
    createdAt: "Aug 3",
  },
  {
    id: "l3",
    name: "Sofia Mendez",
    city: "Long Beach",
    service: "Second Opinion",
    source: "Website",
    status: "Quoted",
    value: 9800,
    createdAt: "Aug 2",
  },
  {
    id: "l4",
    name: "Eric Walsh",
    city: "Costa Mesa",
    service: "Ductless Mini-Split",
    source: "Referral",
    status: "Won",
    value: 6200,
    createdAt: "Jul 30",
  },
  {
    id: "l5",
    name: "Hannah Kim",
    city: "Newport Beach",
    service: "A/C Replacement",
    source: "Ads",
    status: "Lost",
    value: 11200,
    createdAt: "Jul 28",
  },
];

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function invoiceTotals() {
  const paid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const unpaid = invoices
    .filter((i) => i.status === "Unpaid" || i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((s, i) => s + i.amount, 0);
  return { paid, unpaid, overdue };
}
