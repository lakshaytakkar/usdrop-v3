import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.iran.liara.run',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      // TikTok Shop CDN domains - all unique subdomains from product data
      {
        protocol: 'https',
        hostname: 'p16-oec-common-useast2a.ibyteimg.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-oec-general-useast5.ttcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-oec-general.ttcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-oec-sg.ibyteimg.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-oec-ttp.tiktokcdn-us.com',
      },
      {
        protocol: 'https',
        hostname: 'p16-oec-va.ibyteimg.com',
      },
      // Additional TikTok CDN patterns (p19 variants)
      {
        protocol: 'https',
        hostname: 'p19-oec-sg.ibyteimg.com',
      },
    ],
  },
};

export default nextConfig;
