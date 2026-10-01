"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminUi";
import { JobPhotoGallery, type GalleryPhoto } from "@/components/portal/JobPhotoGallery";
import { Button } from "@/components/ui/Button";
import { PHOTO_LABELS, type PhotoLabel } from "@/lib/job-photos";

type PendingPhoto = {
  key: string;
  file: File;
  preview: string;
  label: PhotoLabel;
};

export function JobPhotosCard({
  jobId,
  photos,
}: {
  jobId: string;
  photos: GalleryPhoto[];
}) {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  useEffect(() => {
    return () => {
      pendingRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  function queue(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      preview: URL.createObjectURL(file),
      label: "On site" as PhotoLabel,
    }));
    setPending((current) => [...current, ...next]);
    setMsg("");
  }

  function setLabel(key: string, label: PhotoLabel) {
    setPending((current) => current.map((item) => (item.key === key ? { ...item, label } : item)));
  }

  function dropPending(key: string) {
    setPending((current) => {
      const item = current.find((row) => row.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      return current.filter((row) => row.key !== key);
    });
  }

  async function save() {
    if (!pending.length) return;
    setSaving(true);
    setMsg("");
    const body = new FormData();
    body.append("jobId", jobId);
    pending.forEach((item) => {
      body.append("files", item.file);
      body.append("labels", item.label);
    });
    const res = await fetch("/api/admin/photos", { method: "POST", body });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Could not save photos");
      return;
    }
    pending.forEach((item) => URL.revokeObjectURL(item.preview));
    setPending([]);
    setMsg("Saved");
    router.refresh();
  }

  async function remove(photoId: string) {
    if (!window.confirm("Remove this photo from the job?")) return;
    setRemoving(photoId);
    setMsg("");
    const res = await fetch("/api/admin/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoId }),
    });
    setRemoving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Could not remove photo");
      return;
    }
    router.refresh();
  }

  return (
    <AdminCard>
      <AdminCardHeader
        title="Job photos"
        caption="Take photos on site. They stay on this job, and the customer sees them too."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" arrow={false} onClick={() => cameraRef.current?.click()}>
          Take photo
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          arrow={false}
          onClick={() => libraryRef.current?.click()}
        >
          Add photos
        </Button>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            queue(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={libraryRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            queue(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {pending.length > 0 && (
        <ul className="mt-4 space-y-3">
          {pending.map((item) => (
            <li key={item.key} className="flex items-center gap-3 rounded-xl border border-hm-line p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <label className="min-w-0 flex-1 text-sm">
                <span className="sr-only">Photo type</span>
                <select
                  className="hm-input"
                  value={item.label}
                  onChange={(e) => setLabel(item.key, e.target.value as PhotoLabel)}
                >
                  {PHOTO_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="px-2 text-xs font-semibold text-hm-muted hover:text-hm-red"
                onClick={() => dropPending(item.key)}
              >
                Remove
              </button>
            </li>
          ))}
          <li>
            <Button type="button" size="sm" arrow={false} disabled={saving} onClick={save}>
              {saving ? "Saving..." : "Save photos"}
            </Button>
          </li>
        </ul>
      )}

      {msg && <p className="mt-3 text-sm text-hm-muted">{msg}</p>}

      <JobPhotoGallery
        photos={photos}
        empty="No photos yet."
        onDelete={remove}
        deletingId={removing}
      />
    </AdminCard>
  );
}
