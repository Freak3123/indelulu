import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com",
              "indelulu-posts.s3.ap-south-1.amazonaws.com"
    ],
  },
};

export default nextConfig;
