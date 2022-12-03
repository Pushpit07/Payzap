/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com", "static.debank.com", "cryptologos.cc"],
  },
};

module.exports = nextConfig;
