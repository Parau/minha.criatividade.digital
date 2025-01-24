import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  output: 'export', // Enables static export
  basePath: '/minha.criatividade.digital', 
  images: {
    unoptimized: true, // Required for static export
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false, // For GitHub Pages compatibility
};

export default withBundleAnalyzer(nextConfig);
