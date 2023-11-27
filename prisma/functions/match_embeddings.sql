create or replace function match_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  similarity float
)
language sql stable
as $$
  select
    species_embedding.species_id,
    species_embedding.content,
    1 - (species_embedding.embedding <=> query_embedding) as similarity
  from species_embedding
  where 1 - (species_embedding.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;