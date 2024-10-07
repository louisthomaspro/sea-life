-- Create a function to generate the search name
-- CREATE OR REPLACE FUNCTION generate_search_name(common_names jsonb)
-- RETURNS TEXT AS $$
-- DECLARE
--   en_names TEXT;
--   fr_names TEXT;
-- BEGIN
--   en_names := (SELECT string_agg(value, ' ')
--                FROM jsonb_array_elements_text((common_names->>'en')::jsonb));
--   fr_names := (SELECT string_agg(value, ' ')
--                FROM jsonb_array_elements_text((common_names->>'fr')::jsonb));
--   RETURN COALESCE(en_names, '') || ' ' || COALESCE(fr_names, '');
-- END;
-- $$ LANGUAGE plpgsql
-- IMMUTABLE;

-- Add searchName column to Taxa table using the function
-- ALTER TABLE "Taxa" ADD COLUMN "searchName" TEXT GENERATED ALWAYS AS (
--   generate_search_name("commonNames")
-- ) STORED;


ALTER TABLE "Taxa" DROP COLUMN IF EXISTS "commonNameEn";
ALTER TABLE "Taxa" ADD COLUMN "commonNameEn" TEXT GENERATED ALWAYS AS (
  (("commonNames"->'en')->>0)::TEXT
) STORED;

ALTER TABLE "Taxa" DROP COLUMN IF EXISTS "commonNameFr";
ALTER TABLE "Taxa" ADD COLUMN "commonNameFr" TEXT GENERATED ALWAYS AS (
  (("commonNames"->'fr')->>0)::TEXT
) STORED;
