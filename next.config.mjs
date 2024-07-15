import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rightful-jackal-16.convex.cloud',
        // You can add more hostnames here if needed
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        // Add other patterns as necessary
      },
    ],
  },
};

export default nextConfig;
