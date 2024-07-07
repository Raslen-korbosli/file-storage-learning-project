import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: {
      hostname: 'rightful-jackal-16.convex.cloud',
    },
  },
};

export default nextConfig;
