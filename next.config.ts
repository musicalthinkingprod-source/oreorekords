import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio estático: `npm run build` genera ./out, que se publica en la rama `deploy`
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["oreorekords.test", "*.oreorekords.test"],
};

export default nextConfig;
