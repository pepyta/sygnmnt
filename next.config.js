
const removeImports = require("next-remove-imports")();

/** @type {import('next').NextConfig} */
const nextConfig = removeImports({
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  experimental: { esmExternals: true }
});

module.exports = nextConfig
