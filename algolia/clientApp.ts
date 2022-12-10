import algoliasearch from "algoliasearch";

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const algoliaAdmin = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_ADMIN_KEY
);

const algoliaIndex = algolia.initIndex("sea-guide");

export { algolia, algoliaIndex, algoliaAdmin };
