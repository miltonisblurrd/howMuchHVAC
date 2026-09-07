"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  CalendarDays,
  MessageSquare,
  Users,
  BarChart3,
  Phone,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AdminAccount } from "@/components/admin/AdminAccount";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/intake", label: "Add from a call", icon: Phone, emphasize: true },
  { href: "/admin/jobs", label: "Jobs", icon: FileText },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/insights", label: "Ad insights", icon: BarChart3 },
];

export function AdminShell({
  children,
  userName,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  userName: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("hm-admin-nav") === "1");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("hm-admin-nav", next ? "1" : "0");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            title={link.label}
            className={cn(
              "group relative flex h-10 items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold transition",
              active
                ? "bg-[color-mix(in_oklab,var(--hm-red)_10%,white)] text-hm-charcoal"
                : "text-hm-muted hover:bg-hm-fog hover:text-hm-charcoal",
              !active && link.emphasize && "text-hm-red hover:text-hm-red",
              collapsed && "justify-center px-0",
            )}
          >
            {active && (
              <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-hm-red" />
            )}
            <Icon
              className={cn("h-[18px] w-[18px] shrink-0", active ? "text-hm-red" : "text-current")}
              strokeWidth={1.75}
            />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <>
      <div className={cn("flex h-16 items-center gap-2 px-3", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <Logo variant="mark" height={28} href="/admin" />
        ) : (
          <Logo height={34} href="/admin" />
        )}
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse navigation"
            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg border border-hm-line text-hm-muted transition hover:bg-hm-fog hover:text-hm-charcoal lg:inline-flex"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>
      {collapsed && (
        <div className="mb-2 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Expand navigation"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-hm-line text-hm-muted transition hover:bg-hm-fog hover:text-hm-charcoal"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}
      {nav}
      <div className="mt-auto border-t border-hm-line p-2">
        <button
          type="button"
          onClick={logout}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold text-hm-muted transition hover:bg-hm-fog hover:text-hm-charcoal",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f8]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-hm-line bg-white lg:flex",
          collapsed ? "w-[4.5rem]" : "w-[15.5rem]",
        )}
      >
        {sidebarBody}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-hm-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[16.5rem] flex-col bg-white shadow-[8px_0_40px_-24px_rgba(18,21,26,0.45)]">
            <div className="flex h-16 items-center justify-between px-3">
              <Logo height={34} href="/admin" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-hm-muted hover:bg-hm-fog"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 px-2">
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
                      "flex h-10 items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold",
                      active
                        ? "bg-[color-mix(in_oklab,var(--hm-red)_10%,white)] text-hm-charcoal"
                        : "text-hm-muted hover:bg-hm-fog",
                      !active && link.emphasize && "text-hm-red",
                    )}
                  >
                    <Icon
                      className={cn("h-[18px] w-[18px]", active ? "text-hm-red" : "text-current")}
                      strokeWidth={1.75}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className={cn("min-h-screen", collapsed ? "lg:pl-[4.5rem]" : "lg:pl-[15.5rem]")}>
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-hm-line/80 bg-[#f4f5f8]/90 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-hm-line bg-white text-hm-charcoal"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <Suspense fallback={null}>
              <AdminSearch />
            </Suspense>
          </div>
          <AdminAccount fallbackName={userName.includes("@") ? "Andy" : userName} />
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {title ? (
                <h1 className="font-display text-[1.75rem] font-bold tracking-tight text-hm-charcoal sm:text-[2rem]">
                  {title}
                </h1>
              ) : null}
              {description ? <p className="mt-1 max-w-2xl text-sm text-hm-muted">{description}</p> : null}
            </div>
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {actions}
              <Suspense fallback={<div className="h-10 w-44 rounded-full border border-hm-line bg-white" />}>
                <AdminSearch />
              </Suspense>
              <AdminAccount fallbackName={userName.includes("@") ? "Andy" : userName} />
            </div>
            {actions ? <div className="lg:hidden">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
