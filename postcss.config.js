module.exports = {
  plugins: [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
    process.env.NEXT_PUBLIC_SKIP_PURGE_CSS !== "true" && [
      "@fullhuman/postcss-purgecss",
      {
        content: [
          "./pages/**/*.{js,jsx,ts,tsx}",
          "./components/**/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/treetable/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/button/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/sidebar/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/dropdown/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/multiselect/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/divider/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/dialog/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/confirmdialog/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/utils/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/styleclass/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/progressspinner/*.{js,jsx,ts,tsx}",
          "./node_modules/nprogress/*.{js,jsx,ts,tsx}",
          "./node_modules/keen-slider/*.{js,jsx,ts,tsx}",
          "./node_modules/@fancyapps/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/menu/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/menuitem/*.{js,jsx,ts,tsx}",
          // "./node_modules/primereact/tooltip/*.{js,jsx,ts,tsx}",
          "./node_modules/primereact/skeleton/*.{js,jsx,ts,tsx}",
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          standard: [
            "html",
            "body",
            /^p-sidebar/,
            /^p-sidebar-bottom/,
            /^Toastify/,
            // /^carousel/,
            // /^p-menu/,
          ],
          deep: [],
          greedy: [],
          keyframes: [],
          variables: [],
        },
      },
    ],
  ].filter(Boolean),
};
