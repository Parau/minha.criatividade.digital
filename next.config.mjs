import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'export',
  basePath: '/minha.criatividade.digital',
  assetPrefix: '/minha.criatividade.digital/',
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  // Optional: Add these if you need better optimization
  webpack: (config, { isServer }) => {
    // Add any custom webpack configs if needed
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

export default withBundleAnalyzer(nextConfig);