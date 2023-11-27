create index on species_embedding using ivfflat (embedding vector_cosine_ops)
with
  (lists = 100);