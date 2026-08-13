"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  MessageSquare,
  Users,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Jobs", icon: FileText },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/assistant", label: "AI Assistant", icon: Sparkles },
];

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-hm-fog">
      <header className="border-b border-hm-line bg-white">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Logo height={40} href="/admin" />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-hm-red/10 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-hm-red">
                Admin
              </span>
              <span className="text-xs text-hm-muted">Live ops</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm font-medium text-hm-muted md:inline">
              {userName}
            </span>
            <Button type="button" variant="outline" size="sm" arrow={false} onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="border-b border-hm-line bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 md:px-8">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 font-display text-[13px] font-semibold transition",
                  active
                    ? "bg-hm-charcoal text-white"
                    : "text-hm-muted hover:bg-hm-fog hover:text-hm-charcoal",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
