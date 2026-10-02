import type { NextConfig } from "next";

// Static export: `npm run build` writes a plain HTML/CSS/JS site to `out/` (no server needed).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
