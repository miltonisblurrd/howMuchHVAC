import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "How Much? Air & Home Improvements",
    short_name: "How Much?",
    description:
      "Licensed, insured HVAC experts serving Orange County, Los Angeles, and San Diego.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff1d25",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
