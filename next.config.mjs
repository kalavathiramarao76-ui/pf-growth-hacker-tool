export default {
  experimental: {
    appDir: true,
    runtime: 'nodejs',
    serverComponents: true,
  },
  future: {
    strictPostcssConfiguration: true,
  },
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  tailwindcss: {},
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};