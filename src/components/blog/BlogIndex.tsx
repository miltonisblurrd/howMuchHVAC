"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export type BlogCard = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  date?: string;
  readingMinutes?: number;
};

export function BlogIndex({ posts }: { posts: BlogCard[] }) {
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(set).sort()];
  }, [posts]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const catOk = category === "All" || post.category === category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles?"
            className="hm-input !pl-10"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-display text-xs font-bold tracking-wide transition",
                category === cat
                  ? "bg-hm-red text-white"
                  : "bg-hm-fog text-hm-muted hover:text-hm-charcoal",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-hm-muted">
        Showing {filtered.length} of {posts.length} articles
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-hm-line bg-hm-fog p-6 transition hover:border-hm-red/40"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-hm-red">
              {post.category}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-hm-charcoal">
              {post.title}
            </h2>
            <p className="mt-3 text-sm text-hm-muted">{post.description}</p>
            <p className="mt-4 text-xs text-hm-muted">
              {post.readingMinutes} min read
              {post.date ? ` ? ${post.date}` : ""}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-hm-line p-10 text-center">
          <p className="font-display font-bold text-hm-charcoal">No articles match</p>
          <p className="mt-2 text-sm text-hm-muted">Try another search or category.</p>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-hm-red"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
