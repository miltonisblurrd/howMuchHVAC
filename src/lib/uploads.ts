import { getSupabaseAdmin } from "@/lib/supabase/admin";

const PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/jpg",
]);

const DOC_TYPES = new Set([
  ...PHOTO_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const PHOTO_MARKER = "__PHOTO__:";

export function parseMessagePhoto(body: string) {
  if (!body.startsWith(PHOTO_MARKER)) {
    return { photoPath: null as string | null, text: body };
  }
  const rest = body.slice(PHOTO_MARKER.length);
  const nl = rest.indexOf("\n");
  if (nl === -1) return { photoPath: rest, text: "" };
  return { photoPath: rest.slice(0, nl), text: rest.slice(nl + 1) };
}

export function withPhotoMarker(path: string, text: string) {
  return `${PHOTO_MARKER}${path}\n${text}`.trimEnd();
}

function extFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName) && fromName.length <= 5) return fromName;
  if (file.type === "application/pdf") return "pdf";
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  if (file.type.includes("heic") || file.type.includes("heif")) return "heic";
  return "jpg";
}

export async function uploadJobFile(input: {
  bucket: "job-photos" | "job-documents";
  jobId: string;
  file: File;
  kind: "photo" | "document";
}) {
  if (input.file.size > 8 * 1024 * 1024) {
    return { ok: false as const, error: "File must be under 8MB" };
  }
  const allowed = input.kind === "photo" ? PHOTO_TYPES : DOC_TYPES;
  if (input.file.type && !allowed.has(input.file.type)) {
    return { ok: false as const, error: "That file type is not allowed" };
  }

  const path = `${input.jobId}/${crypto.randomUUID()}.${extFor(input.file)}`;
  const admin = getSupabaseAdmin();
  const buffer = Buffer.from(await input.file.arrayBuffer());
  const { error } = await admin.storage.from(input.bucket).upload(path, buffer, {
    contentType: input.file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, path };
}
