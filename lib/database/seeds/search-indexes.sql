CREATE INDEX idx_taxa_scientific_name_fts ON "Taxa" USING GIN (to_tsvector('simple', "scientificName"));
CREATE INDEX idx_taxa_common_name_en_fts ON "Taxa" USING GIN (to_tsvector('simple', COALESCE("commonNameEn", '')));
CREATE INDEX idx_taxa_common_name_fr_fts ON "Taxa" USING GIN (to_tsvector('simple', COALESCE("commonNameFr", '')));