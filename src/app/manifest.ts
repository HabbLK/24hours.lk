import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "24hours.lk - Sri Lanka's Unified Service Hub",
    short_name: "24hours.lk",
    description:
      "Find and access essential services across Sri Lanka - government, healthcare, transportation, and more - all in one place, 24/7.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#F5F3EE",
    theme_color: "#0F0F0F",
    categories: ["utilities", "productivity", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
