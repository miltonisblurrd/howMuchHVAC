"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/request", label: "Request service" },
];

export function PortalShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST" });
    window.location.href = "/portal/login";
  }

  return (
    <div className="min-h-screen bg-hm-fog">
      <header className="border-b border-hm-line bg-white">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-8">
            <Logo height={40} href="/portal" />
            <nav className="hidden gap-1 md:flex">
              {links.map((link) => {
                const active =
                  link.href === "/portal"
                    ? pathname === "/portal"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2 font-display text-[13px] font-semibold transition",
                      active
                        ? "bg-hm-fog text-hm-charcoal"
                        : "text-hm-muted hover:text-hm-charcoal",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm font-medium text-hm-muted sm:inline">
              {userName}
            </span>
            <Button type="button" variant="outline" tone="light" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <div className="border-b border-hm-line bg-white md:hidden">
        <div className="flex gap-1 overflow-x-auto px-4 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 font-display text-sm font-semibold text-hm-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
