import algoliasearch from "algoliasearch/lite";

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);

const speciesIndex = algolia.initIndex("species");

export { algolia, speciesIndex };
