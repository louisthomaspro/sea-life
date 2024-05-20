## Getting Started

```bash
vercel env pull .env

pnpm i

npx prisma generate

pnpm dev
```

## Prisma commands

```bash
npx prisma db pull
npx prisma db push
npx prisma generate
```

## Supabase backup

```bash
npx supabase login
npx supabase link -p XXX
# Dump schema
mkdir -p "supabase/backups/$(date +'%Y-%m-%d')" && npx supabase db dump -f "supabase/backups/$(date +'%Y-%m-%d')/schema_$(date +'%Y-%m-%d_%H-%M-%S').sql"
# Dump data
mkdir -p "supabase/backups/$(date +'%Y-%m-%d')" && npx supabase db dump -f "supabase/backups/$(date +'%Y-%m-%d')/data_$(date +'%Y-%m-%d_%H-%M-%S').sql" --data-only

npx supabase db dump -f "supabase/backups/schema.sql"
npx supabase db dump -f "supabase/backups/data.sql" --data-only
```

# Restore schema

npx supabase db restore -f "supabase/backups/2021-10-06/schema_2021-10-06_14-00-00.sql"

## Database

```bash
# Reset triggers
npx prisma db execute --file ./lib/database/seeds/triggers.sql
npx prisma db execute --file ./supabase/backups/data.sql

# https://nesin.io/blog/backup-restore-supabase-postgres-database

pg_dump -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" -Fc -b -v -f file.dump

pg_restore -j 5 --clean -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" file.dump
```

## Export firestore data

```bash
// https://www.npmjs.com/package/node-firestore-import-export
 npx -p node-firestore-import-export firestore-export -a test.json -b backup.json -n species
```
