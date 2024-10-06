## Getting Started

```bash
npx vercel@latest env pull .env

pnpm i

npx prisma generate

pnpm dev
```

## Prisma commands

```bash
# Init migration
mkdir prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema --script > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init
```

```bash
npx prisma db push
npx prisma generate

# Create migration
pnpm run migrate-dev

# Create migration without running it, useful to create a migration with a sql query (ex: Generated column)
npx prisma migrate dev --create-only
npx prisma migrate dev
```

## Database

```bash
# Reset triggers
npx prisma db execute --file ./lib/database/seeds/triggers.sql
npx prisma db execute --file ./supabase/backups/data.sql

# https://nesin.io/blog/backup-restore-supabase-postgres-database

pg_dump -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" -Fc -b -v -f file.dump

pg_restore -j 5 --clean -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" file.dump

pg_restore --clean --schema=public --schema-only -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" file.dump

pg_restore --schema=public --data-only -d "postgres://postgres.etbfmqkktewuqbpktqvf:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" file.dump
```

## Export firestore data

```bash
// https://www.npmjs.com/package/node-firestore-import-export
 npx -p node-firestore-import-export firestore-export -a test.json -b backup.json -n species
```

## Execute scripts

```bash
bun ./script/{script_name}.ts
```
