const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer");
const runtimeCaching = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  // buildExcludes: [/middleware-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
let nextConfig = {
  // Workaround for minimumCacheTTL
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
    ];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // experimental: {
  //   scrollRestoration: true,
  // },
  swcMinify: true,
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 31536000,
    // domains: [
    //   "firebasestorage.googleapis.com",
    //   "inaturalist-open-data.s3.amazonaws.com",
    //   "static.inaturalist.org",
    // ],
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
