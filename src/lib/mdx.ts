import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { toIsoDate } from "@/lib/blog";

const contentRoot = path.join(process.cwd(), "src/content");

export type MdxFaq = { question: string; answer: string };

export type MdxDoc = {
  slug: string;
  title: string;
  description: string;
  date?: string;
  modified?: string;
  category?: string;
  tags?: string[];
  author?: string;
  keyTakeaways?: string[];
  content: string;
  readingMinutes?: number;
  faqs?: MdxFaq[];
};

function readDir(dir: string): MdxDoc[] {
  const full = path.join(contentRoot, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(full, filename), "utf8");
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.mdx?$/, "");
      const faqs = Array.isArray(data.faqs)
        ? (data.faqs as MdxFaq[]).filter((f) => f?.question && f?.answer)
        : undefined;
      return {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: toIsoDate(data.date),
        modified: toIsoDate(data.modified) ?? toIsoDate(data.date),
        category: data.category ? String(data.category) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        author: data.author ? String(data.author) : "Andy",
        keyTakeaways: Array.isArray(data.keyTakeaways)
          ? data.keyTakeaways.map(String)
          : undefined,
        content,
        readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
        faqs,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getBlogPosts() {
  return readDir("blog");
}

export function getBlogPost(slug: string) {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getFaqs() {
  return readDir("faqs");
}

export function getFaq(slug: string) {
  return getFaqs().find((f) => f.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getBlogPost(slug);
  if (!current) return [];
  const all = getBlogPosts().filter((p) => p.slug !== slug);
  const sameCategory = all.filter((p) => p.category && p.category === current.category);
  const rest = all.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}
