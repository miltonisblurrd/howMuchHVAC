import { PHOTO_GROUPS, photoGroup, type PhotoGroupKey } from "@/lib/job-photos";

export type GalleryPhoto = {
  id: string;
  label: string;
  url: string | null;
};

export function JobPhotoGallery({
  photos,
  empty = "None yet.",
  onDelete,
  deletingId,
}: {
  photos: GalleryPhoto[];
  empty?: string;
  onDelete?: (photoId: string) => void;
  deletingId?: string | null;
}) {
  const ready = photos.filter((photo) => photo.url);
  if (!ready.length) {
    return <p className="mt-4 text-sm text-hm-muted">{empty}</p>;
  }

  const grouped = new Map<PhotoGroupKey, GalleryPhoto[]>();
  for (const photo of ready) {
    const key = photoGroup(photo.label);
    const list = grouped.get(key) || [];
    list.push(photo);
    grouped.set(key, list);
  }

  const visible = PHOTO_GROUPS.filter((group) => grouped.get(group.key)?.length);

  return (
    <div className="mt-4 space-y-5">
      {visible.map((group) => (
        <section key={group.key}>
          <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-hm-muted">
            {group.title}
          </h3>
          <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {grouped.get(group.key)!.map((photo) => (
              <li key={photo.id}>
                <a href={photo.url!} target="_blank" rel="noreferrer" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url!}
                    alt={group.title}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                </a>
                {onDelete && (
                  <button
                    type="button"
                    className="mt-1 text-xs font-semibold text-hm-muted hover:text-hm-red disabled:opacity-50"
                    disabled={deletingId === photo.id}
                    onClick={() => onDelete(photo.id)}
                  >
                    {deletingId === photo.id ? "Removing..." : "Delete"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
