const withPWA = require("next-pwa");
const { withPlaiceholder } = require("@plaiceholder/next");
const withBundleAnalyzer = require("@next/bundle-analyzer");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
let nextConfig = {
  // Workaround for minimumCacheTTL
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png)",
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
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
    // buildExcludes: [/middleware-manifest.json$/],
    disable: process.env.NODE_ENV === "development",
  },
  images: {
    minimumCacheTTL: 31536000,
    domains: [
      "firebasestorage.googleapis.com",
      "inaturalist-open-data.s3.amazonaws.com",
      "static.inaturalist.org",
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

// withBundleAnalyzer is not working well with next-pwa and svgr/webpack
if (process.env.ANALYZE) {
  nextConfig = withBundleAnalyzer(nextConfig);
} else {
  nextConfig = withPWA(nextConfig);
  nextConfig = withPlaiceholder(nextConfig);
}

module.exports = nextConfig;
