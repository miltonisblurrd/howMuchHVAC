export const DASHBOARD_VIEWS = [
  { id: "all", label: "All" },
  { id: "attention", label: "Needs you" },
  { id: "money", label: "Money" },
  { id: "schedule", label: "Schedule" },
] as const;

export type DashboardView = (typeof DASHBOARD_VIEWS)[number]["id"];

export function parseDashboardView(value: string | undefined): DashboardView {
  if (value === "attention" || value === "money" || value === "schedule") return value;
  return "all";
}
