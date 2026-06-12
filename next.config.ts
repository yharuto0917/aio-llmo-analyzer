import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import packageJson from "./package.json";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.APP_VERSION || packageJson.version,
  },
};

export default nextConfig;

