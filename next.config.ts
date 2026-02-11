import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'],
  images: {
    // Enable image optimization
    formats: ['image/avif', 'image/webp'],
    // Add device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum quality for optimization
    minimumCacheTTL: 60,
    // Remote patterns for external images
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
      // Marketplace logo domains
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.chairish.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ebay.com',
      },
      {
        protocol: 'https',
        hostname: 'creoate.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fashiongo.net',
      },
      {
        protocol: 'https',
        hostname: 'www.walmart.com',
      },
      {
        protocol: 'https',
        hostname: 'www.etsy.com',
      },
      {
        protocol: 'https',
        hostname: 'poshmark.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mercari.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bonanza.com',
      },
      {
        protocol: 'https',
        hostname: 'www.newegg.com',
      },
      {
        protocol: 'https',
        hostname: 'www.wayfair.com',
      },
      {
        protocol: 'https',
        hostname: 'www.overstock.com',
      },
      {
        protocol: 'https',
        hostname: 'reverb.com',
      },
      // Amazon product images
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // Tradelle CDN (CloudFront)
      {
        protocol: 'https',
        hostname: 'd3r56lgpj005wx.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
