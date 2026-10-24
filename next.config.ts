import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The course and path model was replaced by the six-block roadmap
  // (docs/dashboard-v2-spec.md section 5). Temporary, not permanent: the
  // product definition is still moving.
  async redirects() {
    return [
      { source: "/path", destination: "/roadmap", permanent: false },
      { source: "/courses", destination: "/roadmap/upskilling", permanent: false },
      { source: "/courses/:rest*", destination: "/roadmap/upskilling", permanent: false },
    ];
  },
};

export default nextConfig;
