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
```

## Export firestore data

```bash
// https://www.npmjs.com/package/node-firestore-import-export
 npx -p node-firestore-import-export firestore-export -a test.json -b backup.json -n species
```
