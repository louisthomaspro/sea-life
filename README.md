## Getting Started

```bash
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

## Database

```bash
pg_dump -h aws-0-ap-southeast-1.pooler.supabase.com -p 5432 -d postgres -U postgres.etbfmqkktewuqbpktqvf --data-only -Fc > backup.dump

pg_restore -h aws-0-ap-southeast-1.pooler.supabase.com -p 5432 -d postgres -U postgres.etbfmqkktewuqbpktqvf < backup.dump
```

## Export firestore data

```bash
// https://www.npmjs.com/package/node-firestore-import-export
 npx -p node-firestore-import-export firestore-export -a test.json -b backup.json -n species
```
