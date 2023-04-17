const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer");
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
let nextConfig = {
  // https://react-svgr.com/docs/next/
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: ["@svgr/webpack"],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  experimental: {
    //   scrollRestoration: true,
    // turbo: {
    //   loaders: {
    //     ".svg": ["@svgr/webpack"],
    //   },
    // },
  },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    // Cache images in /.next/cache/images and local browser for 1 year
    minimumCacheTTL: 31536000,
    // domains: [
    //   "firebasestorage.googleapis.com",
    //   "inaturalist-open-data.s3.amazonaws.com",
    //   "static.inaturalist.org",
    // ],
    unoptimized: process.env.SKIP_IMAGE_OPTIMIZATION === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // include 384x384 in storage-resize-images extension (when sizes="50vw")
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // loader: "imgix",
    // path: "https://sea-guide.imgix.net/",
    // loader: "cloudinary",
    // path: "https://sea-guide.mo.cloudinary.net/",
  },
  compiler: {
    styledComponents: true,
  },
};

nextConfig = withPWA(nextConfig);
nextConfig = withPlaiceholder(nextConfig);

if (process.env.ANALYZE) {
  nextConfig = withBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
