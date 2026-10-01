/** Andy's on-site labels. Anything else was sent by the customer in messages. */
export const PHOTO_LABELS = ["Before", "After", "On site"] as const;

export type PhotoLabel = (typeof PHOTO_LABELS)[number];

export type PhotoGroupKey = PhotoLabel | "customer";

export const PHOTO_GROUPS: { key: PhotoGroupKey; title: string }[] = [
  { key: "Before", title: "Before" },
  { key: "After", title: "After" },
  { key: "On site", title: "On site" },
  { key: "customer", title: "From the customer" },
];

export function isPhotoLabel(value: string): value is PhotoLabel {
  return (PHOTO_LABELS as readonly string[]).includes(value);
}

export function photoGroup(label: string): PhotoGroupKey {
  return isPhotoLabel(label) ? label : "customer";
}
