import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rightful-jackal-16.convex.cloud',
        port: '',
        // pathname: '/my-bucket/**',
      },
    ],
  },
};

export default nextConfig;
