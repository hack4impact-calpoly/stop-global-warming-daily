import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stop Global Warming Daily",
    short_name: "SGWD",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/images/logo copy.png",
        sizes: "200x200",
      },
    ],
  };
}
