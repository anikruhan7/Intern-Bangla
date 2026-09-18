import type { MetadataRoute } from "next";

const SITE_URL = "https://intern-bangla-raea.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/staff",
        "/student",
        "/company/dashboard",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
