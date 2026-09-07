import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGitHubPages ? { basePath: "/job-tracker", assetPrefix: "/job-tracker/" } : {})
};

export default nextConfig;
