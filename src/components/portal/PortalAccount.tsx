"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { profileInitials } from "@/lib/profile-display";
import { cn } from "@/lib/cn";

export type PortalAccountProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  avatarUrl: string | null;
};

export function PortalAccount({
  profile,
  onReplayTour,
}: {
  profile: PortalAccountProfile;
  onReplayTour: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone);
    setAddress(profile.address);
    setCity(profile.city);
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/portal/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address, city }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Could not save");
      return;
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
    const res = await fetch("/api/portal/profile/avatar", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) {
      setMsg(data.error || "Could not upload photo");
      return;
    }
    if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
    router.refresh();
  }

  const initials = profileInitials(name || profile.name, profile.email);

  async function logout() {
    await fetch("/api/portal/logout", { method: "POST" });
    window.location.href = "/portal/login";
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-3">
        <span className="hidden max-w-[9rem] truncate text-sm font-medium text-hm-muted md:inline">
          {name || profile.email}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Account settings"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-hm-line bg-hm-fog text-sm font-bold text-hm-charcoal transition hover:border-hm-red/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hm-red/45",
            open && "border-hm-red/50 ring-2 ring-hm-red/20",
          )}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </button>
      </div>

      {open && !editing && (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-hm-line bg-white p-2 shadow-[0_20px_50px_-24px_rgba(18,21,26,0.45)]">
          <div className="px-3 py-2">
            <p className="truncate font-display text-sm font-bold text-hm-charcoal">
              {name || profile.email}
            </p>
            <p className="truncate text-xs text-hm-muted">{profile.email}</p>
          </div>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-hm-charcoal hover:bg-hm-fog"
            onClick={() => {
              setOpen(false);
              setEditing(true);
            }}
          >
            Edit profile
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-hm-charcoal hover:bg-hm-fog"
            onClick={() => {
              setOpen(false);
              onReplayTour();
            }}
          >
            Replay welcome
          </button>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-hm-muted hover:bg-hm-fog hover:text-hm-charcoal"
            onClick={() => void logout()}
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
            aria-labelledby="profile-title"
            className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)]"
          >
            <h2 id="profile-title" className="font-display text-xl font-bold tracking-tight">
              Your profile
            </h2>
            <p className="mt-1 text-sm text-hm-muted">
              Home address helps Andy?s crew find you. Phone is for visit updates.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-hm-line bg-hm-fog text-base font-bold text-hm-charcoal"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
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

            <form onSubmit={save} className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                  Name
                </span>
                <input className="hm-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                  Phone
                </span>
                <input className="hm-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                  Home address
                </span>
                <input
                  className="hm-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hm-muted">
                  City
                </span>
                <input className="hm-input" value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
              <p className="text-xs text-hm-muted">Email is {profile.email} ? that?s your sign-in.</p>
              {msg && <p className="text-sm text-hm-red">{msg}</p>}
              <div className="flex justify-end gap-2 pt-2">
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
