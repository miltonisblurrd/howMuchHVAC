"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  MessageSquare,
  BookOpen,
  CirclePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  LogOut,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CallAndy } from "@/components/contact/CallAndy";
import { PortalAccount, type PortalAccountProfile } from "@/components/portal/PortalAccount";
import { PortalOnboarding } from "@/components/portal/PortalOnboarding";
import { onboardingStorageKey } from "@/lib/profile-display";
import { cn } from "@/lib/cn";

const links = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/documents", label: "Documents", icon: FileText },
  { href: "/portal/resources", label: "Resources", icon: BookOpen },
  { href: "/portal/pay", label: "Pay", icon: Receipt },
];

export function PortalShell({
  children,
  profile,
  unreadCount = 0,
  unpaidCount = 0,
  showOnboarding = false,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  profile: PortalAccountProfile;
  unreadCount?: number;
  unpaidCount?: number;
  showOnboarding?: boolean;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("hm-portal-nav") === "1");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!showOnboarding) return;
    try {
      if (localStorage.getItem(onboardingStorageKey(profile.id))) return;
    } catch {
      /* ignore */
    }
    setTourOpen(true);
  }, [showOnboarding, profile.id]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("hm-portal-nav", next ? "1" : "0");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST" });
    window.location.href = "/portal/login";
  }

  function badgeFor(href: string) {
    if (href === "/portal/messages" && unreadCount > 0) return unreadCount;
    if (href === "/portal/pay" && unpaidCount > 0) return unpaidCount;
    return 0;
  }

  const sidebarCtas = (
    collapsed: boolean,
  ) =>
    collapsed ? (
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/portal/request"
          title="Request service"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-hm-red text-white shadow-[0_12px_28px_-12px_rgba(255,29,37,0.75)] transition hover:bg-hm-red-deep"
        >
          <CirclePlus className="h-4 w-4" strokeWidth={2} />
        </Link>
        <CallAndy
          variant="secondary"
          arrow={false}
          size="sm"
          className="h-10 w-10 px-0"
          title="Call Andy"
        >
          <Phone className="h-4 w-4" strokeWidth={2} />
        </CallAndy>
      </div>
    ) : (
      <div className="space-y-2">
        <Button href="/portal/request" size="sm" className="w-full">
          Request service
        </Button>
        <CallAndy variant="secondary" arrow={false} size="sm" className="w-full" />
      </div>
    );

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/portal" ? pathname === "/portal" : pathname.startsWith(link.href);
        const badge = badgeFor(link.href);
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
            {!collapsed && <span className="min-w-0 truncate">{link.label}</span>}
            {!collapsed && badge > 0 && (
              <span className="ml-auto inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-hm-red px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
            {collapsed && badge > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-hm-red" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <>
      <div className={cn("flex h-16 items-center gap-2 px-3", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <Logo variant="mark" height={28} href="/portal" />
        ) : (
          <Logo height={34} href="/portal" />
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
        {sidebarCtas(collapsed)}
        <button
          type="button"
          onClick={logout}
          className={cn(
            "mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold text-hm-muted transition hover:bg-hm-fog hover:text-hm-charcoal",
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
              <Logo height={34} href="/portal" />
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
                  link.href === "/portal"
                    ? pathname === "/portal"
                    : pathname.startsWith(link.href);
                const badge = badgeFor(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold",
                      active
                        ? "bg-[color-mix(in_oklab,var(--hm-red)_10%,white)] text-hm-charcoal"
                        : "text-hm-muted hover:bg-hm-fog",
                    )}
                  >
                    <Icon
                      className={cn("h-[18px] w-[18px]", active ? "text-hm-red" : "text-current")}
                      strokeWidth={1.75}
                    />
                    <span className="min-w-0 flex-1 truncate">{link.label}</span>
                    {badge > 0 && (
                      <span className="inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-hm-red px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-hm-line p-3">
              {sidebarCtas(false)}
              <button
                type="button"
                onClick={logout}
                className="mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-2.5 font-display text-[13px] font-semibold text-hm-muted transition hover:bg-hm-fog hover:text-hm-charcoal"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                Log out
              </button>
            </div>
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
          <p className="min-w-0 flex-1 truncate font-display text-sm font-bold text-hm-charcoal">
            {title || "Client portal"}
          </p>
          <PortalAccount profile={profile} onReplayTour={() => setTourOpen(true)} />
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
              <PortalAccount profile={profile} onReplayTour={() => setTourOpen(true)} />
            </div>
            {actions ? <div className="flex flex-wrap gap-2 lg:hidden">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>

      <PortalOnboarding
        userId={profile.id}
        firstName={(profile.name || "there").split(" ")[0]}
        open={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  );
}
