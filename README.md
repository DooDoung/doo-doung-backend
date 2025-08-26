# First Time

```
docker-compose up -d
pnpm i
pnpx prisma generate
pnpx prisma migrate dev

```

# Others

```
docker-compose up -d
pnpx prisma migrate dev (if there any change in backend schema)
```

# Seed

### Seed all tables

pnpm run db:seed

### Clear all tables

pnpm run db:seed clear

### Seed specific table

pnpm run db:seed [tableName]

### Clear specific table

pnpm run db:seed clear [tableName]

### Seed dev accounts

pnpm run db:seed dev_accounts
