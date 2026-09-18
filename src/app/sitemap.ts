import type { MetadataRoute } from "next";

const SITE_URL = "https://intern-bangla-raea.vercel.app";

const staticRoutes = [
  "",
  "/blog",
  "/contact",
  "/legal/cancellation",
  "/legal/credits",
  "/legal/privacy",
  "/legal/refund",
  "/legal/terms",
  "/company/about",
  "/company/hire-talent",
  "/programs/courses",
  "/programs/events",
  "/programs/internships",
  "/programs/pro-internships",
  "/student-corner/campus-ambassador",
  "/student-corner/hall-of-fame",
  "/student-corner/projects",
  "/student-corner/resume-builder",
  "/student-corner/verify-certificate",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
