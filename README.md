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

## Export firestore data

```bash
// https://www.npmjs.com/package/node-firestore-import-export
 npx -p node-firestore-import-export firestore-export -a test.json -b backup.json -n species
```
