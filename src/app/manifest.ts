import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Create Next App",
    short_name: "Next App",
    description: "",
    start_url: "/",
    scope: "/",
    display: "standalone",
  };
}
