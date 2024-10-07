/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Ensure that this option is supported in your Next.js version
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // Allows images from Google user content
      },
    ],
  },
  reactStrictMode: true, // Optional: Helps catch potential errors in development
  typescript: {
    ignoreBuildErrors: true, // Optional: If TypeScript build errors cause build failures, temporarily set this
  },
};

module.exports = nextConfig;
