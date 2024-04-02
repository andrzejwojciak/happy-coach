/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.slack-edge.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vps427257.ovh.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "vps427257.ovh.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
