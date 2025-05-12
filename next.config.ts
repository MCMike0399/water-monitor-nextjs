import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: true,
   // We're using a custom server, so we need to disable the serverless build
   eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
   },
};

export default nextConfig;
