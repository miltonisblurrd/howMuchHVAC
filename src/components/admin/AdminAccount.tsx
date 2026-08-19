"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { profileInitials } from "@/lib/profile-display";
import { cn } from "@/lib/cn";

type Settings = {
  displayName: string;
  publicEmail: string;
  directPhone: string;
  notifyEmail: string;
  notifyPhone: string;
  officeAddress: string;
  avatarUrl: string | null;
};

export function AdminAccount({ fallbackName }: { fallbackName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [form, setForm] = useState<Settings>({
    displayName: fallbackName,
    publicEmail: "",
    directPhone: "",
    notifyEmail: "",
    notifyPhone: "",
    officeAddress: "",
    avatarUrl: null,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.settings) return;
        setLoginEmail(data.loginEmail || "");
        setForm({
          displayName: data.settings.displayName || fallbackName,
          publicEmail: data.settings.publicEmail || "",
          directPhone: data.settings.directPhone || "",
          notifyEmail: data.settings.notifyEmail || "",
          notifyPhone: data.settings.notifyPhone || "",
          officeAddress: data.settings.officeAddress || "",
          avatarUrl: data.settings.avatarUrl || null,
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [fallbackName]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        publicEmail: form.publicEmail,
        directPhone: form.directPhone,
        notifyEmail: form.notifyEmail,
        notifyPhone: form.notifyPhone,
        officeAddress: form.officeAddress,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMsg(data.error || "Could not save");
      return;
    }
    if (data.settings) {
      setForm((prev) => ({
        ...prev,
        displayName: data.settings.displayName,
        publicEmail: data.settings.publicEmail,
        directPhone: data.settings.directDisplay || data.settings.directPhone,
        notifyEmail: data.settings.notifyEmail,
        notifyPhone: data.settings.notifyPhone,
        officeAddress: data.settings.officeAddress,
        avatarUrl: data.settings.avatarUrl ?? prev.avatarUrl,
      }));
    }
    setEditing(false);
    router.refresh();
  }

  async function onAvatar(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMsg("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/profile/avatar", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) {
      setMsg(data.error || "Could not upload photo");
      return;
    }
    if (data.avatarUrl) set("avatarUrl", data.avatarUrl);
    router.refresh();
  }

  const shownName =
    form.displayName.includes("@") || !form.displayName.trim()
      ? fallbackName.includes("@")
        ? "Andy"
        : fallbackName
      : form.displayName;
  const initials = profileInitials(shownName, loginEmail);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-3">
        <span className="hidden max-w-[9rem] truncate text-sm font-medium text-hm-muted md:inline">
          {shownName}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Edit profile"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-hm-line bg-hm-fog text-sm font-bold text-hm-charcoal transition hover:border-hm-red/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hm-red/45",
            open && "border-hm-red/50 ring-2 ring-hm-red/20",
          )}
        >
          {form.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </button>
      </div>

      {open && !editing && (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-hm-line bg-white p-2 shadow-[0_20px_50px_-24px_rgba(18,21,26,0.45)]">
          <div className="px-3 py-2">
            <p className="truncate font-display text-sm font-bold">{shownName}</p>
            <p className="truncate text-xs text-hm-muted">{loginEmail || form.publicEmail}</p>
          </div>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-hm-fog"
            onClick={() => {
              setOpen(false);
              setEditing(true);
            }}
          >
            Edit profile
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-hm-muted hover:bg-hm-fog hover:text-hm-charcoal"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
          >
            Log out
          </button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-hm-ink/60 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-profile-title"
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)]"
          >
            <h2 id="admin-profile-title" className="font-display text-xl font-bold tracking-tight">
              Your profile
            </h2>
            <p className="mt-1 text-sm text-hm-muted">
              This is how customers see you, and where we ping you at 7pm.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-hm-line bg-hm-fog text-base font-bold"
              >
                {form.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </button>
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  tone="light"
                  arrow={false}
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? "Uploading?" : "Change photo"}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onAvatar(e.target.files?.[0])}
                />
              </div>
            </div>

            <form onSubmit={save} className="mt-5 space-y-4">
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wide text-hm-red">You</legend>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Display name
                  </span>
                  <input
                    className="hm-input"
                    value={form.displayName}
                    onChange={(e) => set("displayName", e.target.value)}
                    required
                  />
                  <span className="mt-1 block text-xs text-hm-muted">
                    Customers see this name ? not your Gmail.
                  </span>
                </label>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wide text-hm-red">
                  How customers reach you
                </legend>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Direct phone
                  </span>
                  <input
                    className="hm-input"
                    value={form.directPhone}
                    onChange={(e) => set("directPhone", e.target.value)}
                    required
                  />
                  <span className="mt-1 block text-xs text-hm-muted">
                    Updates Call Andy buttons on the site and portal.
                  </span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Public email
                  </span>
                  <input
                    className="hm-input"
                    type="email"
                    value={form.publicEmail}
                    onChange={(e) => set("publicEmail", e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Office / shop address
                  </span>
                  <input
                    className="hm-input"
                    value={form.officeAddress}
                    onChange={(e) => set("officeAddress", e.target.value)}
                    placeholder="Optional"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wide text-hm-red">
                  How you get alerts
                </legend>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Notify email
                  </span>
                  <input
                    className="hm-input"
                    type="email"
                    value={form.notifyEmail}
                    onChange={(e) => set("notifyEmail", e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                    Notify phone
                  </span>
                  <input
                    className="hm-input"
                    value={form.notifyPhone}
                    onChange={(e) => set("notifyPhone", e.target.value)}
                    placeholder="SMS alerts"
                  />
                </label>
              </fieldset>

              {loginEmail && (
                <p className="text-xs text-hm-muted">Sign-in email stays {loginEmail}.</p>
              )}
              {msg && <p className="text-sm text-hm-red">{msg}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  tone="light"
                  size="sm"
                  arrow={false}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} arrow={false}>
                  {saving ? "Saving?" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
