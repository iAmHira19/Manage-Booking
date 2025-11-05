/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: false,
  devIndicators: false,
  eslint: {
    // Let production builds complete even if there are ESLint issues.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
