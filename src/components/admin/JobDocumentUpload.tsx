"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function JobDocumentUpload({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("Quote");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMsg("");
    const body = new FormData();
    body.append("jobId", jobId);
    body.append("name", name || file.name);
    body.append("docType", docType);
    body.append("file", file);
    const res = await fetch("/api/admin/documents", { method: "POST", body });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "Upload failed");
      return;
    }
    setFile(null);
    setName("");
    setMsg("Uploaded");
    router.refresh();
  }

  return (
    <form onSubmit={upload} className="mt-3 space-y-2">
      <input
        className="hm-input"
        placeholder="File name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select className="hm-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
        {["Quote", "Scope", "Warranty", "Invoice copy", "Other"].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input
        type="file"
        className="block w-full text-xs text-hm-muted"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button type="submit" size="sm" disabled={loading || !file} arrow={false}>
        {loading ? "Uploading?" : "Upload document"}
      </Button>
      {msg && <p className="text-xs text-hm-muted">{msg}</p>}
    </form>
  );
}
