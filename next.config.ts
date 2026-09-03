import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "172.20.10.3", "localhost:3000", "172.20.10.3:3000"],
};

export default nextConfig;
