import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@filizlen/shared", "@filizlen/api-client"],
};

export default nextConfig;
