import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const base = siteConfig.url.replace(/\/$/, "");

/** Public marketing URLs for Google indexing. Admin / API routes excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/life", changeFrequency: "monthly", priority: 0.9 },
    { path: "/health", changeFrequency: "monthly", priority: 0.9 },
    { path: "/patient-advocacy", changeFrequency: "monthly", priority: 0.85 },
    { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/schedule-consultation", changeFrequency: "monthly", priority: 0.85 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
    { path: "/do-not-sell", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
