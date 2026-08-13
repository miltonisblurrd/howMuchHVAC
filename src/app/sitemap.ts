import type { MetadataRoute } from "next";
import { serviceAreas } from "@/lib/areas";
import { getBlogPosts, getFaqs } from "@/lib/mdx";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { team } from "@/lib/team";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = [
    "",
    "/services",
    "/service-areas",
    "/projects",
    "/partners",
    "/about",
    "/team",
    "/reviews",
    "/booking",
    "/get-a-quote",
    "/blog",
    "/faqs",
    "/brand",
    "/contact",
    "/financing",
    "/maintenance",
    "/warranty",
    "/second-opinion",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: new Date() })),
    ...serviceAreas.map((a) => ({
      url: `${base}/service-areas/${a.slug}`,
      lastModified: new Date(),
    })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date() })),
    ...getBlogPosts().map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date() })),
    ...getFaqs().map((f) => ({ url: `${base}/faqs/${f.slug}`, lastModified: new Date() })),
    ...team.map((m) => ({ url: `${base}/team/${m.slug}`, lastModified: new Date() })),
  ];
}
